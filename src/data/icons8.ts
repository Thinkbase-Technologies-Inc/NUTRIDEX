/**
 * Curated Icons8 Fluency icons for NutriDex by ThinkBase.
 * High-definition, colorful, modern food and health icons directly from Icons8.
 */

export const ICONS8_FOOD_GROUPS: Record<string, string> = {
  verduras: "https://img.icons8.com/fluency/48/salad.png",
  frutas: "https://img.icons8.com/fluency/48/apple.png",
  "cereales-sin-grasa": "https://img.icons8.com/fluency/48/wheat.png",
  "cereales-con-grasa": "https://img.icons8.com/fluency/48/cookie.png",
  leguminosas: "https://img.icons8.com/fluency/48/soy.png",
  "proteina-muy-baja-grasa": "https://img.icons8.com/fluency/48/fish.png",
  "proteina-baja-grasa": "https://img.icons8.com/fluency/48/chicken.png",
  "proteina-moderada-grasa": "https://img.icons8.com/fluency/48/steak.png",
  "proteina-alta-grasa": "https://img.icons8.com/fluency/48/cheese.png",
  "leche-descremada": "https://img.icons8.com/fluency/48/milk-bottle.png",
  "leche-semidescremada": "https://img.icons8.com/fluency/48/milk-bottle.png",
  "leche-entera": "https://img.icons8.com/fluency/48/milk-bottle.png",
  "leche-con-azucar": "https://img.icons8.com/fluency/48/milk-bottle.png",
  "grasas-sin-proteina": "https://img.icons8.com/fluency/48/avocado.png",
  "grasas-con-proteina": "https://img.icons8.com/fluency/48/olive-oil.png",
  "azucar-sin-grasa": "https://img.icons8.com/fluency/48/candy.png",
  "azucar-con-grasa": "https://img.icons8.com/fluency/48/chocolate-bar.png",
};

export const ICONS8_MEALS: Record<string, string> = {
  Desayuno: "https://img.icons8.com/fluency/48/pancake.png",
  "Colación de media mañana": "https://img.icons8.com/fluency/48/strawberry.png",
  Comida: "https://img.icons8.com/fluency/48/bento.png",
  "Colación de la tarde": "https://img.icons8.com/fluency/48/coffee.png",
  Cena: "https://img.icons8.com/fluency/48/spaghetti.png",
};

export const ICONS8_METRICS = {
  calories: "https://img.icons8.com/fluency/48/fire-element.png",
  weight: "https://img.icons8.com/fluency/48/scale.png",
  meals: "https://img.icons8.com/fluency/48/dining-room.png",
  calculator: "https://img.icons8.com/fluency/48/calculator.png",
};

export function getGroupIcon(groupId: string): string {
  return ICONS8_FOOD_GROUPS[groupId] ?? "https://img.icons8.com/fluency/48/salad.png";
}

export function getMealIcon(mealName: string): string {
  return ICONS8_MEALS[mealName] ?? "https://img.icons8.com/fluency/48/dining-room.png";
}
