"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Heart,
  Calculator,
  ArrowLeftRight,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useSearchStore } from "@/stores/useSearchStore";
import { useFoodsStore } from "@/stores/useFoodsStore";
import { getFoods, getGroups, getGroup } from "@/data/foods";
import { searchMatch, formatGrams } from "@/domain/calculation";
import { Icons8Img } from "@/components/ui/Icons8Img";
import { getGroupIcon } from "@/data/icons8";
import { NutriDexIcon } from "@/components/ui/NutriDexIcon";
import { useToast } from "@/components/ui/Toast";

const FOOD_PHOTOS: Record<string, string> = {
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
  "tortilla-de-maiz": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80",
  "avena-en-hojuela-cruda": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80",
  "pechuga-de-pollo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80",
  aguacate: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80",
  "papaya-picada": "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=400&q=80",
};

const DEFAULT_FOOD_PHOTO = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80";

const POPULAR_SEARCHES = [
  "Manzana",
  "Pechuga de pollo",
  "Aguacate",
  "Avena en hojuela cruda",
  "Tortilla de maíz",
  "Papaya picada",
];

const MAIN_CATEGORIES = [
  { id: "all", name: "Todos", iconGroup: "all" },
  { id: "frutas", name: "Frutas", iconGroup: "frutas" },
  { id: "verduras", name: "Verduras", iconGroup: "verduras" },
  { id: "cereales-sin-grasa", name: "Cereales", iconGroup: "cereales-sin-grasa" },
  { id: "leguminosas", name: "Leguminosas", iconGroup: "leguminosas" },
  { id: "proteina-baja-grasa", name: "Proteínas", iconGroup: "proteina-baja-grasa" },
  { id: "leche-descremada", name: "Lácteos", iconGroup: "leche-descremada" },
  { id: "grasas-sin-proteina", name: "Grasas", iconGroup: "grasas-sin-proteina" },
  { id: "azucar-sin-grasa", name: "Azúcares", iconGroup: "azucar-sin-grasa" },
];

