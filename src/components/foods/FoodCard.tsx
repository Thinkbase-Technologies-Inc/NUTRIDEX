"use client";

import Link from "next/link";
import { ArrowUpRight, Calculator, Heart, Sprout, Wheat, Beef, Milk, Salad, Cookie, Flame } from "lucide-react";
import type { FoodItem } from "@/types";
import { getGroup } from "@/data/foods";
import { formatGrams } from "@/domain/calculation";
import { useToast } from "@/components/ui/Toast";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { getGroupIcon } from "@/data/icons8";

interface FoodCardProps {
  food: FoodItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=500&q=80",
};

const DEFAULT_FOOD_PHOTO = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80";

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  verduras: Salad,
  frutas: Sprout,
  "cereales-sin-grasa": Wheat,
  "cereales-con-grasa": Cookie,
  leguminosas: Sprout,
  "proteina-muy-baja-grasa": Beef,
  "proteina-baja-grasa": Beef,
  "proteina-moderada-grasa": Beef,
  "proteina-alta-grasa": Beef,
  "leche-descremada": Milk,
  "leche-semidescremada": Milk,
  "leche-entera": Milk,
  "leche-con-azucar": Milk,
  "grasas-sin-proteina": Flame,
  "grasas-con-proteina": Flame,
  "azucar-sin-grasa": Cookie,
  "azucar-con-grasa": Cookie,
};

export function FoodCard({ food, isFavorite, onToggleFavorite }: FoodCardProps) {
  const group = getGroup(food.groupId);
  const gramsLabel = formatGrams(food.grams);
  const { showToast } = useToast();
  const GroupIcon = (group ? GROUP_ICONS[group.id] : null) ?? Sprout;
  const photo = FOOD_PHOTOS[food.id] ?? DEFAULT_FOOD_PHOTO;

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-nutridex-border bg-nutridex-surface overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-nutridex-primary/30">
      <div>
        {/* Photo Banner with Heart button */}
        <div className="relative h-36 w-full overflow-hidden bg-slate-900">
          <img
            src={photo}
            alt={food.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Category Chip over photo with Icons8 fluency icon */}
          {group && (
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs"
                style={{ backgroundColor: `${group.colorToken}E6` }}
              >
                <Icons8Img src={getGroupIcon(group.id)} alt={group.name} size={15} />
                <span className="truncate max-w-[120px]">{group.name}</span>
              </span>
            </div>
          )}

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => {
                onToggleFavorite?.(food.id);
                showToast({
                  type: "success",
                  title: isFavorite ? "Eliminado de favoritos" : "Guardado en favoritos",
                  description: food.name,
                  duration: 2000,
                });
              }}
              aria-label={isFavorite ? `Quitar ${food.name} de favoritos` : `Agregar ${food.name} a favoritos`}
              aria-pressed={isFavorite}
              className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} aria-hidden />
            </button>
          )}

          {/* Portion overlay */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-baseline justify-between text-white">
            <span className="text-sm font-extrabold drop-shadow-sm">{food.portionLabel}</span>
            {gramsLabel && (
              <span className="text-xs font-semibold text-white/90 drop-shadow-sm">
                {food.isApproximate && "≈ "}{gramsLabel}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link
            href={`/alimentos/${food.slug}`}
            className="block text-base font-extrabold text-nutridex-text-primary group-hover:text-nutridex-primary transition-colors"
          >
            {food.name}
          </Link>
          <span className="text-xs text-nutridex-text-secondary mt-0.5 block">
            1 equivalente estándar
          </span>
        </div>
      </div>

      {/* Bottom Actions matching Image 1 & 2 */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2">
        <Link
          href={`/calculadora?food=${food.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-dock px-4 py-2 text-xs font-bold text-white transition-all hover:bg-black active:scale-95 shadow-xs"
        >
          <Calculator className="h-3.5 w-3.5 text-nutridex-accent" aria-hidden />
          <span>Calcular</span>
        </Link>

        <Link
          href={`/alimentos/${food.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-nutridex-border bg-nutridex-surface px-3 py-2 text-xs font-semibold text-nutridex-text-secondary hover:text-nutridex-primary hover:bg-nutridex-surface-muted transition-colors"
        >
          <span>Ficha</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
