"use client";

import { createContext, useCallback, useMemo, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  open?: boolean;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const TOAST_LIMIT = 5;
const REMOVE_DELAY = 1000;

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

type ToastState = {
  toasts: Toast[];
};

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId: string }
  | { type: "REMOVE_TOAST"; toastId: string };

function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
      };
    }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(reducer, { toasts: [] });

  useMemo(() => {
    const handles: Record<string, ReturnType<typeof setTimeout>> = {};

    state.toasts.forEach((toast) => {
      if (toast.open === false) {
        handles[toast.id] = setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
        }, REMOVE_DELAY);
      } else if (toast.duration && toast.duration > 0) {
        handles[toast.id] = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id });
        }, toast.duration);
      }
    });

    return () => {
      Object.values(handles).forEach((h) => clearTimeout(h));
    };
  }, [state.toasts]);

  const showToast = useCallback(
    (props: Omit<Toast, "id">) => {
      const id = genId();
      dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true } });
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId: id });
  }, []);

  const openToasts = state.toasts.filter((t) => t.open !== false);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed z-[100] pointer-events-none bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 lg:flex-col lg:bottom-5 lg:left-[calc(100%-2rem)] lg:translate-x-0 lg:w-full lg:items-end">
        {openToasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertTriangle : Info;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-full max-w-sm flex-col gap-1 rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 shadow-[0_30px_60px_-30px_rgba(24,62,26,0.45)] transition-all duration-200 transform ease-out"
              style={{
                opacity: toast.open === false ? 0 : 1,
                transform: toast.open === false ? "translateY(10px)" : "translateY(0)",
              }}
              role="alert"
              aria-live="polite"
            >
              <div className="flex gap-3">
                <div className="shrink-0 rounded-full p-1.5">
                  <Icon
                    className={`h-4 w-4 ${
                      toast.type === "success" ? "text-nutridex-primary" : toast.type === "error" ? "text-nutridex-danger" : "text-nutridex-text-secondary"
                    }`}
                    aria-hidden
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-nutridex-text-primary">{toast.title}</h4>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-nutridex-text-secondary">{toast.description}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Descartar notificación"
                className="shrink-0 rounded p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary"
              >
                <span className="sr-only">Descartar</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
