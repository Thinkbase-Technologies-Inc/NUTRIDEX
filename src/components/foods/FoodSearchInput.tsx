"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { searchMatch } from "@/domain/calculation";
import { getFoods, getGroup } from "@/data/foods";

const SUGGESTIONS = ["Manzana", "Tortilla de maíz", "Pechuga de pollo", "Avena en hojuela cruda", "Aguacate"];

export function FoodSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const foods = getFoods();
  const matches = query.trim() ? foods.filter((f) => searchMatch(f, query)).slice(0, 6) : [];

  const handleSelect = (slug: string) => {
    router.push(`/alimentos/${slug}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center rounded-2xl border border-nutridex-border bg-nutridex-surface p-1.5 shadow-sm transition-all focus-within:border-nutridex-primary focus-within:ring-2 focus-within:ring-nutridex-primary/20">
        <Search className="ml-3.5 h-5 w-5 shrink-0 text-nutridex-text-secondary" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Busca por nombre o grupo (ej. manzana, tortilla, pollo)..."
          aria-label="Buscar alimentos equivalentes"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base text-nutridex-text-primary placeholder:text-nutridex-text-secondary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => router.push(query.trim() ? `/alimentos?q=${encodeURIComponent(query)}` : "/alimentos")}
          aria-label="Ir al explorador de alimentos"
          className="flex h-10 px-4 items-center gap-1.5 shrink-0 rounded-xl bg-nutridex-primary text-xs sm:text-sm font-semibold text-white transition-all hover:bg-nutridex-primary-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <span>Buscar</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Sugerencias rápidas bajo el buscador */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-nutridex-text-secondary shrink-0 pl-1">
          <Sparkles className="h-3 w-3 text-nutridex-primary" aria-hidden />
          Prueba:
        </span>
        {SUGGESTIONS.map((item) => {
          const matchFood = foods.find((f) => f.name.toLowerCase() === item.toLowerCase());
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (matchFood) {
                  router.push(`/alimentos/${matchFood.slug}`);
                } else {
                  setQuery(item);
                  setShowResults(true);
                }
              }}
              className="shrink-0 rounded-full border border-nutridex-border bg-nutridex-surface/80 px-2.5 py-1 text-xs text-nutridex-text-secondary transition-colors hover:border-nutridex-primary/50 hover:bg-nutridex-primary-soft hover:text-nutridex-primary active:scale-95"
            >
              {item}
            </button>
          );
        })}
      </div>

      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface shadow-lg backdrop-blur-md">
          {matches.length === 0 ? (
            <div className="px-4 py-3.5 text-sm text-nutridex-text-secondary">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="divide-y divide-nutridex-border/60">
              {matches.map((food) => {
                const group = getGroup(food.groupId);
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleSelect(food.slug)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-nutridex-text-primary">{food.name}</span>
                      {group && <span className="block text-xs text-nutridex-text-secondary">{group.name}</span>}
                    </div>
                    <span className="shrink-0 rounded-full bg-nutridex-primary-soft px-2.5 py-1 text-xs font-medium text-nutridex-primary">
                      {food.portionLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
