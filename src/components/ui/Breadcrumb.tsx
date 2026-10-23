"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { FoodGroup } from "@/types";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1 text-[11px] leading-none">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const active = item.href === pathname || (item.href === "/" && pathname === "/");
        return (
          <React.Fragment key={item.href}>
            {!isLast && (
              <>
                <Link
                  href={item.href}
                  className={`text-nutridex-text-secondary hover:text-nutridex-primary transition-colors ${active ? "text-nutridex-primary" : ""} focus-visible:underline focus-visible:outline-none`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-3 w-3 text-nutridex-text-secondary shrink-0" aria-hidden />
              </>
            )}
            {isLast && <span className="text-nutridex-text-primary font-medium">{item.label}</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function CategoryBreadcrumb(group: FoodGroup) {
  return (
    <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Alimentos", href: "/alimentos" }, { label: group.name, href: `/categorias/${group.slug}` }]} />
  );
}
