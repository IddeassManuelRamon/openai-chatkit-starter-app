"use client";

import { useState } from "react";

interface SmartDocProps {
  onBack: () => void;
}

interface Folder {
  id: string;
  name: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  pages: number;
}

interface Snippet {
  id: string;
  content: string;
  source: string;
  page: number;
  createdAt: Date;
}

type ViewMode = "list" | "split" | "grid";

export default function SmartDoc({ onBack }: SmartDocProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("general");
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadFolder, setUploadFolder] = useState("general");

  const [folders, setFolders] = useState<Folder[]>([
    { id: "general", name: "Sin Carpeta(General)", documents: [] }
  ]);

  const [snippets] = useState<Snippet[]>([]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        documents: []
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  const handleUploadPDF = () => {
    // TODO: Implement actual file upload
    if (uploadDocName.trim()) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: uploadDocName.trim() + ".pdf",
        pages: 1
      };
      setFolders(folders.map(f =>
        f.id === uploadFolder
          ? { ...f, documents: [...f.documents, newDoc] }
          : f
      ));
      setUploadDocName("");
      setShowUploadModal(false);
      setCurrentDocument(newDoc);
    }
  };

  const currentFolder = folders.find(f => f.id === selectedFolder);

  return (
    <div>
      {/* Header */}
      <div className="module-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="back-button" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al Menú
          </button>
          <h2>SmartDoc Tools</h2>
        </div>
        <div className="header-actions">
          <button
            className={`icon-button ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="Vista lista"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button
            className={`icon-button ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Vista dividida"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
          </button>
          <button
            className={`icon-button ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Vista cuadrícula"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            className="toolbar-button primary"
            onClick={() => setShowNewFolderModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
            Nueva Carpeta
          </button>
          <button
            className="toolbar-button primary"
            onClick={() => setShowUploadModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="smartdoc-toolbar">
        <select
          className="toolbar-input"
          style={{ maxWidth: "180px" }}
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="toolbar-input"
          placeholder="nombrepdf.pdf"
          value={currentDocument?.name || ""}
          readOnly
        />
        <button className="toolbar-button" title="Zoom out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <button className="toolbar-button" title="Zoom in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <input type="text" className="toolbar-input" style={{ width: "60px" }} placeholder="1" />
        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>de</span>
        <input type="text" className="toolbar-input" style={{ width: "60px" }} placeholder="1" readOnly />
        <button className="toolbar-button" title="Página anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
        </button>
        <button className="toolbar-button" title="Página siguiente">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7"/>
            <polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
        <button className="toolbar-button" title="Cerrar documento">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="smartdoc-content">
        {/* PDF Viewer */}
        <div className="pdf-viewer">
          {currentDocument ? (
            <div style={{ textAlign: "center" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p style={{ marginTop: "12px", opacity: 0.7 }}>{currentDocument.name}</p>
              <p style={{ fontSize: "12px", opacity: 0.5 }}>Vista previa del documento</p>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p style={{ marginTop: "12px", opacity: 0.7 }}>Selecciona o sube un documento PDF</p>
            </div>
          )}
        </div>

        {/* Snippets Panel */}
        <div className="snippets-panel">
          <div className="panel-header">SNIPPETS RECIENTES</div>
          {snippets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h4>No hay snippets recientes</h4>
              <p>Abre un archivo de la lista o haz un Snip de imagen dentro del Visor</p>
            </div>
          ) : (
            <div style={{ padding: "12px" }}>
              {snippets.map(snippet => (
                <div key={snippet.id} className="field-card">
                  <div className="field-name">{snippet.content}</div>
                  <div className="field-value">{snippet.source} - Pág. {snippet.page}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subir PDF</h3>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>×</button>
            </div>

            <div className="upload-zone">
              <div className="upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p>Arrastra tu PDF aquí o haz clic para seleccionar</p>
              <button>Seleccionar Archivo</button>
            </div>

            <div className="form-group">
              <label>Nombre del documento:</label>
              <input
                type="text"
                placeholder="Ej: Contrato de Servicios 2024"
                value={uploadDocName}
                onChange={(e) => setUploadDocName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Seleccionar carpeta:</label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
              >
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowUploadModal(false)}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={handleUploadPDF}
                disabled={!uploadDocName.trim()}
              >
                Subir PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva Carpeta</h3>
              <button className="modal-close" onClick={() => setShowNewFolderModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Nombre de la carpeta:</label>
              <input
                type="text"
                placeholder="Ej: Contratos 2024"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowNewFolderModal(false)}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Crear Carpeta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document List (when in list mode or as sidebar) */}
      {currentFolder && currentFolder.documents.length > 0 && (
        <div style={{
          padding: "12px",
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-card)"
        }}>
          <div className="panel-header" style={{ padding: "0 0 12px 0" }}>
            DOCUMENTOS EN {currentFolder.name.toUpperCase()}
          </div>
          {currentFolder.documents.map(doc => (
            <div
              key={doc.id}
              className={`field-card ${currentDocument?.id === doc.id ? "selected" : ""}`}
              onClick={() => setCurrentDocument(doc)}
            >
              <div className="field-name">{doc.name}</div>
              <div className="field-value">{doc.pages} página(s)</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
