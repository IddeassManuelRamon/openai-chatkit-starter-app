# 🚂 Servidor ChatKit Proxy para Railway

Este servidor actúa como proxy entre Google Apps Script y los workflows de OpenAI Agent Builder.

## 🎯 ¿Por qué necesitas este servidor?

**El problema:** ChatKit requiere un componente web que carga scripts desde CDN, pero Google Apps Script bloquea módulos ES6 externos.

**La solución:** Este servidor proxy:
- ✅ Crea sesiones de ChatKit con tu workflow
- ✅ Maneja la comunicación con OpenAI
- ✅ Permite que Google Apps Script funcione con workflows de Agent Builder
- ✅ Soporta streaming SSE (Server-Sent Events)

## 🚀 Deployment en Railway (5 minutos)

### Paso 1: Preparar el código

1. **Clona o sube este repositorio a GitHub** (si aún no lo has hecho)

2. **O crea un nuevo repositorio** con estos archivos:
   ```
   railway-server/
   ├── package.json
   ├── server.js
   ├── .env.example
   ├── .gitignore
   └── README.md
   ```

### Paso 2: Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Inicia sesión con GitHub

### Paso 3: Conectar repositorio

1. Haz clic en **"Deploy from GitHub repo"**
2. Selecciona tu repositorio
3. Si es la primera vez, autoriza Railway para acceder a GitHub
4. Selecciona el repositorio que contiene la carpeta `railway-server/`

### Paso 4: Configurar el proyecto

Railway detectará automáticamente que es un proyecto Node.js.

**Si tu código está en una subcarpeta** (como `railway-server/`):

1. Ve a **Settings** → **Service Settings**
2. En **Root Directory**, pon: `railway-server`
3. Guarda los cambios

### Paso 5: Configurar variables de entorno

1. Ve a la pestaña **Variables**
2. Añade estas variables:

   | Variable | Valor | Dónde obtenerlo |
   |----------|-------|-----------------|
   | `OPENAI_API_KEY` | `sk-proj-...` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
   | `WORKFLOW_ID` | `wf_...` | Agent Builder → Publish → Copiar ID |
   | `PORT` | `3000` | (Opcional, Railway lo asigna automáticamente) |

3. Haz clic en **"Add Variable"** para cada una

### Paso 6: Deploy

1. Railway comenzará el deployment automáticamente
2. Espera 1-2 minutos
3. Verás logs en tiempo real del deployment

### Paso 7: Obtener la URL

1. Ve a **Settings** → **Networking**
2. Haz clic en **"Generate Domain"**
3. Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
4. **Copia esta URL** - la necesitarás para Google Apps Script

### Paso 8: Verificar que funciona

Prueba tu servidor:

```bash
# Reemplaza con tu URL de Railway
curl https://tu-proyecto.up.railway.app/health
```

Deberías ver:
```json
{"status":"ok"}
```

## 🧪 Probar el servidor localmente (Opcional)

Antes de hacer deploy, puedes probarlo en tu computadora:

### 1. Instalar dependencias

```bash
cd railway-server
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` y añade tus credenciales:

```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXX
WORKFLOW_ID=wf_YYYYYYYYYY
PORT=3000
```

### 3. Iniciar el servidor

```bash
npm start
```

Deberías ver:

```
🚀 Servidor ChatKit Proxy iniciado
📡 Puerto: 3000
🌐 URL: http://localhost:3000
```

### 4. Probar los endpoints

**Health check:**
```bash
curl http://localhost:3000/health
```

**Crear sesión:**
```bash
curl -X POST http://localhost:3000/api/create-session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}'
```

**Enviar mensaje:**
```bash
curl -X POST http://localhost:3000/api/send-message-simple \
  -H "Content-Type: application/json" \
  -d '{
    "client_secret": "chsk_...",
    "message": "Hola, ¿cómo estás?"
  }'
```

## 📡 Endpoints disponibles

### GET /

Info del servidor y lista de endpoints.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "ChatKit Proxy Server",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### GET /health

Health check del servidor.

**Respuesta:**
```json
{"status": "ok"}
```

### POST /api/create-session

Crea una sesión de ChatKit con tu workflow.

**Body:**
```json
{
  "userId": "user-123"  // Opcional
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "client_secret": "chsk_abc123...",
  "expires_after": "2024-01-15T10:30:00Z",
  "user_id": "user-123"
}
```

### POST /api/send-message-simple

Envía un mensaje al workflow (sin streaming, más fácil de usar con Apps Script).

**Body:**
```json
{
  "client_secret": "chsk_abc123...",
  "message": "¿Qué puedes hacer?",
  "history": []  // Opcional
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Soy un asistente que puede ayudarte con...",
  "history": [
    {"role": "user", "content": "¿Qué puedes hacer?"},
    {"role": "assistant", "content": "Soy un asistente que puede..."}
  ]
}
```

