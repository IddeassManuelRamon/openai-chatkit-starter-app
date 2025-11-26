"use client";

import { ModuleType } from "../page";

interface HomeProps {
  onNavigate: (module: ModuleType) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div>
      {/* Header */}
      <header className="taskpane-header">
        <div className="header-left">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="header-title">IDDEASS WORD SMART</span>
        </div>
        <button className="header-settings" title="Configuración">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="home-container">
        {/* Hero Section */}
        <div className="home-hero">
          <h1>IDDEASS WORD SMART</h1>
          <p>Potencia tu productividad con herramientas inteligentes para gestión de documentos y rellenado automático de formularios</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value blue">3</div>
            <div className="stat-label">Módulos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value cyan">∞</div>
            <div className="stat-label">PDFs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value purple">AI</div>
            <div className="stat-label">Extracción</div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="modules-grid">
          {/* SmartDoc Module */}
          <div className="module-card">
            <div className="module-header">
              <div className="module-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="module-info">
                <h3>SmartDoc</h3>
                <p>Gestiona y organiza tus documentos PDF con sistema de carpetas. Haz snipeos de información para insertar en tu documento.</p>
              </div>
            </div>
            <ul className="module-features">
              <li>Sistema de carpetas</li>
              <li>Visor de documentos PDF</li>
              <li>Snipeos de información</li>
              <li>Inserción directa en Word</li>
            </ul>
            <button className="module-button" onClick={() => onNavigate("smartdoc")}>
              Acceder a Gestión de Documentos
            </button>
          </div>

          {/* SmartForm Module */}
          <div className="module-card">
            <div className="module-header">
              <div className="module-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="module-info">
                <h3>SmartForm</h3>
                <p>Detecta campos de formularios automáticamente y rellena con IA extrayendo información de documentos.</p>
              </div>
            </div>
            <ul className="module-features">
              <li>Detección de patrones</li>
              <li>Extracción con IA</li>
              <li>Autocompletado</li>
            </ul>
            <button className="module-button" onClick={() => onNavigate("smartform")}>
              Acceder a Rellenado de Formularios
            </button>
          </div>

          {/* SmartChat Module */}
          <div className="module-card">
            <div className="module-header">
              <div className="module-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="module-info">
                <h3>SmartChat</h3>
                <p>Habla con la IA para que te ayude con tus documentos.</p>
              </div>
            </div>
            <ul className="module-features">
              <li>Generación de texto</li>
              <li>Resolución de dudas</li>
              <li>Respuestas Smart en tiempo real</li>
            </ul>
            <button className="module-button" onClick={() => onNavigate("smartchat")}>
              Acceder a Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
