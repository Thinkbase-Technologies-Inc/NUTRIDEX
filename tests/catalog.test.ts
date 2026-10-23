import { describe, it, expect } from "vitest";
import { SEED_CATALOG, getGroups, getFoods, getFood, getFoodsByGroup, getGroup } from "@/data/foods";
import { validateCatalog } from "../scripts/validate-foods/validate";

describe("Food Catalog", () => {
  it("has 17 categories", () => {
    const groups = getGroups();
    expect(groups.length).toBe(17);
  });

  it("has no duplicate group IDs", () => {
    const groups = getGroups();
    const ids = groups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has foods", () => {
    const foods = getFoods();
    expect(foods.length).toBeGreaterThan(0);
  });

  it("has no duplicate food IDs", () => {
    const foods = getFoods();
    const ids = foods.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all foods have valid group references", () => {
    const foods = getFoods();
    const groupIds = getGroups().map((g) => g.id);
    for (const food of foods) {
      expect(groupIds).toContain(food.groupId);
    }
  });

  it("all foods have portion labels", () => {
    const foods = getFoods();
    for (const food of foods) {
      expect(food.portionLabel).toBeTruthy();
    }
  });

  it("foods with grams have positive values", () => {
    const foods = getFoods();
    for (const food of foods) {
      if (food.grams !== null) {
        expect(food.grams).toBeGreaterThan(0);
      }
    }
  });

  it("foods preserve source traceability", () => {
    const foods = getFoods();
    for (const food of foods) {
      expect(food.sourceText).toBeTruthy();
      expect(food.sourcePage).toBeGreaterThanOrEqual(1);
    }
  });

  it("getFood finds food by ID", () => {
    const foods = getFoods();
    const found = getFood(foods[0].id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(foods[0].id);
  });

  it("getFoodsByGroup returns foods for a group", () => {
    const foods = getFoodsByGroup("frutas");
    expect(foods.length).toBeGreaterThan(0);
    for (const f of foods) {
      expect(f.groupId).toBe("frutas");
    }
  });

  it("getGroup finds group by ID", () => {
    const group = getGroup("frutas");
    expect(group).toBeDefined();
    expect(group?.name).toBe("Frutas");
  });

  it("catalog validates with no critical issues", () => {
    const result = validateCatalog(SEED_CATALOG);
    expect(result.valid).toBe(true);
    expect(result.counts.groups).toBe(17);
    expect(result.counts.foods).toBeGreaterThan(0);
  });

  it("catalog has version and source document", () => {
    expect(SEED_CATALOG.version).toBeTruthy();
    expect(SEED_CATALOG.sourceDocument).toBeTruthy();
  });
});
