"use client";

import { Agent, AGENTS } from "@/lib/config";
import { useEffect, useState, useCallback } from "react";

export function useAgentMentionDetector() {
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionPosition, setMentionPosition] = useState<{ x: number; y: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let lastValue = "";
    let checkInterval: NodeJS.Timeout;

    const checkForMention = () => {
      // Intentar acceder al textarea del ChatKit
      const chatKitElement = document.querySelector("openai-chatkit");
      if (!chatKitElement?.shadowRoot) return;

      const textarea = chatKitElement.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
      if (!textarea) return;

      const value = textarea.value;
      const cursorPosition = textarea.selectionStart ?? 0;

      // Solo verificar si el valor cambió
      if (value === lastValue) return;
      lastValue = value;

      // Buscar @ antes del cursor
      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
        const hasSpaceAfter = textAfterAt.includes(" ");
        const isAtStartOrAfterSpace = lastAtIndex === 0 || value[lastAtIndex - 1] === " " || value[lastAtIndex - 1] === "\n";

        if (isAtStartOrAfterSpace && !hasSpaceAfter) {
          // Mostrar menú de menciones
          const rect = textarea.getBoundingClientRect();
          setMentionPosition({
            x: rect.left + 20,
            y: rect.top - 10,
          });
          setSearchTerm(textAfterAt.toLowerCase());
          setShowMentionMenu(true);
          return;
        }
      }

      // Ocultar menú si no hay @
      setShowMentionMenu(false);
    };

    // Verificar cada 100ms
    checkInterval = setInterval(checkForMention, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const handleSelectAgent = useCallback((agent: Agent) => {
    // Encontrar el textarea y reemplazar @ + término con nada
    const chatKitElement = document.querySelector("openai-chatkit");
    if (!chatKitElement?.shadowRoot) return;

    const textarea = chatKitElement.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const value = textarea.value;
    const cursorPosition = textarea.selectionStart ?? 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      // Remover @ y el término de búsqueda
      const newValue = value.slice(0, lastAtIndex) + value.slice(cursorPosition);

      // Actualizar textarea (usar Object.getOwnPropertyDescriptor para activar setters)
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, newValue);
      } else {
        textarea.value = newValue;
      }

      // Disparar eventos para que React/ChatKit lo detecte
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));

      // Posicionar cursor
      textarea.setSelectionRange(lastAtIndex, lastAtIndex);
      textarea.focus();
    }

    setShowMentionMenu(false);
    return agent;
  }, []);

  const filteredAgents = AGENTS.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm) ||
    agent.description.toLowerCase().includes(searchTerm)
  );

  return {
    showMentionMenu,
    mentionPosition,
    filteredAgents,
    handleSelectAgent,
    closeMentionMenu: () => setShowMentionMenu(false),
  };
}
