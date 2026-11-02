"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, CalendarDays, Calculator, User } from "lucide-react";
import { usePlannerStore } from "@/stores/usePlannerStore";

const ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Alimentos", href: "/alimentos", icon: UtensilsCrossed },
  { label: "Mi plan", href: "/mi-plan", icon: CalendarDays },
  { label: "Calcular", href: "/calculadora", icon: Calculator },
  { label: "Perfil", href: "/configuracion", icon: User },
];

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const { plans, activeDate } = usePlannerStore();
  const currentPlan = plans.find((p) => p.date === activeDate);
  const totalEquivalents = currentPlan
    ? currentPlan.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.equivalents, 0), 0)
    : 0;

  return (
    <nav
      aria-label="Navegación inferior móvil"
      className="md:hidden nx-mobile-dock px-3.5"
    >
      <div className="mx-auto w-full max-w-[340px] rounded-[2.5rem] bg-[#181d19]/92 backdrop-blur-2xl p-1.5 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)] border border-white/10 pointer-events-auto transition-transform duration-200">
        <ul className="flex items-center justify-between gap-1">
          {ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href} className={active ? "flex-auto" : "shrink-0"}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-11 items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                    active
                      ? "rounded-full bg-white text-[#121614] px-3.5 font-bold text-xs shadow-md gap-2"
                      : "w-11 rounded-full text-white/55 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`shrink-0 transition-transform ${
                      active ? "h-4 w-4 text-[#121614]" : "h-5 w-5"
                    }`}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden
                  />
                  {active && (
                    <span className="truncate text-xs font-extrabold tracking-tight leading-none">
                      {item.label}
                    </span>
                  )}

                  {/* Dynamic pulse notification dot when plan has tracked items */}
                  {item.href === "/mi-plan" && !active && totalEquivalents > 0 && (
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#181d19] animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
