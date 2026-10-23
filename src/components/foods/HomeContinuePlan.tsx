"use client";

import Link from "next/link";
import { CalendarDays, ArrowRight, Sparkles, Heart } from "lucide-react";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { getFood, getFoods } from "@/data/foods";
import { FoodCard } from "@/components/foods/FoodCard";
import { useEffect } from "react";

export function HomeContinuePlan() {
  const { plans, loadPlans } = usePlannerStore();
  const { favorites, toggleFavorite } = useFoodsStore();

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const today = new Date().toISOString().slice(0, 10);
  const plan = plans.find((p) => p.date === today);
  const totalFoods = plan ? plan.meals.reduce((sum, m) => sum + m.foods.length, 0) : 0;
  const favoriteFoods = getFoods().filter((f) => favorites.includes(f.id)).slice(0, 3);

  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-5">
      <section className="nx-card relative overflow-hidden p-5 lg:col-span-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-primary-soft px-2.5 py-1 text-[11px] font-semibold text-nutridex-primary">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Hoy
            </span>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-nutridex-text-primary">
              {totalFoods > 0 ? "Continúa tu plan" : "Empieza tu plan de hoy"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-nutridex-text-secondary">
              {totalFoods > 0
                ? `Tienes ${totalFoods} alimento${totalFoods !== 1 ? "s" : ""} registrado${totalFoods !== 1 ? "s" : ""} en ${plan?.meals.length} comidas.`
                : "Organiza desayuno, comidas y colaciones con equivalentes claros."}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nutridex-primary-soft text-nutridex-primary">
            <Sparkles className="h-6 w-6" aria-hidden />
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href="/mi-plan"
            className="inline-flex items-center gap-2 rounded-full bg-nutridex-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            {totalFoods > 0 ? "Abrir mi plan" : "Crear mi plan"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/mi-plan/semana"
            className="inline-flex items-center gap-2 rounded-full border border-nutridex-border px-4 py-2.5 text-sm font-medium text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Vista semanal
          </Link>
        </div>

        {plan && totalFoods > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {plan.meals
              .filter((m) => m.foods.length > 0)
              .slice(0, 3)
              .map((meal) => (
                <div key={meal.id} className="rounded-xl bg-nutridex-surface-muted px-3 py-2.5">
                  <p className="truncate text-[11px] font-medium text-nutridex-text-secondary">{meal.name}</p>
                  <p className="nx-num mt-0.5 text-sm font-semibold text-nutridex-text-primary">
                    {meal.foods.length} alim.
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="nx-card p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-nutridex-text-primary">
            <Heart className="h-4 w-4 text-nutridex-danger" aria-hidden />
            Favoritos
          </h2>
          <Link
            href="/favoritos"
            className="text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Ver todos
          </Link>
        </div>

        {favoriteFoods.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-nutridex-border px-4 py-6 text-center">
            <p className="text-sm font-medium text-nutridex-text-primary">Aún no tienes favoritos</p>
            <p className="mt-1 text-xs text-nutridex-text-secondary">
              Guarda alimentos para encontrarlos en segundos.
            </p>
            <Link
              href="/alimentos"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-nutridex-primary hover:underline"
            >
              Explorar alimentos <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {favoriteFoods.map((food) => (
              <li key={food.id} className="flex items-center justify-between gap-2 rounded-xl bg-nutridex-surface-muted px-3 py-2.5">
                <Link
                  href={`/alimentos/${food.slug}`}
                  className="min-w-0 flex-1 truncate text-sm font-medium text-nutridex-text-primary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                >
                  {food.name}
                </Link>
                <span className="shrink-0 text-xs text-nutridex-text-secondary">{food.portionLabel}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
