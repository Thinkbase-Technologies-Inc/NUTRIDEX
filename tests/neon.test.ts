import { describe, it, expect, beforeAll } from "vitest";

// Ensure .env.local is loaded in Vitest environment
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import {
  isNeonConfigured,
  initDatabase,
  getNeonHealth,
  syncFoodsToNeon,
  getFoodsFromNeon,
  addUserFavoriteToNeon,
  getUserFavoritesFromNeon,
  removeUserFavoriteFromNeon,
  findUserByEmail,
  createUser,
  updateUserProfileInNeon,
  upsertMealPlanInNeon,
  getMealPlansFromNeon,
  deleteMealPlanFromNeon,
  getRecipesFromNeon,
  getNotificationsFromNeon,
  createNotificationInNeon,
  markNotificationReadInNeon,
} from "../src/lib/db";
import { getFoods } from "../src/data/foods";
import type { MealPlan } from "../src/types";

describe("Neon Lakebase Postgres Integration", { timeout: 30000 }, () => {
  beforeAll(async () => {
    if (isNeonConfigured()) {
      await initDatabase();
    }
  }, 30000);

  it("detects Neon database configuration", () => {
    expect(isNeonConfigured()).toBe(true);
  });

  it("initializes schema and healthcheck", async () => {
    const res = await initDatabase();
    expect(res.success).toBe(true);
    expect(res.branch).toBeDefined();
  });

  it("checks database health, latency and tables", async () => {
    const health = await getNeonHealth();
    expect(health.status).toBe("connected");
    expect(health.database).toBe("neondb");
    expect(health.latencyMs).toBeGreaterThan(0);
    expect(health.tables).toContain("nutridex_foods");
    expect(health.tables).toContain("nutridex_favorites");
    expect(health.tables).toContain("nutridex_users");
    expect(health.tables).toContain("nutridex_meal_plans");
    expect(health.tables).toContain("nutridex_recetas");
    expect(health.tables).toContain("nutridex_notificaciones");
  });

  it("syncs and retrieves foods catalog from Neon", async () => {
    const localFoods = getFoods();
    const syncRes = await syncFoodsToNeon(localFoods);
    expect(syncRes.success).toBe(true);
    expect(syncRes.count).toBe(localFoods.length);

    const dbFoods = await getFoodsFromNeon();
    expect(dbFoods.length).toBeGreaterThanOrEqual(localFoods.length);
    const manzana = dbFoods.find((f) => f.id === "manzana");
    expect(manzana).toBeDefined();
    expect(manzana?.name).toBe("Manzana");
  });

  it("manages user authentication and profiles in Neon", async () => {
    const testEmail = `neon-test-${Date.now()}@thinkbase.dev`;
    const user = await createUser({
      name: "Test Neon User",
      email: testEmail,
      passwordHash: "testPass123",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240",
    });
    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail.toLowerCase());

    const found = await findUserByEmail(testEmail);
    expect(found).not.toBeNull();
    expect(found?.name).toBe("Test Neon User");

    const updated = await updateUserProfileInNeon(testEmail, {
      target_calories: 2150,
      target_equivalents: 15,
    });
    expect(updated.target_calories).toBe(2150);
  });

  it("manages meal plans in Neon", async () => {
    const testEmail = "emily.andrian@thinkbase.app";
    const testDate = "2026-11-02";
    const samplePlan: MealPlan = {
      id: `plan_${testDate}`,
      date: testDate,
      meals: [
        {
          id: "meal_breakfast",
          name: "Desayuno",
          foods: [{ id: "f1", foodId: "manzana", equivalents: 1 }],
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    const saveRes = await upsertMealPlanInNeon(testEmail, samplePlan);
    expect(saveRes.success).toBe(true);

    const plans = await getMealPlansFromNeon(testEmail);
    expect(plans.length).toBeGreaterThanOrEqual(1);
    const foundPlan = plans.find((p) => p.date === testDate);
    expect(foundPlan).toBeDefined();
    expect(foundPlan?.meals[0]?.name).toBe("Desayuno");

    const delRes = await deleteMealPlanFromNeon(testEmail, testDate);
    expect(delRes.success).toBe(true);
  });

  it("queries healthy recipes from Neon", async () => {
    const recipes = await getRecipesFromNeon();
    expect(recipes.length).toBeGreaterThanOrEqual(3);
    const smoothie = recipes.find((r) => r.slug.includes("smoothie"));
    expect(smoothie).toBeDefined();
    expect(smoothie?.category).toBe("Desayuno");
  });

  it("manages user notifications in Neon", async () => {
    const testEmail = "emily.andrian@thinkbase.app";
    const notifRes = await createNotificationInNeon(
      testEmail,
      "Test Alert",
      "Plan listo para hoy",
      "plan",
      "/mi-plan"
    );
    expect(notifRes.success).toBe(true);

    const notifs = await getNotificationsFromNeon(testEmail);
    expect(notifs.length).toBeGreaterThanOrEqual(1);
    const found = notifs.find((n) => n.id === notifRes.id);
    expect(found).toBeDefined();

    const readRes = await markNotificationReadInNeon(notifRes.id, testEmail);
    expect(readRes.success).toBe(true);
  });

  it("manages user favorites end-to-end", async () => {
    const testEmail = "test-user@thinkbase.dev";
    const testFood = "manzana";

    const addRes = await addUserFavoriteToNeon(testEmail, testFood);
    expect(addRes.success).toBe(true);

    const favs = await getUserFavoritesFromNeon(testEmail);
    expect(favs).toContain(testFood);

    const removeRes = await removeUserFavoriteFromNeon(testEmail, testFood);
    expect(removeRes.success).toBe(true);

    const favsAfter = await getUserFavoritesFromNeon(testEmail);
    expect(favsAfter).not.toContain(testFood);
  });
});
