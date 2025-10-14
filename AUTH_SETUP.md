# Configuración de Autenticación con Supabase

Este documento explica cómo configurar el sistema de autenticación de la aplicación utilizando Supabase.

## Requisitos Previos

1. Tener una cuenta en [Supabase](https://supabase.com)
2. Tener acceso a [Railway](https://railway.app) para el despliegue

## Paso 1: Crear un Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Completa los siguientes campos:
   - **Name**: `iddeass-chat` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura y guárdala
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Pricing Plan**: Free (o el plan que prefieras)
4. Haz clic en "Create new project"
5. Espera a que el proyecto se inicialice (puede tomar unos minutos)

## Paso 2: Configurar Autenticación en Supabase

### 2.1 Obtener las Credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (bajo "Project URL")
   - **anon public** key (bajo "Project API keys")

### 2.2 Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2.3 Configurar Proveedores de Autenticación

#### Email/Password (Ya configurado por defecto)

Esta opción ya está habilitada automáticamente en Supabase.

#### Google OAuth (Opcional)

1. Ve a **Authentication** > **Providers** > **Google**
2. Habilita "Google enabled"
3. Configura las credenciales de Google OAuth:
   - Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com)
   - Configura OAuth 2.0
   - Añade la URL de callback de Supabase
   - Copia Client ID y Client Secret a Supabase

#### Facebook OAuth (Opcional)

1. Ve a **Authentication** > **Providers** > **Facebook**
2. Habilita "Facebook enabled"
3. Configura las credenciales de Facebook OAuth:
   - Crea una app en [Facebook Developers](https://developers.facebook.com)
   - Configura Facebook Login
   - Añade la URL de callback de Supabase
   - Copia App ID y App Secret a Supabase

### 2.4 Configurar URL de Redirección

1. Ve a **Authentication** > **URL Configuration**
2. Añade las siguientes URLs en "Redirect URLs":
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tu-dominio.railway.app/auth/callback` (producción)

### 2.5 Configurar Email Templates (Opcional)

1. Ve a **Authentication** > **Email Templates**
2. Personaliza los templates de:
   - Confirm signup
   - Reset password
   - Magic Link

## Paso 3: Estructura de la Base de Datos

Supabase crea automáticamente la tabla `auth.users`. Si necesitas campos adicionales del usuario, puedes crear una tabla `profiles`:

```sql
-- Ejecuta esto en el SQL Editor de Supabase
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security
alter table public.profiles enable row level security;

-- Crear políticas
create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using ( auth.uid() = id );
```

## Paso 4: Desarrollo Local

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000/auth](http://localhost:3000/auth) para ver la página de login

## Paso 5: Despliegue en Railway

### 5.1 Configurar el Proyecto en Railway

1. Ve a [Railway](https://railway.app) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo" y conecta tu repositorio
4. Railway detectará automáticamente que es un proyecto Next.js

### 5.2 Configurar Variables de Entorno en Railway

1. En tu proyecto de Railway, ve a **Variables**
2. Añade las siguientes variables:

```
OPENAI_API_KEY=tu-openai-key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=tu-workflow-id
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_GENERAL_ID=tu-general-id
NEXT_PUBLIC_N8N_ID=tu-n8n-id
NEXT_PUBLIC_DESPACHOS_ID=tu-despachos-id
NEXT_PUBLIC_EXPERTO_TRIBUTOS_ID=tu-tributos-id
NEXT_PUBLIC_EXPERTO_BOICAC_ID=tu-boicac-id
```

3. Railway desplegará automáticamente la aplicación

### 5.3 Actualizar URL de Redirección en Supabase

1. Una vez desplegada, copia la URL de tu proyecto en Railway (ej: `https://tu-app.railway.app`)
2. Ve a Supabase > **Authentication** > **URL Configuration**
3. Añade `https://tu-app.railway.app/auth/callback` a "Redirect URLs"

## Flujo de Autenticación

### 1. Registro de Usuario
- Usuario visita `/auth`
- Hace clic en "Regístrate aquí"
- Completa el formulario con nombre, email y contraseña
- Supabase envía un email de confirmación (opcional)
- Usuario confirma su email
- Es redirigido al chat

### 2. Login
- Usuario visita `/auth`
- Ingresa email y contraseña
- Es autenticado por Supabase
- Es redirigido al chat en `/`

### 3. Recuperación de Contraseña
- Usuario hace clic en "¿Olvidaste tu contraseña?"
- Ingresa su email
- Supabase envía un email con instrucciones
- Usuario hace clic en el link del email
- Establece una nueva contraseña

### 4. Cierre de Sesión
- Usuario hace clic en su avatar en el header
- Selecciona "Cerrar sesión"
- Es redirigido a `/auth`

## Protección de Rutas

La página principal (`/`) está protegida automáticamente:
- Si el usuario no está autenticado → redirige a `/auth`
- Si el usuario está autenticado → muestra el chat

## Archivos Clave

### Autenticación
- `/contexts/AuthContext.tsx` - Context Provider de autenticación
- `/lib/supabase.ts` - Cliente de Supabase para el navegador
- `/lib/supabase-server.ts` - Cliente de Supabase para el servidor

### Componentes
- `/components/LoginForm.tsx` - Formulario de login
- `/components/RegisterForm.tsx` - Formulario de registro
- `/components/ForgotPasswordForm.tsx` - Formulario de recuperación
- `/components/Header.tsx` - Header con menú de usuario y logout

### Páginas
- `/app/auth/page.tsx` - Página de autenticación (login/registro/recuperación)
- `/app/page.tsx` - Página principal (protegida, requiere login)
- `/app/App.tsx` - Componente principal con protección de rutas

## Personalización

### Estilos
Los formularios utilizan Tailwind CSS y siguen el diseño proporcionado con:
- Panel split en desktop (info izquierda, formulario derecha)
- Logo de Iddeass
- Colores: verde (#10B981) como color primario
- Animaciones y transiciones suaves

### Cambiar el Logo
Reemplaza los siguientes archivos en `/public`:
- `imagotiponegro_iddeass.v3.png` - Logo negro (tema claro)
- `Logonegro_iddeass_v3.png` - Logo completo negro
- `Logoblanco_iddeass_v3.png` - Logo completo blanco (tema oscuro)

### Modificar Validaciones
Edita los componentes de formulario:
- Longitud mínima de contraseña: `RegisterForm.tsx` línea ~28
- Validaciones de email: Manejadas automáticamente por Supabase

## Solución de Problemas

### Error: "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario haya confirmado su email (si está habilitado)

### Error: "Failed to fetch"
- Verifica que las URLs de Supabase en `.env` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Error: "redirect_to URL is not in allowlist"
- Ve a Supabase > Authentication > URL Configuration
- Añade tu URL a "Redirect URLs"

### Los usuarios no reciben emails
- Verifica la configuración SMTP en Supabase > Settings > Auth
- En desarrollo, revisa los logs en Supabase > Authentication > Logs

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Railway Docs](https://docs.railway.app)

## Soporte

Si tienes problemas con la configuración:
1. Revisa los logs de Supabase en **Authentication** > **Logs**
2. Revisa los logs de Railway en tu proyecto
3. Verifica que todas las variables de entorno estén correctamente configuradas
