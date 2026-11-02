import { describe, it, expect, beforeEach } from "vitest";
import {
  categorizeFoodGroup,
  useShoppingStore,
  SHOPPING_DEPARTMENTS,
} from "../src/stores/useShoppingStore";
import type { MealPlan } from "../src/types";

describe("Smart Grocery & Shopping List Unit Tests", () => {
  beforeEach(() => {
    useShoppingStore.setState({
      items: [
        {
          id: "item-1",
          item_name: "Manzanas",
          category: "Frutas y Verduras",
          quantity: "4 piezas",
          is_purchased: false,
        },
        {
          id: "item-2",
          item_name: "Avena",
          category: "Cereales y Granos",
          quantity: "1 bolsa",
          is_purchased: true,
        },
      ],
      isLoading: false,
    });
  });

  describe("categorizeFoodGroup", () => {
    it("maps fruit and vegetable groups to 'Frutas y Verduras'", () => {
      expect(categorizeFoodGroup("frutas")).toBe("Frutas y Verduras");
      expect(categorizeFoodGroup("verduras")).toBe("Frutas y Verduras");
    });

    it("maps protein and legume groups to 'Proteínas y Carnes'", () => {
      expect(categorizeFoodGroup("proteina-baja-grasa")).toBe("Proteínas y Carnes");
      expect(categorizeFoodGroup("leguminosas")).toBe("Proteínas y Carnes");
    });

    it("maps milk groups to 'Lácteos y Bebidas'", () => {
      expect(categorizeFoodGroup("leche-descremada")).toBe("Lácteos y Bebidas");
      expect(categorizeFoodGroup("leche-entera")).toBe("Lácteos y Bebidas");
    });

    it("maps cereal groups to 'Cereales y Granos'", () => {
      expect(categorizeFoodGroup("cereales-sin-grasa")).toBe("Cereales y Granos");
      expect(categorizeFoodGroup("cereales-con-grasa")).toBe("Cereales y Granos");
    });

    it("maps fat groups to 'Grasas y Semillas'", () => {
      expect(categorizeFoodGroup("grasas-sin-proteina")).toBe("Grasas y Semillas");
    });

    it("falls back to 'Abarrotes y Varios'", () => {
      expect(categorizeFoodGroup("otros-alimentos")).toBe("Abarrotes y Varios");
    });
  });

  describe("Shopping store operations", () => {
    it("adds a new item to shopping list", async () => {
      const { addItem } = useShoppingStore.getState();
      await addItem("Espinacas", "Frutas y Verduras", "1 manojo");

      const items = useShoppingStore.getState().items;
      expect(items.length).toBe(3);
      expect(items[0].item_name).toBe("Espinacas");
      expect(items[0].is_purchased).toBe(false);
    });

    it("toggles item purchased status", async () => {
      const { toggleItem } = useShoppingStore.getState();
      await toggleItem("item-1");

      const items = useShoppingStore.getState().items;
      const item1 = items.find((i) => i.id === "item-1");
      expect(item1?.is_purchased).toBe(true);

      await toggleItem("item-1");
      const item1After = useShoppingStore.getState().items.find((i) => i.id === "item-1");
      expect(item1After?.is_purchased).toBe(false);
    });

    it("removes an item by id", async () => {
      const { removeItem } = useShoppingStore.getState();
      await removeItem("item-1");

      const items = useShoppingStore.getState().items;
      expect(items.find((i) => i.id === "item-1")).toBeUndefined();
      expect(items.length).toBe(1);
    });

    it("clears purchased items", async () => {
      const { clearPurchased } = useShoppingStore.getState();
      await clearPurchased();

      const items = useShoppingStore.getState().items;
      expect(items.every((i) => !i.is_purchased)).toBe(true);
      expect(items.length).toBe(1);
      expect(items[0].id).toBe("item-1");
    });

    it("generates items from meal plans", async () => {
      const samplePlans: MealPlan[] = [
        {
          id: "plan-1",
          date: "2026-11-02",
          meals: [
            {
              id: "meal-1",
              name: "Desayuno",
              foods: [
                { id: "f1", foodId: "aguacate", equivalents: 2 },
              ],
            },
          ],
          updatedAt: new Date().toISOString(),
        },
      ];

      const { generateFromPlanner } = useShoppingStore.getState();
      const addedCount = await generateFromPlanner(samplePlans);
      expect(addedCount).toBeGreaterThanOrEqual(1);

      const items = useShoppingStore.getState().items;
      const aguacateItem = items.find((i) => i.item_name.toLowerCase().includes("aguacate"));
      expect(aguacateItem).toBeDefined();
    });
  });
});
