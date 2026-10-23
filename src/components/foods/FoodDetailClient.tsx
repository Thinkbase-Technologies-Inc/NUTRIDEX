"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeftRight, CalendarDays, ChevronLeft, Info } from "lucide-react";
import { getFood, getGroup, getFoodsByGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";

interface FoodDetailClientProps {
  foodId: string;
}

export function FoodDetailClient({ foodId }: FoodDetailClientProps) {
  const food = getFood(foodId);
  const group = food ? getGroup(food.groupId) : undefined;
  const { favorites, toggleFavorite } = useFoodsStore();
  const { ensurePlan, addFood } = usePlannerStore();
  const [equivalents, setEquivalents] = useState(1);
  const [addedToPlan, setAddedToPlan] = useState(false);

  if (!food) return null;

  const isFavorite = favorites.includes(food.id);
  const result = calculateEquivalents(food, equivalents);
  const siblings = getFoodsByGroup(food.groupId).filter((f) => f.id !== food.id).slice(0, 6);

  const handleAddToPlan = () => {
    const today = new Date().toISOString().slice(0, 10);
    ensurePlan(today);
    addFood(today, "Comida", food.id, equivalents);
    setAddedToPlan(true);
    setTimeout(() => setAddedToPlan(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <Link
        href="/alimentos"
        className="inline-flex items-center gap-1 text-sm font-medium text-nutridex-text-secondary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Volver a alimentos
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold text-nutridex-text-primary">{food.name}</h1>
        {group && (
          <Link
            href={`/categorias/${group.slug}`}
            className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: `${group.colorToken}18`, color: group.colorToken }}
          >
            {group.name}
          </Link>
        )}
      </header>

      {/* Porción de referencia - dato más importante */}
      <section className="nx-card relative mt-8 overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-nutridex-primary-soft blur-2xl" aria-hidden />
        <p className="text-sm text-nutridex-text-secondary">Porción de referencia · 1 equivalente</p>
        <p className="nx-num mt-2 text-4xl font-bold tracking-tight text-nutridex-primary md:text-5xl">
          {food.portionLabel}
        </p>
        {food.grams !== null && (
          <p className="mt-2 text-xl font-medium text-nutridex-text-primary">
            {food.isApproximate && "≈ "}
            {formatGrams(food.grams)}
          </p>
        )}
      </section>

      {/* Calculadora de equivalentes */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Calcular equivalentes</h2>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Un equivalente corresponde a la porción indicada en la tabla.
        </p>
        <div className="mt-4">
          <EquivalentStepper value={equivalents} onChange={setEquivalents} />
        </div>

        <div
          className="mt-6 rounded-2xl bg-gradient-to-br from-[#2e7d32] to-[#4caf50] p-6 text-center text-white shadow-[0_28px_50px_-30px_rgba(46,125,50,0.8)]"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-white/80">
            {equivalents} equivalente{equivalents !== 1 ? "s" : ""}
          </p>
          <p className="nx-num mt-1 text-3xl font-bold">{result.quantityLabel}</p>
          {result.grams !== null && (
            <p className="mt-1 text-lg font-medium text-white/90">
              {result.isApproximate && "≈ "}
              {formatGrams(result.grams)}
            </p>
          )}
        </div>
      </section>

      {/* Acciones */}
      <section className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(food.id)}
          aria-pressed={isFavorite}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 ${
            isFavorite
              ? "bg-nutridex-danger/10 text-nutridex-danger"
              : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-primary hover:bg-nutridex-surface-muted"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-nutridex-danger" : ""}`} aria-hidden />
          {isFavorite ? "En favoritos" : "Guardar favorito"}
        </button>
        <Link
          href={`/comparador?a=${food.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-medium text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden />
          Comparar
        </Link>
        <button
          type="button"
          onClick={handleAddToPlan}
          className="inline-flex items-center gap-2 rounded-xl bg-nutridex-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          {addedToPlan ? "¡Agregado!" : "Agregar a mi plan"}
        </button>
      </section>

      {/* Alternativas del mismo grupo */}
      {siblings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-nutridex-text-primary">Alternativas del mismo grupo</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {siblings.map((sib) => (
              <Link
                key={sib.id}
                href={`/alimentos/${sib.slug}`}
                className="flex items-center justify-between rounded-lg border border-nutridex-border bg-nutridex-surface px-4 py-3 transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
              >
                <span className="text-sm font-medium text-nutridex-text-primary">{sib.name}</span>
                <span className="text-xs text-nutridex-text-secondary">{sib.portionLabel}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fuente */}
      <footer className="mt-10 rounded-xl border border-nutridex-border bg-nutridex-surface-muted p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-nutridex-text-secondary" aria-hidden />
          <div>
            <p className="text-xs text-nutridex-text-secondary">
              Fuente: Tabla de alimentos equivalentes (página {food.sourcePage}).
            </p>
            {food.validationStatus === "needs_review" && (
              <p className="mt-1 text-xs text-nutridex-warning">
                Registro pendiente de verificación contra el documento fuente.
              </p>
            )}
            {food.notes && (
              <p className="mt-1 text-xs text-nutridex-text-secondary">{food.notes}</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
