"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante SSR, mostrar icono neutro (sol) para evitar mismatch
  const isLight = mounted ? theme === "light" : true;

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border hover:bg-surface-hover hover:border-border-hover transition-all duration-200 shadow-sm hover:shadow-md group"
      aria-label="Toggle theme"
      title={mounted ? (theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro") : "Cambiar tema"}
    >
      {/* Icono Sol (Light Mode) */}
      <svg
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isLight
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>

      {/* Icono Luna (Dark Mode) */}
      <svg
        className={`absolute h-5 w-5 transition-all duration-300 ${
          !isLight
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Indicador de hover */}
      <div className="absolute inset-0 rounded-xl bg-brand-primary opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
    </button>
  );
}
