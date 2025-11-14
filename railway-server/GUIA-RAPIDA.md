# 🚀 Guía Rápida: Workflow de Agent Builder en Google Docs

Esta guía te lleva paso a paso para tener tu workflow de Agent Builder funcionando en Google Docs.

## 📋 Lo que necesitas

- [ ] Cuenta de OpenAI con API key
- [ ] Un workflow publicado en Agent Builder
- [ ] Cuenta de GitHub
- [ ] Cuenta de Railway (gratis)
- [ ] Google Docs

## ⏱️ Tiempo total: ~15 minutos

---

## Parte 1: Preparar el Workflow (5 min)

### 1. Crear/Publicar tu Workflow

1. Ve a [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder)
2. Crea un nuevo workflow o abre uno existente
3. Haz clic en **"Publish"**
4. **Copia el Workflow ID** (empieza con `wf_...`)
   - Guárdalo en un lugar seguro

### 2. Obtener API Key

1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Haz clic en **"Create new secret key"**
3. Dale un nombre: "Railway ChatKit Server"
4. **Copia la API key** (empieza con `sk-proj-...`)
   - ⚠️ **IMPORTANTE:** Guárdala ahora, no podrás verla de nuevo
5. Guárdala en un lugar seguro

---

## Parte 2: Desplegar Servidor en Railway (5 min)

### 1. Subir código a GitHub

**Opción A: Usar este repositorio**
- Ya está listo, solo conéctalo a Railway

**Opción B: Tu propio repo**
1. Crea un nuevo repositorio en GitHub
2. Sube la carpeta `railway-server/` a tu repo

### 2. Conectar a Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate/Inicia sesión con GitHub
3. Haz clic en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Autoriza Railway (si es primera vez)
6. Selecciona tu repositorio

### 3. Configurar el proyecto

**Si usas subcarpeta:**
1. Ve a **Settings** → **Service Settings**
2. En **Root Directory**, pon: `railway-server`
3. Click en **Save**

### 4. Variables de entorno

1. Ve a la pestaña **Variables**
2. Haz clic en **"New Variable"**
3. Añade estas 2 variables:

   | Variable | Valor |
   |----------|-------|
   | `OPENAI_API_KEY` | `sk-proj-...` (la que copiaste) |
   | `WORKFLOW_ID` | `wf_...` (el que copiaste) |

4. Railway hará deploy automáticamente

### 5. Obtener URL del servidor

1. Espera 1-2 minutos a que termine el deploy
2. Ve a **Settings** → **Networking**
3. Haz clic en **"Generate Domain"**
4. **Copia la URL** (ejemplo: `https://chatkit-proxy-production.up.railway.app`)
5. Guárdala - la necesitas para Google Apps Script

### 6. Verificar que funciona

Abre esta URL en tu navegador (reemplaza con tu URL):
```
https://tu-proyecto.up.railway.app/health
```

Deberías ver:
```json
{"status":"ok"}
```

✅ **¡Servidor listo!**

---

## Parte 3: Configurar Google Apps Script (5 min)

### 1. Abrir Apps Script

1. Abre Google Docs (nuevo o existente)
2. Ve a **Extensiones** → **Apps Script**
3. Se abrirá el editor

### 2. Copiar archivos

**Archivo 1: Code.gs**
1. Borra el contenido por defecto
2. Copia el contenido de `google-apps-script/Code-WithWorkflow.gs`
3. Pégalo en Code.gs

**Archivo 2: ChatPanelWorkflow.html**
1. Haz clic en el **+** junto a "Archivos"
2. Selecciona **HTML**
3. Nómbralo exactamente: `ChatPanelWorkflow`
4. Copia el contenido de `google-apps-script/ChatPanelWorkflow.html`
5. Pégalo

### 3. Configurar URL del servidor

En **Code.gs**, línea 12, pega tu URL de Railway:

```javascript
const CONFIG = {
  CHATKIT_PROXY_URL: 'https://tu-proyecto.up.railway.app',  // ← PEGA TU URL AQUÍ
  SERVER_API_KEY: '',  // Déjalo vacío
};
```

### 4. Guardar

1. Haz clic en el icono de **💾 Guardar**
2. Dale un nombre al proyecto: "ChatKit Workflow"
3. Cierra el editor de Apps Script

### 5. Primera ejecución

