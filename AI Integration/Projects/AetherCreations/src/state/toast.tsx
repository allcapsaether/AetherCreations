import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { href, type Route } from "../router";

type ToastAction = { label: string; route: Route };
type ToastState = { message: string; action?: ToastAction };
type ToastValue = { notify: (message: string, action?: ToastAction) => void };

const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const notify = useCallback((message: string, action?: ToastAction) => setToast({ message, action }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The live region stays mounted so screen readers announce new messages. */}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <span>{toast.message}</span>
            {toast.action && (
              <a href={href(toast.action.route)} onClick={() => setToast(null)}>
                {toast.action.label}
              </a>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside <ToastProvider>");
  return value;
}
