"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ArrowLeftRight,
  CalendarDays,
  Search,
  Check,
  Sparkles,
  RotateCcw,
  Scale,
} from "lucide-react";
import { getFood, getFoods, getGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useToast } from "@/components/ui/Toast";

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=200&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=200&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=200&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=200&q=80",
};

const QUICK_FOODS = ["manzana", "tortilla-de-maiz", "pechuga-de-pollo", "avena-en-hojuela-cruda", "aguacate"];

function CalculatorInner() {
  const searchParams = useSearchParams();
  const initialFoodId = searchParams.get("food");
  const { favorites, toggleFavorite } = useFoodsStore();
  const { ensurePlan, addFood } = usePlannerStore();

  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(initialFoodId);
  const [equivalents, setEquivalents] = useState(1);
  const [query, setQuery] = useState("");
  const [showPicker, setShowPicker] = useState(!initialFoodId);
  const [addedToPlan, setAddedToPlan] = useState(false);

  const food = selectedFoodId ? getFood(selectedFoodId) : undefined;
  const group = food ? getGroup(food.groupId) : undefined;
  const result = food ? calculateEquivalents(food, equivalents) : null;
  const isFavorite = food ? favorites.includes(food.id) : false;

  const foods = getFoods();
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 8) : [];
  const { showToast } = useToast();

  const handleAddToPlan = () => {
    if (!food) return;
    const today = new Date().toISOString().slice(0, 10);
    ensurePlan(today);
    addFood(today, "Comida", food.id, equivalents);
    showToast({
      type: "success",
      title: "Agregado a tu plan de hoy",
      description: `${food.name} (${equivalents} equiv.) en Comida`,
      duration: 3000,
    });
    setAddedToPlan(true);
    setTimeout(() => setAddedToPlan(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Calculadora de porciones
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-nutridex-text-secondary">
          Multiplica o fracciona equivalentes para saber exactamente cuánta cantidad o gramos servir.
        </p>
      </header>

      {/* Selector de alimento */}
      <section className="mt-6">
        {showPicker || !food ? (
          <div className="nx-card p-4 sm:p-5">
            <label htmlFor="calc-food-search" className="block text-xs font-semibold uppercase tracking-wider text-nutridex-text-secondary mb-2">
              Selecciona o busca un alimento
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
              <input
                id="calc-food-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe manzana, tortilla, pollo, avena..."
                autoFocus
                className="w-full rounded-xl border border-nutridex-border bg-nutridex-surface py-2.5 pl-10 pr-4 text-sm text-nutridex-text-primary placeholder:text-nutridex-text-secondary focus:border-nutridex-primary focus:outline-none focus:ring-2 focus:ring-nutridex-primary/20"
              />
            </div>

            {/* Quick chips when no active query */}
            {!query.trim() && (
              <div className="mt-3.5">
                <span className="text-xs font-medium text-nutridex-text-secondary block mb-1.5">
                  Sugerencias rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_FOODS.map((id) => {
                    const item = foods.find((f) => f.id === id);
                    if (!item) return null;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedFoodId(item.id);
                          setShowPicker(false);
                        }}
                        className="rounded-full border border-nutridex-border bg-nutridex-surface px-3 py-1 text-xs font-medium text-nutridex-text-secondary hover:border-nutridex-primary/50 hover:bg-nutridex-primary-soft hover:text-nutridex-primary active:scale-95 transition-all"
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching search results */}
            {query.trim() && (
              <div className="mt-3 divide-y divide-nutridex-border/60 rounded-xl border border-nutridex-border bg-nutridex-surface overflow-hidden">
                {matches.length === 0 ? (
                  <p className="px-3.5 py-3 text-sm text-nutridex-text-secondary">
                    No se encontraron alimentos para &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  matches.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedFoodId(f.id);
                        setShowPicker(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                    >
                      <span className="text-sm font-semibold text-nutridex-text-primary">{f.name}</span>
                      <span className="text-xs font-medium text-nutridex-text-secondary">{f.portionLabel}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="nx-card p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {FOOD_PHOTOS[food.id] && (
                <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-nutridex-border bg-slate-900 shadow-xs">
                  <img src={FOOD_PHOTOS[food.id]} alt={food.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary truncate">{food.name}</h2>
                  {group && (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: `${group.colorToken}15`, color: group.colorToken }}
                    >
                      {group.name}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-nutridex-text-secondary">
                  Referencia: <span className="font-semibold text-nutridex-text-primary">1 eq = {food.portionLabel}</span>
                  {food.grams && ` (≈ ${food.grams} g)`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="shrink-0 rounded-lg border border-nutridex-border px-3 py-1.5 text-xs font-semibold text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-nutridex-primary"
            >
              Cambiar alimento
            </button>
          </div>
        )}
      </section>

      {food && result && (
        <div className="mt-6 space-y-6">
          {/* Stepper Control */}
          <section className="nx-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-nutridex-text-primary">
                Ajustar número de equivalentes
              </h3>
              {equivalents !== 1 && (
                <button
                  type="button"
                  onClick={() => setEquivalents(1)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-nutridex-primary hover:underline"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden />
                  Restablecer a 1
                </button>
              )}
            </div>
            <EquivalentStepper value={equivalents} onChange={setEquivalents} />
          </section>

          {/* Elevated Result Card (Clean, Single Elevation, High-Contrast) */}
          <section
            className="rounded-2xl border-2 border-nutridex-primary/30 bg-nutridex-surface p-6 sm:p-8 text-center shadow-md relative overflow-hidden"
            role="status"
            aria-live="polite"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-primary-soft px-3 py-1 text-xs font-bold text-nutridex-primary">
              <Scale className="h-3.5 w-3.5" aria-hidden />
              <span>Resultado para {equivalents} {equivalents === 1 ? "equivalente" : "equivalentes"}</span>
            </div>

            <div className="mt-4">
              <span className="nx-num text-3xl sm:text-5xl font-extrabold tracking-tight text-nutridex-text-primary block">
                {result.quantityLabel}
              </span>
              {result.grams !== null && (
                <p className="mt-2 text-lg sm:text-xl font-bold text-nutridex-primary">
                  {result.isApproximate && "≈ "}
                  {formatGrams(result.grams)}
                </p>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-nutridex-text-secondary max-w-md mx-auto">
              Equivale proporcionalmente a {equivalents} porción{equivalents !== 1 ? "es" : ""} del grupo{" "}
              <strong className="text-nutridex-text-primary font-semibold">{group?.name}</strong>.
            </p>
          </section>

          {/* Actions */}
          <section className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddToPlan}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-nutridex-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-nutridex-primary-hover active:scale-95 shadow-xs focus-visible:outline-2 focus-visible:outline-nutridex-primary"
            >
              {addedToPlan ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  <span>¡Agregado al plan!</span>
                </>
              ) : (
                <>
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  <span>Agregar a mi plan de hoy</span>
                </>
              )}
            </button>

            <Link
              href={`/comparador?a=${food.id}`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-semibold text-nutridex-text-primary transition-all hover:bg-nutridex-surface-muted active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary"
            >
              <ArrowLeftRight className="h-4 w-4 text-nutridex-text-secondary" aria-hidden />
              <span>Comparar sustitutos</span>
            </Link>

            <button
              type="button"
              onClick={() => toggleFavorite(food.id)}
              aria-pressed={isFavorite}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                isFavorite
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                  : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} aria-hidden />
              <span className="hidden sm:inline">{isFavorite ? "Guardado" : "Favorito"}</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default function CalculadoraPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-nutridex-text-secondary">Cargando calculadora…</div>}>
      <CalculatorInner />
    </Suspense>
  );
}
