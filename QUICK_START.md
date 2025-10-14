# Guía Rápida de Inicio

Esta es una guía rápida para poner en marcha el sistema de autenticación con Supabase.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [Railway](https://railway.app) para despliegue (opcional)

## 🚀 Configuración Rápida (5 minutos)

### 1. Clonar y Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Espera a que se inicialice (2-3 minutos)
3. Ve a **Settings** > **API** y copia:
   - **Project URL**
   - **anon public key**

### 3. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y reemplaza los valores de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

### 4. Configurar Base de Datos

1. Ve a tu proyecto de Supabase
2. Haz clic en **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido de `supabase-schema.sql`
5. Ejecuta la query (botón **Run**)

### 5. Iniciar la Aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) - serás redirigido a `/auth` para hacer login.

## 🎯 Probar el Sistema

### Registrar un Usuario

1. Abre [http://localhost:3000/auth](http://localhost:3000/auth)
2. Haz clic en "Regístrate aquí"
3. Completa el formulario:
   - **Nombre completo**: Tu Nombre
   - **Email**: tu@email.com
   - **Contraseña**: mínimo 8 caracteres
4. Haz clic en "Registrarse"

**Nota**: Por defecto, Supabase NO requiere confirmación por email en desarrollo. Si está habilitado, revisa tu email y confirma.

### Iniciar Sesión

1. Ve a [http://localhost:3000/auth](http://localhost:3000/auth)
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido al chat

### Cerrar Sesión

1. Haz clic en tu avatar/nombre en la esquina superior derecha
2. Selecciona "Cerrar sesión"
3. Serás redirigido a `/auth`

## 🔧 Configuración Avanzada

### Habilitar Confirmación por Email

1. Ve a Supabase > **Authentication** > **Providers** > **Email**
2. Activa "Confirm email"
3. Personaliza el template de email en **Email Templates**

### Configurar Autenticación con Google/Facebook

Ver la guía completa en [AUTH_SETUP.md](./AUTH_SETUP.md)

### Personalizar Estilos

Los componentes de autenticación usan Tailwind CSS:
- [LoginForm.tsx](./components/LoginForm.tsx)
- [RegisterForm.tsx](./components/RegisterForm.tsx)
- [ForgotPasswordForm.tsx](./components/ForgotPasswordForm.tsx)

Modifica las clases de Tailwind para cambiar colores, espaciados, etc.

## 📁 Estructura de Archivos

```
├── app/
│   ├── auth/
│   │   └── page.tsx              # Página de login/registro
│   ├── App.tsx                   # App principal (protegida)
│   └── layout.tsx                # Layout con AuthProvider
├── components/
│   ├── LoginForm.tsx             # Formulario de login
│   ├── RegisterForm.tsx          # Formulario de registro
│   ├── ForgotPasswordForm.tsx    # Recuperación de contraseña
│   └── Header.tsx                # Header con menú de usuario
├── contexts/
│   └── AuthContext.tsx           # Context de autenticación
├── lib/
│   ├── supabase.ts               # Cliente de Supabase (cliente)
│   └── supabase-server.ts        # Cliente de Supabase (servidor)
├── middleware.ts                 # Middleware de protección de rutas
├── supabase-schema.sql           # Schema SQL para Supabase
├── .env                          # Variables de entorno (NO subir a git)
└── .env.example                  # Template de variables de entorno
```

## 🐛 Solución de Problemas Comunes

### Error: "Invalid supabaseUrl"
- Asegúrate de que `.env` tenga los valores correctos
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Invalid login credentials"
- Verifica email y contraseña
- Si está habilitada la confirmación, confirma tu email primero

### No recibo emails
- En desarrollo, revisa los logs en Supabase > **Authentication** > **Logs**
- Verifica la configuración SMTP en **Settings** > **Auth**

### La página no redirige correctamente
- Limpia la caché del navegador
- Borra las cookies
- Reinicia el servidor

## 🚢 Despliegue en Railway

1. Sube tu código a GitHub
2. Ve a [railway.app](https://railway.app) y crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Añade las variables de entorno desde `.env`
5. Railway desplegará automáticamente

**Importante**: Añade la URL de Railway a las "Redirect URLs" en Supabase:
- Supabase > **Authentication** > **URL Configuration**
- Añade: `https://tu-app.railway.app/auth/callback`

## 📚 Documentación Completa

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Guía completa de autenticación
- [CLAUDE.md](./CLAUDE.md) - Documentación del proyecto
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 💡 Próximos Pasos

1. Personaliza los colores y estilos
2. Configura OAuth con Google/Facebook
3. Añade más campos al perfil de usuario
4. Implementa recuperación de contraseña personalizada
5. Añade análisis de uso

## 🆘 Soporte

Si tienes problemas:
1. Revisa [AUTH_SETUP.md](./AUTH_SETUP.md) para documentación detallada
2. Verifica los logs de Supabase en **Authentication** > **Logs**
3. Revisa la consola del navegador para errores de JavaScript

---

¡Listo! Ahora tienes un sistema completo de autenticación con Supabase. 🎉
