"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShoppingItemRow } from "@/lib/db";
import { useAuthStore } from "./useAuthStore";
import { getFoods } from "@/data/foods";
import type { MealPlan } from "@/types";

export interface ShoppingItem {
  id: string;
  item_name: string;
  category: string;
  quantity: string;
  is_purchased: boolean;
}

export const SHOPPING_DEPARTMENTS = [
  "Frutas y Verduras",
  "Proteínas y Carnes",
  "Lácteos y Bebidas",
  "Cereales y Granos",
  "Grasas y Semillas",
  "Abarrotes y Varios",
] as const;

export function categorizeFoodGroup(groupId: string): string {
  if (groupId.startsWith("cereal")) {
    return "Cereales y Granos";
  }
  if (groupId.startsWith("proteina") || groupId.startsWith("leguminosa")) {
    return "Proteínas y Carnes";
  }
  if (groupId.startsWith("leche")) {
    return "Lácteos y Bebidas";
  }
  if (groupId.startsWith("fruta") || groupId.startsWith("verdura")) {
    return "Frutas y Verduras";
  }
  if (groupId.startsWith("grasa")) {
    return "Grasas y Semillas";
  }
  return "Abarrotes y Varios";
}

interface ShoppingState {
  items: ShoppingItem[];
  isLoading: boolean;

  // Actions
  addItem: (name: string, category: string, quantity?: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearPurchased: () => Promise<void>;
  clearAll: () => Promise<void>;
  generateFromPlanner: (plans: MealPlan[]) => Promise<number>;
  syncFromNeon: () => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "seed-manzana",
          item_name: "Manzana fresca",
          category: "Frutas y Verduras",
          quantity: "6 piezas",
          is_purchased: false,
        },
        {
          id: "seed-avena",
          item_name: "Avena en hojuelas cruda",
          category: "Cereales y Granos",
          quantity: "1 bolsa (500 g)",
          is_purchased: true,
        },
        {
          id: "seed-pollo",
          item_name: "Pechuga de pollo sin piel",
          category: "Proteínas y Carnes",
          quantity: "1 kg",
          is_purchased: false,
        },
        {
          id: "seed-aguacate",
          item_name: "Aguacate Hass",
          category: "Grasas y Semillas",
          quantity: "3 piezas",
          is_purchased: false,
        },
        {
          id: "seed-leche",
          item_name: "Leche de almendras sin azúcar",
          category: "Lácteos y Bebidas",
          quantity: "1 litro",
          is_purchased: true,
        },
      ],
      isLoading: false,

      addItem: async (name, category, quantity = "1 porción") => {
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        const newItem: ShoppingItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          item_name: name.trim(),
          category,
          quantity: quantity.trim(),
          is_purchased: false,
        };

        set((state) => ({
          items: [newItem, ...state.items],
        }));

        try {
          await fetch("/api/neon/shopping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, item: newItem }),
          });
        } catch {}
      },

      toggleItem: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        const nextStatus = !item.is_purchased;
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, is_purchased: nextStatus } : i
          ),
        }));

        try {
          await fetch("/api/neon/shopping", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, email, isPurchased: nextStatus }),
          });
        } catch {}
      },

      removeItem: async (id) => {
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        try {
          await fetch(
            `/api/neon/shopping?id=${id}&email=${encodeURIComponent(email)}`,
            { method: "DELETE" }
          );
        } catch {}
      },

      clearPurchased: async () => {
        const purchased = get().items.filter((i) => i.is_purchased);
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        set((state) => ({
          items: state.items.filter((i) => !i.is_purchased),
        }));

        for (const item of purchased) {
          try {
            await fetch(
              `/api/neon/shopping?id=${item.id}&email=${encodeURIComponent(email)}`,
              { method: "DELETE" }
            );
          } catch {}
        }
      },

      clearAll: async () => {
        const user = useAuthStore.getState().user;
        const email = user?.email || "emily.andrian@thinkbase.app";

        set({ items: [] });

        try {
          await fetch(
            `/api/neon/shopping?all=true&email=${encodeURIComponent(email)}`,
            { method: "DELETE" }
          );
        } catch {}
      },

      generateFromPlanner: async (plans: MealPlan[]) => {
        const foods = getFoods();
        const foodMap = new Map(foods.map((f) => [f.id, f]));

        // Aggregate counts by food
        const foodCounts = new Map<string, number>();

        for (const plan of plans) {
          for (const meal of plan.meals) {
            for (const item of meal.foods) {
              const current = foodCounts.get(item.foodId) || 0;
              foodCounts.set(item.foodId, current + (item.equivalents || 1));
            }
          }
        }

        const newItems: ShoppingItem[] = [];
        const existingNames = new Set(get().items.map((i) => i.item_name.toLowerCase()));

        for (const [foodId, totalEquivs] of foodCounts.entries()) {
          const food = foodMap.get(foodId);
          if (!food || existingNames.has(food.name.toLowerCase())) continue;

          const category = categorizeFoodGroup(food.groupId);
          const quantity = `${totalEquivs} equiv. (${food.portionLabel})`;

          newItems.push({
            id: `gen-${foodId}-${Date.now()}`,
            item_name: food.name,
            category,
            quantity,
            is_purchased: false,
          });
        }

        if (newItems.length > 0) {
          set((state) => ({ items: [...newItems, ...state.items] }));

          // Sync new items to cloud
          const user = useAuthStore.getState().user;
          const email = user?.email || "emily.andrian@thinkbase.app";
          for (const item of newItems) {
            try {
              await fetch("/api/neon/shopping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, item }),
              });
            } catch {}
          }
        }

        return newItems.length;
      },

      syncFromNeon: async () => {
        const user = useAuthStore.getState().user;
        if (!user?.email) return;

        set({ isLoading: true });
        try {
          const res = await fetch(
            `/api/neon/shopping?email=${encodeURIComponent(user.email)}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.items && Array.isArray(data.items)) {
              set({ items: data.items });
            }
          }
        } catch {
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "nutridex-shopping-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
