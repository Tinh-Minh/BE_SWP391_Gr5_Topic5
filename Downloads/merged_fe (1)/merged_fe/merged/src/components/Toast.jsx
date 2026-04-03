import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, duration);
  }, []);

  const ICONS = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i",
  };

  const COLORS = {
    success: { bg: "#f0fdf4", border: "#86efac", color: "#16a34a" },
    error: { bg: "#fef2f2", border: "#fca5a5", color: "#dc2626" },
    warning: { bg: "#fffbeb", border: "#fcd34d", color: "#d97706" },
    info: { bg: "#eff6ff", border: "#93c5fd", color: "#2563eb" },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 99999,
          width: "min(420px, calc(100vw - 32px))",
        }}
      >
        {toasts.map((item) => {
          const colorSet = COLORS[item.type] || COLORS.success;
          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "24px minmax(0, 1fr) 20px",
                alignItems: "start",
                columnGap: 12,
                background: colorSet.bg,
                border: `1px solid ${colorSet.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                animation: "slideIn 0.25s ease-out",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  background: colorSet.color,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                {ICONS[item.type]}
              </span>

              <span
                style={{
                  minWidth: 0,
                  fontSize: 14,
                  color: colorSet.color,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {item.message}
              </span>

              <button
                onClick={() => setToasts((prev) => prev.filter((toastItem) => toastItem.id !== item.id))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: colorSet.color,
                  fontSize: 16,
                  lineHeight: 1,
                  padding: 0,
                  opacity: 0.6,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
