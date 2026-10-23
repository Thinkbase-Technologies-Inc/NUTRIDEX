import Link from "next/link";
import { ArrowUpRight, Calculator, Heart } from "lucide-react";
import type { FoodItem } from "@/types";
import { getGroup } from "@/data/foods";
import { formatGrams } from "@/domain/calculation";
import { useToast } from "@/components/ui/Toast";

interface FoodCardProps {
  food: FoodItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function FoodCard({ food, isFavorite, onToggleFavorite }: FoodCardProps) {
  const group = getGroup(food.groupId);
  const gramsLabel = formatGrams(food.grams);
  const { showToast } = useToast();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_46px_-30px_rgba(24,62,26,0.5)] focus-within:ring-2 focus-within:ring-nutridex-primary">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
          style={{ backgroundColor: `${group?.colorToken ?? "#2e7d32"}1f`, color: group?.colorToken ?? "#2e7d32" }}
          aria-hidden
        >
          {food.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/alimentos/${food.slug}`}
            className="block rounded text-[15px] font-semibold leading-snug text-nutridex-text-primary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            {food.name}
          </Link>
          {group && (
            <span className="mt-1 inline-block truncate text-xs text-nutridex-text-secondary">{group.name}</span>
          )}
        </div>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => {
              onToggleFavorite?.(food.id);
              showToast({
                type: "success",
                title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
                description: isFavorite ? undefined : food.name,
                duration: 2500,
              });
            }}
            aria-label={isFavorite ? `Quitar ${food.name} de favoritos` : `Agregar ${food.name} a favoritos`}
            aria-pressed={isFavorite}
            className="shrink-0 rounded-full p-1.5 text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted hover:text-nutridex-danger focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-nutridex-danger text-nutridex-danger" : ""}`} aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="nx-num text-lg font-bold leading-none text-nutridex-text-primary">{food.portionLabel}</p>
          {gramsLabel && (
            <p className="mt-1 text-xs text-nutridex-text-secondary">
              {food.isApproximate && "≈ "}
              {gramsLabel}
            </p>
          )}
        </div>
        <span className="rounded-full bg-nutridex-surface-muted px-2.5 py-1 text-[11px] font-medium text-nutridex-text-secondary">
          1 equiv.
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/calculadora?food=${food.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-primary-soft px-3 py-1.5 text-xs font-semibold text-nutridex-primary transition-colors hover:bg-nutridex-primary hover:text-white focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Calculator className="h-3.5 w-3.5" aria-hidden />
          Calcular
        </Link>
        <Link
          href={`/alimentos/${food.slug}`}
          className="ml-auto inline-flex items-center gap-1 rounded text-xs font-medium text-nutridex-text-secondary transition-colors hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          Detalle
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
