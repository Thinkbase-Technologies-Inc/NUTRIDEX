import { describe, it, expect } from "vitest";
import {
  ICONS8_FOOD_GROUPS,
  ICONS8_MEALS,
  ICONS8_METRICS,
  getGroupIcon,
  getMealIcon,
} from "../src/data/icons8";

describe("Icons8 Integration", () => {
  it("provides valid Icons8 URLs for all 17 food groups", () => {
    const groupKeys = Object.keys(ICONS8_FOOD_GROUPS);
    expect(groupKeys.length).toBeGreaterThanOrEqual(17);

    for (const key of groupKeys) {
      const url = ICONS8_FOOD_GROUPS[key];
      expect(url).toContain("img.icons8.com");
      expect(url).toMatch(/^https:\/\/img\.icons8\.com\/fluency\/\d+\/.+\.png$/);
    }
  });

  it("provides valid Icons8 URLs for meal categories", () => {
    const mealKeys = Object.keys(ICONS8_MEALS);
    expect(mealKeys.length).toBeGreaterThanOrEqual(5);

    for (const key of mealKeys) {
      const url = ICONS8_MEALS[key];
      expect(url).toContain("img.icons8.com");
      expect(url).toMatch(/^https:\/\/img\.icons8\.com\/fluency\/\d+\/.+\.png$/);
    }
  });

  it("resolves getGroupIcon with fallback", () => {
    expect(getGroupIcon("frutas")).toContain("apple.png");
    expect(getGroupIcon("unknown-group")).toContain("img.icons8.com");
  });

  it("resolves getMealIcon with fallback", () => {
    expect(getMealIcon("Desayuno")).toContain("pancake.png");
    expect(getMealIcon("Unknown Meal")).toContain("dining-room.png");
  });
});
