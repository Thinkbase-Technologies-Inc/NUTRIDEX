/**
 * Seed catalog de ejemplos documentados en el prompt.
 *
 * ESTO NO ES EL CATÁLOGO COMPLETO DEL PDF.
 * El archivo docs/lista-alimentos-equivalentes.pdf no se encontró en el
 * repositorio. Estos registros son ejemplos textuales del documento
 * (manzana, tortilla de maíz, avena, pechuga de pollo, aguacate, papaya
 * picada) incluidos únicamente para que la aplicación sea funcional y
 * demostrable mientras se ejecuta el pipeline de extracción real.
 *
 * Cada registro está marcado con validationStatus "needs_review" y una nota
 * indicando que debe confirmarse contra el PDF fuente. No se inventan
 * calorías, macronutrientes ni porciones no documentadas.
 */

import type { FoodCatalog, FoodGroup, FoodItem } from "@/types";
import { normalizeSlug } from "@/domain/calculation";

const GROUPS: FoodGroup[] = [
  { id: "verduras", slug: "verduras", name: "Verduras", colorToken: "#2e7d5b", order: 1 },
  { id: "frutas", slug: "frutas", name: "Frutas", colorToken: "#147d64", order: 2 },
  { id: "cereales-sin-grasa", slug: "cereales-sin-grasa", name: "Cereales sin grasa", colorToken: "#b45309", order: 3 },
  { id: "cereales-con-grasa", slug: "cereales-con-grasa", name: "Cereales con grasa", colorToken: "#d97706", order: 4 },
  { id: "leguminosas", slug: "leguminosas", name: "Leguminosas", colorToken: "#15803d", order: 5 },
  { id: "proteina-muy-baja-grasa", slug: "proteina-muy-baja-grasa", name: "Proteína muy baja en grasa", colorToken: "#059669", order: 6 },
  { id: "proteina-baja-grasa", slug: "proteina-baja-grasa", name: "Proteína baja en grasa", colorToken: "#10b981", order: 7 },
  { id: "proteina-moderada-grasa", slug: "proteina-moderada-grasa", name: "Proteína moderada en grasa", colorToken: "#34d399", order: 8 },
  { id: "proteina-alta-grasa", slug: "proteina-alta-grasa", name: "Proteína alta en grasa", colorToken: "#6ee7b7", order: 9 },
  { id: "leche-descremada", slug: "leche-descremada", name: "Leche descremada", colorToken: "#93c5fd", order: 10 },
  { id: "leche-semidescremada", slug: "leche-semidescremada", name: "Leche semidescremada", colorToken: "#60a5fa", order: 11 },
  { id: "leche-entera", slug: "leche-entera", name: "Leche entera", colorToken: "#3b82f6", order: 12 },
  { id: "leche-con-azucar", slug: "leche-con-azucar", name: "Leche con azúcar", colorToken: "#2563eb", order: 13 },
  { id: "grasas-sin-proteina", slug: "grasas-sin-proteina", name: "Grasas sin proteína", colorToken: "#ea580c", order: 14 },
  { id: "grasas-con-proteina", slug: "grasas-con-proteina", name: "Grasas con proteína", colorToken: "#f97316", order: 15 },
  { id: "azucar-sin-grasa", slug: "azucar-sin-grasa", name: "Azúcar sin grasa", colorToken: "#d97706", order: 16 },
  { id: "azucar-con-grasa", slug: "azucar-con-grasa", name: "Azúcar con grasa", colorToken: "#c2410c", order: 17 },
];

const groupById = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

