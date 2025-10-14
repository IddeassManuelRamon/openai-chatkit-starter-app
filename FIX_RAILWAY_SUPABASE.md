# 🔧 Solución: "Application failed to respond" en Supabase Studio

## 🎯 Problema Identificado

Según la documentación de Railway, el error "Application failed to respond" (502 Bad Gateway) ocurre cuando:

1. **El servicio no está escuchando en `0.0.0.0`**
2. **El servicio no está usando la variable `PORT` de Railway**
3. **El puerto configurado no coincide con el puerto real de la aplicación**

## ✅ Solución para Supabase Studio en Railway

### Paso 1: Verificar Variables de Entorno Obligatorias

Ve a **Supabase Studio** → **Variables** y asegúrate de tener TODAS estas:

```env
# Las 4 que ya añadiste:
AUTH_JWT_SECRET=o8SKdGCetdFGhBX6G3/OyGgdvd4YpgUeAhNQhydjM6g=
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjA0MjgwOTQsImV4cCI6MjA3NTc4ODA5NH0.8QRc4NgPvKqF5_wVz_0CQlzRNw8fEzNkFE_kXYBlYns
IMPORTANT_READ_ME=Configured

# NUEVAS - Variables adicionales críticas:
STUDIO_PORT=3000
SUPABASE_PUBLIC_URL=https://${RAILWAY_PUBLIC_DOMAIN}

# Conexión a base de datos (si tienes PostgreSQL en Railway):
DATABASE_URL=${DATABASE_URL}
POSTGRES_PASSWORD=${PGPASSWORD}
```

### Paso 2: Configurar el Puerto Correcto

Supabase Studio usa el puerto **3000** por defecto, pero Railway necesita que uses la variable `PORT`.

1. Ve a **Supabase Studio** → **Settings** → **Networking**
2. Busca **"Custom Start Command"** o **"Start Command"**
3. Si existe, déjalo vacío (Railway lo detectará automáticamente)

### Paso 3: Verificar el Target Port

1. Ve a **Supabase Studio** → **Settings** → **Networking**
2. En **"Public Networking"**, verifica:
   - **Port**: Debe ser `3000` (el puerto interno de Supabase Studio)
   - O déjalo vacío para que Railway lo detecte automáticamente

### Paso 4: Revisar los Logs

1. Ve a **Supabase Studio** → **Deployments**
2. Haz clic en el último deployment (el que está fallando)
3. Ve a **"View Logs"**
4. Busca mensajes como:
   ```
   ✓ Server listening on 0.0.0.0:3000
   ✗ Failed to connect to database
   ✗ Missing required environment variable: DATABASE_URL
   ```

### Paso 5: Verificar la Base de Datos

**IMPORTANTE**: Supabase Studio NECESITA una base de datos PostgreSQL para funcionar.

#### ¿Tienes un servicio PostgreSQL en Railway?

1. Ve a tu proyecto en Railway
2. Busca un servicio llamado **"PostgreSQL"** o **"Postgres"**

#### Si NO tienes PostgreSQL:

1. **Añadir PostgreSQL**:
   - Haz clic en **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Espera a que se despliegue (2-3 minutos)

2. **Conectar PostgreSQL a Supabase Studio**:
   - Railway generará automáticamente una variable `DATABASE_URL`
   - Ve a **Supabase Studio** → **Variables**
   - Verifica que existe: `DATABASE_URL=${DATABASE_URL}`
   - Si no existe, añádela manualmente

3. **Redeploy Supabase Studio**:
   - Ve a **Supabase Studio** → **Deployments**
   - Haz clic en **"Redeploy"**

## 🔍 Checklist de Diagnóstico

Marca cada paso que hayas completado:

- [ ] ✅ Añadidas las 4 variables principales (AUTH_JWT_SECRET, etc.)
- [ ] ✅ Añadida variable `STUDIO_PORT=3000`
- [ ] ✅ Añadida variable `SUPABASE_PUBLIC_URL`
- [ ] ✅ Verificado que existe servicio PostgreSQL en Railway
- [ ] ✅ Verificado que existe variable `DATABASE_URL` en Supabase Studio
- [ ] ✅ Revisados los logs del deployment
- [ ] ✅ El servicio muestra "Deployed" (verde) en Railway
- [ ] ✅ La URL del servicio responde (no da 502)

## 📋 Variables Completas para Supabase Studio

Aquí está la lista COMPLETA de variables que debes tener:

```env
# JWT Configuration
AUTH_JWT_SECRET=o8SKdGCetdFGhBX6G3/OyGgdvd4YpgUeAhNQhydjM6g=

# Supabase Keys
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjA0MjgwOTQsImV4cCI6MjA3NTc4ODA5NH0.8QRc4NgPvKqF5_wVz_0CQlzRNw8fEzNkFE_kXYBlYns

# Studio Configuration
STUDIO_PORT=3000
SUPABASE_PUBLIC_URL=https://${RAILWAY_PUBLIC_DOMAIN}

# Database Connection (crítico)
DATABASE_URL=${DATABASE_URL}

# Additional
IMPORTANT_READ_ME=Configured
```

## 🚨 Solución Rápida: Si Todo Falla

Si después de seguir todos estos pasos sigue fallando, hay 2 opciones:

### Opción A: Reinstalar el Template (2 minutos)

1. **Borra los servicios actuales**:
   - Supabase Studio → Settings → Delete Service
   - Gotrue Auth → Settings → Delete Service

2. **Vuelve a desplegar el template**:
   - Railway → New Project → Deploy Template
   - Busca "Supabase"
   - Esta vez, asegúrate de que el template incluya PostgreSQL

3. **Configura las variables desde el inicio**:
   - Usa la lista completa de arriba
   - No olvides añadir PostgreSQL si no viene incluido

### Opción B: Usar Supabase Cloud (5 minutos, 100% confiable)

Honestamente, si Railway sigue dando problemas, **Supabase Cloud es mucho más simple**:

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto (2 minutos)
3. Copia URL y ANON_KEY
4. Actualiza tu `.env`
5. ¡Funciona!

**Ventajas**:
- Cero configuración
- Cero errores 502
- Gratis hasta 500MB
- Funciona inmediatamente

## 📊 Siguiente Paso

**¿Qué quieres hacer?**

1. **Seguir intentando con Railway** → Revisa el checklist de arriba y verifica los logs
2. **Reinstalar el template** → Opción A
3. **Cambiar a Supabase Cloud** → Opción B (recomendado)

---

## 💬 Dame Más Información

Para ayudarte mejor, necesito saber:

1. **¿Ves un servicio "PostgreSQL" en tu proyecto de Railway?**
   - Sí / No

2. **¿Qué dice el log del deployment?**
   - Ve a Supabase Studio → Deployments → View Logs
   - Copia las últimas 10-20 líneas

3. **¿Cuántos servicios tienes en total en Railway?**
   - ¿Solo "Gotrue Auth" y "Supabase Studio"?
   - ¿O también "PostgreSQL"?

Con esa información puedo darte una solución más específica.
