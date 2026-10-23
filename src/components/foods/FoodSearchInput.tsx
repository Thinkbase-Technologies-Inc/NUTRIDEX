"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { searchMatch } from "@/domain/calculation";
import { getFoods, getGroup } from "@/data/foods";

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
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-nutridex-border bg-nutridex-surface p-2 pl-5 shadow-[0_20px_45px_-30px_rgba(24,62,26,0.6)] transition-shadow focus-within:shadow-[0_24px_50px_-28px_rgba(24,62,26,0.7)]">
        <Search className="h-5 w-5 shrink-0 text-nutridex-text-secondary" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 180)}
          placeholder="Busca manzana, tortilla, pollo, avena..."
          aria-label="Buscar alimentos"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-nutridex-text-primary placeholder:text-nutridex-text-secondary focus:outline-none sm:text-base"
        />
        <button
          type="button"
          onClick={() => router.push("/alimentos")}
          aria-label="Ir al explorador de alimentos"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nutridex-primary text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {showResults && query.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface shadow-[0_30px_60px_-30px_rgba(24,62,26,0.5)]">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-nutridex-text-secondary">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            matches.map((food) => {
              const group = getGroup(food.groupId);
              return (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleSelect(food.slug)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
                >
                  <span>
                    <span className="block text-sm font-semibold text-nutridex-text-primary">{food.name}</span>
                    {group && <span className="block text-xs text-nutridex-text-secondary">{group.name}</span>}
                  </span>
                  <span className="shrink-0 rounded-full bg-nutridex-surface-muted px-2.5 py-1 text-xs text-nutridex-text-secondary">
                    {food.portionLabel}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
