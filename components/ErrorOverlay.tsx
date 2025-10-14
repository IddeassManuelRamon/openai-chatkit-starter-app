"use client";

import type { ReactNode } from "react";

type ErrorOverlayProps = {
  error: string | null;
  fallbackMessage?: ReactNode;
  onRetry?: (() => void) | null;
  retryLabel?: string;
};

export function ErrorOverlay({
  error,
  fallbackMessage,
  onRetry,
  retryLabel,
}: ErrorOverlayProps) {
  if (!error && !fallbackMessage) {
    return null;
  }

  const content = error ?? fallbackMessage;

  if (!content) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col justify-center rounded-[inherit] bg-background/90 p-6 text-center backdrop-blur-md">
      <div className="pointer-events-auto mx-auto w-full max-w-md animate-fade-in">
        {/* Icono de estado */}
        <div className="mb-4 flex justify-center">
          {error ? (
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="rounded-full bg-brand-primary/10 p-3">
              <svg className="h-8 w-8 text-brand-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>

        {/* Mensaje */}
        <div className="rounded-2xl bg-surface-elevated border border-border px-6 py-5 shadow-lg">
          <div className="text-base font-medium text-foreground">{content}</div>
          {error && onRetry ? (
            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-primary-dark hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 active:scale-95"
              onClick={onRetry}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {retryLabel ?? "Reiniciar chat"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
