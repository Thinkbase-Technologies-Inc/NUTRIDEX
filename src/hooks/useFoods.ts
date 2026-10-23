/**
 * src/hooks/useFoods.ts
 */

import { useCallback } from "react";
import type { FoodItem, FoodGroup } from "@/types";
import { getFoods, getGroups, getFood, getFoodsByGroup, getGroup } from "@/data/foods";
import { searchMatch } from "@/domain/calculation";

export function useFoods() {
  const foods = getFoods();
  const groups = getGroups();

  const search = useCallback((query: string): FoodItem[] => {
    if (!query.trim()) return foods;
    return foods.filter((f) => searchMatch(f, query));
  }, [foods]);

  const filterByGroup = useCallback((groupId: string): FoodItem[] => {
    return getFoodsByGroup(groupId);
  }, []);

  const getGroupById = useCallback((id: string): FoodGroup | undefined => {
    return getGroup(id);
  }, []);

  const findFood = useCallback((id: string): FoodItem | undefined => {
    return getFood(id);
  }, []);

  return { foods, groups, search, filterByGroup, getGroupById, findFood };
}
