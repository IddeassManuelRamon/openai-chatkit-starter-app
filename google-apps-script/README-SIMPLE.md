# 🚀 Versión Simple - Solo necesitas API Key

Esta es la versión **más simple y directa** de la integración. Ya **NO necesitas crear un workflow** en Agent Builder.

## ✅ Ventajas de esta versión

- ✅ **Solo necesitas API key** (no workflow)
- ✅ **Funciona inmediatamente** sin configuración compleja
- ✅ **Más rápido** - usa directamente la API de Chat Completions
- ✅ **Más económico** - control total del modelo (usa gpt-4o-mini por defecto)
- ✅ **Más personalizable** - puedes configurar el comportamiento del asistente
- ✅ **Sin problemas de CDN** - no requiere cargar scripts externos
- ✅ **Sin problemas de allowlist** - no usa dominios especiales

## 📋 Configuración Rápida (2 minutos)

### Paso 1: Obtener API Key (1 min)

1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Haz clic en **"Create new secret key"**
3. Dale un nombre (ej: "Google Docs Chat")
4. Copia la key (empieza con `sk-proj-...`)

### Paso 2: Configurar en Apps Script (1 min)

En el archivo **`Code.gs`**, línea 12, pega tu API key:

```javascript
const CONFIG = {
  OPENAI_API_KEY: 'sk-proj-XXXXXXXXXX',  // ← Pega tu API key aquí
  WORKFLOW_ID: 'tu-workflow-id-aqui',    // ← Déjalo así (no se necesita)
  CHATKIT_API_BASE: 'https://api.openai.com',
  CHAT_MODEL: 'gpt-4o-mini',             // ← Modelo a usar
  SYSTEM_PROMPT: 'Eres un asistente útil...'  // ← Personaliza el comportamiento
};
```

### Paso 3: ¡Listo! 🎉

Guarda, refresca tu documento, y abre **ChatKit AI** → **Abrir Chat**

## 🎨 Personalización

### Cambiar el modelo de IA

En `Code.gs`, cambia `CHAT_MODEL`:

```javascript
CHAT_MODEL: 'gpt-4o-mini'    // Rápido y económico (recomendado)
CHAT_MODEL: 'gpt-4o'         // Mejor calidad, más caro
CHAT_MODEL: 'gpt-4-turbo'    // Balance calidad/precio
CHAT_MODEL: 'gpt-3.5-turbo'  // Más económico
```

**Comparación de modelos:**

| Modelo | Velocidad | Calidad | Costo | Recomendado para |
|--------|-----------|---------|-------|------------------|
| gpt-4o-mini | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | Uso general, económico |
| gpt-4o | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Tareas complejas |
| gpt-4-turbo | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | Balance |
| gpt-3.5-turbo | ⚡⚡⚡ | ⭐⭐ | 💰 | Tareas simples |

### Personalizar el comportamiento del asistente

En `Code.gs`, cambia `SYSTEM_PROMPT`:

```javascript
// Ejemplo 1: Asistente de escritura
SYSTEM_PROMPT: 'Eres un editor profesional que ayuda a mejorar textos. Siempre das sugerencias constructivas y específicas.'

// Ejemplo 2: Asistente técnico
SYSTEM_PROMPT: 'Eres un experto en programación que explica conceptos de forma clara y con ejemplos.'

// Ejemplo 3: Asistente creativo
SYSTEM_PROMPT: 'Eres un escritor creativo que ayuda a generar ideas y desarrollar historias.'

// Ejemplo 4: Asistente de traducción
SYSTEM_PROMPT: 'Eres un traductor profesional que traduce textos manteniendo el tono y contexto original.'

// Ejemplo 5: Asistente académico
SYSTEM_PROMPT: 'Eres un profesor que ayuda a estudiantes a entender temas complejos con explicaciones claras y ejemplos.'
```

### Cambiar los prompts de inicio

Edita `ChatPanelSimple.html`, busca la sección con `starter-prompts`:

```html
<div class="starter-prompts" id="starter-prompts">
  <button class="starter-prompt" onclick="sendPrompt('Tu pregunta aquí')">
    🎯 Tu pregunta aquí
  </button>
  <button class="starter-prompt" onclick="sendPrompt('Otra pregunta')">
    📝 Otra pregunta
  </button>
  <!-- Añade más según necesites -->
</div>
```

### Ajustar parámetros de generación

En `Code.gs`, función `sendChatMessage`, puedes modificar:

```javascript
const payload = {
  model: CONFIG.CHAT_MODEL || 'gpt-4o-mini',
  messages: messages,
  temperature: 0.7,    // 0-2: creatividad (0=determinista, 2=muy creativo)
  max_tokens: 2000,    // Máximo de tokens en la respuesta
  // Parámetros adicionales opcionales:
  // top_p: 1,         // 0-1: diversidad (alternativa a temperature)
  // presence_penalty: 0,   // -2 a 2: penaliza repetición de temas
  // frequency_penalty: 0,  // -2 a 2: penaliza repetición de palabras
};
```

**Guía de parámetros:**

- **temperature**:
  - `0.1-0.3` = Respuestas consistentes y enfocadas (ideal para código, análisis)
  - `0.7` = Balance (recomendado para uso general)
  - `1.0-1.5` = Más creativo y variado (ideal para escritura creativa)

- **max_tokens**:
  - `500` = Respuestas cortas
  - `1000` = Respuestas medias (1 página)
  - `2000` = Respuestas largas (recomendado)
  - `4000` = Respuestas muy largas (cuidado con costos)

## 💰 Costos

Esta versión usa tu API key directamente, así que pagas por uso:

