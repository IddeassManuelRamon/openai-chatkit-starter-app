# OpenAI ChatKit Starter App

## Project Overview

This is a Next.js application that integrates OpenAI's ChatKit web component to provide a chat interface powered by OpenAI's Agent Builder workflows. The app serves as a minimal starter template for building conversational AI applications.

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Component**: @openai/chatkit-react (>=1.1.1 <2.0.0)
- **Authentication**: Supabase (@supabase/supabase-js, @supabase/ssr)
- **Linting**: ESLint 9

## Project Structure

```
├── app/
│   ├── api/
│   │   └── create-session/
│   │       └── route.ts          # API endpoint for ChatKit session creation
│   ├── auth/
│   │   └── page.tsx              # Authentication page (login/register/forgot password)
│   ├── App.tsx                    # Main app component (protected)
│   ├── layout.tsx                 # Root layout with AuthProvider
│   └── page.tsx                   # Home page
├── components/
│   ├── ChatKitPanel.tsx           # Main ChatKit integration component
│   ├── ErrorOverlay.tsx           # Error handling UI
│   ├── LoginForm.tsx              # Login form component
│   ├── RegisterForm.tsx           # Registration form component
│   ├── ForgotPasswordForm.tsx     # Password recovery form
│   └── Header.tsx                 # Header with user menu and logout
├── contexts/
│   └── AuthContext.tsx            # Authentication context provider
├── lib/
│   ├── config.ts                  # App configuration (prompts, theme, workflow ID)
│   ├── supabase.ts                # Supabase client (browser)
│   └── supabase-server.ts         # Supabase client (server)
├── hooks/                         # Custom React hooks
├── public/                        # Static assets
├── middleware.ts                  # Route protection middleware
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment variables template
├── supabase-schema.sql           # Database schema for Supabase
├── AUTH_SETUP.md                 # Complete authentication setup guide
└── QUICK_START.md                # Quick start guide
```

## Key Files

### Configuration
- **lib/config.ts**: Central configuration for:
  - Workflow ID from OpenAI Agent Builder
  - Starter prompts shown to users
  - Theme configuration (colors, radius, etc.)
  - Greeting message and placeholder text

### Components
- **components/ChatKitPanel.tsx**: Main component that integrates the `<openai-chatkit>` web component with event handlers for analytics and storage
- **components/ErrorOverlay.tsx**: Error handling and display
- **components/LoginForm.tsx**: User login interface
- **components/RegisterForm.tsx**: User registration interface
- **components/ForgotPasswordForm.tsx**: Password recovery interface
- **components/Header.tsx**: Application header with user menu and logout

### Authentication
- **contexts/AuthContext.tsx**: Authentication state management and Supabase integration
- **lib/supabase.ts**: Supabase client for browser-side operations
- **lib/supabase-server.ts**: Supabase client for server-side operations
- **middleware.ts**: Route protection middleware (redirects unauthenticated users to /auth)

### API Routes
- **app/api/create-session/route.ts**: Backend endpoint that creates ChatKit sessions using the OpenAI API

## Environment Variables

Required variables in `.env`:
- `OPENAI_API_KEY`: API key from OpenAI (same org/project as Agent Builder)
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: Workflow ID from Agent Builder
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `CHATKIT_API_BASE` (optional): Custom base URL for ChatKit API

See [.env.example](./.env.example) for a complete template.

## Development Workflow

### Commands
- `npm run dev`: Start development server (http://localhost:3000)
- `npm run build`: Production build
- `npm start`: Start production server
- `npm run lint`: Run ESLint

### Current Branch
- **Working branch**: dev-manolo
- **Main branch**: main

## Customization Points

1. **Starter Prompts**: Edit `lib/config.ts` → `STARTER_PROMPTS` array
2. **Theme**: Modify `getThemeConfig()` in `lib/config.ts` (use https://chatkit.studio/playground for visual editing)
3. **Event Handlers**: Update `ChatKitPanel.tsx` for analytics/storage integration
4. **Greeting/Placeholder**: Change `GREETING` and `PLACEHOLDER_INPUT` in `lib/config.ts`

## Integration with OpenAI

This app connects to OpenAI's Agent Builder workflows:
1. Create a workflow in [Agent Builder](https://platform.openai.com/agent-builder)
2. Publish the workflow to get the workflow ID
3. Add the workflow ID to `.env` as `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
4. The app creates sessions via the API endpoint and renders the chat UI

## Authentication System

This application includes a complete authentication system powered by Supabase:

### Features
- Email/password registration and login
- Password recovery via email
- OAuth integration (Google, Facebook) - configurable
- Protected routes with middleware
- User profile management
- Persistent sessions with cookies

### Quick Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add them to `.env`
4. Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor
5. Start the app with `npm run dev`

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

### User Flow
1. **Unauthenticated users** → Redirected to `/auth`
2. **Login/Register** → Access granted to chat interface
3. **Authenticated users** → Can access `/` (chat) and logout from header menu
4. **Password recovery** → Email sent with reset link

## Deployment Notes

- Run `npm run build` before deploying
- Add deployment domain to [Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) in OpenAI dashboard
- Ensure environment variables are set in production environment
- For Railway deployment, see [AUTH_SETUP.md](./AUTH_SETUP.md) section 5
- Add production URL to Supabase redirect URLs

## References

### OpenAI & ChatKit
- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [ChatKit Playground](https://chatkit.studio/playground)
- [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)

### Authentication & Database
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

### Setup Guides
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup guide
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Complete authentication documentation