1. **Refresca** tu Google Doc (F5 o Cmd+R)
2. Espera 5-10 segundos
3. Deberías ver un nuevo menú: **ChatKit AI**
4. Haz clic en **ChatKit AI** → **Abrir Chat**
5. **Primera vez:** Google pedirá permisos
   - Haz clic en **"Revisar permisos"**
   - Selecciona tu cuenta
   - Haz clic en **"Avanzado"**
   - Haz clic en **"Ir a ChatKit Workflow (no seguro)"**
   - Haz clic en **"Permitir"**

### 6. ¡Probar!

1. El panel lateral se abrirá
2. Deberías ver tu chat
3. **Envía un mensaje:** "Hola, ¿qué puedes hacer?"
4. Debería responder según tu workflow

✅ **¡Funcionando!**

---

## 🎉 ¡Terminaste!

Ahora tienes tu workflow de Agent Builder completamente integrado en Google Docs.

## 📝 Uso diario

1. Abre cualquier Google Doc
2. **ChatKit AI** → **Abrir Chat**
3. Chatea con tu workflow
4. Usa el botón **"📝 Usar texto seleccionado"** para incluir texto del documento

---

## 🐛 Solución de problemas rápidos

### El menú "ChatKit AI" no aparece

➜ Refresca la página y espera 10 segundos

### Error: "Por favor configura tu CHATKIT_PROXY_URL"

➜ Ve a Code.gs y verifica que hayas pegado tu URL de Railway en la línea 12

### Error al crear sesión

➜ Verifica que:
1. El servidor de Railway esté corriendo (ve a railway.app)
2. La URL sea correcta (incluyendo https://)
3. Las variables de entorno estén configuradas en Railway

### El chat se carga pero no responde

➜ Abre Railway → tu proyecto → **View Logs** y busca errores

### Error 404

➜ La URL está mal escrita. Debe ser:
```
https://tu-proyecto.up.railway.app
```
(sin `/api/...` al final)

---

## 💰 Costos

**Railway:**
- Plan gratuito: $5 créditos/mes (suficiente para desarrollo)
- Plan Developer: $5/mes + uso

**OpenAI:**
- Pagas solo por los mensajes que envíes al workflow
- Depende de tu uso y del modelo que use tu workflow

**Total estimado para uso moderado:** $5-10/mes

---

## 🔒 Seguridad

✅ Tu API key está **solo en Railway** (no en el código de Apps Script)
✅ Railway usa **HTTPS automático**
✅ Las sesiones **expiran** después de 24 horas

### Opcional: Añadir autenticación

Si quieres más seguridad entre Apps Script y tu servidor:

**En Railway:**
1. Variables → Add Variable
2. Nombre: `API_KEY`
3. Valor: Genera una clave segura (ejemplo: `mi-clave-super-secreta-123`)

**En server.js** (línea 20, después de `app.use(express.json());`):
```javascript
// Middleware de autenticación
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
});
```

**En Code-WithWorkflow.gs** (línea 13):
```javascript
SERVER_API_KEY: 'mi-clave-super-secreta-123',  // ← Tu API key
```

Haz commit y push de los cambios, Railway actualizará automáticamente.

---

## 📚 Recursos

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **OpenAI Agent Builder:** [platform.openai.com/agent-builder](https://platform.openai.com/agent-builder)
- **ChatKit Docs:** [openai.github.io/chatkit-js](https://openai.github.io/chatkit-js)

---

## 🆘 Ayuda

Si algo no funciona:

1. **Revisa los logs de Railway:**
   - Ve a tu proyecto
   - Click en **Deployments**
   - Click en **View Logs**

2. **Revisa los logs de Apps Script:**
   - Ve al editor de Apps Script
   - **Ejecuciones** (sidebar izquierdo)
   - Busca errores

3. **Prueba los endpoints manualmente:**
   ```bash
   # Health check
   curl https://tu-proyecto.up.railway.app/health

   # Crear sesión
   curl -X POST https://tu-proyecto.up.railway.app/api/create-session \
     -H "Content-Type: application/json" \
     -d '{"userId": "test"}'
   ```

---

## ✨ Próximos pasos

Una vez funcionando, puedes:

- **Personalizar los prompts de inicio** en ChatPanelWorkflow.html
- **Cambiar colores y estilo** en ChatPanelWorkflow.html
- **Añadir más funcionalidades** según tus necesidades
- **Configurar dominios personalizados** en Railway
- **Añadir analytics** para monitorear uso

¡Disfruta tu workflow en Google Docs! 🚀
