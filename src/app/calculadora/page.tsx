"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowLeftRight, CalendarDays, ChevronLeft, Search } from "lucide-react";
import { getFood, getFoods, getGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useToast } from "@/components/ui/Toast";

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
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 10) : [];
  const { showToast } = useToast();

  const handleAddToPlan = () => {
    if (!food) return;
    const today = new Date().toISOString().slice(0, 10);
    ensurePlan(today);
    addFood(today, "Comida", food.id, equivalents);
    showToast({
      type: "success",
      title: "Agregado a tu plan",
      description: `${food.name} — ${equivalents} equivalente${equivalents !== 1 ? "s" : ""}`,
      duration: 3000,
    });
    setAddedToPlan(true);
    setTimeout(() => setAddedToPlan(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <p className="text-sm font-medium text-nutridex-primary">Porciones sin complicaciones</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-tight text-nutridex-text-primary md:text-4xl">
          Calculadora de equivalencias
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-nutridex-text-secondary">
          Un equivalente corresponde a la porción indicada en la tabla.
        </p>
      </header>

      {/* Selector de alimento */}
      <section className="mt-6">
        {showPicker || !food ? (
          <div className="nx-card p-4">
            <label htmlFor="food-search" className="block text-sm font-medium text-nutridex-text-primary mb-2">
              Buscar alimento
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
              <input
                id="food-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca manzana, tortilla, pollo, avena..."
                autoFocus
                className="w-full rounded-full border border-nutridex-border bg-nutridex-surface py-3 pl-11 pr-4 text-sm text-nutridex-text-primary focus:outline-none focus:ring-2 focus:ring-nutridex-primary/40"
              />
            </div>
            {query.trim() && (
              <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-nutridex-border divide-y">
                {matches.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-nutridex-text-secondary">Sin resultados.</p>
                ) : (
                  matches.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { setSelectedFoodId(f.id); setShowPicker(false); setQuery(""); }}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                    >
                      <span className="text-sm font-medium text-nutridex-text-primary">{f.name}</span>
                      <span className="text-xs text-nutridex-text-secondary">{f.portionLabel}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="nx-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-nutridex-text-primary">{food.name}</p>
                {group && (
                  <p className="text-xs text-nutridex-text-secondary">{group.name} · {food.portionLabel}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="text-sm font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
              >
                Cambiar
              </button>
            </div>
          </div>
        )}
      </section>

      {food && result && (
        <>
          {/* Control de cantidad */}
          <section className="mt-6">
            <EquivalentStepper value={equivalents} onChange={setEquivalents} />
          </section>

          {/* Resultado */}
          <section
            className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-[#2e7d32] to-[#4caf50] p-8 text-center text-white shadow-[0_30px_55px_-30px_rgba(46,125,50,0.85)]"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-white/80">
              {equivalents} equivalente{equivalents !== 1 ? "s" : ""}
            </p>
            <p className="nx-num mt-2 text-4xl font-bold">{result.quantityLabel}</p>
            {result.grams !== null && (
              <p className="mt-2 text-xl font-medium text-white/90">
                {result.isApproximate && "≈ "}
                {formatGrams(result.grams)}
              </p>
            )}
          </section>

          {/* Acciones */}
          <section className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToPlan}
              className="inline-flex items-center gap-2 rounded-full bg-nutridex-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              {addedToPlan ? "¡Agregado!" : "Agregar a mi plan"}
            </button>
            <Link
              href={`/comparador?a=${food.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-medium text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden />
              Comparar alternativas
            </Link>
            <button
              type="button"
              onClick={() => toggleFavorite(food.id)}
              aria-pressed={isFavorite}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 ${
                isFavorite
                  ? "bg-nutridex-danger/10 text-nutridex-danger"
                  : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-primary hover:bg-nutridex-surface-muted"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-nutridex-danger" : ""}`} aria-hidden />
              {isFavorite ? "En favoritos" : "Guardar favorito"}
            </button>
          </section>
        </>
      )}
    </div>
  );
}

export default function CalculadoraPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-nutridex-text-secondary">Cargando calculadora…</div>}>
      <CalculatorInner />
    </Suspense>
  );
}
