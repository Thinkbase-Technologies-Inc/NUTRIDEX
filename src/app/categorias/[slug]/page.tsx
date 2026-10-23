import { notFound } from "next/navigation";
import { getGroups, getFoodsByGroup, getGroup } from "@/data/foods";
import { FoodCard } from "@/components/foods/FoodCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const groups = getGroups();
  const group = groups.find((g) => g.slug === slug);
  if (!group) notFound();

  const foods = getFoodsByGroup(group.id).sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-12">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Alimentos", href: "/alimentos" },
          { label: group.name, href: `/categorias/${group.slug}` },
        ]}
      />
      <header className="mt-6 mb-6">
        <div
          className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: `${group.colorToken}18`, color: group.colorToken }}
        >
          Categoría
        </div>
        <h1 className="text-[30px] font-bold tracking-tight text-nutridex-text-primary md:text-4xl">{group.name}</h1>
        <p className="mt-2 text-sm text-nutridex-text-secondary">
          {foods.length} alimento{foods.length !== 1 ? "s" : ""} en este grupo
        </p>
      </header>

      {foods.length === 0 ? (
        <p className="mt-8 text-sm text-nutridex-text-secondary">
          No hay alimentos registrados en esta categoría aún.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
