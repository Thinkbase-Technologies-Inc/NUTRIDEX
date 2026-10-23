"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftRight, Search, ChevronDown } from "lucide-react";
import { getFood, getFoods, getGroup, getFoodsByGroup } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import { EquivalentStepper } from "@/components/ui/EquivalentStepper";

function FoodPicker({ selectedId, onSelect, excludeId }: { selectedId: string | null; onSelect: (id: string) => void; excludeId?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const foods = getFoods().filter((f) => f.id !== excludeId);
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 10) : [];
  const selected = selectedId ? getFood(selectedId) : undefined;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between rounded-xl border border-nutridex-border bg-nutridex-surface px-4 py-3 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
      >
        <span className={selected ? "text-sm font-medium text-nutridex-text-primary" : "text-sm text-nutridex-text-secondary"}>
          {selected ? selected.name : "Seleccionar alimento"}
        </span>
        <ChevronDown className="h-4 w-4 text-nutridex-text-secondary" aria-hidden />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-nutridex-border bg-nutridex-surface shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                autoFocus
                className="w-full rounded-lg border border-nutridex-border bg-nutridex-surface py-2 pl-8 pr-2 text-sm focus:outline-2 focus:outline-nutridex-primary"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y">
            {matches.length === 0 ? (
              <p className="px-3 py-2 text-sm text-nutridex-text-secondary">Sin resultados.</p>
            ) : (
              matches.map((f) => {
                const g = getGroup(f.groupId);
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="option"
                    aria-selected={selectedId === f.id}
                    onClick={() => { onSelect(f.id); setOpen(false); setQuery(""); }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    <div>
                      <span className="block text-sm font-medium text-nutridex-text-primary">{f.name}</span>
                      {g && <span className="block text-xs text-nutridex-text-secondary">{g.name}</span>}
                    </div>
                    <span className="text-xs text-nutridex-text-secondary">{f.portionLabel}</span>
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

  const [foodAId, setFoodAId] = useState<string | null>(initialA);
  const [foodBId, setFoodBId] = useState<string | null>(null);
  const [equivalents, setEquivalents] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const foodA = foodAId ? getFood(foodAId) : undefined;
  const foodB = foodBId ? getFood(foodBId) : undefined;

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

  // B foods limited to same group as A
  const groupBOptions = foodA ? getFoodsByGroup(foodA.groupId).filter((f) => f.id !== foodA.id) : [];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <header>
        <h1 className="text-2xl font-bold text-nutridex-text-primary">Comparador de alimentos</h1>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Compara porciones de alimentos del mismo grupo al mismo número de equivalentes.
        </p>
      </header>

      {/* Selector de equivalentes */}
      <section className="mt-6">
        <EquivalentStepper value={equivalents} onChange={setEquivalents} />
      </section>

      {/* Tarjetas de comparación */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Alimento A */}
        <div className="rounded-2xl border border-nutridex-border bg-nutridex-surface p-6">
          <h2 className="text-sm font-semibold text-nutridex-text-secondary mb-3">Alimento A</h2>
          <FoodPicker selectedId={foodAId} onSelect={handleSelectA} />
          {foodA && resultA && (
            <div className="mt-4">
              <p className="text-xs text-nutridex-text-secondary">{getGroup(foodA.groupId)?.name}</p>
              <p className="mt-2 text-lg font-semibold text-nutridex-text-primary">{foodA.name}</p>
              <div className="mt-3 rounded-lg bg-nutridex-surface-muted p-4 text-center">
                <p className="text-sm text-nutridex-text-secondary">{equivalents} equivalente{equivalents !== 1 ? "s" : ""}</p>
                <p className="mt-1 text-xl font-bold text-nutridex-primary">{resultA.quantityLabel}</p>
                {resultA.grams !== null && (
                  <p className="mt-1 text-sm text-nutridex-text-primary">
                    {resultA.isApproximate && "≈ "}{formatGrams(resultA.grams)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Alimento B */}
        <div className="rounded-2xl border border-nutridex-border bg-nutridex-surface p-6">
          <h2 className="text-sm font-semibold text-nutridex-text-secondary mb-3">Alimento B</h2>
          {foodA ? (
            <>
              <FoodPicker selectedId={foodBId} onSelect={handleSelectB} excludeId={foodAId ?? undefined} />
              {error && (
                <p role="alert" className="mt-2 text-xs text-nutridex-danger">{error}</p>
              )}
              {foodB && resultB && (
                <div className="mt-4">
                  <p className="text-xs text-nutridex-text-secondary">{getGroup(foodB.groupId)?.name}</p>
                  <p className="mt-2 text-lg font-semibold text-nutridex-text-primary">{foodB.name}</p>
                  <div className="mt-3 rounded-lg bg-nutridex-surface-muted p-4 text-center">
                    <p className="text-sm text-nutridex-text-secondary">{equivalents} equivalente{equivalents !== 1 ? "s" : ""}</p>
                    <p className="mt-1 text-xl font-bold text-nutridex-primary">{resultB.quantityLabel}</p>
                    {resultB.grams !== null && (
                      <p className="mt-1 text-sm text-nutridex-text-primary">
                        {resultB.isApproximate && "≈ "}{formatGrams(resultB.grams)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {groupBOptions.length > 0 && !foodB && (
                <div className="mt-3">
                  <p className="text-xs text-nutridex-text-secondary mb-2">Alternativas del mismo grupo:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {groupBOptions.slice(0, 8).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleSelectB(f.id)}
                        className="rounded-full border border-nutridex-border px-2.5 py-1 text-xs text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-nutridex-text-secondary">Selecciona primero el alimento A.</p>
          )}
        </div>
      </section>

      {/* Botón intercambiar */}
      {foodA && foodB && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-5 py-2.5 text-sm font-medium text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
            Intercambiar alimentos
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-nutridex-text-secondary">
        El intercambio conserva el número de equivalentes dentro del mismo grupo. No se afirma identidad exacta de calorías o macronutrientes.
      </p>
    </div>
  );
}

export default function ComparadorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-nutridex-text-secondary">Cargando comparador…</div>}>
      <ComparatorInner />
    </Suspense>
  );
}
