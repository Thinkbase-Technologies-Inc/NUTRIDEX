import { notFound } from "next/navigation";
import { getFood, getGroup, getGroups } from "@/data/foods";
import { FoodDetailClient } from "@/components/foods/FoodDetailClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [];
}

export default async function FoodDetailPage({ params }: Props) {
  const { slug } = await params;
  const food = getFood(slug);
  if (!food) notFound();

  const groups = getGroups();
  const group = food.groupId ? getGroup(food.groupId) : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-10 md:py-12">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Alimentos", href: "/alimentos" },
          ...(group ? [{ label: group.name, href: `/categorias/${group.slug}` }] : []),
          { label: food.name, href: `/alimentos/${food.slug}` },
        ]}
      />
      <FoodDetailClient foodId={food.id} />
    </div>
  );
}
