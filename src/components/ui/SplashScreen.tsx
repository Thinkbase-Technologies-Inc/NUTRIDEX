"use client";

import { useEffect, useState } from "react";
import { NutriDexIcon } from "./NutriDexIcon";
import { Database, Sparkles } from "lucide-react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 1.3 seconds timer (1300 ms) as explicitly requested
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1300);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-nutridex-background px-6 transition-opacity duration-300 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-label="Cargando NutriDex"
    >
      <div className="relative flex flex-col items-center text-center max-w-sm animate__animated animate__fadeIn">
        {/* Glow backdrop */}
        <div className="absolute -inset-10 bg-nutridex-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />

        {/* Brand Icon with glow */}
        <div className="relative mb-6">
          <NutriDexIcon size={84} glow className="drop-shadow-2xl animate__animated animate__zoomIn" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-nutridex-primary text-white text-xs font-bold shadow-md">
            ✦
          </span>
        </div>

        {/* Brand Typography */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-nutridex-text-primary">
            NutriDex
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-nutridex-cyan flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            <span>By ThinkBase</span>
          </p>
        </div>

        {/* Nube ThinkBase pill */}
        <div className="mt-6 flex items-center gap-2 rounded-full border border-nutridex-border bg-nutridex-surface/80 px-3.5 py-1.5 text-xs font-semibold text-nutridex-text-secondary backdrop-blur-md shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Sincronización en la Nube</span>
        </div>

        {/* 1.3s Progress bar */}
        <div className="mt-8 w-44 h-1.5 bg-nutridex-border/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-nutridex-primary via-nutridex-cyan to-emerald-400 rounded-full"
            style={{
              animation: "splashProgress 1.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        </div>

        <p className="mt-3 text-xs font-medium text-nutridex-text-secondary/80">
          Cargando tu plan nutricional...
        </p>
      </div>

      <style jsx>{`
        @keyframes splashProgress {
          0% {
            width: 0%;
          }
          40% {
            width: 50%;
          }
          85% {
            width: 90%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
