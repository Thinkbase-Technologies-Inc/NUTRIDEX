"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Trash2, Copy, ChevronLeft, ChevronRight, Search, Printer } from "lucide-react";
import { usePlannerStore, newMealId, newFoodId } from "@/stores/usePlannerStore";
import { getFood, getGroup, getFoods } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import type { MealPlan, Meal, MealFood } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

const MEAL_NAMES = ["Desayuno", "Colación de media mañana", "Comida", "Colación de la tarde", "Cena"];

function formatDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}

function AddFoodDialog({ onAdd, onClose }: { onAdd: (foodId: string, eq: number) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const foods = getFoods();
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 10) : [];
  const { showToast } = useToast();

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="Agregar alimento">
      <div className="w-full max-w-md rounded-t-3xl md:rounded-3xl bg-nutridex-surface p-6">
        <h3 className="text-lg font-semibold text-nutridex-text-primary">Agregar alimento</h3>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar alimento..."
          autoFocus
          className="mt-3 w-full rounded-full border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm focus:outline-2 focus:outline-nutridex-primary"
        />
        <div className="mt-3 max-h-64 overflow-y-auto divide-y rounded-2xl border border-nutridex-border">
          {matches.length === 0 ? (
            <p className="px-3 py-2 text-sm text-nutridex-text-secondary">Sin resultados.</p>
          ) : (
            matches.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    const fItem = getFood(f.id);
                    onAdd(f.id, 1);
                    onClose();
                    showToast({
                      type: "success",
                      title: "Agregado al plan",
                      description: fItem?.name ?? f.name,
                      duration: 3000,
                    });
                  }}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                >
                <span className="text-sm font-medium text-nutridex-text-primary">{f.name}</span>
                <span className="text-xs text-nutridex-text-secondary">{f.portionLabel}</span>
              </button>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full border border-nutridex-border px-4 py-2.5 text-sm font-medium text-nutridex-text-primary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function MealCard({ meal, date, onDuplicate }: { meal: Meal; date: string; onDuplicate: () => void }) {
  const { updateFood, removeFood, removeMeal } = usePlannerStore();
  const [showAdd, setShowAdd] = useState(false);
  const { addFood } = usePlannerStore();

  return (
    <div className="rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 shadow-[0_18px_40px_-36px_rgba(24,62,26,0.4)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-nutridex-text-primary">{meal.name}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            aria-label={`Duplicar ${meal.name}`}
            className="rounded p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => removeMeal(date, meal.id)}
            aria-label={`Eliminar ${meal.name}`}
            className="rounded p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-danger focus-visible:outline-2 focus-visible:outline-nutridex-primary"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>

      {meal.foods.length === 0 ? (
        <p className="mt-2 text-xs text-nutridex-text-secondary">Sin alimentos registrados.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {meal.foods.map((mf) => {
            const food = getFood(mf.foodId);
            if (!food) return null;
            const result = calculateEquivalents(food, mf.equivalents);
            return (
              <li key={mf.id} className="flex items-center justify-between gap-2 rounded-xl bg-nutridex-surface-muted px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-nutridex-text-primary truncate">{food.name}</p>
                  <p className="text-xs text-nutridex-text-secondary">
                    {mf.equivalents} equiv · {result.quantityLabel}
                    {result.grams !== null && ` · ${result.isApproximate ? "≈ " : ""}${formatGrams(result.grams)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateFood(date, meal.id, mf.foodId, Math.max(0.5, mf.equivalents - 0.5))}
                    aria-label="Reducir equivalentes"
                    className="rounded px-1.5 py-0.5 text-xs font-medium text-nutridex-text-secondary hover:bg-nutridex-surface focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFood(date, meal.id, mf.foodId, mf.equivalents + 0.5)}
                    aria-label="Aumentar equivalentes"
                    className="rounded px-1.5 py-0.5 text-xs font-medium text-nutridex-text-secondary hover:bg-nutridex-surface focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFood(date, meal.id, mf.foodId)}
                    aria-label={`Eliminar ${food.name}`}
                    className="rounded p-1 text-nutridex-text-secondary hover:text-nutridex-danger focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setShowAdd(true)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
      >
        <Plus className="h-3 w-3" aria-hidden />
        Agregar alimento
      </button>

      {showAdd && (
        <AddFoodDialog
          onAdd={(foodId, eq) => addFood(date, meal.name, foodId, eq)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

function EquivalentSummary({ plan }: { plan: MealPlan }) {
  const totals: Record<string, number> = {};
  for (const meal of plan.meals) {
    for (const mf of meal.foods) {
      const food = getFood(mf.foodId);
      if (food) {
        totals[food.groupId] = (totals[food.groupId] || 0) + mf.equivalents;
      }
    }
  }
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-nutridex-border bg-nutridex-surface p-5">
      <h3 className="text-sm font-semibold text-nutridex-text-primary">Resumen de equivalentes</h3>
      <ul className="mt-3 space-y-1.5">
        {entries.map(([groupId, total]) => {
          const group = getGroup(groupId);
          return (
            <li key={groupId} className="flex items-center justify-between text-sm">
              <span className="text-nutridex-text-secondary">{group?.name ?? groupId}</span>
              <span className="font-semibold text-nutridex-text-primary">{total}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MiPlanPage() {
  const { plans, activeDate, setActiveDate, ensurePlan, addMeal, duplicateDay, loadPlans, loading } = usePlannerStore();
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const plan = plans.find((p) => p.date === activeDate);

  const handleDateChange = (delta: number) => {
    const d = new Date(activeDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setActiveDate(formatDateString(d));
  };

  const handleDuplicateDay = useCallback(() => {
    const d = new Date(activeDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const tomorrow = formatDateString(d);
    void duplicateDay(activeDate, tomorrow);
  }, [activeDate, duplicateDay]);

  const handlePrint = useCallback(() => {
    setShowPrint(true);
    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (!plan) ensurePlan(activeDate);
  }, [plan, activeDate, ensurePlan]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-10 md:py-12">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-nutridex-primary">Tu día, organizado</p>
          <h1 className="mt-2 text-[30px] font-bold tracking-tight text-nutridex-text-primary md:text-4xl">
            Mi plan alimenticio
          </h1>
          <p className="mt-2 text-sm text-nutridex-text-secondary">Organiza tus comidas del día</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface px-3.5 py-2 text-sm text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <Printer className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </header>

      {/* Navegación de fecha */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-nutridex-border bg-nutridex-surface p-2.5 shadow-[0_18px_40px_-36px_rgba(24,62,26,0.4)]">
        <button
          type="button"
          onClick={() => handleDateChange(-1)}
          aria-label="Día anterior"
          className="rounded-lg p-2 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-nutridex-text-primary capitalize">{formatDateLabel(activeDate)}</p>
          <p className="text-xs text-nutridex-text-secondary">{activeDate}</p>
        </div>
        <button
          type="button"
          onClick={() => handleDateChange(1)}
          aria-label="Día siguiente"
          className="rounded-lg p-2 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleDuplicateDay}
          className="inline-flex items-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface px-3.5 py-2 text-sm text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <Copy className="h-4 w-4" aria-hidden />
          Duplicar día
        </button>
        <Link
          href="/mi-plan/semana"
          className="inline-flex items-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface px-3.5 py-2 text-sm text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          Vista semanal
        </Link>
      </div>

      {/* Comidas */}
      {plan ? (
        <>
          <div className="mt-6 space-y-3">
            {plan.meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                date={activeDate}
                onDuplicate={() => {
                  const foodsCopy = meal.foods.map((f) => ({ ...f, id: newFoodId() }));
                  addMeal(activeDate, `${meal.name} (copia)`);
                  // Find the newly created meal and add foods
                  const updated = usePlannerStore.getState().plans.find((p) => p.date === activeDate);
                  const newMeal = updated?.meals.find((m) => m.name === `${meal.name} (copia)`);
                  if (newMeal) {
                    for (const mf of foodsCopy) {
                      usePlannerStore.getState().addFood(activeDate, newMeal.name, mf.foodId, mf.equivalents);
                    }
                  }
                }}
              />
            ))}
          </div>
          <EquivalentSummary plan={plan} />
        </>
      ) : loading ? (
        <div className="mt-8 text-center text-sm text-nutridex-text-secondary">Cargando plan…</div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="Sin plan para este día"
          description="Agrega alimentos a las comidas para comenzar tu plan del día."
        />
      )}
    </div>
  );
}
