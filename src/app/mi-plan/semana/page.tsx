"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { getFood } from "@/data/foods";
import { calculateEquivalents } from "@/domain/calculation";

function formatDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getWeekDates(startDate: Date): string[] {
  const dates: string[] = [];
  const d = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    dates.push(formatDateString(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export default function SemanaPage() {
  const { plans, loadPlans, duplicateDay, ensurePlan } = usePlannerStore();
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return formatDateString(d);
  });

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const weekDates = getWeekDates(new Date(weekStart + "T00:00:00"));

  const changeWeek = (delta: number) => {
    const d = new Date(weekStart + "T00:00:00");
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(formatDateString(d));
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <Link
          href="/mi-plan"
          className="inline-flex items-center gap-1 text-sm font-medium text-nutridex-text-secondary hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Volver al plan diario
        </Link>
        <h1 className="mt-4 text-[30px] font-bold tracking-tight text-nutridex-text-primary md:text-4xl">
          Vista semanal
        </h1>
        <p className="mt-2 text-sm text-nutridex-text-secondary">Revisa y duplica tus planes día por día.</p>
      </header>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-nutridex-border bg-nutridex-surface p-2.5">
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          aria-label="Semana anterior"
          className="rounded-lg p-2 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-sm font-semibold text-nutridex-text-primary">
          Semana del {weekDates[0]} al {weekDates[6]}
        </p>
        <button
          type="button"
          onClick={() => changeWeek(1)}
          aria-label="Semana siguiente"
          className="rounded-lg p-2 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weekDates.map((date) => {
          const plan = plans.find((p) => p.date === date);
          const totalFoods = plan ? plan.meals.reduce((sum, m) => sum + m.foods.length, 0) : 0;
          const d = new Date(date + "T00:00:00");
          const dayName = d.toLocaleDateString("es-MX", { weekday: "short" });
          const dayNum = d.getDate();

          return (
            <div key={date} className="rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 shadow-[0_18px_40px_-38px_rgba(24,62,26,0.4)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-nutridex-text-secondary capitalize">{dayName}</p>
                  <p className="text-lg font-bold text-nutridex-text-primary">{dayNum}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => void duplicateDay(date, formatDateString(new Date(new Date(date + "T00:00:00").getTime() + 86400000)))}
                    aria-label={`Duplicar ${date}`}
                    className="rounded p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <Link
                    href="/mi-plan"
                    onClick={() => usePlannerStore.getState().setActiveDate(date)}
                    aria-label={`Editar ${date}`}
                    className="rounded p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>

              {totalFoods > 0 ? (
                <ul className="mt-3 space-y-1">
                  {plan!.meals.filter((m) => m.foods.length > 0).map((meal) => (
                    <li key={meal.id}>
                      <p className="text-xs font-medium text-nutridex-text-primary">{meal.name}</p>
                      <ul className="ml-2 space-y-0.5">
                        {meal.foods.map((mf) => {
                          const food = getFood(mf.foodId);
                          if (!food) return null;
                          return (
                            <li key={mf.id} className="text-xs text-nutridex-text-secondary">
                              {food.name} · {mf.equivalents} equiv
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-nutridex-text-secondary">Sin registros</p>
              )}

              <p className="mt-2 text-xs text-nutridex-text-secondary">{totalFoods} alimento{totalFoods !== 1 ? "s" : ""}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
