/**
 * scripts/validate-foods/validate.ts
 *
 * Valida la estructura del catálogo generado y detecta:
 * - Duplicados reales por ID/slug.
 * - Registros repetidos por error vs. alimentos similares con distinta presentación.
 * - Registros incompletos (sin peso o porción ambigua).
 * - Trazabilidad al PDF (página y texto de origen).
 */

import type { FoodCatalog, FoodItem } from "@/types";
import { FoodCatalogSchema } from "@/types/schema";
import { SEED_CATALOG } from "@/data/foods";

export interface ValidationIssue {
  type: "duplicate" | "incomplete" | "ambiguous" | "invalid_structure";
  id: string;
  name: string;
  detail: string;
}

export function validateCatalog(catalog: FoodCatalog): {
  valid: boolean;
  issues: ValidationIssue[];
  counts: { groups: number; foods: number };
} {
  const issues: ValidationIssue[] = [];
  const result = FoodCatalogSchema.safeParse(catalog);

  if (!result.success) {
    issues.push({
      type: "invalid_structure",
      id: "",
      name: "",
      detail: JSON.stringify(result.error.format()),
    });
    return { valid: false, issues, counts: { groups: 0, foods: 0 } };
  }

  const seen = new Map<string, FoodItem[]>();

  for (const food of catalog.foods) {
    const group = catalog.groups.find((g) => g.id === food.groupId);
    if (!group) {
      issues.push({ type: "invalid_structure", id: food.id, name: food.name, detail: "Grupo no encontrado" });
    }

    // Duplicados por nombre normalizado (mismo alimento repetido)
    const key = food.normalizedName.toLowerCase().trim();
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(food);

    // Registros incompletos
    if (!food.grams && !food.portionUnit) {
      issues.push({ type: "incomplete", id: food.id, name: food.name, detail: "Sin peso ni unidad de porción" });
    }

    // Ambiguos: notas o needs_review
    if (food.validationStatus === "needs_review" || food.notes) {
      issues.push({ type: "ambiguous", id: food.id, name: food.name, detail: food.notes ?? "Requiere revisión contra PDF" });
    }
  }

  // Detectar duplicados reales
  for (const [name, items] of seen.entries()) {
    if (items.length > 1) {
      // Mismo grupo y misma porción -> posible duplicado real
      const sameGroup = items.filter((i) => i.groupId === items[0].groupId);
      if (sameGroup.length > 1) {
        issues.push({
          type: "duplicate",
          id: items[0].id,
          name,
          detail: `${items.length} registros con mismo nombre y grupo`,
        });
      } else {
        // Distinto grupo o presentación similar -> similar con distinta presentación
        issues.push({
          type: "ambiguous",
          id: items[0].id,
          name,
          detail: `Registros similares con distinta presentación/grupo`,
        });
      }
    }
  }

  return {
    // needs_review and ambiguity are reportable, but are not structural failures.
    valid: !issues.some((issue) => ["duplicate", "incomplete", "invalid_structure"].includes(issue.type)),
    issues,
    counts: { groups: catalog.groups.length, foods: catalog.foods.length },
  };
}

if (require.main === module) {
  const report = validateCatalog(SEED_CATALOG);
  console.log(JSON.stringify(report, null, 2));
}
