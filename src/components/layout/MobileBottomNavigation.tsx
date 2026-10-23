"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Calculator, CalendarDays, User } from "lucide-react";

const ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Alimentos", href: "/alimentos", icon: LayoutGrid },
  { label: "Calcular", href: "/calculadora", icon: Calculator },
  { label: "Mi plan", href: "/mi-plan", icon: CalendarDays },
  { label: "Perfil", href: "/configuracion", icon: User },
];

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación inferior"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto max-w-md rounded-[1.75rem] border border-black/5 bg-[#1c1f1b] p-2 shadow-[0_24px_44px_-20px_rgba(0,0,0,0.6)]">
        <ul className="flex items-stretch justify-between gap-1">
          {ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] px-1 text-[10px] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
                    active ? "bg-white text-[#1c1f1b]" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