**Precios aproximados (Octubre 2024):**

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) | Costo típico/conversación |
|--------|----------------------|------------------------|---------------------------|
| gpt-4o-mini | $0.15 | $0.60 | ~$0.001 |
| gpt-4o | $2.50 | $10.00 | ~$0.02 |
| gpt-4-turbo | $10.00 | $30.00 | ~$0.05 |

**Ejemplo práctico:**
- Una conversación típica de 10 mensajes con gpt-4o-mini cuesta **menos de $0.01**
- 100 conversaciones al mes ≈ **$1**
- Es muy económico para uso personal

**Monitorea tu uso:**
- Ve a [platform.openai.com/usage](https://platform.openai.com/usage)
- Puedes establecer límites de gasto

## 🔧 Archivos Necesarios

Solo necesitas estos 2 archivos:

### 1. Code.gs (Obligatorio)
Backend de Apps Script con:
- Configuración (API key, modelo, prompt)
- Función `sendChatMessage()` - envía mensajes a OpenAI
- Función `createChatKitSession()` - valida configuración
- Funciones auxiliares

### 2. ChatPanelSimple.html (Obligatorio)
Interfaz de chat con:
- Burbujas de mensajes
- Input de texto
- Prompts de inicio
- Indicador de escritura

### Archivos opcionales:
- `DiagnosticPanel.html` - Para diagnóstico de problemas
- `Settings.html` - Para ver configuración

## 🆚 Comparación: Simple vs ChatKit Original

| Característica | Versión Simple | ChatKit Original |
|----------------|----------------|------------------|
| Requiere API key | ✅ Sí | ✅ Sí |
| Requiere Workflow | ❌ No | ✅ Sí |
| Requiere Allowlist | ❌ No | ✅ Sí |
| Requiere CDN | ❌ No | ✅ Sí |
| Configuración | 🟢 Muy fácil | 🟡 Más compleja |
| Control del modelo | ✅ Total | ❌ Limitado |
| Personalización | ✅ Total | 🟡 Limitada |
| Costo | 💰 Económico | 💰💰 Variable |
| Velocidad inicial | ⚡ Rápida | 🐌 Más lenta |

## ❓ FAQ

### ¿Necesito crear un Workflow en Agent Builder?

**No.** Esta versión usa directamente la API de Chat Completions, no requiere workflow.

### ¿Necesito añadir dominios a la allowlist?

**No.** Solo usamos la API REST estándar de OpenAI, sin restricciones de dominio.

### ¿Qué modelo debo usar?

Para la mayoría de casos, **gpt-4o-mini** es perfecto. Es rápido, económico y muy capaz. Solo usa gpt-4o si necesitas razonamiento muy complejo.

### ¿Puedo usar mis propios datos/documentos?

Sí, de dos formas:
1. **Texto seleccionado**: Usa el botón "Usar texto seleccionado" para incluir texto de tu documento
2. **System prompt personalizado**: Añade instrucciones específicas en `SYSTEM_PROMPT`

### ¿El historial se guarda?

El historial se mantiene **solo durante la sesión actual**. Si cierras el panel, se pierde. Esto es por diseño (privacidad) y para ahorrar tokens.

### ¿Cómo limito los costos?

1. Usa `gpt-4o-mini` (muy económico)
2. Reduce `max_tokens` si no necesitas respuestas largas
3. Establece límites en [platform.openai.com/settings/limits](https://platform.openai.com/settings/limits)

### ¿Es seguro poner mi API key en el código?

En Apps Script, el código es **privado** (solo tú lo ves). Sin embargo, para mayor seguridad:
- No compartas el script
- Monitorea tu uso en OpenAI
- Considera usar Project API Keys en lugar de User API Keys

## 🐛 Solución de Problemas

### "Por favor configura tu OPENAI_API_KEY"

➜ No has pegado tu API key en `Code.gs` o está incorrecta.

**Solución:** Verifica que en la línea 12 de `Code.gs` tengas:
```javascript
OPENAI_API_KEY: 'sk-proj-...',  // ← Debe empezar con sk-
```

### Error 401: Unauthorized

➜ Tu API key es incorrecta o ha expirado.

**Solución:**
1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Actualiza en `Code.gs`

### Error 429: Rate limit exceeded

➜ Has excedido el límite de solicitudes.

**Solución:**
- Espera 1 minuto
- Si persiste, verifica tus límites en OpenAI
- Considera upgrade de plan si es necesario

### El chat no responde

**Diagnóstico:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Ve a Apps Script → **Ejecuciones** para ver logs

**Soluciones comunes:**
- Verifica que la API key esté correcta
- Revisa que tengas créditos en OpenAI
- Comprueba que el modelo esté disponible

### Respuestas muy lentas

**Causas:**
- Modelo pesado (gpt-4o es más lento que gpt-4o-mini)
- Respuestas muy largas (max_tokens alto)
- Límites de rate en tu cuenta

**Solución:**
- Cambia a `gpt-4o-mini`
- Reduce `max_tokens` a 1000
- Espera unos segundos entre mensajes

## 🎉 ¡Listo para empezar!

Con solo tu API key, tienes un asistente AI completamente funcional en Google Docs.

**Checklist final:**
```
□ API key obtenida de OpenAI
□ API key pegada en Code.gs (línea 12)
□ Archivo guardado
□ Documento refrescado
□ Chat abierto desde el menú
□ ¡Funciona! 🎉
```

Si tienes problemas, revisa la sección de **Solución de Problemas** arriba o usa el **Diagnóstico** desde el menú.

¡Disfruta tu asistente AI! 🚀
