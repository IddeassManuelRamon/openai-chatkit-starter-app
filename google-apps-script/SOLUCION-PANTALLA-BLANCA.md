# 🔧 Solución: Pantalla en Blanco en ChatKit

Si ves una pantalla completamente en blanco al abrir ChatKit, sigue esta guía.

## 🎯 Causa más común: Domain Allowlist

La causa **#1** de pantalla en blanco es que **el dominio de Google Apps Script no está autorizado** en la configuración de OpenAI.

### ¿Por qué sucede esto?

Google Apps Script ejecuta tu HTML desde dominios específicos de Google (como `script.googleusercontent.com`). Por seguridad, OpenAI requiere que estos dominios estén en la **allowlist** de tu organización.

## 📋 Solución Paso a Paso

### Paso 1: Ejecutar el Diagnóstico

1. En tu Google Doc, ve al menú **ChatKit AI** → **🔍 Diagnóstico**
2. El diagnóstico se ejecutará automáticamente
3. Te mostrará exactamente dónde está el problema

### Paso 2: Añadir Dominios a la Allowlist

Si el diagnóstico muestra un error de allowlist:

1. **Ve a la configuración de OpenAI:**
   - Abre: [https://platform.openai.com/settings/organization/security/domain-allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist)

2. **Añade los siguientes dominios** (haz clic en "Add domain" para cada uno):
   ```
   *.googleusercontent.com
   script.google.com
   *.script.google.com
   ```

3. **Espera 2-5 minutos** para que los cambios se propaguen

4. **Vuelve a intentar** abriendo el chat

### Paso 3: Verificar la Configuración

Si el diagnóstico muestra otros errores:

#### Error: "API KEY ERROR"
- Tu API key está incorrecta o ha expirado
- **Solución:**
  1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  2. Crea una nueva API key o verifica la existente
  3. Actualiza el valor en `Code.gs`:
     ```javascript
     OPENAI_API_KEY: 'sk-proj-...'  // Tu API key real
     ```

#### Error: "WORKFLOW ERROR"
- El Workflow ID está incorrecto o no existe
- **Solución:**
  1. Ve a [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder)
  2. Abre tu workflow y haz clic en "Publish"
  3. Copia el Workflow ID exacto
  4. Actualiza el valor en `Code.gs`:
     ```javascript
     WORKFLOW_ID: 'wf_...'  // Tu workflow ID real
     ```

#### Error: "API key y Workflow en diferentes organizaciones"
- La API key y el Workflow deben estar en la **misma organización/proyecto** de OpenAI
- **Solución:**
  1. Verifica que ambos estén en la misma org
  2. O crea una nueva API key en la org correcta

## 🔍 Método Manual: Ver Errores en la Consola

Si prefieres investigar manualmente:

1. **Abre ChatKit** (aunque se vea en blanco)
2. **Presiona F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**
4. Busca errores en rojo

### Errores Comunes y Soluciones

| Error en Consola | Significado | Solución |
|------------------|-------------|----------|
| `CORS error` | Dominio no autorizado | Añadir a allowlist |
| `Origin not allowed` | Dominio no autorizado | Añadir a allowlist |
| `401 Unauthorized` | API key incorrecta | Verificar API key |
| `404 Not Found` | Workflow no existe | Verificar Workflow ID |
| `Failed to fetch` | Problema de red/CORS | Añadir a allowlist |
| `clientSecret is undefined` | No se creó sesión | Revisar errores anteriores |

## 🧪 Verificación Completa

Ejecuta esta checklist:

### ✅ Checklist de Configuración

- [ ] **API Key configurada** en `Code.gs`
- [ ] **Workflow ID configurado** en `Code.gs`
- [ ] **Workflow publicado** en Agent Builder
- [ ] **API key válida** (no expirada)
- [ ] **Dominios en allowlist:**
  - [ ] `*.googleusercontent.com`
  - [ ] `script.google.com`
  - [ ] `*.script.google.com`
- [ ] **Esperado 5 minutos** después de añadir dominios
- [ ] **Documento refrescado** (F5)

## 🎬 Ejemplo Completo: Configuración desde Cero

### 1. Configurar OpenAI (5 min)

```bash
# 1. Obtener API Key
1. Ve a: https://platform.openai.com/api-keys
2. Haz clic en "Create new secret key"
3. Copia la key (empieza con sk-proj-...)
4. Guárdala (no podrás verla de nuevo)

# 2. Crear Workflow
1. Ve a: https://platform.openai.com/agent-builder
2. Haz clic en "New workflow"
3. Configura tu asistente
4. Haz clic en "Publish"
5. Copia el Workflow ID (empieza con wf_...)

# 3. Configurar Allowlist
1. Ve a: https://platform.openai.com/settings/organization/security/domain-allowlist
2. Añade estos dominios:
   - *.googleusercontent.com
   - script.google.com
   - *.script.google.com
```

### 2. Configurar Google Apps Script (3 min)

```javascript
// En Code.gs, actualiza CONFIG:
const CONFIG = {
  OPENAI_API_KEY: 'sk-proj-XXXXXXXXXX',  // ← Pega tu API key aquí
  WORKFLOW_ID: 'wf_YYYYYYYYYY',           // ← Pega tu Workflow ID aquí
  CHATKIT_API_BASE: 'https://api.openai.com'
};
```

### 3. Guardar y Probar (2 min)

1. Guarda el archivo (Ctrl+S / Cmd+S)
2. Cierra el editor de Apps Script
3. Refresca tu Google Doc (F5)
4. Ve a **ChatKit AI** → **🔍 Diagnóstico**
5. Si todo está verde ✅, ve a **ChatKit AI** → **Abrir Chat**

## 🆘 Aún no funciona?

### Debugging Avanzado

1. **Verifica los logs del servidor:**
   ```
   En el editor de Apps Script:
   - Ve a "Ejecuciones" (sidebar izquierdo)
   - Busca errores recientes
   ```

2. **Prueba la API manualmente:**
   ```bash
   # Usa curl o Postman para probar directamente
   curl -X POST https://api.openai.com/v1/chatkit/sessions \
     -H "Authorization: Bearer TU_API_KEY" \
     -H "OpenAI-Beta: chatkit_beta=v1" \
     -H "Content-Type: application/json" \
     -d '{
       "workflow": {"id": "TU_WORKFLOW_ID"},
       "user": "test-user"
     }'
   ```

3. **Verifica límites de uso:**
   - Ve a [platform.openai.com/usage](https://platform.openai.com/usage)
   - Verifica que no hayas excedido tu quota

## 📞 Soporte Adicional

Si después de seguir todos estos pasos aún tienes problemas:

1. **Ejecuta el diagnóstico** y toma una captura
2. **Abre la consola (F12)** y copia los errores
3. **Verifica los logs** en Apps Script
4. **Consulta la documentación:**
   - [ChatKit Docs](http://openai.github.io/chatkit-js/)
   - [OpenAI API Docs](https://platform.openai.com/docs)

## ✨ Consejos Finales

- **Espera siempre 2-5 minutos** después de cambiar la allowlist
- **Usa el diagnóstico** antes de contactar soporte
- **Guarda tu API key de forma segura** (nunca la compartas)
- **Monitorea tu uso** en platform.openai.com/usage
- **El chat puede tardar 3-5 segundos** en cargar la primera vez (es normal)

## 🎉 ¿Todo funcionó?

Una vez que veas el chat funcionando:

1. Prueba los **prompts de inicio**
2. Selecciona texto en tu documento y usa **"Usar texto seleccionado"**
3. **Personaliza** los prompts en `ChatPanel.html`
4. **Personaliza** el tema en `ChatPanel.html`

¡Disfruta tu asistente AI en Google Docs! 🚀
