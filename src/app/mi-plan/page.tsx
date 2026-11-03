"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Search,
  Printer,
  Sparkles,
  Heart,
  Repeat,
  X,
  Check,
  CheckCircle2,
  PieChart,
  ArrowRight,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Salad,
  Sprout,
  Wheat,
  Beef,
  Flame,
  Cookie,
} from "lucide-react";
import { usePlannerStore, newMealId, newFoodId } from "@/stores/usePlannerStore";
import { getFood, getGroup, getFoods } from "@/data/foods";
import { calculateEquivalents, formatGrams, searchMatch } from "@/domain/calculation";
import type { MealPlan, Meal, MealFood } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { getGroupIcon, getMealIcon } from "@/data/icons8";

const MEAL_PHOTOS: Record<string, string> = {
  Desayuno: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
  "Colación de media mañana": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80",
  Comida: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  "Colación de la tarde": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  Cena: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80";

function formatDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getWeekDays(activeDateStr: string): { dateStr: string; dayNum: number; dayName: string; isToday: boolean }[] {
  const d = new Date(activeDateStr + "T00:00:00");
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);

  const days = [];
  const todayStr = formatDateString(new Date());

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dateStr = formatDateString(cur);
    days.push({
      dateStr,
      dayNum: cur.getDate(),
      dayName: cur.toLocaleDateString("es-MX", { weekday: "short" }),
      isToday: dateStr === todayStr,
    });
  }
  return days;
}

