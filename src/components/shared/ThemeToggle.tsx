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
      className="flex w-full items-center justify-between rounded-xl border border-nutridex-border bg-nutridex-surface px-3 py-2.5 text-sm text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
    >
      <span className="flex items-center gap-2">
        {theme === "light" ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
        {theme === "light" ? "Modo oscuro" : "Modo claro"}
      </span>
      <span className="relative h-5 w-9 rounded-full bg-nutridex-surface-muted transition-colors">
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-nutridex-primary transition-all duration-200 ${
            theme === "light" ? "left-0.5" : "left-[1.15rem]"
          }`}
        />
      </span>
    </button>
  );
}
