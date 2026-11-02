"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Clock,
  Flame,
  Search,
  Plus,
  Check,
  Calendar,
  Sparkles,
  BookOpen,
  X,
  ChefHat,
} from "lucide-react";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import type { RecipeRow } from "@/lib/db";

const CATEGORIES = ["Todas", "Desayuno", "Comida", "Cena", "Snack"];

export default function RecetasPage() {
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [activeRecipe, setActiveRecipe] = useState<RecipeRow | null>(null);

  const { activeDate, addMeal, ensurePlan, savePlan } = usePlannerStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/neon/recetas")
      .then((res) => res.json())
      .then((data) => {
        if (data.recetas) setRecipes(data.recetas);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchCat =
        selectedCategory === "Todas" ||
        r.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !search.trim() ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [recipes, selectedCategory, search]);

  const handleAddToPlan = async (recipe: RecipeRow) => {
    ensurePlan(activeDate);
    // Add custom recipe meal to planner
    addMeal(activeDate, `${recipe.title} (${recipe.calories_kcal} kcal)`);
    await savePlan(activeDate);

    // Sync to NeonDB
    if (user?.email) {
      try {
        const plan = usePlannerStore.getState().getPlan(activeDate);
        if (plan) {
          await fetch("/api/neon/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, plan }),
          });
        }
      } catch {}
    }

    showToast({
      type: "success",
      title: "Receta añadida a tu plan",
      description: `"${recipe.title}" se agregó a tu día ${activeDate} y se sincronizó con tu plan.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10 space-y-7 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-primary text-white shadow-xs">
            <ChefHat className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-nutridex-primary">
            Alimentación Inteligente
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-nutridex-text-primary">
          Recetario Nutritivo
        </h1>
        <p className="text-xs sm:text-sm text-nutridex-text-secondary max-w-2xl">
          Platillos saludables y balanceados con porciones equivalentes oficiales, listos para incorporar a tu plan semanal en la nube.
        </p>
      </div>

      {/* Controls: Search + Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recetas por nombre, ingrediente..."
            className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-nutridex-text-primary placeholder:text-nutridex-text-secondary focus:border-nutridex-primary focus:outline-none focus:ring-1 focus:ring-nutridex-primary shadow-xs"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-2xs whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-nutridex-primary text-white shadow-xs"
                  : "bg-nutridex-surface border border-nutridex-border text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-nutridex-primary border-t-transparent" />
          <p className="text-xs font-bold text-nutridex-text-secondary">
            Cargando recetas saludables...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="nx-card p-12 text-center space-y-3">
          <ChefHat className="mx-auto h-12 w-12 text-nutridex-text-secondary/40" />
          <h3 className="text-base font-bold text-nutridex-text-primary">No se encontraron recetas</h3>
          <p className="text-xs text-nutridex-text-secondary max-w-sm mx-auto">
            Prueba ajustando tu búsqueda o seleccionando otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="nx-card overflow-hidden flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-nutridex-text-primary shadow-xs">
                    {recipe.category}
                  </span>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1 drop-shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-white/90" />
                      {recipe.prep_time_mins} min
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-nutridex-primary px-2 py-0.5 shadow-xs">
                      <Flame className="h-3 w-3" />
                      {recipe.calories_kcal} kcal
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-nutridex-text-primary line-clamp-1 group-hover:text-nutridex-primary transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-nutridex-text-secondary line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                  <p className="text-xs font-semibold text-nutridex-cyan line-clamp-1">
                    Equiv: {recipe.portion_info}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 border-t border-nutridex-border/40 flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveRecipe(recipe)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-nutridex-surface-muted py-2.5 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-border transition-colors active:scale-95"
                >
                  <BookOpen className="h-3.5 w-3.5 text-nutridex-text-secondary" />
                  <span>Ver preparación</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToPlan(recipe)}
                  title="Añadir a mi plan del día"
                  className="flex items-center justify-center gap-1 rounded-xl bg-nutridex-primary px-3.5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-xs active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar al plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {activeRecipe && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate__animated animate__fadeIn animate__faster"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border border-nutridex-border bg-nutridex-surface p-6 shadow-2xl animate__animated animate__zoomIn animate__faster">
            <button
              type="button"
              onClick={() => setActiveRecipe(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative -mx-6 -mt-6 mb-5 h-56 overflow-hidden bg-slate-900 rounded-t-3xl">
              <img
                src={activeRecipe.image_url}
                alt={activeRecipe.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="inline-block rounded-full bg-nutridex-primary px-2.5 py-0.5 text-xs font-bold shadow-xs">
                  {activeRecipe.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black drop-shadow-sm">
                  {activeRecipe.title}
                </h2>
                <div className="flex items-center gap-3 text-xs font-semibold text-white/90">
                  <span>⏱ {activeRecipe.prep_time_mins} min</span>
                  <span>🔥 {activeRecipe.calories_kcal} kcal</span>
                  <span>🍽 {activeRecipe.servings} porción</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-nutridex-text-secondary leading-relaxed mb-5">
              {activeRecipe.description}
            </p>

            {/* Ingredients */}
            <div className="space-y-2 mb-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-nutridex-text-primary">
                Ingredientes & Equivalentes
              </h4>
              <ul className="space-y-1.5 text-xs text-nutridex-text-primary">
                {activeRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl bg-nutridex-surface-muted/60 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-nutridex-primary mt-1.5 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-nutridex-text-primary">
                Modo de preparación
              </h4>
              <ol className="space-y-2 text-xs text-nutridex-text-primary">
                {activeRecipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 rounded-xl bg-nutridex-surface-muted/40 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nutridex-primary text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-nutridex-border/60">
              <button
                type="button"
                onClick={() => setActiveRecipe(null)}
                className="rounded-2xl border border-nutridex-border px-4 py-2.5 text-xs font-bold text-nutridex-text-secondary hover:bg-nutridex-surface-muted transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToPlan(activeRecipe);
                  setActiveRecipe(null);
                }}
                className="flex items-center gap-2 rounded-2xl bg-nutridex-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar a mi plan de hoy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
