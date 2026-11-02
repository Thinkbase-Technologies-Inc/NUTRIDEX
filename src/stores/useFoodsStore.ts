/**
 * src/stores/useFoodsStore.ts
 *
 * Estado compartido del catálogo de alimentos: favoritos y recientes,
 * sincronizados localmente (IndexedDB/LocalStorage) y con Neon Lakebase Postgres.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { readFavorites, writeFavorites } from "@/repositories/indexeddb";
import { useAuthStore } from "./useAuthStore";

interface FoodsState {
  favorites: string[];
  recent: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecent: (id: string) => void;
  setFavorites: (ids: string[]) => void;
  syncFavoritesFromNeon: () => Promise<void>;
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
        const next = [...favorites, id];
        writeFavorites(next);
        set({ favorites: next });

        // Sync with NeonDB in background
        const email = useAuthStore.getState().user?.email;
        if (email) {
          fetch("/api/neon/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, foodId: id }),
          }).catch(() => {});
        }
      },

      removeFavorite: (id) => {
        const { favorites } = get();
        const next = favorites.filter((x) => x !== id);
        writeFavorites(next);
        set({ favorites: next });

        // Sync with NeonDB in background
        const email = useAuthStore.getState().user?.email;
        if (email) {
          fetch("/api/neon/favorites", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, foodId: id }),
          }).catch(() => {});
        }
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

      syncFavoritesFromNeon: async () => {
        const email = useAuthStore.getState().user?.email;
        if (!email) return;
        try {
          const res = await fetch(`/api/neon/favorites?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (res.ok && Array.isArray(data.favorites) && data.favorites.length > 0) {
            const current = get().favorites;
            const merged = Array.from(new Set([...current, ...data.favorites]));
            set({ favorites: merged });
            writeFavorites(merged);
          }
        } catch {}
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
  store.syncFavoritesFromNeon();
}
