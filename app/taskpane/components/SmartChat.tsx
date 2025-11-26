"use client";

import { useState, useRef, useEffect } from "react";

interface SmartChatProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function SmartChat({ onBack }: SmartChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy tu asistente SmartChat. Puedo ayudarte con tus documentos de Word. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual OpenAI API call)
    setTimeout(() => {
      const responses = [
        "Entiendo tu solicitud. Déjame analizar el documento actual para ayudarte mejor.",
        "Puedo ayudarte con eso. Para generar el texto que necesitas, ¿podrías darme más detalles sobre el contexto?",
        "He revisado tu documento. ¿Te gustaría que sugiera mejoras en la redacción o estructura?",
        "Claro, puedo ayudarte a completar esa sección. ¿Quieres que use un tono formal o informal?",
        "Basándome en el contenido de tu documento, te sugiero considerar los siguientes puntos..."
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertTextToWord = async (text: string) => {
    // TODO: Implement actual Word text insertion using Office.js
    console.log("Inserting text to Word:", text);
    alert(`Texto insertado en Word: "${text.substring(0, 50)}..."`);
  };

  const suggestedPrompts = [
    "Genera un párrafo de introducción",
    "Mejora la redacción del documento",
    "Resume el contenido actual",
    "Sugiere una conclusión"
  ];

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
          <h2>SmartChat</h2>
        </div>
        <div className="header-actions">
          <button
            className="toolbar-button"
            onClick={() => setMessages([{
              id: "welcome",
              role: "assistant",
              content: "¡Hola! Soy tu asistente SmartChat. Puedo ayudarte con tus documentos de Word. ¿En qué puedo ayudarte hoy?",
              timestamp: new Date()
            }])}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Nueva conversación
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="smartchat-container">
        {/* Messages */}
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              <div className="message-avatar">
                {message.role === "assistant" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </div>
              <div className="message-content">
                <p style={{ margin: 0 }}>{message.content}</p>
                {message.role === "assistant" && message.id !== "welcome" && (
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "inherit"
                    }}
                    onClick={() => insertTextToWord(message.content)}
                  >
                    Insertar en Word
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message assistant">
              <div className="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div className="message-content">
                <div style={{ display: "flex", gap: "4px" }}>
                  <span className="loading-dot" style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--text-muted)",
                    animation: "pulse 1s infinite"
                  }}></span>
                  <span className="loading-dot" style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--text-muted)",
                    animation: "pulse 1s infinite 0.2s"
                  }}></span>
                  <span className="loading-dot" style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--text-muted)",
                    animation: "pulse 1s infinite 0.4s"
                  }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (only show when few messages) */}
        {messages.length <= 2 && (
          <div style={{
            padding: "12px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            borderTop: "1px solid var(--border-color)",
            background: "var(--bg-light)"
          }}>
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => setInputValue(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Escribe tu mensaje aquí..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chat-send-button"
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{ opacity: inputValue.trim() && !isLoading ? 1 : 0.5 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "8px",
            textAlign: "center"
          }}>
            SmartChat puede generar texto y ayudarte con tus documentos
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
