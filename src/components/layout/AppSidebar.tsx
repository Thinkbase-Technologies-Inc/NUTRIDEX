"use client";

import Link from "next/link";
import { Search, Calculator, ArrowLeftRight, CalendarDays, Heart, Settings, Home, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NutriDexLogo } from "@/components/ui/Logo";
import { ActiveNavIndicator } from "./ActiveNavIndicator";

const NAV_ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Alimentos", href: "/alimentos", icon: LayoutGrid },
  { label: "Calculadora", href: "/calculadora", icon: Calculator },
  { label: "Comparador", href: "/comparador", icon: ArrowLeftRight },
  { label: "Mi plan", href: "/mi-plan", icon: CalendarDays },
  { label: "Favoritos", href: "/favoritos", icon: Heart },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  return (
    <nav
      aria-label="Navegación principal"
      className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[260px] flex-col border-r border-nutridex-border bg-nutridex-surface"
    >
      <div className="flex items-center gap-3 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <NutriDexLogo size={36} />
          <span className="text-lg font-semibold tracking-tight">NutriDex</span>
        </Link>
      </div>
      <div className="px-4 mt-2">
        <ActiveNavIndicator items={NAV_ITEMS.map((i) => ({ href: i.href, label: i.label, icon: i.icon }))} />
      </div>
      <div className="mt-auto px-6 pb-6">
        <ThemeToggle />
      </div>
    </nav>
  );
}
