"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftRight, Search, ChevronDown, Check, Scale, Info, Sparkles } from "lucide-react";
import { getFood, getFoods, getGroup, getFoodsByGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=200&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=200&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=200&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=200&q=80",
};

interface FoodPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  excludeId?: string;
  filterGroupId?: string;
  placeholder?: string;
}

function FoodPicker({ selectedId, onSelect, excludeId, filterGroupId, placeholder = "Seleccionar alimento" }: FoodPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  let foods = getFoods().filter((f) => f.id !== excludeId);
  if (filterGroupId) {
    foods = foods.filter((f) => f.groupId === filterGroupId);
  }
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 8) : foods.slice(0, 10);
  const selected = selectedId ? getFood(selectedId) : undefined;
  const group = selected ? getGroup(selectedId ? selected.groupId : "") : undefined;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between rounded-2xl border border-nutridex-border bg-nutridex-surface p-2.5 text-left transition-all hover:border-nutridex-primary/50 focus-visible:outline-2 focus-visible:outline-nutridex-primary shadow-xs"
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {selected && FOOD_PHOTOS[selected.id] && (
            <div className="relative h-11 w-11 rounded-xl overflow-hidden shrink-0 border border-nutridex-border bg-slate-900">
              <img src={FOOD_PHOTOS[selected.id]} alt={selected.name} className="h-full w-full object-cover" />
            </div>
          )}
          {selected ? (
            <div className="min-w-0">
              <span className="block text-sm font-bold text-nutridex-text-primary truncate">{selected.name}</span>
              <span className="block text-xs text-nutridex-text-secondary truncate">
                {selected.portionLabel} {selected.grams ? `(≈ ${selected.grams} g)` : ""}
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-nutridex-text-secondary px-2">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-nutridex-text-secondary transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface shadow-lg">
          <div className="p-2 border-b border-nutridex-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                autoFocus
                className="w-full rounded-lg border border-nutridex-border bg-nutridex-surface-muted/60 py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-nutridex-primary"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-nutridex-border/50">
            {matches.length === 0 ? (
              <p className="px-3 py-3 text-xs text-nutridex-text-secondary">
                {filterGroupId ? "No hay más alimentos en este grupo." : "Sin resultados."}
              </p>
            ) : (
              matches.map((f) => {
                const g = getGroup(f.groupId);
                const isCurrent = selectedId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    onClick={() => {
                      onSelect(f.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-nutridex-surface-muted ${
                      isCurrent ? "bg-nutridex-primary-soft/60" : ""
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block text-xs sm:text-sm font-semibold text-nutridex-text-primary truncate">{f.name}</span>
                      {g && <span className="block text-xs text-nutridex-text-secondary truncate">{g.name}</span>}
                    </div>
                    <span className="shrink-0 text-xs font-medium text-nutridex-primary">{f.portionLabel}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparatorInner() {
  const searchParams = useSearchParams();
  const initialA = searchParams.get("a");

  const [foodAId, setFoodAId] = useState<string | null>(initialA ?? "manzana");
  const [foodBId, setFoodBId] = useState<string | null>(null);
  const [equivalents, setEquivalents] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const foodA = foodAId ? getFood(foodAId) : undefined;
  const foodB = foodBId ? getFood(foodBId) : undefined;
  const groupA = foodA ? getGroup(foodA.groupId) : undefined;

  // Options for Food B strictly in same group as Food A
  const groupBOptions = foodA ? getFoodsByGroup(foodA.groupId).filter((f) => f.id !== foodA.id) : [];

  const handleSelectA = useCallback((id: string) => {
    setFoodAId(id);
    setFoodBId(null);
    setError(null);
  }, []);

  const handleSelectB = useCallback((id: string) => {
    const a = foodAId ? getFood(foodAId) : undefined;
    const b = getFood(id);
    if (a && b && a.groupId !== b.groupId) {
      setError("Solo se pueden comparar alimentos del mismo grupo alimenticio.");
      return;
    }
    setFoodBId(id);
    setError(null);
  }, [foodAId]);

  const handleSwap = useCallback(() => {
    if (foodAId && foodBId) {
      setFoodAId(foodBId);
      setFoodBId(foodAId);
    }
  }, [foodAId, foodBId]);

  const resultA = foodA ? calculateEquivalents(foodA, equivalents) : null;
  const resultB = foodB ? calculateEquivalents(foodB, equivalents) : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Comparador de alimentos
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-nutridex-text-secondary">
          Descubre sustitutos exactos dentro del mismo grupo de alimentos conservando tu número de equivalentes.
        </p>
      </header>

      {/* Selector de equivalentes */}
      <section className="mt-6 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-wider text-nutridex-text-secondary block mb-2">
          Número de equivalentes a comparar
        </span>
        <EquivalentStepper value={equivalents} onChange={setEquivalents} />
      </section>

      {/* Grid de Comparación con botón swap */}
      <section className="mt-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
          {/* Alimento A */}
          <div className="nx-card p-5 sm:p-6 border-nutridex-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-md bg-nutridex-primary-soft px-2.5 py-0.5 text-xs font-bold text-nutridex-primary">
                Alimento A (Origen)
              </span>
              {groupA && (
                <span className="text-xs font-medium text-nutridex-text-secondary">
                  Grupo: <strong className="text-nutridex-text-primary">{groupA.name}</strong>
                </span>
              )}
            </div>

            <FoodPicker selectedId={foodAId} onSelect={handleSelectA} placeholder="Elige el primer alimento..." />

            {foodA && resultA && (
              <div className="mt-5 rounded-2xl border border-nutridex-border bg-nutridex-surface-muted/40 p-4 text-center">
                <span className="text-xs font-semibold text-nutridex-text-secondary uppercase tracking-wider">
                  Porción calculada ({equivalents} eq)
                </span>
                <p className="nx-num mt-2 text-2xl sm:text-3xl font-extrabold text-nutridex-text-primary">
                  {resultA.quantityLabel}
                </p>
                {resultA.grams !== null && (
                  <p className="mt-1 text-sm font-bold text-nutridex-primary">
                    {resultA.isApproximate && "≈ "}{formatGrams(resultA.grams)}
                  </p>
                )}
                <span className="mt-3 block text-xs text-nutridex-text-secondary">
                  Ref: 1 eq = {foodA.portionLabel} {foodA.grams ? `(≈ ${foodA.grams} g)` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Alimento B */}
          <div className="nx-card p-5 sm:p-6 border-nutridex-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-md bg-nutridex-surface-muted px-2.5 py-0.5 text-xs font-bold text-nutridex-text-secondary">
                Alimento B (Sustituto)
              </span>
              {foodA && (
                <span className="text-xs font-medium text-nutridex-primary">
                  Solo grupo {groupA?.name}
                </span>
              )}
            </div>

            <FoodPicker
              selectedId={foodBId}
              onSelect={handleSelectB}
              excludeId={foodAId ?? undefined}
              filterGroupId={foodA?.groupId}
              placeholder={foodA ? `Elige sustituto de ${groupA?.name}...` : "Selecciona primero el alimento A"}
            />

            {error && (
              <p role="alert" className="mt-2 text-xs font-medium text-rose-500">{error}</p>
            )}

            {foodB && resultB ? (
              <div className="mt-5 rounded-2xl border border-nutridex-border bg-nutridex-surface-muted/40 p-4 text-center">
                <span className="text-xs font-semibold text-nutridex-text-secondary uppercase tracking-wider">
                  Porción equivalente ({equivalents} eq)
                </span>
                <p className="nx-num mt-2 text-2xl sm:text-3xl font-extrabold text-nutridex-text-primary">
                  {resultB.quantityLabel}
                </p>
                {resultB.grams !== null && (
                  <p className="mt-1 text-sm font-bold text-nutridex-primary">
                    {resultB.isApproximate && "≈ "}{formatGrams(resultB.grams)}
                  </p>
                )}
                <span className="mt-3 block text-xs text-nutridex-text-secondary">
                  Ref: 1 eq = {foodB.portionLabel} {foodB.grams ? `(≈ ${foodB.grams} g)` : ""}
                </span>
              </div>
            ) : foodA && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-nutridex-text-secondary block mb-2">
                  {groupBOptions.length > 0 ? "Sustitutos directos recomendados:" : "No hay otros alimentos cargados en este grupo aún."}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {groupBOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectB(f.id)}
                      className="rounded-full border border-nutridex-border bg-nutridex-surface px-3 py-1 text-xs font-semibold text-nutridex-text-primary hover:border-nutridex-primary hover:bg-nutridex-primary-soft hover:text-nutridex-primary transition-all active:scale-95"
                    >
                      {f.name} ({f.portionLabel})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swap button placed nicely */}
        {foodA && foodB && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-2 text-xs sm:text-sm font-semibold text-nutridex-text-primary hover:bg-nutridex-surface-muted hover:border-nutridex-primary active:scale-95 transition-all shadow-xs"
            >
              <ArrowLeftRight className="h-4 w-4 text-nutridex-primary" aria-hidden />
              <span>Intercambiar posiciones</span>
            </button>
          </div>
        )}
      </section>

      {/* Comparison Summary Insight */}
      {foodA && foodB && resultA && resultB && (
        <section className="mt-8 rounded-2xl border border-nutridex-primary/30 bg-nutridex-primary-soft/40 p-5">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-nutridex-primary shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="text-sm font-bold text-nutridex-text-primary">
                Equivalencia confirmada
              </h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-nutridex-text-secondary">
                Para <strong>{equivalents} equivalente{equivalents !== 1 ? "s" : ""}</strong> de{" "}
                <strong className="text-nutridex-text-primary">{foodA.name}</strong> ({resultA.quantityLabel}
                {resultA.grams ? `, ≈ ${resultA.grams} g` : ""}), puedes sustituir con{" "}
                <strong className="text-nutridex-text-primary">{resultB.quantityLabel}</strong> de{" "}
                <strong className="text-nutridex-text-primary">{foodB.name}</strong>
                {resultB.grams ? ` (≈ ${resultB.grams} g)` : ""}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Information note */}
      <p className="mt-6 text-center text-xs text-nutridex-text-secondary leading-relaxed max-w-xl mx-auto">
        El Sistema de Equivalentes agrupa alimentos con aportes energéticos y nutrimentales similares para permitir intercambios prácticos sin alterar el plan alimenticio.
      </p>
    </div>
  );
}

export default function ComparadorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-nutridex-text-secondary">Cargando comparador…</div>}>
      <ComparatorInner />
    </Suspense>
  );
}
