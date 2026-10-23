import type { CalculationResult } from "@/types";

interface ServingDisplayProps {
  result: CalculationResult;
}

export function ServingDisplay({ result }: ServingDisplayProps) {
  const { portionLabel, grams, isApproximate, equivalents } = result;

  return (
    <div className="rounded-xl border border-nutridex-border bg-nutridex-surface p-6 text-center">
      <p className="text-sm text-nutridex-text-secondary">Resultado para</p>
      <p className="mt-1 text-lg font-semibold text-nutridex-text-primary">
        {equivalents} equivalente{equivalents !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex flex-col items-center gap-1">
        <span className="text-2xl font-bold text-nutridex-primary">{portionLabel}</span>
        {grams !== null && grams !== undefined && (
          <span className="text-lg font-medium text-nutridex-text-primary">
            {isApproximate && "≈ "}
            {grams} g
          </span>
        )}
      </div>
    </div>
  );
}