function food(opts: {
  name: string;
  normalizedName: string;
  groupId: string;
  portionLabel: string;
  portionNumerator: number | null;
  portionDenominator: number | null;
  portionUnit: string | null;
  grams: number | null;
  isApproximate: boolean;
  sourcePage: number;
  sourceText: string;
  validationStatus: "verified" | "needs_review" | "incomplete";
  notes: string | null;
  aliases?: string[];
}): FoodItem {
  const id = normalizeSlug(opts.name);
  return {
    id,
    slug: normalizeSlug(opts.name),
    name: opts.name,
    normalizedName: opts.normalizedName,
    aliases: opts.aliases ?? [],
    groupId: opts.groupId,
    portionLabel: opts.portionLabel,
    portionNumerator: opts.portionNumerator,
    portionDenominator: opts.portionDenominator,
    portionUnit: opts.portionUnit,
    grams: opts.grams,
    isApproximate: opts.isApproximate,
    sourcePage: opts.sourcePage,
    sourceText: opts.sourceText,
    validationStatus: opts.validationStatus,
    notes: opts.notes,
  };
}

const FOODS: FoodItem[] = [
  food({
    name: "Manzana",
    normalizedName: "manzana",
    groupId: "frutas",
    portionLabel: "1 pieza",
    portionNumerator: 1,
    portionDenominator: null,
    portionUnit: "pieza",
    grams: 106,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Manzana | 1 pieza | ~106 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["manzanas"],
  }),
  food({
    name: "Tortilla de maíz",
    normalizedName: "tortilla de maiz",
    groupId: "cereales-sin-grasa",
    portionLabel: "1 pieza",
    portionNumerator: 1,
    portionDenominator: null,
    portionUnit: "pieza",
    grams: 30,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Tortilla de maíz | 1 pieza | ~30 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["tortilla", "tortillas de maiz"],
  }),
  food({
    name: "Avena en hojuela cruda",
    normalizedName: "avena en hojuela cruda",
    groupId: "cereales-sin-grasa",
    portionLabel: "1/3 taza",
    portionNumerator: 1,
    portionDenominator: 3,
    portionUnit: "taza",
    grams: 30,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Avena en hojuela cruda | 1/3 taza | ~30 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["avena"],
  }),
  food({
    name: "Pechuga de pollo",
    normalizedName: "pechuga de pollo",
    groupId: "proteina-muy-baja-grasa",
    portionLabel: "30 gramos",
    portionNumerator: 30,
    portionDenominator: null,
    portionUnit: "gramos",
    grams: 30,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Pechuga de pollo | 30 gramos | ~30 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["pollo", "pechuga"],
  }),
  food({
    name: "Aguacate",
    normalizedName: "aguacate",
    groupId: "grasas-con-proteina",
    portionLabel: "1/3 pieza",
    portionNumerator: 1,
    portionDenominator: 3,
    portionUnit: "pieza",
    grams: 31,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Aguacate | 1/3 pieza | ~31 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["avocado"],
  }),
  food({
    name: "Papaya picada",
    normalizedName: "papaya picada",
    groupId: "frutas",
    portionLabel: "1 taza",
    portionNumerator: 1,
    portionDenominator: null,
    portionUnit: "taza",
    grams: 140,
    isApproximate: true,
    sourcePage: 1,
    sourceText: "Papaya picada | 1 taza | ~140 g",
    validationStatus: "needs_review",
    notes: "Ejemplo del documento. Confirmar contra PDF.",
    aliases: ["papaya"],
  }),
];

export const SEED_CATALOG: FoodCatalog = {
  groups: GROUPS,
  foods: FOODS,
  version: "0.1.0-seed",
  extractedAt: new Date().toISOString(),
  sourceDocument: "docs/lista-alimentos-equivalentes.pdf (no disponible en repositorio)",
};

export function getGroup(id: string): FoodGroup | undefined {
  return groupById[id];
}

export function getGroups(): FoodGroup[] {
  return [...GROUPS].sort((a, b) => a.order - b.order);
}

export function getFoodsByGroup(groupId: string): FoodItem[] {
  return FOODS.filter((f) => f.groupId === groupId);
}

export function getFood(id: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === id);
}

export function getFoods(): FoodItem[] {
  return [...FOODS];
}
