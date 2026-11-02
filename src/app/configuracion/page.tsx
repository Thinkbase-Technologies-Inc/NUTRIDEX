"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sun,
  Monitor,
  Flame,
  UtensilsCrossed,
  Settings,
  Calendar,
  Sparkles,
  Database,
  Cloud,
  Camera,
} from "lucide-react";
import { StoredBackupSchema } from "@/types/schema";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTheme } from "@/components/shared/ThemeProvider";
import { NeonStatusBadge } from "@/components/shared/NeonStatusBadge";
import type { StoredBackup } from "@/types";
import { clearAllUserData, savePlan } from "@/repositories/indexeddb";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { ICONS8_METRICS } from "@/data/icons8";

export default function ConfiguracionPage() {
  const { favorites, setFavorites } = useFoodsStore();
  const { plans, loadPlans } = usePlannerStore();
  const { user, isAuthenticated, openAuthModal, logout, openAvatarModal } = useAuthStore();
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
    setMessage({ type: "success", text: "Respaldo JSON descargado correctamente." });
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
          setMessage({ type: "error", text: "El archivo no contiene un formato de respaldo válido de NutriDex." });
          return;
        }
        if (!confirm("¿Deseas reemplazar tus datos actuales con este respaldo?")) {
          setMessage({ type: "info", text: "Importación cancelada." });
          return;
        }
        setFavorites(result.data.favorites);
        for (const plan of result.data.plans) {
          await savePlan(plan);
        }
        await loadPlans();
        setMessage({ type: "success", text: "Datos y planes importados con éxito." });
      } catch {
        setMessage({ type: "error", text: "Ocurrió un error al leer el archivo." });
      }
      if (fileRef.current) fileRef.current.value = "";
    },
    [setFavorites, loadPlans]
  );

  const handleClearData = useCallback(() => {
    if (!confirm("¿Estás seguro de eliminar todos tus favoritos y planes? Esta acción no se puede deshacer.")) {
      return;
    }
    setFavorites([]);
    clearAllUserData();
    setMessage({ type: "success", text: "Todos los datos locales se han restablecido." });
  }, [setFavorites]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Configuración y datos
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-nutridex-text-secondary">
          Personaliza tu apariencia visual y gestiona el respaldo de tus planes locales.
        </p>
      </header>

      {message && (
        <div
          role="status"
          className={`mt-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              : message.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
              : "border-nutridex-border bg-nutridex-surface-muted text-nutridex-text-secondary"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          ) : message.type === "error" ? (
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          ) : null}
          <span>{message.text}</span>
        </div>
      )}

      {/* Perfil del Usuario matching Image 1 Screen 3 */}
      {isAuthenticated && user ? (
        <section className="mt-8 nx-card p-6 flex flex-col items-center text-center animate__animated animate__fadeIn">
          <div className="relative group">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-nutridex-surface shadow-md">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={openAvatarModal}
              title="Cambiar foto de perfil"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-nutridex-primary text-white shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-nutridex-text-primary">{user.name}</h2>
          <p className="text-xs text-nutridex-text-secondary">{user.email} · {user.planName ?? "ThinkBase Local-First"}</p>
          <button
            type="button"
            onClick={openAvatarModal}
            className="mt-2 text-xs font-bold text-nutridex-primary hover:underline flex items-center gap-1"
          >
            <Camera className="h-3 w-3" />
            <span>Cambiar foto (Subir imagen o elegir preset)</span>
          </button>

          {/* Two Metric Summary Cards from Image 1 Screen 3 with Icons8 */}
          <div className="mt-5 grid grid-cols-2 gap-3 w-full">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-nutridex-surface-muted border border-nutridex-border/60 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-nutridex-peach/80 shadow-2xs shrink-0">
                <Icons8Img src={ICONS8_METRICS.calories} alt="Calorías" size={24} />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-nutridex-text-secondary block">Meta diaria</span>
                <span className="text-sm font-extrabold text-nutridex-text-primary block">{user.targetCalories} kcal</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-nutridex-surface-muted border border-nutridex-border/60 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-nutridex-mint/80 shadow-2xs shrink-0">
                <Icons8Img src={ICONS8_METRICS.meals} alt="Equivalentes" size={24} />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-nutridex-text-secondary block">Equivalentes</span>
                <span className="text-sm font-extrabold text-nutridex-text-primary block">{user.targetEquivalents} equiv.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 w-full">
            <Link
              href="/mi-plan"
              className="inline-flex items-center justify-center gap-2 flex-1 rounded-2xl bg-nutridex-primary py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover transition-colors shadow-xs"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              <span>Ver mi plan de hoy</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                setMessage({ type: "info", text: "Has cerrado sesión correctamente." });
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs font-bold text-nutridex-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              Cerrar sesión
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-8 nx-card p-6 flex flex-col items-center text-center animate__animated animate__fadeIn">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary">
            <Settings className="h-7 w-7" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-nutridex-text-primary">No has iniciado sesión</h2>
          <p className="mt-1 text-xs text-nutridex-text-secondary max-w-sm">
            Inicia sesión o crea una cuenta para personalizar tus metas y sincronizar tus datos locales.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-nutridex-primary px-4 py-2 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-xs"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted shadow-2xs"
            >
              Registrarse
            </button>
          </div>
        </section>
      )}

      {/* Tema y Apariencia */}
      <section className="mt-5 nx-card p-5">
        <h2 className="text-base font-bold text-nutridex-text-primary">Apariencia</h2>
        <p className="mt-1 text-xs text-nutridex-text-secondary">
          Selecciona el tema de la interfaz según tu preferencia o la configuración de tu sistema.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { mode: "light", label: "Claro", icon: Sun },
            { mode: "dark", label: "Oscuro", icon: Moon },
            { mode: "system", label: "Sistema", icon: Monitor },
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode as "light" | "dark" | "system")}
              aria-pressed={theme === mode}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border p-3 text-xs sm:text-sm font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                theme === mode
                  ? "border-nutridex-primary bg-nutridex-primary-soft text-nutridex-primary shadow-xs"
                  : "border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Respaldo de datos */}
      <section className="mt-5 nx-card p-5">
        <h2 className="text-base font-bold text-nutridex-text-primary">Copia de seguridad</h2>
        <p className="mt-1 text-xs text-nutridex-text-secondary">
          Exporta tus favoritos y planes alimenticios para transferirlos a otro dispositivo o conservarlos seguros.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-nutridex-text-primary transition-all hover:bg-nutridex-surface-muted active:scale-95 shadow-xs focus-visible:outline-2 focus-visible:outline-nutridex-primary"
          >
            <Download className="h-4 w-4 text-nutridex-primary" aria-hidden />
            <span>Descargar respaldo JSON</span>
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-nutridex-text-primary transition-all hover:bg-nutridex-surface-muted active:scale-95 shadow-xs focus-visible:outline-2 focus-visible:outline-nutridex-primary"
          >
            <Upload className="h-4 w-4 text-nutridex-secondary" aria-hidden />
            <span>Restaurar desde JSON</span>
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

      {/* Sincronización en la Nube */}
      <section className="mt-5 nx-card p-5">
        <div className="flex items-center gap-2 text-nutridex-primary">
          <Cloud className="h-5 w-5" aria-hidden />
          <h2 className="text-base font-bold text-nutridex-text-primary">Sincronización en la Nube</h2>
        </div>
        <p className="mt-1 text-xs text-nutridex-text-secondary">
          Tus planes alimenticios, recetas, favoritos y metas se respaldan y sincronizan en tiempo real con alta disponibilidad.
        </p>
        <div className="mt-4">
          <NeonStatusBadge />
        </div>
      </section>

      {/* Privacidad & Seguridad */}
      <section className="mt-5 nx-card p-5">
        <div className="flex items-center gap-2 text-nutridex-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden />
          <h2 className="text-base font-bold text-nutridex-text-primary">Privacidad y Seguridad Garantizada</h2>
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-nutridex-text-secondary">
          NutriDex protege tu información de nutrición y salud con cifrado moderno. Puedes utilizar tu cuenta en cualquier dispositivo con sincronización automática en la nube o en modo local sin conexión con total privacidad.
        </p>
      </section>

      {/* Zona de peligro */}
      <section className="mt-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-5">
        <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400">Restablecer datos locales</h2>
        <p className="mt-1 text-xs text-nutridex-text-secondary">
          Borra permanentemente tus alimentos favoritos y tus planes de comida guardados en este navegador.
        </p>
        <button
          type="button"
          onClick={handleClearData}
          className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-rose-700 active:scale-95 shadow-xs focus-visible:outline-2 focus-visible:outline-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          <span>Borrar todos mis datos</span>
        </button>
      </section>
    </div>
  );
}
