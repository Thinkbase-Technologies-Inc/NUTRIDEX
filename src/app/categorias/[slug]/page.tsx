import { notFound } from "next/navigation";
import { getGroups, getFoodsByGroup } from "@/data/foods";
import { FoodCard } from "@/components/foods/FoodCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Package } from "lucide-react";
import Link from "next/link";

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
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Catálogo", href: "/alimentos" },
          { label: group.name, href: `/categorias/${group.slug}` },
        ]}
      />

      <header className="mt-4 pb-4 border-b border-nutridex-border/60">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: group.colorToken }}
            aria-hidden
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-nutridex-text-primary">
            {group.name}
          </h1>
        </div>
        <p className="mt-1 text-sm text-nutridex-text-secondary">
          {foods.length > 0
            ? `${foods.length} alimento${foods.length !== 1 ? "s" : ""} registrado${foods.length !== 1 ? "s" : ""} en este grupo equivalente`
            : "Grupo alimenticio en proceso de digitalización"}
        </p>
      </header>

      {foods.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-nutridex-border p-8 text-center max-w-md mx-auto">
          <Package className="h-8 w-8 text-nutridex-text-secondary/60 mx-auto" aria-hidden />
          <h2 className="mt-3 text-sm font-semibold text-nutridex-text-primary">
            Sin alimentos cargados aún
          </h2>
          <p className="mt-1 text-xs text-nutridex-text-secondary">
            Este grupo está definido según el documento técnico y se incorporará en la próxima actualización de datos.
          </p>
          <Link
            href="/alimentos"
            className="mt-4 inline-flex items-center rounded-xl bg-nutridex-primary px-4 py-2 text-xs font-semibold text-white hover:bg-nutridex-primary-hover transition-colors"
          >
            Ver catálogo disponible
          </Link>
        </div>
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
