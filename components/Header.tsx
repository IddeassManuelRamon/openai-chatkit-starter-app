"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";

export function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar mismatch de hidratación mostrando logo neutro durante SSR
  const logoSrc = mounted
    ? theme === "dark"
      ? "/Logoblanco_iddeass_v3.png"
      : "/Logonegro_iddeass_v3.png"
    : "/Logonegro_iddeass_v3.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-auto">
            <Image
              src={logoSrc}
              alt="Iddeass"
              width={140}
              height={40}
              className="h-10 object-contain"
              style={{ width: 'auto', height: '40px' }}
              priority
            />
          </div>
        </div>

        {/* Título centrado (opcional) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <h1 className="text-lg font-semibold text-foreground">
            Inteligencia Digital
          </h1>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
