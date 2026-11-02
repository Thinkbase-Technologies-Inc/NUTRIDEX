"use client";

import { createContext, useCallback, useMemo, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

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
      <div className="fixed z-[100] pointer-events-none bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 flex flex-col gap-2.5 items-end">
        {openToasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertTriangle : Info;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-full items-start justify-between gap-3 rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 shadow-xl animate__animated animate__fadeInUp animate__faster transition-all"
              role="alert"
              aria-live="polite"
            >
              <div className="flex gap-3 min-w-0">
                <div
                  className={`shrink-0 rounded-xl p-2 ${
                    toast.type === "success"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : toast.type === "error"
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                      : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-nutridex-text-primary">{toast.title}</h4>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-nutridex-text-secondary">{toast.description}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Descartar notificación"
                className="shrink-0 rounded-lg p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
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
