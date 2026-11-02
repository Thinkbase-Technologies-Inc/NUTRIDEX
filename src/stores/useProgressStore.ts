"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProgressEntry } from "@/lib/db";
import { useAuthStore } from "./useAuthStore";

export type FastingProtocol = "16-8" | "14-10" | "12-12" | "18-6";

export interface FastingInfo {
  protocol: FastingProtocol;
  fastingHours: number;
  eatingHours: number;
  name: string;
}

export const FASTING_PROTOCOLS: Record<FastingProtocol, FastingInfo> = {
  "16-8": { protocol: "16-8", fastingHours: 16, eatingHours: 8, name: "16:8 Método Estándar" },
  "14-10": { protocol: "14-10", fastingHours: 14, eatingHours: 10, name: "14:10 Principiante" },
  "12-12": { protocol: "12-12", fastingHours: 12, eatingHours: 12, name: "12:12 Ritmo Circadiano" },
  "18-6": { protocol: "18-6", fastingHours: 18, eatingHours: 6, name: "18:6 Avanzado" },
};

export interface BMIResult {
  bmi: number;
  category: "Bajo peso" | "Peso normal" | "Sobrepeso" | "Obesidad";
  color: string;
}

export function computeBMI(weightKg: number, heightCm: number): BMIResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: "Peso normal", color: "text-emerald-600" };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: "Bajo peso", color: "text-blue-500" };
  if (bmi < 25.0) return { bmi, category: "Peso normal", color: "text-emerald-500" };
  if (bmi < 30.0) return { bmi, category: "Sobrepeso", color: "text-amber-500" };
  return { bmi, category: "Obesidad", color: "text-rose-500" };
}

interface ProgressState {
  logs: ProgressEntry[];
  currentWeight: number;
  targetWeight: number;
  initialWeight: number;
  heightCm: number;
  waterIntake: number;
  waterTarget: number;
  waterDate: string;
  fastingProtocol: FastingProtocol;
  fastingStartTime: string | null;
  isFasting: boolean;

  // Actions
  logWeight: (
    weight: number,
    date?: string,
    notes?: string,
    measurements?: { waist?: number; hip?: number; chest?: number; body_fat?: number }
  ) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  setTargetWeight: (weight: number) => void;
  setHeightCm: (height: number) => void;
  addWater: (amountMl: number) => Promise<void>;
  resetWater: () => Promise<void>;
  startFasting: (protocol?: FastingProtocol) => void;
  stopFasting: () => void;
  syncFromNeon: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      logs: [
        {
          id: "init-log",
          user_email: "emily.andrian@thinkbase.app",
          date: "2026-11-02",
          weight: 68.0,
          target_weight: 65.0,
          waist: 72,
          hip: 96,
          chest: 88,
          body_fat: 21.5,
          notes: "Registro inicial con plan activo",
        },
      ],
      currentWeight: 68.0,
      targetWeight: 65.0,
      initialWeight: 70.0,
      heightCm: 168,
      waterIntake: 1250,
      waterTarget: 2000,
      waterDate: new Date().toISOString().split("T")[0],
      fastingProtocol: "16-8",
      fastingStartTime: null,
      isFasting: false,

      logWeight: async (weight, date, notes, measurements) => {
        const today = date || new Date().toISOString().split("T")[0];
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";
        const target = get().targetWeight;

        const newEntry: ProgressEntry = {
          id: `prog-${Date.now()}`,
          user_email: email,
          date: today,
          weight,
          target_weight: target,
          waist: measurements?.waist,
          hip: measurements?.hip,
          chest: measurements?.chest,
          body_fat: measurements?.body_fat,
          notes,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          currentWeight: weight,
          logs: [newEntry, ...state.logs.filter((l) => l.date !== today)],
        }));

        // Sync with API in background
        try {
          await fetch("/api/neon/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, entry: newEntry }),
          });
        } catch {}
      },

      deleteLog: async (id: string) => {
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        set((state) => ({
          logs: state.logs.filter((l) => l.id !== id),
        }));

        try {
          await fetch(`/api/neon/progress?id=${id}&email=${encodeURIComponent(email)}`, {
            method: "DELETE",
          });
        } catch {}
      },

      setTargetWeight: (weight: number) => {
        set({ targetWeight: weight });
      },

      setHeightCm: (height: number) => {
        set({ heightCm: height });
      },

      addWater: async (amountMl: number) => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        const currentAmount = state.waterDate === today ? state.waterIntake : 0;
        const newIntake = Math.max(0, currentAmount + amountMl);
        const target = state.waterTarget;

        set({
          waterIntake: newIntake,
          waterDate: today,
        });

        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        try {
          await fetch("/api/neon/water", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              date: today,
              intakeMl: newIntake,
              targetMl: target,
            }),
          });
        } catch {}
      },

      resetWater: async () => {
        const today = new Date().toISOString().split("T")[0];
        set({ waterIntake: 0, waterDate: today });

        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        try {
          await fetch("/api/neon/water", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              date: today,
              intakeMl: 0,
              targetMl: get().waterTarget,
            }),
          });
        } catch {}
      },

      startFasting: (protocol = "16-8") => {
        set({
          isFasting: true,
          fastingProtocol: protocol,
          fastingStartTime: new Date().toISOString(),
        });
      },

      stopFasting: () => {
        set({
          isFasting: false,
          fastingStartTime: null,
        });
      },

      syncFromNeon: async () => {
        const user = useAuthStore.getState().user;
        if (!user?.email) return;

        try {
          const [progRes, waterRes] = await Promise.all([
            fetch(`/api/neon/progress?email=${encodeURIComponent(user.email)}`),
            fetch(
              `/api/neon/water?email=${encodeURIComponent(user.email)}&date=${new Date().toISOString().split("T")[0]}`
            ),
          ]);

          if (progRes.ok) {
            const data = await progRes.json();
            if (data.logs && data.logs.length > 0) {
              set({
                logs: data.logs,
                currentWeight: data.logs[0].weight,
                targetWeight: data.logs[0].target_weight ?? 65,
              });
            }
          }

          if (waterRes.ok) {
            const water = await waterRes.json();
            if (water && typeof water.intake_ml === "number") {
              set({
                waterIntake: water.intake_ml,
                waterTarget: water.target_ml ?? 2000,
              });
            }
          }
        } catch {}
      },
    }),
    {
      name: "nutridex-progress-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
