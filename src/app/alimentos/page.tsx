"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import { getFoods, getGroups } from "@/data/foods";
import { searchMatch } from "@/domain/calculation";
import { FoodCard } from "@/components/foods/FoodCard";
import { FoodListItem } from "@/components/foods/FoodListItem";
import { FoodSearch } from "@/components/ui/FoodSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { Package } from "lucide-react";

export default function AlimentosPage() {
  const [query, setQuery] = useState("");
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
    <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <p className="text-sm font-medium text-nutridex-primary">Catálogo de equivalentes</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-tight text-nutridex-text-primary md:text-4xl">Alimentos</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-nutridex-text-secondary">
          Explora el catálogo de alimentos equivalentes y calcula la porción que necesitas.
        </p>
      </header>

      <div className="mt-7 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FoodSearch value={query} onChange={setQuery} className="flex-1" />
          <div className="flex shrink-0 rounded-full border border-nutridex-border bg-nutridex-surface p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Vista de tarjetas"
              aria-pressed={view === "grid"}
              className={`rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${view === "grid" ? "bg-nutridex-primary text-white" : "text-nutridex-text-secondary hover:bg-nutridex-surface-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="Vista de listado compacto"
              aria-pressed={view === "list"}
              className={`rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${view === "list" ? "bg-nutridex-primary text-white" : "text-nutridex-text-secondary hover:bg-nutridex-surface-muted"}`}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="-mx-5 flex flex-wrap gap-2 px-5 md:mx-0 md:px-0">
          <button
            type="button"
            onClick={() => setGroupFilter(null)}
            aria-pressed={!groupFilter}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${!groupFilter ? "bg-nutridex-primary text-white" : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"}`}
          >
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroupFilter(g.id)}
              aria-pressed={groupFilter === g.id}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary ${groupFilter === g.id ? "bg-nutridex-primary text-white" : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-nutridex-text-secondary" role="status" aria-live="polite">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => { setQuery(""); setGroupFilter(null); }}
              className="text-sm font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sin resultados"
            description="No se encontraron alimentos que coincidan con tu búsqueda. Prueba con otro término o limpia los filtros."
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
          <div className="overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface shadow-[0_18px_40px_-34px_rgba(24,62,26,0.45)]">
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
