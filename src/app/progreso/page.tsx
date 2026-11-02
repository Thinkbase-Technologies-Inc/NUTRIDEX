"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingDown,
  Target,
  Scale,
  Plus,
  Trash2,
  Calendar,
  Activity,
  Award,
  ChevronRight,
  Flame,
  Droplet,
  Timer,
  Ruler,
} from "lucide-react";
import { useProgressStore, computeBMI } from "@/stores/useProgressStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { WaterTrackerWidget } from "@/components/progress/WaterTrackerWidget";
import { FastingTrackerWidget } from "@/components/progress/FastingTrackerWidget";
import { useToast } from "@/components/ui/Toast";

const WEEKLY_CALORIES = [
  { day: "Lun", calories: 1950, active: false },
  { day: "Mar", calories: 1820, active: false },
  { day: "Mié", calories: 2050, active: false },
  { day: "Jue", calories: 1780, active: false },
  { day: "Vie", calories: 2100, active: true },
  { day: "Sáb", calories: 1900, active: false },
  { day: "Dom", calories: 1850, active: false },
];

export default function ProgresoPage() {
  const {
    logs,
    currentWeight,
    targetWeight,
    initialWeight,
    heightCm,
    setTargetWeight,
    setHeightCm,
    logWeight,
    deleteLog,
    syncFromNeon,
  } = useProgressStore();

  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(String(currentWeight));
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newNotes, setNewNotes] = useState("");
  const [newWaist, setNewWaist] = useState("");
  const [newHip, setNewHip] = useState("");
  const [newChest, setNewChest] = useState("");
  const [newBodyFat, setNewBodyFat] = useState("");
  const [activePeriod, setActivePeriod] = useState<"semana" | "mes" | "año">("semana");

  useEffect(() => {
    syncFromNeon();
  }, [syncFromNeon]);

  // Calculations
  const weightLost = Number((initialWeight - currentWeight).toFixed(1));
  const totalGoalDelta = Math.abs(initialWeight - targetWeight);
  const progressPercent = totalGoalDelta > 0
    ? Math.min(100, Math.max(0, Math.round((Math.abs(initialWeight - currentWeight) / totalGoalDelta) * 100)))
    : 57;

  const bmiResult = computeBMI(currentWeight, heightCm);

  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 20 || weightNum > 350) {
      showToast({
        type: "error",
        title: "Peso inválido",
        description: "Por favor ingresa un peso válido en kilogramos.",
      });
      return;
    }

    await logWeight(weightNum, newDate, newNotes || undefined, {
      waist: newWaist ? parseFloat(newWaist) : undefined,
      hip: newHip ? parseFloat(newHip) : undefined,
      chest: newChest ? parseFloat(newChest) : undefined,
      body_fat: newBodyFat ? parseFloat(newBodyFat) : undefined,
    });

    showToast({
      type: "success",
      title: "Peso registrado",
      description: `Se guardó tu pesaje de ${weightNum} kg con fecha ${newDate}.`,
    });

    setIsModalOpen(false);
    setNewNotes("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 space-y-7 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-primary text-white shadow-xs">
              <Activity className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-primary">
              Métricas Corporales
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-nutridex-text-primary">
            Tu Progreso
          </h1>
          <p className="text-xs sm:text-sm text-nutridex-text-secondary">
            Monitorea tu evolución de peso, índice de masa corporal, hidratación y adherencia calórica.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-nutridex-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar nuevo peso</span>
        </button>
      </div>

      {/* Main Stats Card (Matches Mobile Screen 2 from user reference) */}
      <div className="nx-card p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary">
              Peso actual
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl sm:text-5xl font-black text-nutridex-text-primary tracking-tight">
                {currentWeight}
              </span>
              <span className="text-lg font-bold text-nutridex-text-secondary">kg</span>
            </div>
          </div>

          {/* 57% Progress Donut Ring (as in reference mockup) */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-nutridex-border"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.6"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-nutridex-text-primary">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 2 Pills: Lost (Mint) and Goal (Peach) as in user mockup */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Lost Pill */}
          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Perdido</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                {Math.abs(weightLost)}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">kg</span>
            </div>
          </div>

          {/* Goal Pill */}
          <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <Target className="h-3.5 w-3.5" />
              <span>Meta</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-rose-900 dark:text-rose-200">
                {targetWeight}
              </span>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calories Bar Chart (as in reference mockup Screen 2) */}
      <div className="nx-card p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
              Calorías semanales
            </h2>
            <p className="text-xs text-nutridex-text-secondary">
              Promedio: 1,920 kcal / día · Adherencia 94%
            </p>
          </div>

          {/* Period selector (Semana, Mes, Año) */}
          <div className="flex items-center rounded-2xl bg-nutridex-surface-muted p-1 border border-nutridex-border self-start sm:self-auto">
            {(["semana", "mes", "año"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={`rounded-xl px-3 py-1 text-xs font-bold capitalize transition-all ${
                  activePeriod === period
                    ? "bg-nutridex-primary text-white shadow-xs"
                    : "text-nutridex-text-secondary hover:text-nutridex-text-primary"
                }`}
              >
                {period === "semana" ? "Semana" : period === "mes" ? "Mes" : "Año"}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart with Friday callout tooltip (from user image 1) */}
        <div className="pt-8 pb-2">
          <div className="relative flex items-end justify-between gap-2 h-44 sm:h-52 px-2 sm:px-4">
            {WEEKLY_CALORIES.map((item) => {
              const maxCal = 2400;
              const heightPercent = Math.round((item.calories / maxCal) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Friday Active Tooltip Pill */}
                  {item.active && (
                    <div className="absolute -top-9 z-10 rounded-xl bg-nutridex-dock text-white px-2.5 py-1 text-xs font-bold shadow-lg animate__animated animate__fadeInDown whitespace-nowrap">
                      {item.calories} kcal
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full max-w-[42px] h-36 sm:h-44 flex items-end justify-center rounded-2xl bg-nutridex-surface-muted/80 overflow-hidden">
                    <div
                      className={`w-full rounded-2xl transition-all duration-500 ${
                        item.active
                          ? "bg-gradient-to-t from-nutridex-primary to-emerald-400 shadow-md"
                          : "bg-nutridex-border/60 group-hover:bg-nutridex-primary/40"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-xs font-bold ${
                      item.active
                        ? "text-nutridex-primary font-black"
                        : "text-nutridex-text-secondary"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Hydration + Intermittent Fasting (Two High-Value Features) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WaterTrackerWidget />
        <FastingTrackerWidget />
      </div>

      {/* Biometrics & IMC / Measurements Card */}
      <div className="nx-card p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-nutridex-primary text-white shadow-xs">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
                Índice de Masa Corporal (IMC) y Medidas
              </h2>
              <p className="text-xs text-nutridex-text-secondary">
                Calculado según los parámetros de la Organización Mundial de la Salud (OMS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-nutridex-text-secondary">Estatura:</span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-16 rounded-xl border border-nutridex-border bg-nutridex-surface px-2 py-1 text-xs font-bold text-center focus:border-nutridex-primary focus:outline-none"
            />
            <span className="text-xs text-nutridex-text-secondary font-bold">cm</span>
          </div>
        </div>

        {/* IMC Gauge */}
        <div className="rounded-2xl border border-nutridex-border bg-nutridex-surface-muted/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs font-black text-xl text-nutridex-text-primary">
              {bmiResult.bmi}
            </div>
            <div>
              <span className={`text-sm font-black ${bmiResult.color}`}>
                {bmiResult.category}
              </span>
              <p className="text-xs text-nutridex-text-secondary">
                Rango saludable estándar: 18.5 – 24.9 kg/m²
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-nutridex-text-secondary">
            <span>Para tu estatura de {heightCm} cm, tu peso saludable es de {Math.round(18.5 * Math.pow(heightCm / 100, 2))} a {Math.round(24.9 * Math.pow(heightCm / 100, 2))} kg.</span>
          </div>
        </div>

        {/* Recent Body Measurements */}
        {logs[0] && (logs[0].waist || logs[0].hip || logs[0].body_fat) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {logs[0].waist && (
              <div className="rounded-2xl border border-nutridex-border p-3 text-center">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Cintura</span>
                <p className="text-base font-black text-nutridex-text-primary">{logs[0].waist} cm</p>
              </div>
            )}
            {logs[0].hip && (
              <div className="rounded-2xl border border-nutridex-border p-3 text-center">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Cadera</span>
                <p className="text-base font-black text-nutridex-text-primary">{logs[0].hip} cm</p>
              </div>
            )}
            {logs[0].chest && (
              <div className="rounded-2xl border border-nutridex-border p-3 text-center">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Pecho</span>
                <p className="text-base font-black text-nutridex-text-primary">{logs[0].chest} cm</p>
              </div>
            )}
            {logs[0].body_fat && (
              <div className="rounded-2xl border border-nutridex-border p-3 text-center">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">% Grasa</span>
                <p className="text-base font-black text-nutridex-text-primary">{logs[0].body_fat}%</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Log Table */}
      <div className="nx-card p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
            Historial de Pesajes
          </h2>
          <span className="text-xs text-nutridex-text-secondary font-semibold">
            {logs.length} registros
          </span>
        </div>

        <div className="divide-y divide-nutridex-border/60">
          {logs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-nutridex-surface-muted text-nutridex-text-secondary font-bold text-xs">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-nutridex-text-primary">
                      {log.weight} kg
                    </span>
                    <span className="text-xs text-nutridex-text-secondary font-medium">
                      ({log.date})
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-nutridex-text-secondary truncate max-w-xs sm:max-w-md">
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteLog(log.id)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-nutridex-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                title="Eliminar pesaje"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Log Weight */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-3xl border border-nutridex-border bg-nutridex-surface p-6 shadow-2xl animate__animated animate__zoomIn">
            <h3 className="text-lg font-bold text-nutridex-text-primary">
              Registrar Nuevo Pesaje
            </h3>
            <p className="text-xs text-nutridex-text-secondary mt-1">
              Ingresa tu peso de hoy y opcionalmente tus medidas corporales.
            </p>

            <form onSubmit={handleSaveWeight} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Ej. 68.5"
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-bold text-nutridex-text-primary focus:border-nutridex-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs font-semibold text-nutridex-text-primary focus:border-nutridex-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                    Cintura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    placeholder="Ej. 72"
                    className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-3 py-2 text-xs font-semibold focus:border-nutridex-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                    Cadera (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHip}
                    onChange={(e) => setNewHip(e.target.value)}
                    placeholder="Ej. 96"
                    className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-3 py-2 text-xs font-semibold focus:border-nutridex-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Notas u Observaciones
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej. Después del entrenamiento matutino"
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2 text-xs font-medium focus:border-nutridex-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-nutridex-border px-4 py-2 text-xs font-bold text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-nutridex-primary px-5 py-2 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95"
                >
                  Guardar pesaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
