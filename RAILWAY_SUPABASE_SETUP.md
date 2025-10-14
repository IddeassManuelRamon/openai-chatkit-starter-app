# Configuración de Supabase Self-Hosted en Railway

Esta guía te explica paso a paso cómo configurar Supabase en Railway usando el template oficial.

## 📋 Prerrequisitos

- Cuenta en [Railway](https://railway.app)
- Las claves JWT generadas (usa `node generate-jwt-keys.js` si aún no las tienes)

## 🚀 Paso 1: Desplegar el Template de Supabase en Railway

1. Ve a Railway y haz clic en "New Project"
2. Selecciona "Deploy a Template"
3. Busca "Supabase" y selecciona el template oficial
4. Haz clic en "Deploy"

Railway creará automáticamente 2 servicios:
- **Gotrue Auth** (`supabase/gotrue`) - Servicio de autenticación
- **Supabase Studio** (`supabase/studio`) - Dashboard de administración

## 🔧 Paso 2: Generar las Claves JWT

Ejecuta el script incluido en el proyecto:

\`\`\`bash
node generate-jwt-keys.js
\`\`\`

Esto generará:
- **JWT_SECRET**: Secreto para firmar tokens
- **ANON_KEY**: Clave pública para el frontend
- **SERVICE_ROLE_KEY**: Clave privada para el backend

**📝 IMPORTANTE**: Guarda estas claves de forma segura. Las necesitarás tanto en Railway como en tu aplicación.

## ⚙️ Paso 3: Configurar Variables de Entorno en Railway

### Para el servicio **Gotrue Auth**:

Ve al servicio "Gotrue Auth" → Variables y añade:

#### Variables Obligatorias:

\`\`\`env
# URL del sitio (tu aplicación Next.js)
GOTRUE_SITE_URL=https://nodejs-production-1a7d.up.railway.app

# O en desarrollo local:
# GOTRUE_SITE_URL=http://localhost:3000
\`\`\`

**📌 Nota**: Railway ya preconfiguró 9 variables. Solo necesitas añadir `GOTRUE_SITE_URL`.

### Para el servicio **Supabase Studio**:

Ve al servicio "Supabase Studio" → Variables y completa estas **4 variables faltantes**:

\`\`\`env
# 1. Secreto JWT (del script generate-jwt-keys.js)
AUTH_JWT_SECRET=o8SKdGCetdFGhBX6G3/OyGgdvd4YpgUeAhNQhydjM6g=

# 2. Instrucciones importantes (puedes dejar el texto por defecto o vacío)
IMPORTANT_READ_ME=Configured

# 3. Clave anónima (del script generate-jwt-keys.js)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo

# 4. Clave de servicio (del script generate-jwt-keys.js)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjA0MjgwOTQsImV4cCI6MjA3NTc4ODA5NH0.8QRc4NgPvKqF5_wVz_0CQlzRNw8fEzNkFE_kXYBlYns
\`\`\`

## 🌐 Paso 4: Obtener las URLs de Railway

Una vez desplegados los servicios, Railway te asignará URLs públicas:

1. Ve a **Gotrue Auth** → Settings → Public Networking
   - Copia la URL (ejemplo: `https://gotrue-production-xxxx.railway.app`)

2. Ve a **Supabase Studio** → Settings → Public Networking
   - Copia la URL (ejemplo: `https://studio-production-xxxx.railway.app`)

## 📝 Paso 5: Configurar tu Aplicación Next.js

Actualiza tu archivo `.env` con las URLs y claves de Railway:

\`\`\`env
# Supabase Configuration (Self-Hosted en Railway)
NEXT_PUBLIC_SUPABASE_URL=https://gotrue-production-xxxx.railway.app
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo

# OpenAI Configuration (ya las tienes)
OPENAI_API_KEY=tu-openai-key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=tu-workflow-id

# Workflow IDs (ya los tienes)
NEXT_PUBLIC_GENERAL_ID=tu-general-id
NEXT_PUBLIC_N8N_ID=tu-n8n-id
NEXT_PUBLIC_DESPACHOS_ID=tu-despachos-id
NEXT_PUBLIC_EXPERTO_TRIBUTOS_ID=tu-tributos-id
NEXT_PUBLIC_EXPERTO_BOICAC_ID=tu-boicac-id
\`\`\`

## 🗄️ Paso 6: Configurar la Base de Datos

### Opción A: Usar Supabase Studio (Recomendado)

1. Abre la URL de Supabase Studio: `https://studio-production-xxxx.railway.app`
2. Inicia sesión con las credenciales por defecto (consulta las variables en Railway)
3. Ve a **SQL Editor**
4. Copia y pega el contenido de `supabase-schema.sql`
5. Ejecuta el script

### Opción B: Usar cliente SQL directamente

Si Railway incluye una base de datos PostgreSQL, conéctate usando las credenciales proporcionadas.

## ✅ Paso 7: Probar la Configuración

1. **Inicia tu aplicación**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Ve a** `http://localhost:3000/auth`

3. **Prueba registrar un usuario**:
   - Haz clic en "Regístrate aquí"
   - Completa el formulario
   - Si todo está bien configurado, se creará el usuario

4. **Verifica en Supabase Studio**:
   - Ve al Studio: `https://studio-production-xxxx.railway.app`
   - Navega a **Authentication** → **Users**
   - Deberías ver el usuario que acabas de crear

## 🚢 Paso 8: Desplegar tu Aplicación Next.js en Railway

1. **Crea un nuevo servicio** para tu aplicación:
   - En Railway → New → GitHub Repo
   - Selecciona tu repositorio

2. **Configura las variables de entorno**:
   - Copia TODAS las variables de tu `.env`
   - Pégalas en Railway → Variables

3. **Despliega**:
   - Railway detectará automáticamente que es Next.js
   - El deploy se iniciará automáticamente

4. **Actualiza GOTRUE_SITE_URL**:
   - Una vez desplegada, copia la URL de tu app (ej: `https://nodejs-production-1a7d.up.railway.app`)
   - Ve a Gotrue Auth → Variables
   - Actualiza `GOTRUE_SITE_URL` con tu nueva URL
   - Guarda y redespliega

## 🔐 Resumen de Variables por Servicio

### Gotrue Auth (1 variable)
\`\`\`env
GOTRUE_SITE_URL=https://tu-app.railway.app
\`\`\`

### Supabase Studio (4 variables)
\`\`\`env
AUTH_JWT_SECRET=tu-jwt-secret
IMPORTANT_READ_ME=Configured
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_KEY=tu-service-key
\`\`\`

### Tu Aplicación Next.js (todas las del .env)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://gotrue-production-xxxx.railway.app
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
OPENAI_API_KEY=tu-openai-key
# ... todas las demás
\`\`\`

## 🐛 Solución de Problemas

### Error: "Invalid JWT"
- Verifica que el `AUTH_JWT_SECRET` sea el mismo en Gotrue y Studio
- Asegúrate de que las claves ANON y SERVICE fueron generadas con ese mismo secreto

### Error: "Failed to fetch"
- Verifica que la `NEXT_PUBLIC_SUPABASE_URL` apunte a Gotrue Auth, no a Studio
- Asegúrate de que Gotrue Auth tenga una URL pública asignada

### Los usuarios no se crean
- Verifica que `GOTRUE_SITE_URL` esté configurado correctamente
- Revisa los logs de Gotrue Auth en Railway

### No puedo acceder a Studio
- Verifica que Supabase Studio tenga las 4 variables configuradas
- Asegúrate de que tenga una URL pública asignada

## 📚 Referencias

- [Documentación de Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Docker Setup](https://supabase.com/docs/guides/self-hosting/docker)

## 🎉 ¡Listo!

Ahora tienes Supabase corriendo completamente en Railway con tu propia infraestructura. Los beneficios:

- ✅ Control total sobre tus datos
- ✅ Sin límites del tier gratuito de Supabase Cloud
- ✅ Escalabilidad personalizada
- ✅ Privacidad total

---

**💡 Consejo**: Guarda el archivo `.env.supabase` generado en un lugar seguro. Contiene todas tus claves y te servirá como backup.
