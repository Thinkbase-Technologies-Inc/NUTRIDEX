/**
 * src/stores/useThemeStore.ts
 *
 * Gestión del tema con next-themes + localStorage. Hidratación segura.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode } from "@/repositories/indexeddb";
import { readTheme, writeTheme, readPreferences, writePreferences } from "@/repositories/indexeddb";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  systemMode: "light" | "dark";
  setSystemMode: (mode: "light" | "dark") => void;
  resolvedMode: "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      systemMode: "light",
      setMode: (mode) => {
        writeTheme(mode);
        set({ mode });
      },
      setSystemMode: (systemMode) => set({ systemMode }),
      get resolvedMode() {
        const { mode, systemMode } = get();
        if (mode === "system") return systemMode;
        return mode;
      },
    }),
    {
      name: "nutridex:theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

export function resolveThemeFromStorage(): ThemeMode {
  return readTheme();
}

export function applyThemeToDocument(resolved: "light" | "dark"): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
}
