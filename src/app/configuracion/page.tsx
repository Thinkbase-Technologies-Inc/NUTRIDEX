"use client";

import { useState, useCallback, useRef } from "react";
import { Download, Upload, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StoredBackupSchema } from "@/types/schema";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { StoredBackup } from "@/types";
import { clearAllUserData, savePlan } from "@/repositories/indexeddb";

export default function ConfiguracionPage() {
  const { favorites, setFavorites } = useFoodsStore();
  const { plans, loadPlans } = usePlannerStore();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const handleExport = useCallback(() => {
    const backup: StoredBackup = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      favorites,
      plans,
      preferences: {
        theme: theme as "light" | "dark" | "system",
        language: "es",
        onboardingCompleted: true,
        compactView: false,
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutridex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Respaldo exportado correctamente." });
  }, [favorites, plans, theme]);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const result = StoredBackupSchema.safeParse(parsed);
        if (!result.success) {
          setMessage({ type: "error", text: "El archivo no tiene un formato válido." });
          return;
        }
        if (!confirm("¿Reemplazar datos actuales con el respaldo? Esta acción no se puede deshacer.")) {
          setMessage({ type: "info", text: "Importación cancelada." });
          return;
        }
        setFavorites(result.data.favorites);
        for (const plan of result.data.plans) {
          await savePlan(plan);
        }
        await loadPlans();
        setMessage({ type: "success", text: "Respaldo importado correctamente." });
      } catch {
        setMessage({ type: "error", text: "Error al leer el archivo." });
      }
      if (fileRef.current) fileRef.current.value = "";
    },
    [setFavorites, loadPlans]
  );

  const handleClearData = useCallback(() => {
    if (!confirm("¿Eliminar todos tus datos guardados (favoritos, planes, preferencias)? Esta acción no se puede deshacer.")) {
      return;
    }
    setFavorites([]);
    clearAllUserData();
    setMessage({ type: "success", text: "Datos eliminados correctamente." });
  }, [setFavorites]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8 md:py-12">
      <header>
        <h1 className="text-2xl font-bold text-nutridex-text-primary">Configuración</h1>
        <p className="mt-1 text-sm text-nutridex-text-secondary">Preferencias y gestión de datos</p>
      </header>

      {message && (
        <div
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-nutridex-success/10 text-nutridex-success"
              : message.type === "error"
              ? "bg-nutridex-danger/10 text-nutridex-danger"
              : "bg-nutridex-surface-muted text-nutridex-text-secondary"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          ) : message.type === "error" ? (
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          ) : null}
          {message.text}
        </div>
      )}

      {/* Tema */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Apariencia</h2>
        <div className="mt-3 flex gap-2">
          {(["light", "dark", "system"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              aria-pressed={theme === mode}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                theme === mode
                  ? "border-nutridex-primary bg-nutridex-primary text-white"
                  : "border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
              }`}
            >
              {mode === "light" ? "Claro" : mode === "dark" ? "Oscuro" : "Sistema"}
            </button>
          ))}
        </div>
      </section>

      {/* Exportar / Importar */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Respaldo de datos</h2>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Exporta o importa tus favoritos y planes alimenticios como archivo JSON.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-medium text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <Download className="h-4 w-4" aria-hidden />
            Exportar respaldo
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-medium text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Importar respaldo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            aria-label="Seleccionar archivo de respaldo"
          />
        </div>
      </section>

      {/* Borrar datos */}
      <section className="mt-8 rounded-xl border border-nutridex-danger/30 bg-nutridex-danger/5 p-4">
        <h2 className="text-lg font-semibold text-nutridex-danger">Zona de peligro</h2>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Elimina todos tus datos guardados en este navegador. Esta acción no se puede deshacer.
        </p>
        <button
          type="button"
          onClick={handleClearData}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-nutridex-danger px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-nutridex-danger focus-visible:outline-offset-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Borrar todos mis datos
        </button>
      </section>

      {/* Privacidad */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Privacidad</h2>
        <p className="mt-2 text-sm leading-relaxed text-nutridex-text-secondary">
          NutriDex funciona sin cuenta de usuario. Tus datos (favoritos, planes, preferencias) se guardan localmente
          en tu navegador mediante localStorage e IndexedDB. No se envían a servidores externos ni se comparten con
          terceros. Puedes eliminar todos tus datos en cualquier momento desde la sección anterior.
        </p>
      </section>
    </div>
  );
}
