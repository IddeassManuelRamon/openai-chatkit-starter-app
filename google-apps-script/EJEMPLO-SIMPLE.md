# Ejemplo Simple: ChatKit en Google Apps Script

Si prefieres empezar con algo más simple, aquí está la versión mínima de la integración.

## Versión Mínima (Todo en un archivo HTML)

Este ejemplo crea un diálogo HTML simple que usa ChatKit directamente sin servidor backend.

### Simple.html

```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@openai/chatkit@0.3/dist/chatkit.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      height: 100vh;
    }
    openai-chatkit {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <openai-chatkit
    id="chatkit"
    greeting="¡Hola! ¿En qué puedo ayudarte?"
    placeholder="Escribe tu mensaje...">
  </openai-chatkit>

  <script>
    async function init() {
      const chatkit = document.getElementById('chatkit');

      // IMPORTANTE: Reemplaza con tu client_secret
      // Para obtenerlo, necesitas llamar a la API de OpenAI:
      // POST https://api.openai.com/v1/chatkit/sessions
      chatkit.clientSecret = 'tu-client-secret-aqui';

      // Configurar tema
      chatkit.theme = {
        color: {
          accent: { primary: '#0f172a' }
        },
        radius: 'round'
      };
    }

    init();
  </script>
</body>
</html>
```

### Simple.gs

```javascript
function showSimpleChat() {
  const html = HtmlService.createHtmlOutputFromFile('Simple')
    .setWidth(500)
    .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'ChatKit AI');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ChatKit')
    .addItem('Abrir Chat', 'showSimpleChat')
    .addToUi();
}
```

## ⚠️ Limitaciones de la versión simple

1. **No genera client_secret automáticamente** - Necesitas obtenerlo manualmente
2. **El client_secret expira** - Tendrás que actualizarlo periódicamente
3. **Menos seguro** - El client_secret está visible en el código frontend

Por estas razones, **se recomienda usar la versión completa** con el backend en Apps Script.

## 🔄 Cómo obtener un client_secret manualmente

Puedes usar `curl` o Postman para obtener un client_secret:

```bash
curl -X POST https://api.openai.com/v1/chatkit/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -d '{
    "workflow": {
      "id": "TU_WORKFLOW_ID"
    },
    "user": "usuario-test"
  }'
```

Respuesta:
```json
{
  "client_secret": "chsk_abc123...",
  "expires_after": "2024-01-15T10:30:00Z"
}
```

Copia el `client_secret` y úsalo en tu HTML.

## 🎯 Cuándo usar cada versión

### Usa la versión simple si:
- Solo quieres probar ChatKit rápidamente
- No te importa actualizar el client_secret manualmente
- Es para uso personal/desarrollo

### Usa la versión completa si:
- Quieres una solución de producción
- Necesitas que múltiples usuarios lo usen
- Quieres integración con el documento (texto seleccionado, etc.)
- Quieres que el client_secret se genere automáticamente

## 📝 Ejemplo para Google Sheets

Si prefieres usar esto en Google Sheets en lugar de Docs:

```javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ChatKit AI')
    .addItem('Abrir Chat', 'showChat')
    .addToUi();
}

function showChat() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanel')
    .setWidth(400)
    .setHeight(600);

  SpreadsheetApp.getUi().showSidebar(html);
}

// Función para insertar respuesta en celda activa
function insertInActiveCell(text) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const cell = sheet.getActiveCell();
  cell.setValue(text);
}
```

Y en el HTML, añade un botón:

```javascript
// Escuchar respuestas y dar opción de insertar en celda
chatkitElement.addEventListener('message-received', (event) => {
  const response = event.detail.message;

  // Preguntar si quiere insertar en la celda
  if (confirm('¿Insertar esta respuesta en la celda activa?')) {
    google.script.run.insertInActiveCell(response);
  }
});
```

## 🚀 Próximos pasos

Una vez que entiendas cómo funciona la versión simple, te recomiendo:

1. Migrar a la versión completa con backend
2. Añadir funcionalidades personalizadas
3. Integrar con tus workflows específicos
4. Personalizar el tema y los prompts

¡Buena suerte!
