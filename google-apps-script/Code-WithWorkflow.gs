/**
 * ChatKit Integration for Google Docs - Con soporte para Workflows
 *
 * Este script se conecta a tu servidor proxy en Railway
 * que maneja la comunicación con tu workflow de Agent Builder
 */

// Configuración - IMPORTANTE: Reemplaza estos valores con los tuyos
const CONFIG = {
  // URL de tu servidor en Railway
  CHATKIT_PROXY_URL: 'https://tu-proyecto.up.railway.app',  // ← CAMBIA ESTO

  // Opcional: API key para autenticar con tu servidor (si lo configuraste)
  SERVER_API_KEY: '',  // Déjalo vacío si no usas autenticación

  // NOTA: OPENAI_API_KEY y WORKFLOW_ID ahora están en el servidor de Railway,
  // no necesitas configurarlos aquí por seguridad
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
  const html = HtmlService.createHtmlOutputFromFile('ChatPanelWorkflow')
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
 * Crea una sesión de ChatKit llamando a tu servidor proxy
 *
 * @returns {Object} Objeto con client_secret y expires_after
 */
function createChatKitSession() {
  try {
    // Validar configuración
    if (!CONFIG.CHATKIT_PROXY_URL || CONFIG.CHATKIT_PROXY_URL === 'https://tu-proyecto.up.railway.app') {
      throw new Error('Por favor configura tu CHATKIT_PROXY_URL en el archivo Code.gs con la URL de tu servidor de Railway');
    }

    // Generar un ID de usuario único
    const userId = generateUserId();

    Logger.log('Creando sesión con servidor proxy:', CONFIG.CHATKIT_PROXY_URL);

    // Crear headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Añadir API key si está configurada
    if (CONFIG.SERVER_API_KEY) {
      headers['X-API-Key'] = CONFIG.SERVER_API_KEY;
    }

    // Llamar al servidor proxy
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: headers,
      payload: JSON.stringify({
        userId: userId
      }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(`${CONFIG.CHATKIT_PROXY_URL}/api/create-session`, options);
    const responseCode = response.getResponseCode();

    let responseBody;
    try {
      responseBody = JSON.parse(response.getContentText());
    } catch (e) {
      responseBody = { error: response.getContentText() };
    }

    if (responseCode !== 200) {
      console.error('Error creando sesión:', responseCode, responseBody);

      let errorMessage = 'Error desconocido';
      if (responseBody.error) {
        errorMessage = responseBody.error;
      }

      // Detectar problemas comunes
      if (responseCode === 404) {
        errorMessage = `El servidor proxy no responde. Verifica que la URL sea correcta: ${CONFIG.CHATKIT_PROXY_URL}`;
      } else if (responseCode === 401) {
        errorMessage = 'Error de autenticación con el servidor proxy. Verifica SERVER_API_KEY.';
      } else if (responseCode === 500) {
        errorMessage = `Error en el servidor proxy: ${errorMessage}. Revisa los logs en Railway.`;
      }

      throw new Error(errorMessage);
    }

    Logger.log('Sesión creada exitosamente');

    return {
      success: true,
      client_secret: responseBody.client_secret,
      expires_after: responseBody.expires_after,
      user_id: responseBody.user_id
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
 * Envía un mensaje al workflow a través del servidor proxy
 *
 * @param {string} clientSecret - El client secret de la sesión
 * @param {string} message - El mensaje del usuario
 * @param {Array} history - Historial de conversación (opcional)
 * @returns {Object} Respuesta con el mensaje del asistente
 */
function sendChatMessage(clientSecret, message, history) {
  try {
    // Validar configuración
    if (!CONFIG.CHATKIT_PROXY_URL || CONFIG.CHATKIT_PROXY_URL === 'https://tu-proyecto.up.railway.app') {
      throw new Error('Por favor configura tu CHATKIT_PROXY_URL en el archivo Code.gs');
    }

    if (!clientSecret) {
      throw new Error('No hay una sesión activa');
    }

    if (!message || !message.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    Logger.log('Enviando mensaje al workflow');

    // Crear headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Añadir API key si está configurada
    if (CONFIG.SERVER_API_KEY) {
      headers['X-API-Key'] = CONFIG.SERVER_API_KEY;
    }

    // Llamar al servidor proxy (endpoint simple, sin streaming)
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: headers,
      payload: JSON.stringify({
        client_secret: clientSecret,
        message: message,
        history: history || []
      }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(`${CONFIG.CHATKIT_PROXY_URL}/api/send-message-simple`, options);
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
        errorMessage = responseBody.error;
      }

      throw new Error(errorMessage);
    }

    Logger.log('Mensaje enviado exitosamente');

    return {
      success: true,
      message: responseBody.message,
      history: responseBody.history
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
    hasProxyUrl: CONFIG.CHATKIT_PROXY_URL !== 'https://tu-proyecto.up.railway.app',
    proxyUrl: CONFIG.CHATKIT_PROXY_URL !== 'https://tu-proyecto.up.railway.app' ? CONFIG.CHATKIT_PROXY_URL : '',
    hasServerApiKey: !!CONFIG.SERVER_API_KEY
  };
}
