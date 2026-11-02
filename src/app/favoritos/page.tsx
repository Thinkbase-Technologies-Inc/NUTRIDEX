"use client";

import { useState, useMemo, useEffect } from "react";
import { Heart, Package } from "lucide-react";
import { getFoods } from "@/data/foods";
import { searchMatch } from "@/domain/calculation";
import { FoodCard } from "@/components/foods/FoodCard";
import { FoodSearch } from "@/components/ui/FoodSearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFoodsStore } from "@/stores/useFoodsStore";
import Link from "next/link";

export default function FavoritosPage() {
  const { favorites, toggleFavorite, syncFavoritesFromNeon } = useFoodsStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    syncFavoritesFromNeon();
  }, [syncFavoritesFromNeon]);

  const foods = getFoods();
  const favoriteFoods = useMemo(() => {
    return foods
      .filter((f) => favorites.includes(f.id))
      .filter((f) => (query.trim() ? searchMatch(f, query) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [foods, favorites, query]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
          Alimentos favoritos
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-nutridex-text-secondary">
          Alimentos guardados para calcular y consultar rápidamente sin buscarlos de nuevo.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="Sin favoritos guardados"
            description="Presiona el icono de corazón en cualquier alimento del catálogo o calculadora para tenerlo a la mano."
            action={
              <Link
                href="/alimentos"
                className="inline-flex items-center gap-2 rounded-xl bg-nutridex-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary"
              >
                Explorar catálogo
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-md">
              <FoodSearch value={query} onChange={setQuery} placeholder="Buscar en favoritos..." />
            </div>
            <p className="text-xs sm:text-sm font-medium text-nutridex-text-secondary" role="status" aria-live="polite">
              {favoriteFoods.length} favorito{favoriteFoods.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
