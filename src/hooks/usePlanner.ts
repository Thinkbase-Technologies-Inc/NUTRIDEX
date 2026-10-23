/**
 * src/hooks/usePlanner.ts
 * Wrapper ligero sobre usePlannerStore para componentes.
 */

import { usePlannerStore } from "@/stores/usePlannerStore";
import type { MealPlan, Meal } from "@/types";

export function usePlanner() {
  return usePlannerStore();
}

export function usePlanForDate(date: string) {
  const plan = usePlannerStore((s) => s.getPlan(date));
  return plan;
}

export function useActiveDate() {
  return usePlannerStore((s) => s.activeDate);
}
