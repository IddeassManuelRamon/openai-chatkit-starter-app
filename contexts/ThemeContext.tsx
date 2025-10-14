"use client";

import { createContext, useContext, ReactNode } from "react";
import { useColorScheme, type ColorScheme } from "@/hooks/useColorScheme";

type ThemeContextType = {
  theme: ColorScheme;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { scheme, setScheme } = useColorScheme();

  const toggleTheme = () => {
    const newTheme = scheme === "light" ? "dark" : "light";
    setScheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: scheme, toggleTheme, setTheme: setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
