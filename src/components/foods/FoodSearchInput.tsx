"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { searchMatch, removeAccents } from "@/domain/calculation";
import { getFoods } from "@/data/foods";

export function FoodSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const foods = getFoods();
  const matches = query.trim()
    ? foods.filter((f) => searchMatch(f, query)).slice(0, 6)
    : [];

  const handleSelect = (slug: string) => {
    router.push(`/alimentos/${slug}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="relative max-w-xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder="Busca manzana, tortilla, pollo, avena..."
        aria-label="Buscar alimentos"
        className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface py-4 pl-12 pr-4 text-base text-nutridex-text-primary placeholder:text-nutridex-text-secondary shadow-sm focus:outline-2 focus:outline-nutridex-primary"
      />
      {showResults && query.trim() && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-nutridex-border bg-nutridex-surface shadow-lg">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-nutridex-text-secondary">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            matches.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => handleSelect(food.slug)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary"
              >
                <span className="text-sm font-medium text-nutridex-text-primary">{food.name}</span>
                <span className="text-xs text-nutridex-text-secondary">{food.portionLabel}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
