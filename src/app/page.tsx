import Link from "next/link";
import {
  Search,
  Calculator,
  ArrowLeftRight,
  CalendarDays,
  Sprout,
  Wheat,
  Beef,
  Milk,
  Salad,
  Cookie,
  Flame,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { NutriDexLogo } from "@/components/ui/Logo";
import { FoodSearchInput } from "@/components/foods/FoodSearchInput";
import { FoodGroupCard } from "@/components/foods/FoodGroupCard";
import { HomeContinuePlan } from "@/components/foods/HomeContinuePlan";
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
    description: "Busca por nombre o grupo",
    href: "/alimentos",
    icon: Search,
    tile: "bg-[#e8f3e2] dark:bg-[#1e3320]",
    tint: "text-[#2e7d32] dark:text-[#8fe095]",
  },
  {
    label: "Calcular porciones",
    description: "Equivalentes al instante",
    href: "/calculadora",
    icon: Calculator,
    tile: "bg-[#fdeee2] dark:bg-[#352519]",
    tint: "text-[#c26a1f] dark:text-[#f0b27a]",
  },
  {
    label: "Comparar",
    description: "Mismo grupo, misma porción",
    href: "/comparador",
    icon: ArrowLeftRight,
    tile: "bg-[#e6f0fb] dark:bg-[#1a2a3c]",
    tint: "text-[#2a6bb5] dark:text-[#8fc0f2]",
  },
  {
    label: "Mi plan",
    description: "Organiza tu semana",
    href: "/mi-plan",
    icon: CalendarDays,
    tile: "bg-[#efe9fb] dark:bg-[#292138]",
    tint: "text-[#6b4bb5] dark:text-[#c3aef2]",
  },
];

export default function HomePage() {
  const groups = getGroups();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-7 md:px-10 md:py-10">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:hidden">
          <NutriDexLogo size={38} />
          <div>
            <p className="text-[11px] font-medium text-nutridex-text-secondary">Bienvenido a</p>
            <p className="text-sm font-semibold text-nutridex-text-primary">NutriDex</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-full border border-nutridex-border bg-nutridex-surface px-3 py-1.5 text-xs font-medium text-nutridex-text-secondary">
            HealthTech · Food Intelligence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/configuracion"
            aria-label="Abrir configuración"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary transition-colors hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            <Settings className="h-[18px] w-[18px]" aria-hidden />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mt-8 md:mt-12">
        <p className="text-sm font-medium text-nutridex-primary">Equivalencias claras. Nutrición inteligente.</p>
        <h1 className="mt-3 max-w-2xl text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-nutridex-text-primary md:text-[52px]">
          Conoce tus alimentos.
          <br />
          <span className="text-nutridex-primary">Simplifica tus porciones.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-nutridex-text-secondary">
          Descubre equivalencias alimenticias, calcula cantidades y organiza tus comidas fácilmente.
        </p>
      </section>

      {/* Buscador */}
      <section className="mt-7 max-w-2xl">
        <FoodSearchInput />
      </section>

      {/* Acciones rápidas */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-nutridex-text-primary">Accesos rápidos</h2>
          <Link
            href="/alimentos"
            className="inline-flex items-center gap-1 text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Ver catálogo <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="nx-card group flex flex-col p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_46px_-28px_rgba(24,62,26,0.55)] focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.tile}`}>
                  <Icon className={`h-5 w-5 ${action.tint}`} aria-hidden />
                </span>
                <span className="mt-4 text-sm font-semibold leading-snug text-nutridex-text-primary">
                  {action.label}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-nutridex-text-secondary">
                  {action.description}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <HomeContinuePlan />

      {/* Categorías */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-nutridex-text-primary">Explora por categoría</h2>
            <p className="mt-1 text-sm text-nutridex-text-secondary">Los 17 grupos alimenticios de la tabla</p>
          </div>
          <Link
            href="/alimentos"
            className="inline-flex items-center gap-1 text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Ver todo <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <FoodGroupCard key={group.id} group={group} icon={GROUP_ICONS[group.id] ?? Sprout} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 rounded-2xl border border-nutridex-border bg-nutridex-surface/70 p-4">
        <p className="text-xs leading-relaxed text-nutridex-text-secondary">
          NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. No sustituye una
          valoración individual realizada por un profesional de la nutrición.
        </p>
        <Link
          href="/acerca-de"
          className="mt-2 inline-block text-xs font-medium text-nutridex-primary hover:underline focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          Acerca de NutriDex
        </Link>
      </section>
    </div>
  );
}