### POST /api/send-message

Envía un mensaje con streaming SSE (para implementaciones avanzadas).

**Body:**
```json
{
  "client_secret": "chsk_abc123...",
  "message": "Escribe un poema"
}
```

**Respuesta:** Stream de eventos SSE

## 🔧 Configurar Google Apps Script

Una vez que tu servidor esté en Railway, actualiza `Code.gs`:

```javascript
const CONFIG = {
  OPENAI_API_KEY: 'tu-api-key-aqui',  // Ya no se usa directamente
  WORKFLOW_ID: 'tu-workflow-id-aqui',  // Ya no se usa directamente
  CHATKIT_PROXY_URL: 'https://tu-proyecto.up.railway.app',  // ← Tu URL de Railway
  CHAT_MODEL: 'gpt-4o-mini',
  SYSTEM_PROMPT: 'Eres un asistente útil...'
};
```

## 💰 Costos

Railway ofrece:

- **Plan gratuito**: $5 de créditos al mes (suficiente para desarrollo)
- **Plan Developer**: $5/mes + uso
- **Plan Pro**: $20/mes + uso

Para un chat con uso moderado, **el plan gratuito es suficiente**.

**Costos de OpenAI** siguen siendo los mismos (pagas por cada mensaje al workflow).

## 🔒 Seguridad

Este servidor implementa las siguientes medidas de seguridad:

1. ✅ **Variables de entorno**: Las credenciales no están en el código
2. ✅ **CORS configurado**: Acepta peticiones de cualquier origen (ajústalo si quieres más restricción)
3. ✅ **HTTPS automático**: Railway proporciona SSL gratis
4. ✅ **API key en servidor**: El cliente nunca ve tu API key de OpenAI

### Opcional: Añadir autenticación

Si quieres restringir el acceso, puedes añadir un API key simple:

**En Railway, añade variable:**
```
API_KEY=tu-clave-secreta-aqui
```

**En server.js, añade middleware:**
```javascript
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
});
```

**En Google Apps Script:**
```javascript
const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'tu-clave-secreta-aqui'
  },
  // ...
};
```

## 🐛 Solución de problemas

### Error: "OPENAI_API_KEY no está configurada"

➜ Ve a Railway → Variables → Añade `OPENAI_API_KEY`

### Error: "WORKFLOW_ID no está configurado"

➜ Ve a Railway → Variables → Añade `WORKFLOW_ID`

### El servidor no inicia

1. Revisa los logs en Railway: **Deployments** → Click en el último deployment → **View Logs**
2. Verifica que el `package.json` tenga el script `start`
3. Asegúrate de que `Root Directory` esté correctamente configurado

### Error 404 al llamar al endpoint

➜ Verifica que estés usando la URL correcta de Railway y que el endpoint esté bien escrito:
- `https://tu-proyecto.up.railway.app/api/create-session` ✅
- `https://tu-proyecto.up.railway.app/create-session` ❌

### Respuestas lentas

➜ Railway puede "dormir" el servidor después de inactividad. Para evitarlo:
- Usa el plan Developer o superior
- O implementa un "keep-alive" ping desde Apps Script cada 5 minutos

### Error de CORS

Si ves errores de CORS en la consola:

1. Verifica que el servidor tenga `cors()` habilitado
2. O añade el dominio específico en la configuración de CORS

## 📊 Monitoreo

Railway proporciona:

- **Logs en tiempo real**: Ve qué está pasando en tu servidor
- **Métricas de uso**: CPU, memoria, requests
- **Alertas**: Configura notificaciones si algo falla

Para ver logs:
1. Ve a tu proyecto en Railway
2. Click en **Deployments**
3. Click en **View Logs**

## 🔄 Actualizar el servidor

Cada vez que hagas cambios y los subas a GitHub:

1. Railway detectará el cambio automáticamente
2. Hará un nuevo deployment
3. En 1-2 minutos estará actualizado

**Sin downtime** - Railway hace rolling deployments.

## 📚 Próximos pasos

Una vez que tu servidor esté funcionando en Railway:

1. ✅ Copia la URL de Railway
2. ✅ Actualiza Google Apps Script para usar esta URL
3. ✅ Prueba crear una sesión
4. ✅ Prueba enviar mensajes
5. ✅ ¡Disfruta tu workflow de Agent Builder en Google Docs!

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Prueba los endpoints con `curl`
4. Consulta la documentación de Railway: [docs.railway.app](https://docs.railway.app)

## 🎉 ¡Listo!

Ahora tienes un servidor completamente funcional que permite que Google Apps Script use workflows de Agent Builder. 🚀
