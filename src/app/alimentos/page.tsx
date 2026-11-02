"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Package, Sparkles } from "lucide-react";
import { getFoods, getGroups } from "@/data/foods";
import { searchMatch } from "@/domain/calculation";
import { FoodCard } from "@/components/foods/FoodCard";
import { FoodListItem } from "@/components/foods/FoodListItem";
import { FoodSearch } from "@/components/ui/FoodSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFoodsStore } from "@/stores/useFoodsStore";

function AlimentosContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { favorites, toggleFavorite } = useFoodsStore();

  const foods = getFoods();
  const groups = getGroups();

  const filtered = useMemo(() => {
    let result = foods;
    if (groupFilter) result = result.filter((f) => f.groupId === groupFilter);
    if (query.trim()) result = result.filter((f) => searchMatch(f, query));
    return result.sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [foods, groupFilter, query]);

  const hasFilters = !!groupFilter || !!query.trim();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Catálogo de alimentos
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-nutridex-text-secondary">
          Explora los alimentos equivalentes y consulta porciones de referencia, unidades caseras y gramajes.
        </p>
      </header>

      {/* Control bar */}
      <div className="mt-6 flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <FoodSearch value={query} onChange={setQuery} className="flex-1" />
          <div className="flex shrink-0 rounded-xl border border-nutridex-border bg-nutridex-surface p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Vista de cuadrícula"
              aria-pressed={view === "grid"}
              className={`rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                view === "grid"
                  ? "bg-nutridex-primary text-white"
                  : "text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
              }`}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="Vista de lista compacta"
              aria-pressed={view === "list"}
              className={`rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                view === "list"
                  ? "bg-nutridex-primary text-white"
                  : "text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
              }`}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Category horizontal filter bar with snap & smooth touch */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setGroupFilter(null)}
            aria-pressed={!groupFilter}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
              !groupFilter
                ? "bg-nutridex-primary text-white shadow-xs"
                : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:border-nutridex-primary/40 hover:text-nutridex-text-primary"
            }`}
          >
            Todos ({foods.length})
          </button>
          {groups.map((g) => {
            const count = foods.filter((f) => f.groupId === g.id).length;
            const active = groupFilter === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupFilter(active ? null : g.id)}
                aria-pressed={active}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                  active
                    ? "bg-nutridex-primary text-white shadow-xs"
                    : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:border-nutridex-primary/40 hover:text-nutridex-text-primary"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? "#ffffff" : g.colorToken }}
                  aria-hidden
                />
                <span>{g.name}</span>
                <span className={`text-xs ${active ? "text-white/80" : "text-nutridex-text-secondary/70"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Status line */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <p className="font-medium text-nutridex-text-secondary" role="status" aria-live="polite">
            Mostrando <span className="font-bold text-nutridex-text-primary">{filtered.length}</span> alimento
            {filtered.length !== 1 ? "s" : ""}
            {groupFilter && (
              <span>
                {" "}en <span className="font-semibold text-nutridex-primary">{groups.find((g) => g.id === groupFilter)?.name}</span>
              </span>
            )}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroupFilter(null);
              }}
              className="font-semibold text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary rounded py-0.5"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Content View */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sin alimentos encontrados"
            description="No encontramos resultados para tu búsqueda o filtro actual. Intenta con otro término o limpia los filtros."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGroupFilter(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-nutridex-primary px-4 py-2 text-xs font-semibold text-white hover:bg-nutridex-primary-hover transition-colors"
              >
                Ver todos los alimentos
              </button>
            }
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface shadow-xs divide-y divide-nutridex-border/60">
            {filtered.map((food) => (
              <FoodListItem
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlimentosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-nutridex-text-secondary">Cargando catálogo…</div>}>
      <AlimentosContent />
    </Suspense>
  );
}
