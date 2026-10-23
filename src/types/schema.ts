import z from "zod";

export const ValidationStatusSchema = z.enum([
  "verified",
  "needs_review",
  "incomplete",
]);

export const FoodGroupSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  colorToken: z.string().min(1),
  order: z.number().int().nonnegative(),
});

export const FoodItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  normalizedName: z.string().min(1),
  aliases: z.array(z.string()),
  groupId: z.string().min(1),
  portionLabel: z.string().min(1),
  portionNumerator: z.number().int().nonnegative().nullable(),
  portionDenominator: z.number().int().positive().nullable(),
  portionUnit: z.string().nullable(),
  grams: z.number().nonnegative().nullable(),
  isApproximate: z.boolean(),
  sourcePage: z.number().int().nonnegative(),
  sourceText: z.string(),
  validationStatus: ValidationStatusSchema,
  notes: z.string().nullable(),
});

export const FoodCatalogSchema = z.object({
  groups: z.array(FoodGroupSchema),
  foods: z.array(FoodItemSchema),
  version: z.string(),
  extractedAt: z.string(),
  sourceDocument: z.string(),
});

export const MealFoodSchema = z.object({
  id: z.string().min(1),
  foodId: z.string().min(1),
  equivalents: z.number().positive(),
});

export const MealSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  foods: z.array(MealFoodSchema),
});

export const MealPlanSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  meals: z.array(MealSchema),
  updatedAt: z.string(),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string().min(1),
  onboardingCompleted: z.boolean(),
  compactView: z.boolean(),
});

export const StoredBackupSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  favorites: z.array(z.string()),
  plans: z.array(MealPlanSchema),
  preferences: UserPreferencesSchema,
});

export type StoredBackup = z.infer<typeof StoredBackupSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;

export const EquivalentsInputSchema = z
  .object({
    equivalents: z
      .string()
      .min(1, "La cantidad es requerida")
      .refine((val) => {
        const n = Number(val);
        return !isNaN(n) && n > 0 && n <= 100;
      }, "Ingresa un valor válido entre 0.1 y 100"),
  })
  .refine((data) => {
    const n = Number(data.equivalents);
    return Number.isFinite(n) && n > 0;
  }, "Valor no válido");
