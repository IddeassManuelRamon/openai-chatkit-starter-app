"use client";

import { Agent } from "@/lib/config";
import { useEffect, useState } from "react";

type AgentMentionMenuProps = {
  agents: Agent[];
  position: { x: number; y: number } | null;
  onSelectAgent: (agent: Agent) => void;
  onClose: () => void;
};

export function AgentMentionMenu({
  agents,
  position,
  onSelectAgent,
  onClose,
}: AgentMentionMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!position) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % agents.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + agents.length) % agents.length);
      } else if (e.key === "Enter" && agents.length > 0) {
        e.preventDefault();
        onSelectAgent(agents[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [agents, selectedIndex, onSelectAgent, onClose, position]);

  // Resetear índice cuando cambien los agentes filtrados
  useEffect(() => {
    setSelectedIndex(0);
  }, [agents]);

  if (!position || agents.length === 0) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        style={{
          top: position.y,
          left: position.x,
          minWidth: "320px",
          maxWidth: "400px",
        }}
      >
        <div className="py-2 px-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Selecciona un agente
          </span>
        </div>
        <div className="py-1 max-h-64 overflow-y-auto">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              className={`w-full px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-slate-700"
                  : "hover:bg-gray-50 dark:hover:bg-slate-750"
              }`}
              onClick={() => onSelectAgent(agent)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white">
                    @{agent.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {agent.description}
                  </div>
                </div>
                {index === selectedIndex && (
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="py-2 px-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">↑↓</kbd>
            <span>navegar</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">Enter</kbd>
            <span>seleccionar</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded">Esc</kbd>
            <span>cerrar</span>
          </div>
        </div>
      </div>
    </>
  );
}
