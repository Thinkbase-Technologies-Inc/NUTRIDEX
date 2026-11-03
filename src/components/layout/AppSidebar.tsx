"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  LayoutGrid,
  Calculator,
  ArrowLeftRight,
  Heart,
  CalendarRange,
  Info,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  ChefHat,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";
import { NutriDexIcon } from "@/components/ui/NutriDexIcon";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/Toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const DASHBOARD_ITEMS: NavItem[] = [
  { label: "Overview", href: "/", icon: Home },
  { label: "Meal Planner", href: "/mi-plan", icon: CalendarDays },
  { label: "Progreso", href: "/progreso", icon: TrendingUp },
  { label: "Lista del súper", href: "/lista-compras", icon: ShoppingCart },
  { label: "Recetas", href: "/recetas", icon: ChefHat },
  { label: "Alimentos", href: "/alimentos", icon: LayoutGrid },
  { label: "Calculadora", href: "/calculadora", icon: Calculator },
  { label: "Comparador", href: "/comparador", icon: ArrowLeftRight },
  { label: "Favoritos", href: "/favoritos", icon: Heart },
];

const EXTRAS_ITEMS: NavItem[] = [
  { label: "Vista semanal", href: "/mi-plan/semana", icon: CalendarRange },
  { label: "Acerca de", href: "/acerca-de", icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    showToast({
      type: "info",
      title: "Sesión cerrada",
      description: "Has salido de tu cuenta correctamente.",
      duration: 3000,
    });
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      <p className="px-4 mb-2 text-xs font-bold tracking-wider uppercase text-nutridex-text-secondary/70">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative z-10 flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                  active
                    ? "text-white font-bold"
                    : "text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 rounded-xl bg-nutridex-primary shadow-xs -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    active ? "text-white" : "text-nutridex-text-secondary group-hover:text-nutridex-text-primary"
                  }`}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside
      aria-label="Navegación principal"
      className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[240px] flex-col border-r border-nutridex-border bg-nutridex-surface px-3 py-6"
    >
      {/* Brand Header with NutriDex Platform Icon */}
      <Link href="/" className="px-3 pb-6 pt-1 flex items-center gap-3 group">
        <NutriDexIcon size={38} glow />
        <div>
          <span className="text-base font-extrabold tracking-tight text-nutridex-text-primary block group-hover:text-nutridex-primary transition-colors leading-tight">
            NutriDex
          </span>
          <span className="text-xs font-bold text-nutridex-cyan uppercase tracking-wider block">
            by ThinkBase
          </span>
        </div>
      </Link>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
        {renderNavGroup("Dashboard", DASHBOARD_ITEMS)}
        {renderNavGroup("Extras", EXTRAS_ITEMS)}

        {/* Cuenta Section */}
        <div className="mb-5">
          <p className="px-4 mb-2 text-xs font-bold tracking-wider uppercase text-nutridex-text-secondary/70">
            Cuenta
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                href="/configuracion"
                className={`group flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  pathname.startsWith("/configuracion")
                    ? "bg-nutridex-primary text-white shadow-sm font-bold"
                    : "text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted"
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span className="truncate">Configuración</span>
              </Link>
            </li>

            {mounted && isAuthenticated && user ? (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-nutridex-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="truncate">Cerrar sesión</span>
                </button>
              </li>
            ) : mounted ? (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-nutridex-primary hover:bg-nutridex-primary-soft transition-colors text-left font-bold"
                  >
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span className="truncate">Iniciar sesión</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuthModal("register")}
                    className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors text-left"
                  >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span className="truncate">Registrarse</span>
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </nav>

      {/* Footer controls with full neon ThinkBase logo */}
      <div className="mt-auto pt-4 border-t border-nutridex-border/60 px-2 space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-nutridex-text-secondary">Tema</span>
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center pt-2 px-1 text-center">
          <span className="text-xs font-semibold text-nutridex-text-secondary/80 mb-1.5">
            Powered by
          </span>
          <Link href="/acerca-de" className="hover:opacity-90 transition-opacity">
            <ThinkBaseLogo markSize={26} variant="icon" showWordmark={true} glow />
          </Link>
        </div>
      </div>
    </aside>
  );
}
