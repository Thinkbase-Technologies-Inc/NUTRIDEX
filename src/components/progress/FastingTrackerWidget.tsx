"use client";

import { useEffect, useState } from "react";
import { Timer, Play, Square, Flame, Clock } from "lucide-react";
import {
  useProgressStore,
  FASTING_PROTOCOLS,
  type FastingProtocol,
} from "@/stores/useProgressStore";
import { useToast } from "@/components/ui/Toast";

export function FastingTrackerWidget() {
  const { isFasting, fastingProtocol, fastingStartTime, startFasting, stopFasting } =
    useProgressStore();
  const { showToast } = useToast();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const info = FASTING_PROTOCOLS[fastingProtocol];
  const targetSeconds = info.fastingHours * 3600;

  useEffect(() => {
    if (!isFasting || !fastingStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const diffMs = Date.now() - new Date(fastingStartTime).getTime();
      return Math.max(0, Math.floor(diffMs / 1000));
    };

    setElapsedSeconds(calculateElapsed());
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [isFasting, fastingStartTime]);

  const elapsedHours = Math.floor(elapsedSeconds / 3600);
  const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
  const elapsedSecs = elapsedSeconds % 60;

  const percentage = isFasting
    ? Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100))
    : 0;

  // Stages
  const getFastingStage = (hours: number) => {
    if (hours < 4) return { stage: "Fase digestiva", desc: "El cuerpo procesa la última comida" };
    if (hours < 12) return { stage: "Descenso de glucosa", desc: "Uso de reservas energéticas" };
    if (hours < 16) return { stage: "Quema de grasa (Cetosis)", desc: "Metabolismo activo de lípidos" };
    return { stage: "Autofagia celular", desc: "Regeneración celular profunda" };
  };

  const currentStage = getFastingStage(elapsedHours);

  const handleToggle = () => {
    if (isFasting) {
      stopFasting();
      showToast({
        type: "info",
        title: "Ayuno concluido",
        description: `Completaste ${elapsedHours}h ${elapsedMinutes}m de ayuno. ¡Excelente constancia!`,
      });
    } else {
      startFasting(fastingProtocol);
      showToast({
        type: "success",
        title: "Ayuno iniciado",
        description: `Protocolo ${info.name} activado. ¡Mantente bien hidratado!`,
      });
    }
  };

  return (
    <div className="nx-card p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-nutridex-text-primary">
              Ayuno Intermitente
            </h3>
            <p className="text-xs text-nutridex-text-secondary">
              {info.name} ({info.fastingHours}h ayuno / {info.eatingHours}h ventana)
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
            isFasting
              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
              : "bg-nutridex-surface-muted text-nutridex-text-secondary border-nutridex-border"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isFasting ? "bg-amber-500 animate-pulse" : "bg-neutral-400"
            }`}
          />
          <span>{isFasting ? "En ayuno" : "En reposo"}</span>
        </span>
      </div>

      {/* Protocols Selector (Only when stopped) */}
      {!isFasting && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(FASTING_PROTOCOLS) as FastingProtocol[]).map((proto) => {
            const active = fastingProtocol === proto;
            return (
              <button
                key={proto}
                type="button"
                onClick={() => startFasting(proto)}
                className={`rounded-2xl border p-2.5 text-center transition-all ${
                  active
                    ? "border-nutridex-primary bg-nutridex-mint text-nutridex-text-primary font-bold shadow-xs"
                    : "border-nutridex-border bg-nutridex-surface hover:bg-nutridex-surface-muted text-nutridex-text-secondary font-medium"
                }`}
              >
                <span className="block text-xs font-black">{proto}</span>
                <span className="block text-xs text-nutridex-text-secondary">
                  {FASTING_PROTOCOLS[proto].fastingHours}h / {FASTING_PROTOCOLS[proto].eatingHours}h
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Circular Display & Time */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* Circle Progress */}
        <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-nutridex-border"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-amber-500 transition-all duration-500"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-nutridex-text-primary">
              {percentage}%
            </span>
            <span className="text-xs font-bold text-nutridex-text-secondary uppercase tracking-tight">
              {info.fastingHours}h meta
            </span>
          </div>
        </div>

        {/* Timer numbers & stage */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary">
              Tiempo transcurrido
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-nutridex-text-primary">
              {String(elapsedHours).padStart(2, "0")}:{String(elapsedMinutes).padStart(2, "0")}:
              {String(elapsedSecs).padStart(2, "0")}
            </div>
          </div>

          {isFasting && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-2 text-xs">
              <Flame className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300 block">
                  {currentStage.stage}
                </span>
                <span className="text-xs text-nutridex-text-secondary">
                  {currentStage.desc}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all shadow-md active:scale-98 ${
          isFasting
            ? "bg-rose-500 hover:bg-rose-600 text-white"
            : "bg-nutridex-primary hover:bg-nutridex-primary-hover text-white"
        }`}
      >
        {isFasting ? (
          <>
            <Square className="h-4 w-4 fill-white" />
            <span>Terminar ayuno</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-white" />
            <span>Iniciar ayuno ({fastingProtocol})</span>
          </>
        )}
      </button>
    </div>
  );
}
