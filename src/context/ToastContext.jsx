// A minimal global toast/notification system so any page can call
// toast.success("Booked!") or toast.error("...") for consistent success
// and error feedback instead of each page inventing its own banner.
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 5000);
    },
    [remove]
  );

  const toast = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
    info: (message) => push("info", message),
  };

  const ICONS = { success: CheckCircle, error: XCircle, info: Info };
  const STYLES = {
    success: "bg-white border-l-4 border-[#22C55E] text-[#0F172A]",
    error: "bg-white border-l-4 border-[#EF4444] text-[#0F172A]",
    info: "bg-white border-l-4 border-[#0EA5E9] text-[#0F172A]",
  };
  const ICON_COLORS = { success: "text-[#22C55E]", error: "text-[#EF4444]", info: "text-[#0EA5E9]" };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id} className={`flex items-start gap-3 p-4 rounded-xl shadow-xl ${STYLES[t.type]}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ICON_COLORS[t.type]}`} />
              <p className="text-sm flex-1">{t.message}</p>
              <button onClick={() => remove(t.id)} aria-label="Dismiss" className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// useToast is a small hook tied to this context; splitting it into its own
// file would only make ToastContext harder to follow for no real benefit.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
