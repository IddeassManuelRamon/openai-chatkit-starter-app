# OpenAI ChatKit Starter App

## Project Overview

This is a Next.js application that integrates OpenAI's ChatKit web component to provide a chat interface powered by OpenAI's Agent Builder workflows. The app serves as a minimal starter template for building conversational AI applications.

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Component**: @openai/chatkit-react (>=1.1.1 <2.0.0)
- **Linting**: ESLint 9

## Project Structure

```
├── app/
│   ├── api/
│   │   └── create-session/
│   │       └── route.ts          # API endpoint for ChatKit session creation
│   ├── App.tsx                    # Main app component
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── ChatKitPanel.tsx           # Main ChatKit integration component
│   └── ErrorOverlay.tsx           # Error handling UI
├── lib/
│   └── config.ts                  # App configuration (prompts, theme, workflow ID)
├── hooks/                         # Custom React hooks
├── public/                        # Static assets
└── .env                          # Environment variables (not committed)
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

### API Routes
- **app/api/create-session/route.ts**: Backend endpoint that creates ChatKit sessions using the OpenAI API

## Environment Variables

Required variables in `.env`:
- `OPENAI_API_KEY`: API key from OpenAI (same org/project as Agent Builder)
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: Workflow ID from Agent Builder
- `CHATKIT_API_BASE` (optional): Custom base URL for ChatKit API

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

## Deployment Notes

- Run `npm run build` before deploying
- Add deployment domain to [Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) in OpenAI dashboard
- Ensure environment variables are set in production environment

## References

- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [ChatKit Playground](https://chatkit.studio/playground)
- [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)
