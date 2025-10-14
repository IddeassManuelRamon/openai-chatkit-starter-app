# ⚡ Configuración Rápida de Railway - Copia y Pega

## 🎯 Para el servicio "Gotrue Auth"

Ve a: **Gotrue Auth** → **Variables** → **New Variable**

Añade esta variable:

\`\`\`
Variable: GOTRUE_SITE_URL
Value: https://nodejs-production-1a7d.up.railway.app
\`\`\`

(Reemplaza con la URL de tu app Next.js una vez desplegada)

---

## 🎯 Para el servicio "Supabase Studio"

Ve a: **Supabase Studio** → **Variables**

Verás que faltan **4 variables**. Aquí están los valores generados:

### 1. AUTH_JWT_SECRET
\`\`\`
o8SKdGCetdFGhBX6G3/OyGgdvd4YpgUeAhNQhydjM6g=
\`\`\`

### 2. IMPORTANT_READ_ME
\`\`\`
Configured
\`\`\`

### 3. SUPABASE_ANON_KEY
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo
\`\`\`

### 4. SUPABASE_SERVICE_KEY
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjA0MjgwOTQsImV4cCI6MjA3NTc4ODA5NH0.8QRc4NgPvKqF5_wVz_0CQlzRNw8fEzNkFE_kXYBlYns
\`\`\`

---

## 🎯 Para tu aplicación Next.js (.env)

Una vez que Gotrue Auth esté desplegado, copia su URL pública y actualiza tu `.env`:

\`\`\`env
# Supabase Self-Hosted en Railway
NEXT_PUBLIC_SUPABASE_URL=https://tu-gotrue-url.railway.app
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo
\`\`\`

---

## 📋 Checklist de Configuración

- [ ] Añadir `GOTRUE_SITE_URL` en Gotrue Auth
- [ ] Añadir las 4 variables faltantes en Supabase Studio
- [ ] Esperar a que ambos servicios se desplieguen
- [ ] Copiar la URL de Gotrue Auth
- [ ] Actualizar `.env` local con la URL de Gotrue
- [ ] Probar registro de usuario en `http://localhost:3000/auth`
- [ ] Verificar usuario creado en Supabase Studio

---

## 🔍 Cómo obtener las URLs en Railway

1. **URL de Gotrue Auth**:
   - Ve a: Gotrue Auth → Settings → Networking
   - Busca "Public Networking"
   - Copia la URL (ejemplo: `https://gotrue-production-xxxx.railway.app`)

2. **URL de Supabase Studio**:
   - Ve a: Supabase Studio → Settings → Networking
   - Busca "Public Networking"
   - Copia la URL (ejemplo: `https://studio-production-xxxx.railway.app`)

---

## 🚨 IMPORTANTE

**Guarda estas claves de forma segura:**

- JWT_SECRET: `o8SKdGCetdFGhBX6G3/OyGgdvd4YpgUeAhNQhydjM6g=`
- ANON_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- SERVICE_ROLE_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Todas están guardadas en: `.env.supabase`

**⚠️ NUNCA expongas el SERVICE_ROLE_KEY en el frontend o en repositorios públicos.**

---

## 🆘 Si algo no funciona

1. Verifica que todas las variables estén copiadas correctamente (sin espacios extra)
2. Asegúrate de que ambos servicios estén desplegados (estado verde en Railway)
3. Revisa los logs de cada servicio en Railway
4. Consulta [RAILWAY_SUPABASE_SETUP.md](./RAILWAY_SUPABASE_SETUP.md) para más detalles
