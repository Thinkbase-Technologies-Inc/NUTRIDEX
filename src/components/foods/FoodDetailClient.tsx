"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowLeftRight,
  CalendarDays,
  ChevronLeft,
  Info,
  Scale,
  Check,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Repeat,
} from "lucide-react";
import { getFood, getGroup, getFoodsByGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useToast } from "@/components/ui/Toast";

interface FoodDetailClientProps {
  foodId: string;
}

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_FOOD_PHOTO = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80";

export function FoodDetailClient({ foodId }: FoodDetailClientProps) {
  const food = getFood(foodId);
  const group = food ? getGroup(food.groupId) : undefined;
  const { favorites, toggleFavorite } = useFoodsStore();
  const { ensurePlan, addFood } = usePlannerStore();
  const [equivalents, setEquivalents] = useState(1);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const { showToast } = useToast();

  if (!food) return null;

  const isFavorite = favorites.includes(food.id);
  const result = calculateEquivalents(food, equivalents);
  const siblings = getFoodsByGroup(food.groupId).filter((f) => f.id !== food.id).slice(0, 6);
  const photo = FOOD_PHOTOS[food.id] ?? DEFAULT_FOOD_PHOTO;

  const handleAddToPlan = () => {
    const today = new Date().toISOString().slice(0, 10);
    ensurePlan(today);
    addFood(today, "Comida", food.id, equivalents);
    showToast({
      type: "success",
      title: "Agregado a tu plan",
      description: `${food.name} (${equivalents} equiv.) en Comida`,
      duration: 2500,
    });
    setAddedToPlan(true);
    setTimeout(() => setAddedToPlan(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8 md:py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/alimentos"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-nutridex-text-secondary hover:text-nutridex-primary transition-colors rounded py-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Volver al catálogo</span>
      </Link>

      {/* Hero Banner with Food Photography (matching Image 1 & 2) */}
      <div className="nx-card overflow-hidden rounded-3xl relative shadow-md">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img src={photo} alt={food.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top badges */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            {group && (
              <Link
                href={`/categorias/${group.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs"
                style={{ backgroundColor: `${group.colorToken}DD` }}
              >
                <span>{group.name}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                toggleFavorite(food.id);
                showToast({
                  type: "success",
                  title: isFavorite ? "Eliminado de favoritos" : "Guardado en favoritos",
                  description: food.name,
                  duration: 2000,
                });
              }}
              aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                isFavorite ? "bg-rose-500 text-white shadow-sm" : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Bottom Title & Portion metric */}
          <div className="absolute bottom-5 inset-x-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                Alimento Equivalente
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {food.name}
              </h1>
            </div>

            <div className="rounded-2xl bg-white/20 backdrop-blur-md px-4 py-2 border border-white/20 text-right self-start sm:self-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">
                1 Equivalente
              </span>
              <span className="text-lg font-extrabold text-white block leading-tight">
                {food.portionLabel}
              </span>
              {food.grams && (
                <span className="text-xs font-semibold text-emerald-300">
                  {food.isApproximate && "≈ "}{formatGrams(food.grams)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <section className="nx-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-nutridex-text-primary">
              Calcular porciones exactas
            </h2>
            <p className="text-xs text-nutridex-text-secondary">
              Ajusta la cantidad de equivalentes para ver los gramos y porciones caseras
            </p>
          </div>
          <span className="rounded-full bg-nutridex-mint/60 px-3 py-1 text-xs font-bold text-nutridex-mint-text border border-nutridex-mint">
            1 eq = {food.portionLabel}
          </span>
        </div>

        <EquivalentStepper value={equivalents} onChange={setEquivalents} />

        {/* Scaled Result Card */}
        <div className="rounded-2xl bg-nutridex-surface-muted border border-nutridex-border p-5 text-center">
          <span className="text-xs font-bold text-nutridex-text-secondary uppercase tracking-wider block">
            Resultado para {equivalents} {equivalents === 1 ? "equivalente" : "equivalentes"}
          </span>
          <p className="nx-num mt-1 text-3xl font-extrabold text-nutridex-text-primary">
            {result.quantityLabel}
          </p>
          {result.grams !== null && (
            <p className="mt-1 text-base font-bold text-nutridex-primary">
              {result.isApproximate && "≈ "}{formatGrams(result.grams)}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddToPlan}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-nutridex-primary py-2.5 px-5 text-xs sm:text-sm font-bold text-white hover:bg-nutridex-primary-hover active:scale-95 transition-all shadow-xs"
          >
            {addedToPlan ? (
              <>
                <Check className="h-4 w-4" />
                <span>¡Agregado al plan!</span>
              </>
            ) : (
              <>
                <CalendarDays className="h-4 w-4" />
                <span>Agregar a mi plan ({equivalents} eq)</span>
              </>
            )}
          </button>

          <Link
            href={`/comparador?a=${food.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface py-2.5 px-5 text-xs sm:text-sm font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors shadow-xs"
          >
            <Repeat className="h-4 w-4 text-nutridex-text-secondary" />
            <span>Comparar alternativas</span>
          </Link>
        </div>
      </section>

      {/* Siblings / Substitutes in same group */}
      {siblings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
              Sustitutos directos en {group?.name}
            </h2>
            <Link
              href={`/categorias/${group?.slug}`}
              className="text-xs font-semibold text-nutridex-primary hover:underline"
            >
              Ver grupo completo
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {siblings.map((sib) => (
              <Link
                key={sib.id}
                href={`/alimentos/${sib.slug}`}
                className="nx-card p-3.5 flex items-center justify-between gap-3 hover:border-nutridex-primary/40 hover:-translate-y-0.5 transition-all shadow-xs"
              >
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-nutridex-text-primary truncate">{sib.name}</span>
                  <span className="text-xs text-nutridex-text-secondary">{sib.portionLabel}</span>
                </div>
                <span className="shrink-0 rounded-full bg-nutridex-mint/60 px-2.5 py-0.5 text-xs font-bold text-nutridex-mint-text border border-nutridex-mint">
                  1 eq
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Clinical Transparency Note */}
      <footer className="rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 text-xs text-nutridex-text-secondary leading-relaxed space-y-1">
        <p>
          Fuente: <strong>Tabla de alimentos equivalentes</strong> (pág. {food.sourcePage}). Registro textual:{" "}
          <code className="rounded bg-nutridex-surface-muted px-1.5 py-0.5 font-mono text-nutridex-text-primary border border-nutridex-border">
            {food.sourceText}
          </code>
        </p>
        {food.validationStatus === "needs_review" && (
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            Registro de demostración pendiente de confirmación contra el documento fuente completo.
          </p>
        )}
      </footer>
    </div>
  );
}
