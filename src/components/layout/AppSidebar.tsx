"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ArrowLeftRight, CalendarDays, Heart, Settings, Home, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NutriDexLogo } from "@/components/ui/Logo";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";

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
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[260px] flex-col border-r border-nutridex-border bg-nutridex-surface/90 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 px-6 pb-5 pt-7">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-4"
        >
          <NutriDexLogo size={38} />
          <span className="text-lg font-semibold tracking-tight text-nutridex-text-primary">NutriDex</span>
        </Link>
      </div>

      <div className="mx-4 rounded-2xl bg-nutridex-surface-muted p-2">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-nutridex-text-secondary">
          Menú
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 ${
                    active
                      ? "bg-nutridex-surface text-nutridex-primary shadow-[0_12px_24px_-18px_rgba(24,62,26,0.6)]"
                      : "text-nutridex-text-secondary hover:bg-nutridex-surface hover:text-nutridex-text-primary"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active ? "bg-nutridex-primary-soft" : "bg-transparent"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto space-y-3 px-4 pb-6">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-xl border border-nutridex-border px-3 py-2.5">
          <ThinkBaseLogo markSize={20} />
          <span className="text-[11px] text-nutridex-text-secondary">Tecnología por ThinkBase</span>
        </div>
        <p className="px-1 text-[10px] leading-relaxed text-nutridex-text-secondary">
          Herramienta de consulta. No sustituye la valoración de un profesional.
        </p>
      </div>
    </nav>
  );
}
