import Link from "next/link";
import {
  Search,
  Calculator,
  ArrowLeftRight,
  CalendarDays,
  Heart,
  Sprout,
  Wheat,
  Beef,
  Milk,
  Salad,
  Cookie,
  Flame,
} from "lucide-react";
import { NutriDexLogo } from "@/components/ui/Logo";
import { FoodSearchInput } from "@/components/foods/FoodSearchInput";
import { FoodGroupCard } from "@/components/foods/FoodGroupCard";
import { getGroups } from "@/data/foods";

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  verduras: Salad,
  frutas: Sprout,
  "cereales-sin-grasa": Wheat,
  "cereales-con-grasa": Cookie,
  leguminosas: Sprout,
  "proteina-muy-baja-grasa": Beef,
  "proteina-baja-grasa": Beef,
  "proteina-moderada-grasa": Beef,
  "proteina-alta-grasa": Beef,
  "leche-descremada": Milk,
  "leche-semidescremada": Milk,
  "leche-entera": Milk,
  "leche-con-azucar": Milk,
  "grasas-sin-proteina": Flame,
  "grasas-con-proteina": Flame,
  "azucar-sin-grasa": Cookie,
  "azucar-con-grasa": Cookie,
};

const QUICK_ACTIONS = [
  {
    label: "Explorar alimentos",
    description: "Busca y consulta porciones del catálogo",
    href: "/alimentos",
    icon: Search,
  },
  {
    label: "Calcular porciones",
    description: "Calcula equivalentes al instante",
    href: "/calculadora",
    icon: Calculator,
  },
  {
    label: "Comparar equivalencias",
    description: "Compara alimentos del mismo grupo",
    href: "/comparador",
    icon: ArrowLeftRight,
  },
  {
    label: "Mi plan alimenticio",
    description: "Organiza tus comidas de la semana",
    href: "/mi-plan",
    icon: CalendarDays,
  },
];

export default function HomePage() {
  const groups = getGroups();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:hidden">
          <NutriDexLogo size={32} />
          <span className="text-base font-semibold">NutriDex</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <NutriDexLogo size={28} />
          <span className="text-sm font-medium text-nutridex-text-secondary">NutriDex</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mt-8 md:mt-14">
        <h1 className="text-[32px] md:text-[44px] font-bold leading-tight tracking-tight text-nutridex-text-primary">
          Conoce tus alimentos.
          <br />
          Simplifica tus porciones.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-nutridex-text-secondary">
          Descubre equivalencias alimenticias, calcula cantidades y organiza tus comidas fácilmente.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/alimentos"
            className="inline-flex items-center gap-2 rounded-xl bg-nutridex-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Explorar alimentos
          </Link>
          <Link
            href="/calculadora"
            className="inline-flex items-center gap-2 rounded-xl border border-nutridex-border bg-nutridex-surface px-5 py-3 text-sm font-semibold text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Calcular equivalencias
          </Link>
        </div>
      </section>

      {/* Buscador */}
      <section className="mt-10">
        <FoodSearchInput />
      </section>

      {/* Acciones rápidas */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Acciones rápidas</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start gap-3 rounded-xl border border-nutridex-border bg-nutridex-surface p-4 transition-all duration-150 hover:shadow-sm hover:border-nutridex-primary/30 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nutridex-primary-soft">
                  <Icon className="h-4 w-4 text-nutridex-primary" aria-hidden />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-nutridex-text-primary">{action.label}</span>
                  <span className="mt-0.5 block text-xs text-nutridex-text-secondary">{action.description}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categorías */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-nutridex-text-primary">Explora por categoría</h2>
          <Link href="/alimentos" className="text-sm font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded">
            Ver todo
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {groups.map((group) => (
            <FoodGroupCard key={group.id} group={group} icon={GROUP_ICONS[group.id] ?? Sprout} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-16 rounded-xl border border-nutridex-border bg-nutridex-surface-muted p-4">
        <p className="text-xs leading-relaxed text-nutridex-text-secondary">
          NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. No sustituye una
          valoración individual realizada por un profesional de la nutrición.
        </p>
        <Link href="/acerca-de" className="mt-2 inline-block text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 rounded">
          Acerca de NutriDex
        </Link>
      </section>
    </div>
  );
}
