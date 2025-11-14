# ChatKit para Google Apps Script

Esta carpeta contiene los archivos necesarios para integrar ChatKit de OpenAI en Google Docs usando Google Apps Script.

## 🎯 ¿Qué es esto?

Una integración completa de ChatKit que te permite:
- Tener un asistente AI directamente en Google Docs
- Usar texto seleccionado en tus conversaciones
- Interactuar con workflows personalizados de OpenAI Agent Builder
- Acceder al chat desde un panel lateral en Google Docs

## 📋 Requisitos previos

Antes de comenzar, necesitas:

1. **Una cuenta de OpenAI** con acceso a la API
2. **Un API Key de OpenAI** - Obtén una en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Un Workflow creado en Agent Builder** - Crea uno en [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder)
4. **Una cuenta de Google** con acceso a Google Docs

## 🚀 Instalación

### Paso 1: Crear un nuevo proyecto de Apps Script

Tienes dos opciones:

#### Opción A: Desde Google Docs (Recomendado)
1. Abre un documento de Google Docs nuevo o existente
2. Ve a **Extensiones** → **Apps Script**
3. Se abrirá el editor de Apps Script

#### Opción B: Script independiente
1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **Nuevo proyecto**

### Paso 2: Copiar los archivos

Copia el contenido de los siguientes archivos a tu proyecto de Apps Script:

1. **Code.gs**
   - En el editor de Apps Script, reemplaza todo el contenido del archivo `Code.gs` con el contenido de este archivo
   - O simplemente renombra el archivo por defecto y pega el código

2. **ChatPanel.html**
   - Haz clic en el botón **+** junto a "Archivos"
   - Selecciona **HTML**
   - Nómbralo exactamente `ChatPanel`
   - Pega el contenido del archivo `ChatPanel.html`

3. **Settings.html**
   - Repite el proceso anterior
   - Nómbralo exactamente `Settings`
   - Pega el contenido del archivo `Settings.html`

### Paso 3: Configurar credenciales

1. En el archivo `Code.gs`, busca la sección `CONFIG` al inicio del archivo:

```javascript
const CONFIG = {
  OPENAI_API_KEY: 'tu-api-key-aqui',
  WORKFLOW_ID: 'tu-workflow-id-aqui',
  CHATKIT_API_BASE: 'https://api.openai.com'
};
```

2. Reemplaza `'tu-api-key-aqui'` con tu API key de OpenAI
3. Reemplaza `'tu-workflow-id-aqui'` con el ID de tu workflow de Agent Builder

