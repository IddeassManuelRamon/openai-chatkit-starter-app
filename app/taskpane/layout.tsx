"use client";

import { useEffect, useState, ReactNode } from "react";
import "../globals.css";
import "./taskpane.css";

declare global {
  interface Window {
    Office?: {
      initialize: (callback: () => void) => void;
      context?: {
        document?: unknown;
      };
    };
  }
}

interface TaskpaneLayoutProps {
  children: ReactNode;
}

export default function TaskpaneLayout({ children }: TaskpaneLayoutProps) {
  const [isOfficeReady, setIsOfficeReady] = useState(false);

  useEffect(() => {
    // Load Office.js
    const script = document.createElement("script");
    script.src = "https://appsforoffice.microsoft.com/lib/1/hosted/office.js";
    script.onload = () => {
      if (window.Office) {
        window.Office.initialize = () => {
          setIsOfficeReady(true);
        };
      } else {
        // For development outside of Office
        setIsOfficeReady(true);
      }
    };
    script.onerror = () => {
      // For development outside of Office
      setIsOfficeReady(true);
    };
    document.head.appendChild(script);

    // Fallback for when Office.js doesn't call initialize
    const timeout = setTimeout(() => {
      if (!isOfficeReady) {
        setIsOfficeReady(true);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isOfficeReady]);

  if (!isOfficeReady) {
    return (
      <div className="taskpane-loading">
        <div className="loading-spinner"></div>
        <p>Cargando IDDEASS Word Smart...</p>
      </div>
    );
  }

  return (
    <div className="taskpane-container">
      {children}
    </div>
  );
}