function AddFoodModal({
  mealName,
  onAdd,
  onClose,
}: {
  mealName: string;
  onAdd: (foodId: string, eq: number) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [eq, setEq] = useState(1);
  const foods = getFoods();
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 8) : foods.slice(0, 8);
  const { showToast } = useToast();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs animate__animated animate__fadeIn animate__faster"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-nutridex-border bg-nutridex-surface p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col animate__animated animate__zoomIn animate__faster">
        <div className="flex items-center justify-between pb-3 border-b border-nutridex-border/60">
          <div>
            <h3 className="text-base font-extrabold text-nutridex-text-primary">
              Agregar alimento a {mealName}
            </h3>
            <span className="text-xs text-nutridex-text-secondary">Selecciona el alimento y la cantidad</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper for quantity */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-nutridex-surface-muted p-2.5">
          <span className="text-xs font-bold text-nutridex-text-secondary pl-2">Cantidad de equivalentes:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEq((v) => Math.max(0.5, v - 0.5))}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-surface text-nutridex-text-primary font-bold shadow-xs active:scale-95"
            >
              −
            </button>
            <span className="text-sm font-extrabold text-nutridex-text-primary px-2">{eq} eq</span>
            <button
              type="button"
              onClick={() => setEq((v) => v + 0.5)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-primary text-white font-bold shadow-xs active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre (manzana, avena, pollo)..."
            autoFocus
            className="w-full rounded-xl border border-nutridex-border bg-nutridex-surface py-2.5 pl-10 pr-4 text-xs sm:text-sm text-nutridex-text-primary focus:border-nutridex-primary focus:outline-none focus:ring-1 focus:ring-nutridex-primary"
          />
        </div>

        {/* Results */}
        <div className="mt-3 flex-1 overflow-y-auto divide-y divide-nutridex-border/60 rounded-xl border border-nutridex-border">
          {matches.map((food) => {
            const group = getGroup(food.groupId);
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => {
                  onAdd(food.id, eq);
                  onClose();
                  showToast({
                    type: "success",
                    title: "Alimento agregado",
                    description: `${food.name} (${eq} equiv.) en ${mealName}`,
                    duration: 2500,
                  });
                }}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-nutridex-surface-muted"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nutridex-surface-muted p-1 shrink-0">
                    <Icons8Img src={getGroupIcon(food.groupId)} alt={group?.name ?? ""} size={24} />
                  </span>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-nutridex-text-primary">{food.name}</span>
                    <span className="block text-xs text-nutridex-text-secondary">
                      {group?.name} · {food.portionLabel} {food.grams ? `(≈ ${food.grams} g)` : ""}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg bg-nutridex-primary-soft px-2.5 py-1 text-xs font-bold text-nutridex-primary">
                  <Plus className="h-3 w-3" />
                  Agregar
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MiPlanPage() {
  const { plans, activeDate, setActiveDate, ensurePlan, addFood, updateFood, removeFood, addMeal, duplicateDay, loadPlans, loading } = usePlannerStore();
  const [modalMealName, setModalMealName] = useState<string | null>(null);
  const [trackedMeals, setTrackedMeals] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const plan = plans.find((p) => p.date === activeDate);

  useEffect(() => {
    if (!plan) ensurePlan(activeDate);
  }, [plan, activeDate, ensurePlan]);

  const weekDays = useMemo(() => getWeekDays(activeDate), [activeDate]);

  const handleDuplicate = useCallback(() => {
    const d = new Date(activeDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const tomorrow = formatDateString(d);
    void duplicateDay(activeDate, tomorrow);
    showToast({
      type: "success",
      title: "Plan duplicado",
      description: `Comidas copiadas a ${tomorrow}`,
      duration: 3000,
    });
  }, [activeDate, duplicateDay, showToast]);

  const totalEquivalents = plan ? plan.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.equivalents, 0), 0) : 0;
  const targetEquivalents = 14;

  const activeDateFormatted = new Date(activeDate + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 space-y-7 animate__animated animate__fadeIn">
      {/* Top Header matching Gleb Kuznetsov layout from Image 2 */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest uppercase text-nutridex-text-secondary/80">
            PLAN YOUR WEEK · NUTRIDEX
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-nutridex-text-primary">
            Meal Planner
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-nutridex-text-secondary flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-nutridex-primary" />
            <span>Semana del {weekDays[0].dateStr} al {weekDays[6].dateStr}</span>
          </p>
        </div>

        {/* Progress Rings Widget (matching Image 2) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-nutridex-surface border border-nutridex-border shadow-xs">
          <div className="pr-2 border-r border-nutridex-border/60 hidden sm:block">
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary block">
              Progreso
            </span>
            <span className="text-xs font-extrabold text-nutridex-text-primary">Semanal</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Ring 1: Cal / Total */}
            <div className="flex items-center gap-2">
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-nutridex-border/60" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500" strokeDasharray="75, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold">75%</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Plan</span>
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Total</p>
              </div>
            </div>

            {/* Ring 2: Frutas */}
            <div className="flex items-center gap-2">
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-nutridex-border/60" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-rose-500" strokeDasharray="60, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold">60%</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Fruta</span>
                <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400">3 eq</p>
              </div>
            </div>

            {/* Ring 3: Cereales */}
            <div className="flex items-center gap-2">
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-nutridex-border/60" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-500" strokeDasharray="80, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold">80%</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Cereal</span>
                <p className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">4 eq</p>
              </div>
            </div>

            {/* Ring 4: Proteína */}
            <div className="flex items-center gap-2">
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-nutridex-border/60" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-500" strokeDasharray="50, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold">50%</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase">Proteína</span>
                <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">3 eq</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Date & Goals Card (Vibrant Cyan Block & Calendar Strip from Image 2) */}
      <section className="rounded-3xl border border-nutridex-border bg-nutridex-surface overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-nutridex-border">
          {/* Cyan/Emerald block for Current Active Date */}
          <div className="md:col-span-5 bg-gradient-to-r from-cyan-500 to-emerald-500 p-6 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-white/80">
                Semana Actual
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(activeDate + "T00:00:00");
                    d.setDate(d.getDate() - 1);
                    setActiveDate(formatDateString(d));
                  }}
                  aria-label="Día anterior"
                  className="rounded-full bg-white/20 p-1 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(activeDate + "T00:00:00");
                    d.setDate(d.getDate() + 1);
                    setActiveDate(formatDateString(d));
                  }}
                  aria-label="Día siguiente"
                  className="rounded-full bg-white/20 p-1 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-extrabold capitalize leading-tight">
                {activeDateFormatted}
              </h2>
              <p className="text-xs text-white/90 mt-1">
                {totalEquivalents} de {targetEquivalents} equivalentes consumidos
              </p>
            </div>
          </div>

          {/* Goals Metric Strip */}
          <div className="md:col-span-7 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-nutridex-text-secondary uppercase block">Meta</span>
              <span className="text-sm font-extrabold text-nutridex-text-primary">14 equiv / día</span>
            </div>
            <div>
              <span className="text-xs font-bold text-nutridex-text-secondary uppercase block">Registrados</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{totalEquivalents} equiv</span>
            </div>
            <div>
              <span className="text-xs font-bold text-nutridex-text-secondary uppercase block">Restantes</span>
              <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">{Math.max(0, targetEquivalents - totalEquivalents)} equiv</span>
            </div>
            <button
              type="button"
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface px-3.5 py-1.5 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors shadow-xs"
            >
              <Copy className="h-3.5 w-3.5 text-nutridex-primary" />
              <span>Duplicar día</span>
            </button>
          </div>
        </div>

        {/* Day Selector Strip */}
        <div className="flex items-center justify-between p-3 overflow-x-auto no-scrollbar bg-nutridex-surface-muted/40 relative">
          {weekDays.map((d) => {
            const active = d.dateStr === activeDate;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setActiveDate(d.dateStr)}
                className={`relative flex-1 min-w-[70px] py-2 px-1 text-center rounded-2xl transition-colors duration-150 z-10 ${
                  active
                    ? "text-white font-bold"
                    : "text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface/60"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeDayPill"
                    className="absolute inset-0 rounded-2xl bg-nutridex-primary shadow-xs -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                <span className="text-lg font-extrabold block leading-none">{d.dayNum}</span>
                <span className={`text-xs capitalize block mt-1 ${active ? "text-white" : "text-nutridex-text-secondary"}`}>
                  {d.dayName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Meal Cards Grid (Faithful reproduction of Desktop Image 2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-nutridex-text-primary">
            Comidas del día
          </h2>
          <span className="text-xs font-semibold text-nutridex-text-secondary">
            {plan?.meals.length ?? 0} tiempos de comida
          </span>
        </div>

        {plan ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {plan.meals.map((meal) => {
              const photo = MEAL_PHOTOS[meal.name] ?? DEFAULT_PHOTO;
              const isTracked = trackedMeals[meal.id];
              const mealEquivalents = meal.foods.reduce((sum, f) => sum + f.equivalents, 0);

              return (
                <div
                  key={meal.id}
                  className="nx-card overflow-hidden transition-all hover:shadow-lg hover:border-nutridex-primary/30 flex flex-col justify-between"
                >
                  <div>
                    {/* Hero Photo Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={photo}
                        alt={meal.name}
                        className="h-full w-full object-cover opacity-90 transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                      {/* Top Heart Icon */}
                      <div className="absolute top-3 left-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs">
                          <Heart className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Photo Overlays: Title & Macros/Equivalents */}
                      <div className="absolute bottom-3 inset-x-3 text-white space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 backdrop-blur-xs">
                              <Icons8Img src={getMealIcon(meal.name)} alt={meal.name} size={18} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                              {meal.name}
                            </span>
                          </div>
                          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-extrabold backdrop-blur-xs">
                            {mealEquivalents} equiv.
                          </span>
                        </div>

                        {/* Overlaid metric chips (like in Image 2) */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="rounded-md bg-white/25 px-2 py-0.5 text-xs font-bold backdrop-blur-xs">
                            {meal.foods.length} alimentos
                          </span>
                          {meal.foods.slice(0, 2).map((mf) => {
                            const f = getFood(mf.foodId);
                            return f ? (
                              <span key={mf.id} className="rounded-md bg-white/25 px-2 py-0.5 text-xs font-bold backdrop-blur-xs truncate max-w-[120px]">
                                {f.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Food Table (matching Image 2: Category | Sample Food | Amount | Exchange) */}
                    <div className="p-4">
                      {meal.foods.length === 0 ? (
                        <div className="py-6 text-center border border-dashed border-nutridex-border rounded-xl">
                          <p className="text-xs text-nutridex-text-secondary">Sin alimentos registrados aún.</p>
                          <button
                            type="button"
                            onClick={() => setModalMealName(meal.name)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-nutridex-primary hover:underline"
                          >
                            <Plus className="h-3 w-3" />
                            Agregar alimento
                          </button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-nutridex-border/60 text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary">
                                <th className="pb-2">Grupo</th>
                                <th className="pb-2">Alimento</th>
                                <th className="pb-2">Porción</th>
                                <th className="pb-2 text-right">Acción</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-nutridex-border/40 font-medium">
                              {meal.foods.map((mf) => {
                                const food = getFood(mf.foodId);
                                if (!food) return null;
                                const group = getGroup(food.groupId);
                                const result = calculateEquivalents(food, mf.equivalents);

                                return (
                                  <tr key={mf.id} className="hover:bg-nutridex-surface-muted/50 transition-colors">
                                    <td className="py-2.5 pr-2">
                                      <div className="flex items-center gap-1.5">
                                        <Icons8Img
                                          src={getGroupIcon(food.groupId)}
                                          alt={group?.name ?? ""}
                                          size={18}
                                        />
                                        <span className="text-xs text-nutridex-text-secondary truncate max-w-[70px] inline-block align-middle">
                                          {group?.name.split(" ")[0]}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 pr-2">
                                      <Link
                                        href={`/alimentos/${food.slug}`}
                                        className="font-bold text-nutridex-text-primary hover:text-nutridex-primary transition-colors block truncate max-w-[110px]"
                                      >
                                        {food.name}
                                      </Link>
                                      <span className="text-xs text-nutridex-text-secondary block">
                                        {mf.equivalents} eq
                                      </span>
                                    </td>
                                    <td className="py-2.5 pr-2">
                                      <span className="text-xs font-bold text-nutridex-text-primary block">
                                        {result.quantityLabel}
                                      </span>
                                      {result.grams && (
                                        <span className="text-xs text-nutridex-text-secondary block">
                                          ≈ {formatGrams(result.grams)}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2.5 text-right whitespace-nowrap">
                                      <div className="flex items-center justify-end gap-1">
                                        {/* Swap in comparator button */}
                                        <Link
                                          href={`/comparador?a=${food.id}`}
                                          title="Comparar sustituto"
                                          className="p-1 rounded text-nutridex-text-secondary hover:text-nutridex-primary hover:bg-nutridex-surface-muted"
                                        >
                                          <Repeat className="h-3.5 w-3.5" />
                                        </Link>
                                        {/* Delete food button */}
                                        <button
                                          type="button"
                                          onClick={() => removeFood(activeDate, meal.id, mf.foodId)}
                                          title="Eliminar de la comida"
                                          className="p-1 rounded text-nutridex-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions (Add Food on left, Track pill button on right) */}
                  <div className="p-4 pt-2 border-t border-nutridex-border/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setModalMealName(meal.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-nutridex-text-secondary hover:text-nutridex-primary py-1 px-2 rounded-lg transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Agregar alimento</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTrackedMeals((prev) => ({ ...prev, [meal.id]: !prev[meal.id] }));
                        showToast({
                          type: "success",
                          title: isTracked ? "Marcado como pendiente" : "¡Comida registrada!",
                          description: meal.name,
                          duration: 2000,
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                        isTracked
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-xs"
                      }`}
                    >
                      {isTracked ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Registrada</span>
                        </>
                      ) : (
                        <span>Registrar</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* Add Food Modal */}
      {modalMealName && (
        <AddFoodModal
          mealName={modalMealName}
          onAdd={(foodId, eq) => addFood(activeDate, modalMealName, foodId, eq)}
          onClose={() => setModalMealName(null)}
        />
      )}
    </div>
  );
}
