"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Bell,
  Plus,
  Heart,
  ChevronRight,
  TrendingDown,
  Target,
  Coffee,
  Sun,
  Moon,
  Sparkles,
  ArrowUpRight,
  Calculator,
  ArrowLeftRight,
  CalendarDays,
  UtensilsCrossed,
  Sprout,
  Wheat,
  Beef,
  Milk,
  Salad,
  Cookie,
  Flame,
} from "lucide-react";
import { getFoods, getGroups } from "@/data/foods";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { getGroupIcon, ICONS8_MEALS, ICONS8_METRICS } from "@/data/icons8";

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
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

const WEEKLY_DATA = [
  { day: "Lun", value: 65, active: false },
  { day: "Mar", value: 45, active: false },
  { day: "Mié", value: 80, active: false },
  { day: "Jue", value: 55, active: false },
  { day: "Vie", value: 95, active: true, amount: "12 eq" },
  { day: "Sáb", value: 70, active: false },
  { day: "Dom", value: 60, active: false },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const { openSearch } = useSearchStore();
  const foods = getFoods();
  const groups = getGroups();
  const { favorites, toggleFavorite } = useFoodsStore();
  const { user, isAuthenticated, openAuthModal, openAvatarModal } = useAuthStore();

  const firstName = user ? user.name.split(" ")[0] : "Invitado";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 space-y-7 animate__animated animate__fadeIn">
      {/* Mobile Top Greeting Bar (from Image 1) */}
      <div className="flex md:hidden items-center justify-between">
        {isAuthenticated && user ? (
          <Link href="/configuracion" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-xs">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-nutridex-text-secondary">Hola, {firstName}</span>
              <p className="text-sm font-extrabold text-nutridex-text-primary">Bienvenido de nuevo</p>
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-nutridex-primary text-white font-bold shadow-xs">
              +
            </div>
            <div>
              <span className="text-xs font-semibold text-nutridex-text-secondary">Bienvenido a NutriDex</span>
              <p className="text-sm font-extrabold text-nutridex-primary">Iniciar sesión</p>
            </div>
          </button>
        )}
        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>
      </div>

      {/* Main Headline & Search (matching Image 1) */}
      <section className="space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-nutridex-text-primary leading-[1.15]">
          Ideas nutritivas para hoy
        </h1>

        {/* Search Bar with filter toggle icon (Triggers Fullscreen Spotlight) */}
        <div className="flex items-center gap-2 max-w-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary group-focus-within:text-nutridex-primary transition-colors pointer-events-none" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => openSearch(search)}
              onFocus={() => openSearch(search)}
              placeholder="Buscar recetas, alimentos, porciones..."
              className="w-full cursor-pointer rounded-2xl border border-nutridex-border bg-nutridex-surface py-3 pl-10 pr-14 text-xs sm:text-sm font-medium text-nutridex-text-primary placeholder:text-nutridex-text-secondary hover:border-nutridex-primary/50 focus:border-nutridex-primary focus:outline-none focus:ring-1 focus:ring-nutridex-primary shadow-xs transition-colors"
            />
            <button
              type="button"
              onClick={() => openSearch(search)}
              aria-label="Abrir buscador inteligente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-xl bg-nutridex-surface-muted border border-nutridex-border px-2 py-1 text-xs font-bold text-nutridex-text-secondary hover:text-nutridex-primary hover:border-nutridex-primary transition-colors"
            >
              <span className="hidden sm:inline">⌘K</span>
              <span className="sm:hidden text-xs">Buscar</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => openSearch(search)}
            aria-label="Filtros del catálogo"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-nutridex-border bg-nutridex-surface text-nutridex-text-primary hover:bg-nutridex-surface-muted hover:border-nutridex-primary transition-colors shadow-xs"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Featured Meal Card (Light Mint green card from Image 1) */}
      <section className="rounded-3xl border border-nutridex-mint bg-nutridex-mint/80 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs shrink-0">
              <Icons8Img src={ICONS8_MEALS["Desayuno"]} alt="Desayuno" size={30} />
            </span>
            <div>
              <span className="text-base font-bold text-nutridex-text-primary">Desayuno recomendado</span>
              <p className="text-xs text-nutridex-mint-text font-semibold">1 porción de fruta + 1 cereal</p>
            </div>
          </div>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-nutridex-text-primary shadow-xs">
            2 equiv.
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-nutridex-primary/10 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-nutridex-text-primary">
              Avena en hojuela cruda con Manzana
            </h3>
            <p className="text-xs text-nutridex-text-secondary">
              1/3 taza de avena (30 g) + 1 pieza de manzana (≈ 106 g)
            </p>
          </div>

          <Link
            href="/calculadora?food=avena-en-hojuela-cruda"
            aria-label="Calcular porción de avena"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-nutridex-primary shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Grid: Food Ideas & Weekly Progress (Desktop 2 cols, Mobile stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Food Ideas Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
              Alimentos clave para hoy
            </h2>
            <Link
              href="/alimentos"
              className="text-xs font-semibold text-nutridex-primary hover:underline flex items-center gap-0.5"
            >
              <span>Ver catálogo</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Cards with photography from Image 1 */}
          <div className="space-y-3">
            {/* Card 1: Smoothie Bowl / Fruit */}
            <div className="nx-card p-4 flex items-center justify-between gap-4 transition-all hover:border-nutridex-primary/30 hover:shadow-md">
              <div className="space-y-1.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleFavorite("manzana")}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-rose-500"
                >
                  <Heart className={`h-3.5 w-3.5 ${favorites.includes("manzana") ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
                <h3 className="text-sm sm:text-base font-bold text-nutridex-text-primary truncate">
                  Manzana y Frutas Frescas
                </h3>
                <p className="text-xs text-nutridex-text-secondary">
                  1 pieza (≈ 106 g) · 1 equiv Frutas
                </p>
                <div className="pt-2">
                  <Link
                    href="/alimentos/manzana"
                    className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-dock px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    <span>Calcular</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=300&q=80"
                  alt="Frutas y Avena"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Card 2: Pechuga de Pollo & Salad */}
            <div className="nx-card p-4 flex items-center justify-between gap-4 transition-all hover:border-nutridex-primary/30 hover:shadow-md">
              <div className="space-y-1.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleFavorite("pechuga-de-pollo")}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-rose-500"
                >
                  <Heart className={`h-3.5 w-3.5 ${favorites.includes("pechuga-de-pollo") ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
                <h3 className="text-sm sm:text-base font-bold text-nutridex-text-primary truncate">
                  Pechuga de Pollo Asada
                </h3>
                <p className="text-xs text-nutridex-text-secondary">
                  30 gramos (≈ 30 g) · 1 equiv Proteína
                </p>
                <div className="pt-2">
                  <Link
                    href="/alimentos/pechuga-de-pollo"
                    className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-dock px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    <span>Calcular</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
                  alt="Pechuga y Ensalada"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Card 3: Aguacate */}
            <div className="nx-card p-4 flex items-center justify-between gap-4 transition-all hover:border-nutridex-primary/30 hover:shadow-md">
              <div className="space-y-1.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleFavorite("aguacate")}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-rose-500"
                >
                  <Heart className={`h-3.5 w-3.5 ${favorites.includes("aguacate") ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
                <h3 className="text-sm sm:text-base font-bold text-nutridex-text-primary truncate">
                  Aguacate Hass
                </h3>
                <p className="text-xs text-nutridex-text-secondary">
                  1/3 pieza (≈ 31 g) · 1 equiv Grasas
                </p>
                <div className="pt-2">
                  <Link
                    href="/alimentos/aguacate"
                    className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-dock px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    <span>Calcular</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80"
                  alt="Aguacate"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Weekly Analytics (from Image 1 & 2) (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
              Tu progreso semanal
            </h2>
            <Link
              href="/mi-plan/semana"
              className="text-xs font-semibold text-nutridex-primary hover:underline"
            >
              Detalle
            </Link>
          </div>

          <div className="nx-card p-5 space-y-5">
            {/* Top Donut / Percentage Meter */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-nutridex-text-secondary uppercase tracking-wider block">
                  Porciones de hoy
                </span>
                <span className="text-2xl font-extrabold text-nutridex-text-primary">
                  8 / 14 <span className="text-sm font-semibold text-nutridex-text-secondary">equiv.</span>
                </span>
              </div>

              {/* Circular SVG Donut */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-nutridex-border"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-nutridex-primary"
                    strokeDasharray="57, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-nutridex-text-primary">57%</span>
              </div>
            </div>

            {/* Pastel badges (Mint & Peach from Image 1) with Icons8 fluency icons */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-nutridex-mint/70 p-3 border border-nutridex-mint">
                <div className="flex items-center gap-1.5 text-nutridex-mint-text text-xs font-bold">
                  <Icons8Img src={ICONS8_METRICS.calories} alt="Consumidos" size={16} />
                  <span>Consumidos</span>
                </div>
                <p className="mt-1 text-lg font-extrabold text-nutridex-mint-text">8 equiv.</p>
              </div>

              <div className="rounded-2xl bg-nutridex-peach/70 p-3 border border-nutridex-peach">
                <div className="flex items-center gap-1.5 text-nutridex-peach-text text-xs font-bold">
                  <Icons8Img src={ICONS8_METRICS.meals} alt="Meta diaria" size={16} />
                  <span>Meta diaria</span>
                </div>
                <p className="mt-1 text-lg font-extrabold text-nutridex-peach-text">14 equiv.</p>
              </div>
            </div>

            {/* Weekly Bar Chart (from Image 1) */}
            <div className="pt-2 border-t border-nutridex-border/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-nutridex-text-primary">Equivalentes por día</span>
                <span className="text-xs text-nutridex-text-secondary">Esta semana</span>
              </div>

              <div className="flex items-end justify-between gap-2 h-28 pt-4">
                {WEEKLY_DATA.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    {item.active && (
                      <span className="rounded-full bg-nutridex-dock text-white text-xs font-bold px-1.5 py-0.5 shadow-xs mb-1">
                        {item.amount}
                      </span>
                    )}
                    <div className="w-full max-w-[20px] bg-nutridex-surface-muted rounded-full overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-full transition-all ${
                          item.active ? "bg-nutridex-primary" : "bg-nutridex-border/80"
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${item.active ? "text-nutridex-primary" : "text-nutridex-text-secondary"}`}>
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action button to meal planner */}
            <Link
              href="/mi-plan"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-nutridex-primary py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover transition-colors shadow-xs"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Abrir planificador completo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 17 Food Groups Catalog Grid */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-nutridex-text-primary">
              Grupos de alimentos equivalentes
            </h2>
            <p className="text-xs text-nutridex-text-secondary">
              Clasificación oficial según el Sistema de Alimentos Equivalentes
            </p>
          </div>
          <Link
            href="/alimentos"
            className="text-xs font-semibold text-nutridex-primary hover:underline"
          >
            Explorar todos
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {groups.slice(0, 8).map((group) => {
            return (
              <Link
                key={group.id}
                href={`/categorias/${group.slug}`}
                className="nx-card p-3 flex items-center gap-3 transition-all hover:border-nutridex-primary/40 hover:-translate-y-0.5 shadow-xs"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 p-1.5 shadow-2xs"
                  style={{ backgroundColor: `${group.colorToken}15` }}
                >
                  <Icons8Img src={getGroupIcon(group.id)} alt={group.name} size={28} />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-nutridex-text-primary truncate">
                    {group.name}
                  </span>
                  <span className="text-xs text-nutridex-text-secondary block">
                    Equivalente
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
