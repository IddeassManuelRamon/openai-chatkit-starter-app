"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

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

        {/* Theme Toggle y User Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User Menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {user.user_metadata?.full_name || 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-background-secondary transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
