import { describe, it, expect, beforeAll } from "vitest";

// Ensure .env.local is loaded
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import {
  isNeonConfigured,
  initDatabase,
  getNeonHealth,
  getFoodsFromNeon,
  getRecipesFromNeon,
  findUserByEmail,
  getNotificationsFromNeon,
} from "../src/lib/db";
import { getFoods, getGroups } from "../src/data/foods";

describe("NutriDex E2E & Localización (Español México)", { timeout: 30000 }, () => {
  beforeAll(async () => {
    if (isNeonConfigured()) {
      await initDatabase();
    }
  }, 30000);

  it("verifica que la nube de ThinkBase esté conectada y lista", async () => {
    expect(isNeonConfigured()).toBe(true);
    const health = await getNeonHealth();
    expect(health.status).toBe("connected");
  });

  it("verifica que los usuarios demo tengan nombres y datos válidos en español", async () => {
    const emily = await findUserByEmail("emily.andrian@thinkbase.app");
    expect(emily).not.toBeNull();
    expect(emily?.name).toBe("Emily Andrian");
    expect(emily?.plan_name).toContain("Plan Activo");

    const gleb = await findUserByEmail("gleb.kuznetsov@thinkbase.app");
    expect(gleb).not.toBeNull();
    expect(gleb?.name).toBe("Gleb Kuznetsov");
  });

  it("verifica el catálogo SMAE con porciones y categorías en Español México", () => {
    const foods = getFoods();
    expect(foods.length).toBeGreaterThan(0);

    const groups = getGroups();
    expect(groups.length).toBeGreaterThan(0);

    // SMAE categories verification in Spanish
    const groupNames = groups.map((g) => g.name.toLowerCase());
    expect(groupNames.some((n) => n.includes("fruta") || n.includes("verdura") || n.includes("cereal"))).toBe(true);
  });

  it("verifica que el recetario contenga platillos e ingredientes en español", async () => {
    const recipes = await getRecipesFromNeon();
    expect(recipes.length).toBeGreaterThanOrEqual(4);

    for (const r of recipes) {
      expect(r.title).toBeDefined();
      expect(r.ingredients.length).toBeGreaterThan(0);
      expect(r.instructions.length).toBeGreaterThan(0);
      expect(["Desayuno", "Comida", "Cena", "Snack"]).toContain(r.category);
    }
  });

  it("verifica que las notificaciones de usuario no contengan 'NeonDB' para el usuario", async () => {
    const notifs = await getNotificationsFromNeon("emily.andrian@thinkbase.app");
    expect(notifs.length).toBeGreaterThan(0);

    for (const n of notifs) {
      // Must not display "NeonDB" to user
      expect(n.message).not.toContain("NeonDB");
      expect(n.message).not.toContain("Lakebase Postgres");
    }
  });
});
