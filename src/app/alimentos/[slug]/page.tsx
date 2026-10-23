import { notFound } from "next/navigation";
import { getFood, getGroups } from "@/data/foods";
import { FoodDetailClient } from "@/components/foods/FoodDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [];
}

export default async function FoodDetailPage({ params }: Props) {
  const { slug } = await params;
  // Try to find by slug or id
  const groups = getGroups();
  let food = getFood(slug);
  if (!food) {
    // Try matching by slug pattern
    const { getFoods } = await import("@/data/foods");
    food = getFoods().find((f) => f.slug === slug);
  }
  if (!food) notFound();

  return <FoodDetailClient foodId={food.id} />;
}
