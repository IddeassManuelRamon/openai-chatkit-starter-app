"use client";

import { useState, useEffect } from "react";

interface SmartFormProps {
  onBack: () => void;
}

interface DetectedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  type: "text" | "date" | "number" | "signature";
}

type ProcessingState = "idle" | "processing" | "completed";

export default function SmartForm({ onBack }: SmartFormProps) {
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [processingMessage, setProcessingMessage] = useState("");
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [editingField, setEditingField] = useState<DetectedField | null>(null);
  const [editValue, setEditValue] = useState("");

  // Simulate document analysis
  const startDetection = () => {
    setProcessingState("processing");
    setProcessingMessage("Analizando contenido...");

    setTimeout(() => {
      setProcessingMessage("detectando campos...");
    }, 1000);

    setTimeout(() => {
      // Simulated detected fields based on the screenshot
      const mockFields: DetectedField[] = [
        {
          id: "1",
          name: "nombre_completo_autorizante_cesion_imagen",
          value: "_________________________",
          confidence: 95,
          type: "text"
        },
        {
          id: "2",
          name: "dni_autorizante_cesion_imagen",
          value: "___________",
          confidence: 95,
          type: "text"
        },
        {
          id: "3",
          name: "nombre_curso_asociado_cesion_imagen",
          value: "-----------------------------------------------------------------------",
          confidence: 95,
          type: "text"
        },
        {
          id: "4",
          name: "nombre_completo_autorizante_firma",
          value: "_________________________",
          confidence: 95,
          type: "signature"
        },
        {
          id: "5",
          name: "fecha_autorizacion_cesion_imagen",
          value: "___________",
          confidence: 95,
          type: "date"
        },
        {
          id: "6",
          name: "firma_autorizante_cesion_imagen",
          value: "_________________________",
          confidence: 95,
          type: "signature"
        }
      ];

      setDetectedFields(mockFields);
      setProcessingState("completed");
    }, 2500);
  };

  // Start detection automatically when component mounts
  useEffect(() => {
    startDetection();
  }, []);

  const toggleFieldSelection = (fieldId: string) => {
    const newSelection = new Set(selectedFields);
    if (newSelection.has(fieldId)) {
      newSelection.delete(fieldId);
    } else {
      newSelection.add(fieldId);
    }
    setSelectedFields(newSelection);
  };

  const selectAllFields = () => {
    if (selectedFields.size === detectedFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(detectedFields.map(f => f.id)));
    }
  };

  const startEditingField = (field: DetectedField) => {
    setEditingField(field);
    setEditValue(field.value);
  };

  const saveFieldEdit = () => {
    if (editingField) {
      setDetectedFields(fields =>
        fields.map(f =>
          f.id === editingField.id ? { ...f, value: editValue } : f
        )
      );
      setEditingField(null);
      setEditValue("");
    }
  };

  const insertFieldsToWord = async () => {
    // TODO: Implement actual Word Content Control insertion
    const selectedFieldsList = detectedFields.filter(f => selectedFields.has(f.id));
    console.log("Inserting fields to Word:", selectedFieldsList);
    alert(`Se insertarán ${selectedFieldsList.length} campos como Content Controls en Word`);
  };

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
          <h2>SmartForm Tools</h2>
        </div>
        <div className="header-actions">
          {processingState === "completed" && (
            <button className="back-button" onClick={startDetection}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>
          )}
          <button className="icon-button" title="Vista lista">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button className="icon-button" title="Vista cuadrícula">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button className="toolbar-button" onClick={startDetection}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Detección
          </button>
        </div>
      </div>

      {/* Processing State */}
      {processingState === "processing" && (
        <div className="processing-state">
          <div className="processing-spinner"></div>
          <h4>Procesando documento</h4>
          <p>{processingMessage}</p>
        </div>
      )}

      {/* Completed State - Show Fields */}
      {processingState === "completed" && (
        <div className="smartform-container">
          {/* Fields Panel */}
          <div className="fields-panel">
            <div className="panel-header">
              CAMPOS DETECTADOS
              <span style={{ marginLeft: "auto", fontWeight: "normal", fontSize: "12px", color: "var(--text-muted)" }}>
                {detectedFields.length} campos encontrados
              </span>
            </div>

            <div className="fields-list">
              {detectedFields.map(field => (
                <div
                  key={field.id}
                  className={`field-card ${selectedFields.has(field.id) ? "selected" : ""}`}
                  onClick={() => toggleFieldSelection(field.id)}
                  onDoubleClick={() => startEditingField(field)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="field-name">{field.name}</div>
                    <div className="field-confidence">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      {field.confidence}%
                    </div>
                  </div>
                  <div className="field-value">{field.value}</div>
                </div>
              ))}
            </div>

            <button className="select-all-button" onClick={selectAllFields}>
              {selectedFields.size === detectedFields.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
            </button>

            {selectedFields.size > 0 && (
              <button
                className="select-all-button"
                style={{ marginTop: "0", background: "var(--primary-blue)" }}
                onClick={insertFieldsToWord}
              >
                Insertar {selectedFields.size} campo(s) en Word
              </button>
            )}
          </div>

          {/* Editor Panel */}
          <div className="editor-panel">
            <div className="editor-header">Editor de Campos</div>
            <div className="editor-content">
              {editingField ? (
                <div style={{ width: "100%", padding: "20px" }}>
                  <div className="form-group">
                    <label>Nombre del campo:</label>
                    <input type="text" value={editingField.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Valor:</label>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Ingresa el valor del campo"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select value={editingField.type} disabled>
                      <option value="text">Texto</option>
                      <option value="date">Fecha</option>
                      <option value="number">Número</option>
                      <option value="signature">Firma</option>
                    </select>
                  </div>
                  <div className="modal-actions" style={{ marginTop: "24px" }}>
                    <button className="btn-cancel" onClick={() => setEditingField(null)}>
                      Cancelar
                    </button>
                    <button className="btn-primary" onClick={saveFieldEdit}>
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                <div className="editor-empty">
                  <div className="editor-empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                  <h4>Sin campos para editar</h4>
                  <p>Selecciona campos detectados para editarlos</p>
                  <p style={{ fontSize: "11px", marginTop: "8px" }}>
                    Haz doble clic en un campo para editarlo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Idle State */}
      {processingState === "idle" && (
        <div className="processing-state">
          <div className="editor-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h4>Abre un documento para detectar campos</h4>
          <p>El sistema analizará el documento actual y detectará campos editables</p>
          <button
            className="module-button"
            style={{ maxWidth: "200px", marginTop: "16px" }}
            onClick={startDetection}
          >
            Iniciar Detección
          </button>
        </div>
      )}
    </div>
  );
}
