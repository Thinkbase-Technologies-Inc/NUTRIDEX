/**
 * src/stores/usePlannerStore.ts
 *
 * Planificador alimenticio en memoria, sincronizado con IndexedDB y Neon Lakebase Postgres.
 */

import { create } from "zustand";
import type { MealPlan, Meal, MealFood } from "@/types";
import { savePlan as savePlanIdb, getAllPlans, getPlan as getPlanIdb, deletePlan as deletePlanIdb } from "@/repositories/indexeddb";
import { useAuthStore } from "./useAuthStore";

const DEFAULT_MEALS = ["Desayuno", "Colación de media mañana", "Comida", "Colación de la tarde", "Cena"];

export function newMealId(): string {
  return `meal_${crypto.randomUUID()}`;
}

export function newFoodId(): string {
  return `food_${crypto.randomUUID()}`;
}

interface PlannerState {
  plans: MealPlan[];
  activeDate: string;
  loading: boolean;
  setActiveDate: (date: string) => void;
  loadPlans: () => Promise<void>;
  getPlan: (date: string) => MealPlan | undefined;
  ensurePlan: (date: string) => MealPlan;
  addFood: (date: string, mealName: string, foodId: string, equivalents: number) => void;
  updateFood: (date: string, mealId: string, foodId: string, equivalents: number) => void;
  removeFood: (date: string, mealId: string, foodId: string) => void;
  addMeal: (date: string, name: string) => void;
  removeMeal: (date: string, mealId: string) => void;
  renameMeal: (date: string, mealId: string, name: string) => void;
  duplicateDay: (fromDate: string, toDate: string) => Promise<void>;
  savePlan: (date: string) => Promise<void>;
  deletePlan: (date: string) => Promise<void>;
  syncWithNeon: () => Promise<void>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  plans: [],
  activeDate: new Date().toISOString().slice(0, 10),
  loading: false,
  setActiveDate: (date) => set({ activeDate: date }),

  loadPlans: async () => {
    set({ loading: true });
    try {
      const plans = await getAllPlans();
      set({ plans, loading: false });
      // Background sync from NeonDB
      get().syncWithNeon();
    } catch {
      set({ loading: false });
    }
  },

  syncWithNeon: async () => {
    const email = useAuthStore.getState().user?.email;
    if (!email) return;

    try {
      const res = await fetch(`/api/neon/plans?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.plans) && data.plans.length > 0) {
        const neonPlans: MealPlan[] = data.plans;
        const current = get().plans;
        const map = new Map<string, MealPlan>();

        // Local first
        for (const p of current) map.set(p.date, p);
        // Overwrite or add from Neon if newer or missing
        for (const p of neonPlans) {
          if (!map.has(p.date)) {
            map.set(p.date, p);
            void savePlanIdb(p);
          }
        }
        set({ plans: Array.from(map.values()) });
      }
    } catch {}
  },

  getPlan: (date) => get().plans.find((p) => p.date === date),

  ensurePlan: (date) => {
    const { plans } = get();
    let plan = plans.find((p) => p.date === date);
    if (!plan) {
      const meals: Meal[] = DEFAULT_MEALS.map((name) => ({
        id: newMealId(),
        name,
        foods: [],
      }));
      plan = { id: `plan_${date}`, date, meals, updatedAt: new Date().toISOString() };
      set({ plans: [...plans, plan] });
    }
    return plan;
  },

  addFood: (date, mealName, foodId, equivalents) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      let meal = p.meals.find((m) => m.name === mealName);
      if (!meal) {
        meal = { id: newMealId(), name: mealName, foods: [] };
        return { ...p, meals: [...p.meals, meal], updatedAt: new Date().toISOString() };
      }
      const exists = meal.foods.find((f) => f.foodId === foodId);
      const foods = exists
        ? meal.foods.map((f) => (f.foodId === foodId ? { ...f, equivalents } : f))
        : [...meal.foods, { id: newFoodId(), foodId, equivalents }];
      return {
        ...p,
        meals: p.meals.map((m) => (m.id === meal.id ? { ...m, foods } : m)),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  updateFood: (date, mealId, foodId, equivalents) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      return {
        ...p,
        meals: p.meals.map((m) =>
          m.id === mealId
            ? { ...m, foods: m.foods.map((f) => (f.foodId === foodId ? { ...f, equivalents } : f)) }
            : m
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  removeFood: (date, mealId, foodId) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      return {
        ...p,
        meals: p.meals.map((m) =>
          m.id === mealId ? { ...m, foods: m.foods.filter((f) => f.foodId !== foodId) } : m
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  addMeal: (date, name) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      return {
        ...p,
        meals: [...p.meals, { id: newMealId(), name, foods: [] }],
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  removeMeal: (date, mealId) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      return {
        ...p,
        meals: p.meals.filter((m) => m.id !== mealId),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  renameMeal: (date, mealId, name) => {
    const { plans } = get();
    const next = plans.map((p) => {
      if (p.date !== date) return p;
      return {
        ...p,
        meals: p.meals.map((m) => (m.id === mealId ? { ...m, name } : m)),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ plans: next });
    const target = next.find((p) => p.date === date);
    if (target) {
      void savePlanIdb(target);
      get().savePlan(date);
    }
  },

  duplicateDay: async (fromDate, toDate) => {
    const plan = get().getPlan(fromDate);
    if (!plan) return;
    const cloned: MealPlan = {
      id: `plan_${toDate}`,
      date: toDate,
      meals: plan.meals.map((m) => ({
        id: newMealId(),
        name: m.name,
        foods: m.foods.map((f) => ({ id: newFoodId(), foodId: f.foodId, equivalents: f.equivalents })),
      })),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ plans: [...state.plans, cloned] }));
    await savePlanIdb(cloned);
    await get().savePlan(toDate);
  },

  savePlan: async (date) => {
    const plan = get().getPlan(date);
    if (!plan) return;
    await savePlanIdb(plan);

    // Sync to NeonDB
    const email = useAuthStore.getState().user?.email;
    if (email) {
      fetch("/api/neon/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      }).catch(() => {});
    }
  },

  deletePlan: async (date) => {
    const plan = get().getPlan(date);
    if (!plan) return;
    await deletePlanIdb(plan.id);
    set((state) => ({ plans: state.plans.filter((p) => p.date !== date) }));

    // Delete in NeonDB
    const email = useAuthStore.getState().user?.email;
    if (email) {
      fetch(`/api/neon/plans?email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  },
}));
