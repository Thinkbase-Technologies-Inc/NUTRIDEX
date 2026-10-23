import Link from "next/link";
import { ArrowRight, Calculator, Heart } from "lucide-react";
import type { FoodItem } from "@/types";
import { getGroup } from "@/data/foods";
import { formatGrams } from "@/domain/calculation";

interface FoodCardProps {
  food: FoodItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function FoodCard({ food, isFavorite, onToggleFavorite }: FoodCardProps) {
  const group = getGroup(food.groupId);
  const gramsLabel = formatGrams(food.grams);

  return (
    <div className="group flex flex-col rounded-xl border border-nutridex-border bg-nutridex-surface p-4 transition-all duration-150 hover:shadow-sm focus-within:ring-2 focus-within:ring-nutridex-primary">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link
            href={`/alimentos/${food.slug}`}
            className="block text-[15px] font-semibold leading-snug text-nutridex-text-primary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
          >
            {food.name}
          </Link>
          {group && (
            <span
              className="mt-1 inline-block text-xs font-medium rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${group.colorToken}18`, color: group.colorToken }}
            >
              {group.name}
            </span>
          )}
        </div>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(food.id)}
            aria-label={isFavorite ? `Quitar ${food.name} de favoritos` : `Agregar ${food.name} a favoritos`}
            aria-pressed={isFavorite}
            className="shrink-0 rounded-full p-1.5 text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted hover:text-nutridex-danger focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-nutridex-danger text-nutridex-danger" : ""}`} aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-sm font-medium text-nutridex-text-primary">{food.portionLabel}</span>
        {gramsLabel && (
          <span className="text-xs text-nutridex-text-secondary">
            {food.isApproximate && "≈ "}
            {gramsLabel}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/calculadora?food=${food.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-nutridex-primary-soft px-3 py-1.5 text-xs font-medium text-nutridex-primary transition-colors hover:bg-nutridex-primary hover:text-white focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Calculator className="h-3.5 w-3.5" aria-hidden />
          Calcular
        </Link>
        <Link
          href={`/alimentos/${food.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-nutridex-text-secondary transition-colors hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
        >
          Ver detalle
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
