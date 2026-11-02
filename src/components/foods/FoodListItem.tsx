"use client";

import Link from "next/link";
import { Heart, Calculator, Repeat, ArrowUpRight } from "lucide-react";
import type { FoodItem } from "@/types";
import { getGroup } from "@/data/foods";
import { formatGrams } from "@/domain/calculation";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { getGroupIcon } from "@/data/icons8";

interface FoodListItemProps {
  food: FoodItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=150&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=150&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=150&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=150&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=150&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=150&q=80",
};

const DEFAULT_FOOD_PHOTO = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80";

export function FoodListItem({ food, isFavorite, onToggleFavorite }: FoodListItemProps) {
  const group = getGroup(food.groupId);
  const gramsLabel = formatGrams(food.grams);
  const photo = FOOD_PHOTOS[food.id] ?? DEFAULT_FOOD_PHOTO;

  return (
    <div className="flex items-center gap-3 border-b border-nutridex-border/60 p-3.5 last:border-b-0 transition-colors hover:bg-nutridex-surface-muted/60">
      {/* Thumbnail */}
      <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-nutridex-border bg-slate-900">
        <img src={photo} alt={food.name} className="h-full w-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/alimentos/${food.slug}`}
          className="block text-sm font-bold text-nutridex-text-primary hover:text-nutridex-primary transition-colors truncate"
        >
          {food.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          {group && (
            <span className="flex items-center gap-1 text-xs text-nutridex-text-secondary truncate">
              <Icons8Img src={getGroupIcon(group.id)} alt={group.name} size={14} />
              <span>{group.name}</span>
            </span>
          )}
          <span className="text-xs text-nutridex-text-secondary">· 1 eq</span>
        </div>
      </div>

      {/* Portions */}
      <div className="text-right shrink-0 px-2">
        <span className="text-xs sm:text-sm font-extrabold text-nutridex-text-primary block">
          {food.portionLabel}
        </span>
        {gramsLabel && (
          <span className="text-xs font-semibold text-nutridex-text-secondary block">
            {food.isApproximate && "≈ "}{gramsLabel}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href={`/calculadora?food=${food.id}`}
          title="Calcular porción"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-nutridex-dock text-white hover:bg-black transition-colors"
        >
          <Calculator className="h-3.5 w-3.5 text-nutridex-accent" />
        </Link>
        <Link
          href={`/comparador?a=${food.id}`}
          title="Comparar sustituto"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-nutridex-border text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
        >
          <Repeat className="h-3.5 w-3.5" />
        </Link>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(food.id)}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-nutridex-border transition-colors ${
              isFavorite ? "bg-rose-50 text-rose-500 border-rose-200" : "text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-rose-500"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}