**¿Cómo obtener el Workflow ID?**
- Ve a [Agent Builder](https://platform.openai.com/agent-builder)
- Crea o selecciona un workflow
- Haz clic en **"Publish"**
- Copia el Workflow ID que se muestra

### Paso 4: Guardar y autorizar

1. Haz clic en el icono de **💾 Guardar**
2. Dale un nombre a tu proyecto (por ejemplo, "ChatKit Integration")
3. Cierra el editor de Apps Script
4. Vuelve a tu documento de Google Docs
5. Refresca la página (F5 o Cmd+R)

### Paso 5: Primera ejecución

1. En tu documento de Google Docs, deberías ver un nuevo menú: **ChatKit AI**
2. Haz clic en **ChatKit AI** → **Abrir Chat**
3. La primera vez te pedirá permisos:
   - Haz clic en **Revisar permisos**
   - Selecciona tu cuenta de Google
   - Haz clic en **Avanzado** → **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**

## 📱 Uso

### Abrir el chat

- Ve a **ChatKit AI** → **Abrir Chat**
- Se abrirá un panel lateral con el asistente

### Funciones disponibles

1. **Usar texto seleccionado**
   - Selecciona texto en tu documento
   - Haz clic en "📝 Usar texto seleccionado" en la barra de herramientas del chat
   - El texto se insertará en el input del chat

2. **Reiniciar chat**
   - Haz clic en "🔄 Reiniciar chat" para empezar una conversación nueva

3. **Configuración**
   - Ve a **ChatKit AI** → **Configuración** para ver el estado de tu configuración

## 🎨 Personalización

### Cambiar los prompts iniciales

En el archivo `ChatPanel.html`, busca la sección `starterPrompts`:

```javascript
chatkitElement.starterPrompts = [
  {
    label: '¿Qué puedes hacer?',
    prompt: '¿Qué puedes hacer?',
    icon: 'circle-question'
  },
  // Añade más prompts aquí
];
```

### Cambiar el tema

En el archivo `ChatPanel.html`, busca la sección `theme`:

```javascript
chatkitElement.theme = {
  color: {
    grayscale: {
      hue: 220,  // Cambia el matiz (0-360)
      tint: 6,
      shade: -1
    },
    accent: {
      primary: '#0f172a',  // Cambia el color primario
      level: 1
    }
  },
  radius: 'round'  // Opciones: 'sharp', 'round', 'pill'
};
```

Visita [chatkit.studio/playground](https://chatkit.studio/playground) para explorar más opciones de tema.

### Cambiar el mensaje de bienvenida

En `ChatPanel.html`, busca:

```html
<openai-chatkit
  greeting="¡Hola! Soy tu asistente AI. ¿En qué puedo ayudarte hoy?"
  ...
```

### Habilitar subida de archivos

En el archivo `Code.gs`, en la función `createChatKitSession`, cambia:

```javascript
chatkit_configuration: {
  file_upload: {
    enabled: true  // Cambia a true
  }
}
```

**Nota:** Tu workflow debe soportar archivos para que esto funcione.

## 🔧 Solución de problemas

### Error: "Por favor configura tu OPENAI_API_KEY"

- Verifica que hayas reemplazado `'tu-api-key-aqui'` con tu API key real
- Asegúrate de que la API key esté entre comillas simples
- Guarda el archivo `Code.gs` después de hacer cambios

### Error: "Por favor configura tu WORKFLOW_ID"

- Verifica que hayas reemplazado `'tu-workflow-id-aqui'` con tu workflow ID real
- Asegúrate de copiar el ID completo desde Agent Builder

### El menú "ChatKit AI" no aparece

- Refresca la página de Google Docs
- Espera unos segundos para que el script se cargue
- Si aún no aparece, abre el editor de Apps Script y verifica que no haya errores

### Error de permisos

- Cuando se te pida autorización, debes hacer clic en "Avanzado"
- Luego en "Ir a [nombre del proyecto] (no seguro)"
- Esto es normal para scripts personalizados

### El chat no se carga

- Abre la consola del navegador (F12) y revisa si hay errores
- Verifica que tu API key y workflow ID sean válidos
- Asegúrate de que tu workflow esté publicado en Agent Builder

### Error: "Failed to create session"

Posibles causas:
- API key incorrecta o expirada
- Workflow ID incorrecto
- El workflow no está en el mismo proyecto/organización que la API key
- Problemas de red o límites de la API de OpenAI

## 📚 Recursos adicionales

- [Documentación de ChatKit](http://openai.github.io/chatkit-js/)
- [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
- [ChatKit Theme Playground](https://chatkit.studio/playground)
- [Google Apps Script Docs](https://developers.google.com/apps-script)

## 🔒 Seguridad

**IMPORTANTE:**

- ⚠️ **Nunca compartas tu API key** de OpenAI públicamente
- ⚠️ Si usas un script compartido, cada usuario necesita configurar su propia API key
- ⚠️ Las API keys están limitadas por cuotas - monitorea tu uso en [platform.openai.com/usage](https://platform.openai.com/usage)
- ⚠️ Considera usar **Project API Keys** en lugar de User API Keys para mejor seguridad

## 🆘 Soporte

Si tienes problemas:

1. Revisa la sección de "Solución de problemas" arriba
2. Verifica los logs en Apps Script: **Vista** → **Registros**
3. Abre la consola del navegador (F12) para ver errores de JavaScript
4. Consulta la [documentación de ChatKit](http://openai.github.io/chatkit-js/)

## 📄 Licencia

Este código es proporcionado como ejemplo educativo. Úsalo libremente en tus proyectos.

## 🎉 ¡Listo!

Ahora tienes un asistente AI completamente funcional en Google Docs. ¡Disfrútalo!
