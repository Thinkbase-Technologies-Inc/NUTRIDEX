export type ThemeMode = "light" | "dark" | "system";

export type ValidationStatus = "verified" | "needs_review" | "incomplete";

export type FractionalNumber = {
  whole: number;
  numerator: number;
  denominator: number;
};

export type DecimalLike = number | FractionalNumber | null;

export interface FoodGroup {
  id: string;
  slug: string;
  name: string;
  colorToken: string;
  order: number;
}

export interface FoodItem {
  id: string;
  slug: string;
  name: string;
  normalizedName: string;
  aliases: string[];
  groupId: string;
  portionLabel: string;
  portionNumerator: number | null;
  portionDenominator: number | null;
  portionUnit: string | null;
  grams: number | null;
  isApproximate: boolean;
  sourcePage: number;
  sourceText: string;
  validationStatus: ValidationStatus;
  notes: string | null;
}

export interface FoodCatalog {
  groups: FoodGroup[];
  foods: FoodItem[];
  version: string;
  extractedAt: string;
  sourceDocument: string;
}

export interface MealFood {
  id: string;
  foodId: string;
  equivalents: number;
}

export interface Meal {
  id: string;
  name: string;
  foods: MealFood[];
}

export interface MealPlan {
  id: string;
  date: string;
  meals: Meal[];
  updatedAt: string;
}

export interface CalculationInput {
  foodId: string;
  equivalents: number;
}

export interface CalculationResult {
  food: FoodItem;
  equivalents: number;
  portionLabel: string;
  quantityLabel: string;
  grams: number | null;
  isApproximate: boolean;
  fraction: FractionalNumber | null;
}

export interface SwapPair {
  foodA: FoodItem;
  foodB: FoodItem;
  equivalents: number;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  onboardingCompleted: boolean;
  compactView: boolean;
}

export interface StoredBackup {
  version: string;
  exportedAt: string;
  favorites: string[];
  plans: MealPlan[];
  preferences: UserPreferences;
}
