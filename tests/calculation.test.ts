import { describe, it, expect } from "vitest";
import { Rational, validateEquivalents, calculateEquivalents, formatEquivalentsLabel, formatGrams, normalizeSlug, removeAccents, searchMatch } from "@/domain/calculation";
import type { FoodItem } from "@/types";

function makeFood(overrides: Partial<FoodItem> = {}): FoodItem {
  return {
    id: "test-food",
    slug: "test-food",
    name: "Test Food",
    normalizedName: "test food",
    aliases: [],
    groupId: "frutas",
    portionLabel: "1 pieza",
    portionNumerator: 1,
    portionDenominator: null,
    portionUnit: "pieza",
    grams: 100,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Test",
    validationStatus: "needs_review",
    notes: null,
    ...overrides,
  };
}

describe("Rational", () => {
  it("normalizes fractions", () => {
    const r = new Rational(2, 4);
    expect(r.n).toBe(1);
    expect(r.d).toBe(2);
  });

  it("adds fractions correctly", () => {
    const a = new Rational(1, 3);
    const b = new Rational(1, 3);
    const sum = a.add(b);
    expect(sum.n).toBe(2);
    expect(sum.d).toBe(3);
  });

  it("multiplies fractions correctly", () => {
    const a = new Rational(1, 3);
    const b = new Rational(3);
    const product = a.mul(b);
    expect(product.n).toBe(1);
    expect(product.d).toBe(1);
  });

  it("handles mixed fractions", () => {
    const r = Rational.from("1 1/2");
    expect(r.n).toBe(3);
    expect(r.d).toBe(2);
  });

  it("converts to mixed", () => {
    const r = new Rational(5, 2);
    const mixed = r.toMixed();
    expect(mixed).toEqual({ whole: 2, numerator: 1, denominator: 2 });
  });

  it("toString for whole numbers", () => {
    expect(new Rational(3).toString()).toBe("3");
  });

  it("toString for fractions", () => {
    expect(new Rational(2, 3).toString()).toBe("2/3");
  });
});

describe("validateEquivalents", () => {
  it("accepts valid numbers", () => {
    expect(validateEquivalents(1)).toBe(1);
    expect(validateEquivalents(2.5)).toBe(2.5);
    expect(validateEquivalents("3")).toBe(3);
    expect(validateEquivalents("1/2")).toBe(0.5);
  });

  it("rejects zero", () => {
    expect(() => validateEquivalents(0)).toThrow();
  });

  it("rejects negatives", () => {
    expect(() => validateEquivalents(-1)).toThrow();
  });

  it("rejects NaN", () => {
    expect(() => validateEquivalents(NaN)).toThrow();
  });

  it("rejects extremely large values", () => {
    expect(() => validateEquivalents(101)).toThrow();
  });

  it("rejects non-numeric strings", () => {
    expect(() => validateEquivalents("abc")).toThrow();
  });
});

describe("calculateEquivalents", () => {
  const food = makeFood({ grams: 106, portionLabel: "1 pieza", portionNumerator: 1, portionDenominator: null, portionUnit: "pieza" });

  it("calculates for 1 equivalent", () => {
    const result = calculateEquivalents(food, 1);
    expect(result.equivalents).toBe(1);
    expect(result.grams).toBe(106);
    expect(result.quantityLabel).toContain("1");
  });

  it("calculates for 2 equivalents", () => {
    const result = calculateEquivalents(food, 2);
    expect(result.grams).toBe(212);
  });

  it("calculates for 3 equivalents", () => {
    const result = calculateEquivalents(food, 3);
    expect(result.grams).toBe(318);
  });

  it("handles fractional equivalents", () => {
    const result = calculateEquivalents(food, 0.5);
    expect(result.grams).toBe(53);
  });

  it("handles food without grams", () => {
    const noGrams = makeFood({ grams: null, portionNumerator: null, portionDenominator: null, portionUnit: null });
    const result = calculateEquivalents(noGrams, 2);
    expect(result.grams).toBeNull();
  });

  it("calculates fractional portions correctly", () => {
    const fractionFood = makeFood({
      portionLabel: "1/3 taza",
      portionNumerator: 1,
      portionDenominator: 3,
      portionUnit: "taza",
      grams: 30,
    });
    const result = calculateEquivalents(fractionFood, 3);
    expect(result.grams).toBe(90);
    expect(result.quantityLabel).toContain("1");
  });

  it("propagates validation errors", () => {
    expect(() => calculateEquivalents(food, 0)).toThrow();
    expect(() => calculateEquivalents(food, -1)).toThrow();
  });
});

describe("formatEquivalentsLabel", () => {
  it("formats whole numbers", () => {
    expect(formatEquivalentsLabel(1)).toBe("1 equivalente");
    expect(formatEquivalentsLabel(2)).toBe("2 equivalentes");
  });

  it("formats fractions", () => {
    expect(formatEquivalentsLabel(0.5)).toBe("1/2 equivalentes");
  });
});

describe("formatGrams", () => {
  it("formats grams", () => {
    expect(formatGrams(106)).toBe("106 g");
  });

  it("returns null for null", () => {
    expect(formatGrams(null)).toBeNull();
  });
});

describe("normalizeSlug", () => {
  it("creates slugs", () => {
    expect(normalizeSlug("Tortilla de maíz")).toBe("tortilla-de-maiz");
  });
});

describe("removeAccents", () => {
  it("removes accents", () => {
    expect(removeAccents("manzana")).toBe("manzana");
    expect(removeAccents("aguacate")).toBe("aguacate");
  });
});

describe("searchMatch", () => {
  const food = makeFood({ name: "Pechuga de pollo", normalizedName: "pechuga de pollo", aliases: ["pollo"] });

  it("matches partial terms", () => {
    expect(searchMatch(food, "pollo")).toBe(true);
    expect(searchMatch(food, "pechuga")).toBe(true);
  });

  it("matches aliases", () => {
    expect(searchMatch(food, "pollo")).toBe(true);
  });

  it("returns true for empty query", () => {
    expect(searchMatch(food, "")).toBe(true);
  });

  it("returns false for non-matching", () => {
    expect(searchMatch(food, "zanahoria")).toBe(false);
  });
});
