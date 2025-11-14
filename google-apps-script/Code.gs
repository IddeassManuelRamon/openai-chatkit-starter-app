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
  WORKFLOW_ID: 'tu-workflow-id-aqui', // Obtén tu workflow ID de Agent Builder
  CHATKIT_API_BASE: 'https://api.openai.com'
};

/**
 * Crea un menú personalizado cuando se abre el documento
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('ChatKit AI')
    .addItem('Abrir Chat', 'showChatSidebar')
    .addItem('Configuración', 'showSettings')
    .addToUi();
}

/**
 * Muestra el panel lateral con el chat de ChatKit
 */
function showChatSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanel')
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
 * Crea una sesión de ChatKit llamando a la API de OpenAI
 *
 * @returns {Object} Objeto con client_secret y expires_after
 */
function createChatKitSession() {
  try {
    // Validar configuración
    if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'tu-api-key-aqui') {
      throw new Error('Por favor configura tu OPENAI_API_KEY en el archivo Code.gs');
    }

    if (!CONFIG.WORKFLOW_ID || CONFIG.WORKFLOW_ID === 'tu-workflow-id-aqui') {
      throw new Error('Por favor configura tu WORKFLOW_ID en el archivo Code.gs');
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
    const responseBody = JSON.parse(response.getContentText());

    // Manejar errores
    if (responseCode !== 200) {
      console.error('Error creando sesión:', responseBody);
      throw new Error(`Error de OpenAI API: ${responseBody.error || response.getContentText()}`);
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
