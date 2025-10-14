"use client";

import { Agent } from "@/lib/config";
import { useState, useMemo, useRef, useEffect } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) {
      return agents;
    }
    const query = searchQuery.toLowerCase();
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-surface/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-border hover:bg-surface hover:border-brand-primary/30 hover:shadow-lg transition-all duration-200 group"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-surface font-bold text-sm shadow-sm">
          {currentAgent.name.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-foreground group-hover:text-brand-primary transition-colors">
          {currentAgent.name}
        </span>
        <svg
          className={`w-4 h-4 text-foreground-muted group-hover:text-brand-primary transition-all duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery("");
            }}
          />
          <div className="absolute top-full left-0 mt-3 z-50 bg-surface-elevated rounded-2xl shadow-xl border border-border overflow-hidden min-w-[360px] animate-fade-in">
            {/* Search input */}
            <div className="p-4 border-b border-border bg-background-secondary">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar agente..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-foreground placeholder:text-foreground-muted transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Agents list */}
            <div className="py-2 max-h-[420px] overflow-y-auto">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <button
                    key={agent.id}
                    className={`w-full px-4 py-3 text-left transition-all duration-150 group ${
                      agent.id === currentAgent.id
                        ? "bg-brand-primary/10 border-l-4 border-brand-primary"
                        : "hover:bg-surface-hover border-l-4 border-transparent"
                    }`}
                    onClick={() => {
                      onSelectAgent(agent);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105 ${
                        agent.id === currentAgent.id
                          ? "bg-gradient-to-br from-brand-primary to-brand-primary-dark"
                          : "bg-gradient-to-br from-foreground-muted to-foreground-secondary"
                      }`}>
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm transition-colors ${
                          agent.id === currentAgent.id
                            ? "text-brand-primary"
                            : "text-foreground group-hover:text-brand-primary"
                        }`}>
                          {agent.name}
                        </div>
                        <div className="text-xs text-foreground-muted truncate mt-0.5">
                          {agent.description}
                        </div>
                      </div>
                      {agent.id === currentAgent.id && (
                        <svg
                          className="w-5 h-5 text-brand-primary flex-shrink-0"
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
                ))
              ) : (
                <div className="px-4 py-12 text-center text-sm text-foreground-muted">
                  <svg className="w-12 h-12 mx-auto mb-3 text-foreground-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No se encontraron agentes
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
