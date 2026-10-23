import Link from "next/link";
import { Heart } from "lucide-react";
import type { FoodItem } from "@/types";
import { getGroup } from "@/data/foods";
import { formatGrams } from "@/domain/calculation";

interface FoodListItemProps {
  food: FoodItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function FoodListItem({ food, isFavorite, onToggleFavorite }: FoodListItemProps) {
  const group = getGroup(food.groupId);
  const gramsLabel = formatGrams(food.grams);

  return (
    <div className="flex items-center gap-3 border-b border-nutridex-border px-4 py-3 last:border-b-0 transition-colors hover:bg-nutridex-surface-muted/60">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
        style={{ backgroundColor: `${group?.colorToken ?? "#2e7d32"}1f`, color: group?.colorToken ?? "#2e7d32" }}
        aria-hidden
      >
        {food.name.charAt(0)}
      </span>
      <div className="flex-1 min-w-0">
        <Link
          href={`/alimentos/${food.slug}`}
          className="block text-sm font-medium text-nutridex-text-primary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded truncate"
        >
          {food.name}
        </Link>
        {group && (
          <span className="text-xs text-nutridex-text-secondary">{group.name}</span>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-medium text-nutridex-text-primary">{food.portionLabel}</div>
        {gramsLabel && (
          <div className="text-xs text-nutridex-text-secondary">
            {food.isApproximate && "≈ "}
            {gramsLabel}
          </div>
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
  );
}
