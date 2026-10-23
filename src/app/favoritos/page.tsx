"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { getFoods } from "@/data/foods";
import { searchMatch } from "@/domain/calculation";
import { FoodCard } from "@/components/foods/FoodCard";
import { FoodSearch } from "@/components/ui/FoodSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFoodsStore } from "@/stores/useFoodsStore";
import Link from "next/link";

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useFoodsStore();
  const [query, setQuery] = useState("");

  const foods = getFoods();
  const favoriteFoods = useMemo(() => {
    return foods
      .filter((f) => favorites.includes(f.id))
      .filter((f) => (query.trim() ? searchMatch(f, query) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [foods, favorites, query]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <header>
        <h1 className="text-2xl font-bold text-nutridex-text-primary">Favoritos</h1>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          Alimentos que has guardado para consulta rápida
        </p>
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Sin favoritos aún"
          description="Guarda alimentos desde el explorador o la ficha de detalle para verlos aquí."
          action={
            <Link
              href="/alimentos"
              className="inline-flex items-center gap-2 rounded-xl bg-nutridex-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
            >
              Explorar alimentos
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-6 max-w-md">
            <FoodSearch value={query} onChange={setQuery} placeholder="Buscar en favoritos..." />
          </div>
          <p className="mt-3 text-sm text-nutridex-text-secondary" role="status" aria-live="polite">
            {favoriteFoods.length} favorito{favoriteFoods.length !== 1 ? "s" : ""}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
