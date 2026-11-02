"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Copy, ArrowRight } from "lucide-react";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { getFood } from "@/data/foods";
import { calculateEquivalents } from "@/domain/calculation";
import { useToast } from "@/components/ui/Toast";

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
  const { plans, loadPlans, duplicateDay, setActiveDate } = usePlannerStore();
  const { showToast } = useToast();
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

  const todayStr = formatDateString(new Date());

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <Link
          href="/mi-plan"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-nutridex-text-secondary hover:text-nutridex-primary transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary rounded py-1"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span>Volver al plan diario</span>
        </Link>
        <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Vista semanal
        </h1>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Revisa y gestiona la planeación de tus comidas para toda la semana.
        </p>
      </header>

      {/* Control de semana */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-nutridex-border bg-nutridex-surface p-2 shadow-xs">
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          aria-label="Semana anterior"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-nutridex-text-secondary hover:bg-nutridex-surface-muted active:scale-95 transition-all"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <p className="text-xs sm:text-sm font-bold text-nutridex-text-primary">
          Semana: {weekDates[0]} al {weekDates[6]}
        </p>
        <button
          type="button"
          onClick={() => changeWeek(1)}
          aria-label="Semana siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-nutridex-text-secondary hover:bg-nutridex-surface-muted active:scale-95 transition-all"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Grid de 7 días */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weekDates.map((date) => {
          const plan = plans.find((p) => p.date === date);
          const totalFoods = plan ? plan.meals.reduce((sum, m) => sum + m.foods.length, 0) : 0;
          const d = new Date(date + "T00:00:00");
          const dayName = d.toLocaleDateString("es-MX", { weekday: "long" });
          const dayNum = d.getDate();
          const isToday = date === todayStr;

          return (
            <div
              key={date}
              className={`rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                isToday
                  ? "border-nutridex-primary bg-nutridex-surface ring-1 ring-nutridex-primary/20"
                  : "border-nutridex-border bg-nutridex-surface"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-nutridex-border/60">
                  <div>
                    <span className="text-xs font-semibold capitalize text-nutridex-text-secondary block">
                      {dayName}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-nutridex-text-primary">{dayNum}</span>
                      {isToday && (
                        <span className="rounded-full bg-nutridex-primary-soft px-2 py-0.5 text-xs font-bold text-nutridex-primary">
                          Hoy
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const nextD = new Date(d.getTime() + 86400000);
                        const nextDateStr = formatDateString(nextD);
                        void duplicateDay(date, nextDateStr);
                        showToast({
                          type: "success",
                          title: "Día duplicado",
                          description: `Copiado a ${nextDateStr}`,
                          duration: 2500,
                        });
                      }}
                      title="Duplicar al día siguiente"
                      aria-label={`Duplicar plan del ${date}`}
                      className="rounded-lg p-1.5 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <Link
                      href="/mi-plan"
                      onClick={() => setActiveDate(date)}
                      title="Editar día"
                      aria-label={`Editar día ${date}`}
                      className="rounded-lg p-1.5 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-primary"
                    >
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>

                {/* Resumen de comidas */}
                {totalFoods > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {plan!.meals
                      .filter((m) => m.foods.length > 0)
                      .map((meal) => (
                        <li key={meal.id} className="text-xs">
                          <span className="font-semibold text-nutridex-text-primary block">{meal.name}</span>
                          <span className="text-nutridex-text-secondary">
                            {meal.foods.length} alim. (
                            {meal.foods.reduce((acc, f) => acc + f.equivalents, 0)} eq)
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-xs text-nutridex-text-secondary italic">Sin comidas registradas</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-nutridex-border/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-nutridex-text-secondary">
                  {totalFoods} alimento{totalFoods !== 1 ? "s" : ""}
                </span>
                <Link
                  href="/mi-plan"
                  onClick={() => setActiveDate(date)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-nutridex-primary hover:underline"
                >
                  <span>Gestionar</span>
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
