"use client";

import { Agent } from "@/lib/config";
import { useState } from "react";

type AgentSelectorProps = {
  agents: Agent[];
  currentAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
};

export function AgentSelector({
  agents,
  currentAgent,
  onSelectAgent,
}: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentAgent.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden min-w-[280px]">
            <div className="py-1">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    agent.id === currentAgent.id
                      ? "bg-blue-50 dark:bg-slate-700"
                      : "hover:bg-gray-50 dark:hover:bg-slate-750"
                  }`}
                  onClick={() => {
                    onSelectAgent(agent);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agent.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {agent.description}
                      </div>
                    </div>
                    {agent.id === currentAgent.id && (
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
