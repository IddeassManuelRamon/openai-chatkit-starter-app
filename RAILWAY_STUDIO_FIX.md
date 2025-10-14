# 🔧 Solución: Variables de Supabase Studio en Railway

## 🚨 Problema Encontrado

Las variables `SUPABASE_URL` y `SUPABASE_PUBLIC_URL` están usando `RAILWAY_PRIVATE_DOMAIN` en lugar de `RAILWAY_PUBLIC_DOMAIN`.

**Variables actuales (incorrectas):**
```env
SUPABASE_PUBLIC_URL=https://${{kong.RAILWAY_PRIVATE_DOMAIN}}
SUPABASE_URL=http://${{kong.RAILWAY_PRIVATE_DOMAIN}}:8000
```

**Esto causa**: El servicio no es accesible desde internet, solo desde dentro de Railway.

## ✅ Solución: Actualizar Variables

Ve a **Supabase Studio** → **Variables** y actualiza estas 2 variables:

### 1. SUPABASE_PUBLIC_URL
**Cambiar de:**
```
https://${{kong.RAILWAY_PRIVATE_DOMAIN}}
```

**Cambiar a:**
```
https://${{kong.RAILWAY_PUBLIC_DOMAIN}}
```

### 2. SUPABASE_URL
**Cambiar de:**
```
http://${{kong.RAILWAY_PRIVATE_DOMAIN}}:8000
```

**Cambiar a:**
```
http://${{kong.RAILWAY_PUBLIC_DOMAIN}}:8000
```

## 📝 Pasos Exactos

1. **Editar SUPABASE_PUBLIC_URL**:
   - Haz clic en el icono de editar (lápiz) al lado de `SUPABASE_PUBLIC_URL`
   - Cambia `RAILWAY_PRIVATE_DOMAIN` por `RAILWAY_PUBLIC_DOMAIN`
   - Guarda

2. **Editar SUPABASE_URL**:
   - Haz clic en el icono de editar (lápiz) al lado de `SUPABASE_URL`
   - Cambia `RAILWAY_PRIVATE_DOMAIN` por `RAILWAY_PUBLIC_DOMAIN`
   - Guarda

3. **Redeploy**:
   - Ve a **Deployments**
   - Haz clic en **"Redeploy"**
   - Espera 2-3 minutos

4. **Prueba**:
   - Ve a la URL de Supabase Studio
   - Debería cargar correctamente

## 🎯 URLs Finales para tu .env

Una vez que Kong y Studio estén funcionando, copia la URL pública de Kong:

1. Ve al servicio **Kong**
2. Haz clic en **Settings** → **Networking**
3. Copia la **Public URL** (ejemplo: `https://kong-production-1b5b.up.railway.app`)

4. Actualiza tu `.env` local:
```env
# Supabase Configuration (usando Kong como gateway)
NEXT_PUBLIC_SUPABASE_URL=https://kong-production-1b5b.up.railway.app
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo
```

**IMPORTANTE**: Usa la URL de **Kong**, no la de Studio. Kong es el API Gateway que enruta todas las peticiones.

## ✅ Variables Correctas Final

Así deberían verse tus variables en Supabase Studio:

```env
AUTH_JWT_SECRET=o8Sxkdcetct4dF6h8X603/OyGqdy4VppUeNhNQhyqj3M6g=
DEFAULT_ORGANIZATION_NAME=Default Organization
DEFAULT_PROJECT_NAME=Default Project
IMPORTANT_READ_ME=Configured
NEXT_ANALYTICS_BACKEND_PROVIDER=postgres
NEXT_PUBLIC_ENABLE_LOGS=true
PG_META_CRYPTO_KEY=93p3yish12stkpz18czwoz24alrgos2
PORT=3000
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
STUDIO_PG_META_URL=http://${{Postgres Meta.RAILWAY_PRIVATE_DOMAIN}}:8080
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwNDI4MDk0LCJleHAiOjIwNzU3ODgwOTR9.gL1t3Wv3pSS2sxHWr8_k00a1yH4emqnryvvIiwLLZUo
SUPABASE_PUBLIC_URL=https://${{kong.RAILWAY_PUBLIC_DOMAIN}}
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjA0MjgwOTQsImV4cCI6MjA3NTc4ODA5NH0.8QRc4NgPvKqF5_wVz_0CQlzRNw8fEzNkFE_kXYBlYns
SUPABASE_URL=http://${{kong.RAILWAY_PUBLIC_DOMAIN}}:8000
```

**Nota**: Observa que `STUDIO_PG_META_URL` debe usar `RAILWAY_PRIVATE_DOMAIN` porque es comunicación interna, pero `SUPABASE_URL` y `SUPABASE_PUBLIC_URL` deben usar `RAILWAY_PUBLIC_DOMAIN` para acceso externo.

## 🐛 Si Sigue Sin Funcionar

Después de hacer estos cambios, si sigue sin funcionar:

1. **Verifica los logs de Kong**:
   - Ve a Kong → Deployments → View Logs
   - Busca errores de routing o conexión

2. **Verifica que Kong tenga URL pública**:
   - Kong → Settings → Networking
   - Debe tener una Public URL generada

3. **Prueba acceder directamente a Kong**:
   - Abre la URL pública de Kong en el navegador
   - Deberías ver una respuesta JSON de Kong

## 🎯 Resumen

**Cambios necesarios:**
1. ✅ `SUPABASE_PUBLIC_URL` → usar `RAILWAY_PUBLIC_DOMAIN`
2. ✅ `SUPABASE_URL` → usar `RAILWAY_PUBLIC_DOMAIN`
3. ✅ Redeploy Supabase Studio
4. ✅ Copiar URL pública de Kong para tu .env
5. ✅ Probar tu aplicación con `npm run dev`
