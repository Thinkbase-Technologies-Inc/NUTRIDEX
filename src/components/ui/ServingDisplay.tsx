import type { CalculationResult } from "@/types";
import { formatGrams } from "@/domain/calculation";

interface ServingDisplayProps {
  result: CalculationResult;
}

export function ServingDisplay({ result }: ServingDisplayProps) {
  const { portionLabel, grams, isApproximate, equivalents } = result;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2e7d32] to-[#4caf50] p-6 text-center text-white shadow-[0_26px_48px_-30px_rgba(46,125,50,0.8)]">
      <p className="text-sm text-white/80">Resultado para</p>
      <p className="mt-1 text-lg font-semibold">
        {equivalents} equivalente{equivalents !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex flex-col items-center gap-1">
        <span className="nx-num text-3xl font-bold">{portionLabel}</span>
        {grams !== null && grams !== undefined && (
          <span className="text-lg font-medium text-white/90">
            {isApproximate && "≈ "}
            {formatGrams(grams)}
          </span>
        )}
      </div>
    </div>
  );
}
