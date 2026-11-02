"use client";

import { useState } from "react";
import { Droplet, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useProgressStore } from "@/stores/useProgressStore";
import { useToast } from "@/components/ui/Toast";

export function WaterTrackerWidget({ compact = false }: { compact?: boolean }) {
  const { waterIntake, waterTarget, addWater, resetWater } = useProgressStore();
  const { showToast } = useToast();
  const [animating, setAnimating] = useState(false);

  const percentage = Math.min(100, Math.round((waterIntake / waterTarget) * 100));
  const remainingMl = Math.max(0, waterTarget - waterIntake);
  const glasses = Math.round(waterIntake / 250);
  const totalGlasses = Math.round(waterTarget / 250);

  const handleAdd = async (amount: number) => {
    setAnimating(true);
    await addWater(amount);
    setTimeout(() => setAnimating(false), 500);

    if (waterIntake + amount >= waterTarget && waterIntake < waterTarget) {
      showToast({
        type: "success",
        title: "¡Meta de hidratación alcanzada!",
        description: `Has alcanzado tus ${waterTarget} ml de agua hoy. ¡Gran trabajo!`,
      });
    }
  };

  if (compact) {
    return (
      <div className="nx-card p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Droplet className={`h-5 w-5 ${animating ? "scale-125 transition-transform" : ""}`} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">
              {glasses}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-nutridex-text-primary">Hidratación</span>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                {percentage}%
              </span>
            </div>
            <p className="text-xs text-nutridex-text-secondary">
              {waterIntake} ml / {waterTarget} ml ({remainingMl > 0 ? `faltan ${remainingMl} ml` : "¡Meta lograda!"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleAdd(250)}
            className="flex items-center gap-1 rounded-full bg-sky-500 text-white px-3 py-1.5 text-xs font-bold hover:bg-sky-600 active:scale-95 transition-all shadow-xs"
          >
            <Plus className="h-3 w-3" />
            <span>+250 ml</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-card p-5 sm:p-6 space-y-5 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Droplet className={`h-5 w-5 ${animating ? "scale-125 transition-transform" : ""}`} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-nutridex-text-primary">
              Control de Hidratación
            </h3>
            <p className="text-xs text-nutridex-text-secondary">
              Meta diaria recomendada: {waterTarget} ml ({totalGlasses} vasos)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => resetWater()}
          title="Reiniciar contador de hoy"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress Bar & Big Numbers */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-nutridex-text-primary">
            {waterIntake}{" "}
            <span className="text-sm font-semibold text-nutridex-text-secondary">ml</span>
          </span>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
            {percentage}% de tu meta
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-nutridex-surface-muted overflow-hidden border border-nutridex-border/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-nutridex-text-secondary pt-0.5">
          <span>{glasses} de {totalGlasses} vasos (≈ 250 ml c/u)</span>
          <span>{remainingMl > 0 ? `Faltan ${remainingMl} ml` : "¡Completado!"}</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => handleAdd(250)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20 p-2.5 hover:bg-sky-100/50 dark:hover:bg-sky-900/30 transition-all active:scale-95"
        >
          <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300">+250 ml</span>
          <span className="text-xs text-nutridex-text-secondary">1 Vaso</span>
        </button>

        <button
          type="button"
          onClick={() => handleAdd(500)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20 p-2.5 hover:bg-sky-100/50 dark:hover:bg-sky-900/30 transition-all active:scale-95"
        >
          <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300">+500 ml</span>
          <span className="text-xs text-nutridex-text-secondary">1 Botella</span>
        </button>

        <button
          type="button"
          onClick={() => handleAdd(1000)}
          className="flex flex-col items-center justify-center rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20 p-2.5 hover:bg-sky-100/50 dark:hover:bg-sky-900/30 transition-all active:scale-95"
        >
          <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300">+1,000 ml</span>
          <span className="text-xs text-nutridex-text-secondary">1 Termo</span>
        </button>
      </div>
    </div>
  );
}
