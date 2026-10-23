"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Calculator, CalendarDays, MoreHorizontal } from "lucide-react";

const ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Alimentos", href: "/alimentos", icon: LayoutGrid },
  { label: "Calcular", href: "/calculadora", icon: Calculator },
  { label: "Mi plan", href: "/mi-plan", icon: CalendarDays },
  { label: "Más", href: "/configuracion", icon: MoreHorizontal },
];

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación inferior"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-nutridex-border bg-nutridex-surface/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:-outline-offset-2 ${
                  active
                    ? "text-nutridex-primary"
                    : "text-nutridex-text-secondary"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
