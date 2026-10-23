"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
      className="flex items-center gap-2 rounded-lg border border-nutridex-border px-3 py-2 text-sm text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
      <span>{theme === "light" ? "Oscuro" : "Claro"}</span>
    </button>
  );
}
