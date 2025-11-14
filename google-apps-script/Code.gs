/**
 * ChatKit Integration for Google Docs
 *
 * Este script permite integrar ChatKit de OpenAI en Google Docs
 * Necesitas configurar:
 * 1. OPENAI_API_KEY - Tu API key de OpenAI
 * 2. WORKFLOW_ID - El ID del workflow creado en Agent Builder
 */

// Configuración - IMPORTANTE: Reemplaza estos valores con los tuyos
const CONFIG = {
  OPENAI_API_KEY: 'tu-api-key-aqui', // Obtén tu API key de https://platform.openai.com/api-keys
  WORKFLOW_ID: 'tu-workflow-id-aqui', // Obtén tu workflow ID de Agent Builder (OPCIONAL - solo si usas ChatKit original)
  CHATKIT_API_BASE: 'https://api.openai.com',
  CHAT_MODEL: 'gpt-4o-mini', // Modelo a usar: 'gpt-4o-mini' (rápido/económico) o 'gpt-4o' (mejor calidad)
  SYSTEM_PROMPT: 'Eres un asistente útil que ayuda a los usuarios con sus documentos de Google Docs.' // Personaliza el comportamiento del asistente
};

/**
 * Crea un menú personalizado cuando se abre el documento
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('ChatKit AI')
    .addItem('Abrir Chat', 'showChatSidebar')
    .addSeparator()
    .addItem('🔍 Diagnóstico', 'showDiagnostic')
    .addItem('Configuración', 'showSettings')
    .addToUi();
}

/**
 * Muestra el panel lateral con el chat de ChatKit
 */
function showChatSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanelSimple')
    .setTitle('ChatKit AI Assistant')
    .setWidth(400);

  DocumentApp.getUi().showSidebar(html);
}

/**
 * Muestra el diálogo de configuración
 */
function showSettings() {
  const html = HtmlService.createHtmlOutputFromFile('Settings')
    .setWidth(500)
    .setHeight(300);

  DocumentApp.getUi().showModalDialog(html, 'Configuración de ChatKit');
}

/**
 * Muestra el panel de diagnóstico
 */
function showDiagnostic() {
  const html = HtmlService.createHtmlOutputFromFile('DiagnosticPanel')
    .setTitle('Diagnóstico de ChatKit')
    .setWidth(450);

  DocumentApp.getUi().showSidebar(html);
}

/**
 * Crea una sesión de ChatKit llamando a la API de OpenAI
 * NOTA: Esta función ahora solo valida la configuración básica.
 * El chat usa directamente la API de Chat Completions, no requiere workflow.
 *
 * @returns {Object} Objeto con client_secret y expires_after
 */
function createChatKitSession() {
  try {
    // Validar configuración
    if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'tu-api-key-aqui') {
      throw new Error('Por favor configura tu OPENAI_API_KEY en el archivo Code.gs');
    }

    // El WORKFLOW_ID ahora es opcional - solo se necesita si quieres usar ChatKit original
    // Para la versión simple con Chat Completions, solo necesitas la API key
    const useSimpleMode = !CONFIG.WORKFLOW_ID || CONFIG.WORKFLOW_ID === 'tu-workflow-id-aqui';

    if (useSimpleMode) {
      // Modo simple: no requiere workflow, solo API key
      Logger.log('Usando modo simple con Chat Completions API');
      return {
        success: true,
        client_secret: 'simple-mode-' + Utilities.getUuid(),
        expires_after: new Date(Date.now() + 86400000).toISOString(), // 24 horas
        mode: 'simple'
      };
    }

    // Generar un ID de usuario único para esta sesión
    const userId = generateUserId();

    // Configurar la solicitud a la API de OpenAI
    const url = `${CONFIG.CHATKIT_API_BASE}/v1/chatkit/sessions`;

    const payload = {
      workflow: {
        id: CONFIG.WORKFLOW_ID
      },
      user: userId,
      chatkit_configuration: {
        file_upload: {
          enabled: false // Puedes habilitar esto si tu workflow soporta archivos
        }
      }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // Hacer la solicitud a la API
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    let responseBody;
    try {
      responseBody = JSON.parse(response.getContentText());
    } catch (e) {
      responseBody = { error: response.getContentText() };
    }

    // Manejar errores
    if (responseCode !== 200) {
      console.error('Error creando sesión:', responseCode, responseBody);

      // Extraer mensaje de error detallado
      let errorMessage = 'Error desconocido';

      if (responseBody.error) {
        if (typeof responseBody.error === 'string') {
          errorMessage = responseBody.error;
        } else if (responseBody.error.message) {
          errorMessage = responseBody.error.message;
        }
      } else if (responseBody.message) {
        errorMessage = responseBody.message;
      }

      // Detectar problemas comunes
      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes('domain') || errorLower.includes('allowlist') ||
          errorLower.includes('cors') || errorLower.includes('origin')) {
        errorMessage = `ALLOWLIST ERROR: ${errorMessage}. Necesitas añadir el dominio de Google Apps Script a la allowlist en platform.openai.com/settings/organization/security/domain-allowlist`;
      } else if (responseCode === 401) {
        errorMessage = `API KEY ERROR: ${errorMessage}. Verifica que tu API key sea válida.`;
      } else if (responseCode === 404) {
        errorMessage = `WORKFLOW ERROR: ${errorMessage}. Verifica que el Workflow ID sea correcto.`;
      }

      throw new Error(errorMessage);
    }

    // Retornar el client_secret y expires_after
    return {
      success: true,
      client_secret: responseBody.client_secret,
      expires_after: responseBody.expires_after
    };

  } catch (error) {
    console.error('Error en createChatKitSession:', error);
    return {
      success: false,
      error: error.message || error.toString()
    };
  }
}

