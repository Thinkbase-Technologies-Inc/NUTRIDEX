/**
 * src/hooks/useCalculation.ts
 */

import { useCallback } from "react";
import type { FoodItem, CalculationResult } from "@/types";
import { calculateEquivalents, validateEquivalents, formatEquivalentsLabel, formatGrams } from "@/domain/calculation";

export function useCalculation() {
  const calculate = useCallback((food: FoodItem, equivalents: unknown): CalculationResult | { error: string } => {
    try {
      const eq = validateEquivalents(equivalents);
      return calculateEquivalents(food, eq);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Valor inválido" };
    }
  }, []);

  const formatLabel = useCallback((n: number) => formatEquivalentsLabel(n), []);
  const formatGramsLabel = useCallback((g: number | null) => formatGrams(g), []);

  return { calculate, formatLabel, formatGramsLabel };
}