export function FullscreenSearch() {
  const {
    isOpen,
    query,
    selectedGroup,
    closeSearch,
    setQuery,
    setSelectedGroup,
    clearQuery,
    openSearch,
  } = useSearchStore();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { favorites, toggleFavorite } = useFoodsStore();
  const { showToast } = useToast();

  const allFoods = useMemo(() => getFoods(), []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      } else if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Filter foods based on query and selected group
  const filteredFoods = useMemo(() => {
    let result = allFoods;

    if (selectedGroup !== "all") {
      result = result.filter((f) => {
        if (selectedGroup === "proteina-baja-grasa") {
          return f.groupId.startsWith("proteina");
        }
        if (selectedGroup === "cereales-sin-grasa") {
          return f.groupId.startsWith("cereales");
        }
        if (selectedGroup === "leche-descremada") {
          return f.groupId.startsWith("leche");
        }
        if (selectedGroup === "grasas-sin-proteina") {
          return f.groupId.startsWith("grasas");
        }
        if (selectedGroup === "azucar-sin-grasa") {
          return f.groupId.startsWith("azucar");
        }
        return f.groupId === selectedGroup;
      });
    }

    if (query.trim()) {
      result = result.filter((f) => searchMatch(f, query.trim()));
    }

    return result;
  }, [allFoods, query, selectedGroup]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-black/80 backdrop-blur-xl animate__animated animate__fadeIn animate__faster"
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda interactiva de alimentos en pantalla completa"
    >
      {/* Top Search Controls Container */}
      <div className="w-full border-b border-white/10 bg-nutridex-surface/95 dark:bg-[#121914]/95 shadow-xl transition-all">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 md:px-8">
          {/* Top Brand & Close Bar */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <NutriDexIcon size={26} glow={false} />
              <span className="text-xs sm:text-sm font-extrabold text-nutridex-text-primary tracking-tight">
                NutriDex Search
              </span>
              <span className="hidden sm:inline-block rounded-md bg-nutridex-primary-soft px-2 py-0.5 text-xs font-bold text-nutridex-primary">
                Spotlight Grid
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block rounded-lg border border-nutridex-border bg-nutridex-surface-muted px-2 py-1 text-xs font-semibold text-nutridex-text-secondary">
                ESC para salir
              </span>
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Cerrar búsqueda"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-border transition-colors shadow-2xs"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Large Search Input */}
          <div className="relative flex items-center rounded-2xl border-2 border-nutridex-primary/40 bg-nutridex-surface px-4 py-3 shadow-inner focus-within:border-nutridex-primary focus-within:ring-4 focus-within:ring-nutridex-primary/15 transition-all">
            <Search className="h-6 w-6 shrink-0 text-nutridex-primary mr-3" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por alimento, grupo o porción (ej. manzana, avena, pollo)..."
              className="w-full bg-transparent text-base sm:text-xl font-bold text-nutridex-text-primary placeholder:text-nutridex-text-secondary/70 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar texto"
                className="p-1 rounded-full text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors mr-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <span className="rounded-full bg-nutridex-surface-muted px-3 py-1 text-xs font-bold text-nutridex-text-secondary shrink-0 hidden sm:inline-block">
              {filteredFoods.length} {filteredFoods.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          {/* Category Filter Pills with Icons8 Icons */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {MAIN_CATEGORIES.map((cat) => {
              const active = selectedGroup === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedGroup(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all active:scale-95 shadow-2xs ${
                    active
                      ? "bg-nutridex-primary text-white shadow-xs"
                      : "bg-nutridex-surface border border-nutridex-border text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted"
                  }`}
                >
                  {cat.iconGroup !== "all" && (
                    <Icons8Img src={getGroupIcon(cat.iconGroup)} alt={cat.name} size={15} />
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Grid Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          {/* Quick Popular Searches if query is empty */}
          {!query && (
            <div className="mb-6 rounded-2xl bg-nutridex-surface/90 border border-nutridex-border p-4 shadow-sm animate__animated animate__fadeIn">
              <span className="text-xs font-bold text-nutridex-text-secondary flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-nutridex-cyan" />
                Búsquedas populares sugeridas:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full bg-nutridex-surface-muted border border-nutridex-border/80 px-3 py-1 text-xs font-bold text-nutridex-text-primary hover:border-nutridex-primary hover:text-nutridex-primary transition-colors active:scale-95 shadow-2xs"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid (Cuadriculados muy pro) */}
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate__animated animate__fadeInUp animate__faster">
              {filteredFoods.map((food) => {
                const group = getGroup(food.groupId);
                const isFav = favorites.includes(food.id);
                const photo = FOOD_PHOTOS[food.id] ?? DEFAULT_FOOD_PHOTO;
                const gramsLabel = formatGrams(food.grams);

                return (
                  <div
                    key={food.id}
                    className="nx-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-nutridex-primary/40 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                        <img
                          src={photo}
                          alt={food.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Icons8 Group Pill */}
                        {group && (
                          <div className="absolute top-2.5 left-2.5">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs"
                              style={{ backgroundColor: `${group.colorToken}E6` }}
                            >
                              <Icons8Img src={getGroupIcon(group.id)} alt={group.name} size={15} />
                              <span className="truncate max-w-[110px]">{group.name}</span>
                            </span>
                          </div>
                        )}

                        {/* Favorite Heart Button */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleFavorite(food.id);
                            showToast({
                              type: "success",
                              title: isFav ? "Eliminado de favoritos" : "Guardado en favoritos",
                              description: food.name,
                              duration: 2000,
                            });
                          }}
                          aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                          className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                            isFav ? "bg-rose-500 text-white shadow-xs" : "bg-black/40 text-white hover:bg-black/60"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
                        </button>

                        {/* Portion Label on Photo */}
                        <div className="absolute bottom-2 inset-x-3 flex items-baseline justify-between text-white">
                          <span className="text-xs font-extrabold drop-shadow-sm truncate">
                            {food.portionLabel}
                          </span>
                          {gramsLabel && (
                            <span className="text-xs font-semibold text-white/90 drop-shadow-sm shrink-0">
                              {food.isApproximate && "≈ "}{gramsLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <Link
                          href={`/alimentos/${food.slug}`}
                          onClick={closeSearch}
                          className="block text-base font-extrabold text-nutridex-text-primary group-hover:text-nutridex-primary transition-colors line-clamp-1"
                        >
                          {food.name}
                        </Link>
                        <p className="mt-1 text-xs text-nutridex-text-secondary line-clamp-1">
                          1 equivalente de {group?.name ?? "su grupo"}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Toolbar */}
                    <div className="p-3 pt-0 border-t border-nutridex-border/50 flex items-center justify-between gap-1.5 mt-2">
                      <Link
                        href={`/calculadora?food=${food.slug}`}
                        onClick={closeSearch}
                        title="Calcular porción"
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-nutridex-surface-muted py-2 text-xs font-bold text-nutridex-text-secondary hover:text-nutridex-primary hover:bg-nutridex-primary-soft transition-colors"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>Calcular</span>
                      </Link>

                      <Link
                        href={`/comparador?a=${food.id}`}
                        onClick={closeSearch}
                        title="Comparar sustituto"
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-nutridex-surface-muted py-2 text-xs font-bold text-nutridex-text-secondary hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        <span>Sustituir</span>
                      </Link>

                      <Link
                        href={`/alimentos/${food.slug}`}
                        onClick={closeSearch}
                        title="Ver alimento"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-dock text-white hover:bg-black transition-colors shrink-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 nx-card p-8 animate__animated animate__fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-nutridex-surface-muted text-nutridex-text-secondary">
                <Search className="h-8 w-8 text-nutridex-text-secondary/60" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-nutridex-text-primary">
                  No encontramos alimentos para &quot;{query}&quot;
                </h3>
                <p className="text-xs text-nutridex-text-secondary max-w-sm mx-auto">
                  Prueba buscando por términos generales como manzana, cereal, tortilla o selecciona otro grupo.
                </p>
              </div>
              <button
                type="button"
                onClick={clearQuery}
                className="inline-flex items-center gap-2 rounded-2xl bg-nutridex-primary px-4 py-2 text-xs font-bold text-white hover:bg-nutridex-primary-hover transition-colors shadow-xs"
              >
                <span>Mostrar todos los alimentos</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