/**
 * Envía un mensaje al chat usando la API de OpenAI Chat Completions
 *
 * @param {string} sessionId - ID de sesión (no se usa, pero se mantiene por compatibilidad)
 * @param {string} message - El mensaje del usuario
 * @param {Array} history - Historial de conversación (opcional)
 * @returns {Object} Respuesta con el mensaje del asistente
 */
function sendChatMessage(sessionId, message, history) {
  try {
    // Validar configuración
    if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'tu-api-key-aqui') {
      throw new Error('Por favor configura tu OPENAI_API_KEY en el archivo Code.gs');
    }

    if (!message || !message.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    // Construir el historial de mensajes
    const messages = history || [];

    // Si es el primer mensaje, añadir el system prompt
    if (messages.length === 0 && CONFIG.SYSTEM_PROMPT) {
      messages.push({
        role: 'system',
        content: CONFIG.SYSTEM_PROMPT
      });
    }

    // Añadir mensaje del usuario
    messages.push({
      role: 'user',
      content: message
    });

    // Llamar a la API de Chat Completions de OpenAI
    const apiBase = CONFIG.CHATKIT_API_BASE || 'https://api.openai.com';
    const url = `${apiBase}/v1/chat/completions`;

    const payload = {
      model: CONFIG.CHAT_MODEL || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    let responseBody;
    try {
      responseBody = JSON.parse(response.getContentText());
    } catch (e) {
      responseBody = { error: response.getContentText() };
    }

    if (responseCode !== 200) {
      console.error('Error enviando mensaje:', responseCode, responseBody);

      let errorMessage = 'Error al enviar mensaje';
      if (responseBody.error) {
        if (typeof responseBody.error === 'string') {
          errorMessage = responseBody.error;
        } else if (responseBody.error.message) {
          errorMessage = responseBody.error.message;
        }
      }

      throw new Error(errorMessage);
    }

    // Extraer el mensaje del asistente
    let assistantMessage = 'Lo siento, no pude generar una respuesta.';

    if (responseBody.choices && responseBody.choices.length > 0) {
      const choice = responseBody.choices[0];
      if (choice.message && choice.message.content) {
        assistantMessage = choice.message.content;

        // Añadir al historial
        messages.push({
          role: 'assistant',
          content: assistantMessage
        });
      }
    }

    return {
      success: true,
      message: assistantMessage,
      history: messages
    };

  } catch (error) {
    console.error('Error en sendChatMessage:', error);
    return {
      success: false,
      error: error.message || error.toString()
    };
  }
}

/**
 * Genera un ID de usuario único basado en el usuario actual
 *
 * @returns {string} ID de usuario
 */
function generateUserId() {
  const userEmail = Session.getActiveUser().getEmail();

  // Si no hay email (modo anónimo), generar un ID aleatorio
  if (!userEmail) {
    return 'user-' + Utilities.getUuid();
  }

  // Usar el email como base para el ID
  return 'gdocs-' + Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    userEmail
  ).map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('').substring(0, 16);
}

/**
 * Obtiene el contenido seleccionado en el documento
 *
 * @returns {string} Texto seleccionado
 */
function getSelectedText() {
  const selection = DocumentApp.getActiveDocument().getSelection();

  if (!selection) {
    return '';
  }

  const elements = selection.getRangeElements();
  let text = '';

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.getElement().editAsText) {
      const textElement = element.getElement().editAsText();

      if (element.isPartial()) {
        text += textElement.getText().substring(
          element.getStartOffset(),
          element.getEndOffsetInclusive() + 1
        );
      } else {
        text += textElement.getText();
      }
    }
  }

  return text;
}

/**
 * Inserta texto en la posición del cursor
 *
 * @param {string} text - Texto a insertar
 */
function insertTextAtCursor(text) {
  const cursor = DocumentApp.getActiveDocument().getCursor();

  if (cursor) {
    const element = cursor.insertText(text);
    return { success: true };
  } else {
    return {
      success: false,
      error: 'No se encontró el cursor. Por favor, haz clic en el documento primero.'
    };
  }
}

/**
 * Obtiene la configuración actual
 *
 * @returns {Object} Configuración
 */
function getConfig() {
  return {
    hasApiKey: CONFIG.OPENAI_API_KEY !== 'tu-api-key-aqui',
    hasWorkflowId: CONFIG.WORKFLOW_ID !== 'tu-workflow-id-aqui',
    workflowId: CONFIG.WORKFLOW_ID !== 'tu-workflow-id-aqui' ? CONFIG.WORKFLOW_ID : ''
  };
}
