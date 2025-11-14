# 🔧 Solución: Error al cargar ChatKit desde CDN

Si el diagnóstico muestra el error **"No se pudo cargar el script de ChatKit desde el CDN"**, esto significa que Google Apps Script está bloqueando la carga de módulos ES6 externos.

## ✅ Solución: Usar la versión simple

He creado **`ChatPanelSimple.html`** que **NO depende del CDN** y usa directamente la API REST de OpenAI.

### Diferencias entre versiones:

| Característica | ChatPanel.html (Original) | ChatPanelSimple.html (Recomendado) |
|----------------|---------------------------|-------------------------------------|
| Dependencia CDN | ✗ Requiere cargar desde CDN | ✓ No requiere CDN |
| Funciona en Apps Script | ⚠️ Puede tener problemas | ✓ Funciona perfectamente |
| Interfaz | Componente oficial ChatKit | Interfaz personalizada |
| Funcionalidades | Todas las de ChatKit | Chat completo + extras |
| Complejidad | Más simple (usa componente) | Un poco más código |

## 📋 Cómo cambiar a la versión simple

### Opción 1: Ya está configurado (Automático)

Si acabas de copiar los archivos más recientes, **ya está usando ChatPanelSimple.html** automáticamente.

El archivo `Code.gs` ya está configurado para usar la versión simple:

```javascript
function showChatSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanelSimple')  // ← Usa la versión simple
    .setTitle('ChatKit AI Assistant')
    .setWidth(400);

  DocumentApp.getUi().showSidebar(html);
}
```

### Opción 2: Cambiar manualmente

Si por alguna razón no funciona, edita `Code.gs`:

**ANTES:**
```javascript
function showChatSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanel')  // ← Versión original
```

**DESPUÉS:**
```javascript
function showChatSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ChatPanelSimple')  // ← Versión simple
```

## 🎨 Características de la versión simple

La versión simple incluye TODO lo que necesitas:

### ✅ Funcionalidades incluidas:

- **Chat completo** con mensajes de usuario y asistente
- **Interfaz moderna** con avatares y burbujas de chat
- **Indicador de escritura** (typing indicator)
- **Prompts de inicio** personalizables
- **Integración con documento**: Botón para usar texto seleccionado
- **Historial de conversación** mantenido en la sesión
- **Auto-resize** del input de texto
- **Soporte para Enter** (enviar) y Shift+Enter (nueva línea)
- **Botón de limpiar chat**
- **Manejo de errores** robusto

### 🎯 Lo que NO necesita:

- ❌ CDN externo
- ❌ Módulos ES6
- ❌ Librerías adicionales
- ❌ Configuración de CORS

## 📝 Archivos necesarios

Asegúrate de tener estos archivos en tu proyecto de Apps Script:

### 1. Code.gs
- Funciones de backend
- Incluye `createChatKitSession()`
- Incluye `sendChatMessage()` ← **Nuevo!**
- Incluye `getSelectedText()`

### 2. ChatPanelSimple.html
- Interfaz de chat personalizada
- No requiere CDN
- Usa la API REST directamente

### 3. DiagnosticPanel.html (Opcional)
- Para diagnosticar problemas

### 4. Settings.html (Opcional)
- Para ver configuración

## 🧪 Verificar que funciona

1. **Guarda todos los archivos** en Apps Script
2. **Refresca tu Google Doc** (F5)
3. **Abre ChatKit AI** → **Abrir Chat**
4. Deberías ver:
   - ✓ Panel lateral con mensaje de bienvenida
   - ✓ Tres prompts de inicio
   - ✓ Input de texto en la parte inferior
   - ✓ Botones de herramientas arriba

## 🔧 Si aún tienes problemas

### Error: "No hay una sesión activa"

**Causa:** La sesión no se creó correctamente.

**Solución:**
1. Abre **ChatKit AI** → **🔍 Diagnóstico**
2. Verifica que los pasos 1 y 2 estén en verde ✓
3. Si hay error en paso 2, revisa:
   - API key correcta
   - Workflow ID correcto
   - Dominios en allowlist (si aplica)

### Error: "Error al enviar mensaje"

**Causa:** Problema al comunicarse con la API de OpenAI.

**Solución:**
1. Verifica tu API key en `Code.gs`
2. Asegúrate de que el Workflow esté publicado
3. Revisa los logs en Apps Script:
   - Ve a **Ejecuciones** (sidebar izquierdo)
   - Busca errores recientes
   - Copia el mensaje de error completo

### El chat se carga pero no responde

**Causa:** El client_secret puede estar expirado o el endpoint de mensajes no funciona.

**Diagnóstico:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Envía un mensaje
4. Busca errores en rojo

**Solución:**
- Si ves error 401: API key incorrecta
- Si ves error 404: Endpoint no encontrado (verifica que uses la API correcta)
- Si ves error de CORS: Añade dominios a allowlist

## 💡 Personalización

### Cambiar prompts de inicio

Edita `ChatPanelSimple.html`, busca `starter-prompts`:

```html
<div class="starter-prompts" id="starter-prompts">
  <button class="starter-prompt" onclick="sendPrompt('Tu prompt aquí')">
    🎨 Tu prompt aquí
  </button>
  <!-- Añade más prompts -->
</div>
```

### Cambiar colores

En `ChatPanelSimple.html`, busca la sección `<style>`:

```css
.message.user .message-content {
  background: #2196f3;  /* ← Cambia este color para mensajes de usuario */
  color: white;
}

.message.assistant .message-content {
  background: #f5f5f5;  /* ← Cambia este color para mensajes del asistente */
  color: #333;
}
```

### Cambiar avatares

Busca en `ChatPanelSimple.html`:

```javascript
avatar.textContent = role === 'user' ? '👤' : '🤖';  // ← Cambia estos emojis
```

## 🆚 Comparación con la versión original

### Ventajas de ChatPanelSimple:

✅ **Funciona en Google Apps Script** sin problemas de CORS/CDN
✅ **Totalmente personalizable** - controlas el HTML/CSS/JS
✅ **Más ligero** - no carga librerías externas
✅ **Más rápido** - una carga menos desde CDN
✅ **Más control** - puedes añadir funcionalidades personalizadas

### Desventajas:

⚠️ No tienes actualizaciones automáticas del componente oficial
⚠️ Necesitas mantener el código tú mismo
⚠️ No tienes todas las características avanzadas de ChatKit (si las hubiera)

## 📚 Estructura de la API

La versión simple usa estos endpoints:

### 1. Crear sesión
```
POST https://api.openai.com/v1/chatkit/sessions
Headers:
  - Authorization: Bearer {OPENAI_API_KEY}
  - OpenAI-Beta: chatkit_beta=v1
Body:
  - workflow: { id: WORKFLOW_ID }
  - user: USER_ID

Respuesta:
  - client_secret: "chsk_..."
  - expires_after: "2024-..."
```

### 2. Enviar mensaje
```
POST https://api.openai.com/v1/chatkit/messages
Headers:
  - Authorization: Bearer {client_secret}
  - OpenAI-Beta: chatkit_beta=v1
Body:
  - messages: [{role: "user", content: "..."}]

Respuesta:
  - choices: [{message: {content: "..."}}]
```

## 🎉 ¡Listo!

Con **ChatPanelSimple.html** deberías tener un chat completamente funcional sin problemas de CDN.

Si sigues teniendo problemas, abre el **Diagnóstico** y comparte los resultados para ayuda adicional.
