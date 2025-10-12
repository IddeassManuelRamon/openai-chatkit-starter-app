import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export type Agent = {
  id: string;
  name: string;
  description: string;
  workflowId: string;
};

export const AGENTS: Agent[] = [
  {
    id: "general",
    name: "General",
    description: "Asistente general para consultas variadas",
    workflowId: process.env.NEXT_PUBLIC_GENERAL_ID?.trim() ?? "",
  },
  {
    id: "n8n",
    name: "N8N",
    description: "Especialista en automatizaciones N8N",
    workflowId: process.env.NEXT_PUBLIC_N8N_ID?.trim() ?? "",
  },
  {
    id: "despachos",
    name: "Despachos",
    description: "Asistente para gestión de despachos",
    workflowId: process.env.NEXT_PUBLIC_DESPACHOS_ID?.trim() ?? "",
  },
  {
    id: "tributos",
    name: "Experto en Tributos",
    description: "Especialista en tributación y normativa fiscal",
    workflowId: process.env.NEXT_PUBLIC_EXPERTO_TRIBUTOS_ID?.trim() ?? "",
  },
];

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "¿Qué puedes hacer?",
    prompt: "¿Qué puedes hacer?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Pregunta lo que quieras...";

export const GREETING = "¿Cómo puedo ayudarte hoy?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
  // Add other theme options here
  // chatkit.studio/playground to explore config options
});
