/**
 * src/stores/useFoodsStore.ts
 *
 * Estado compartido del catálogo de alimentos: favoritos y recientes.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FoodItem } from "@/types";
import { readFavorites, writeFavorites } from "@/repositories/indexeddb";

interface FoodsState {
  favorites: string[];
  recent: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecent: (id: string) => void;
  setFavorites: (ids: string[]) => void;
}

const MAX_RECENT = 20;

export const useFoodsStore = create<FoodsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recent: [],
      setFavorites: (ids) => set({ favorites: ids }),
      addFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) return;
        writeFavorites([...favorites, id]);
        set({ favorites: [...favorites, id] });
      },
      removeFavorite: (id) => {
        const { favorites } = get();
        const next = favorites.filter((x) => x !== id);
        writeFavorites(next);
        set({ favorites: next });
      },
      toggleFavorite: (id) => {
        if (get().isFavorite(id)) get().removeFavorite(id);
        else get().addFavorite(id);
      },
      isFavorite: (id) => get().favorites.includes(id),
      addRecent: (id) => {
        const { recent } = get();
        const filtered = recent.filter((x) => x !== id);
        const next = [id, ...filtered].slice(0, MAX_RECENT);
        set({ recent: next });
      },
    }),
    {
      name: "nutridex:foods",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites, recent: state.recent }),
    }
  )
);

export function initializeFavorites(): void {
  const store = useFoodsStore.getState();
  const persisted = readFavorites();
  if (persisted.length) store.setFavorites(persisted);
}
