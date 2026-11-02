import Link from "next/link";
import type { ComponentType, CSSProperties } from "react";
import type { FoodGroup } from "@/types";
import { getFoodsByGroup } from "@/data/foods";
import { ChevronRight } from "lucide-react";

interface FoodGroupCardProps {
  group: FoodGroup;
  icon: ComponentType<{ className?: string; style?: CSSProperties; "aria-hidden"?: boolean }>;
}

export function FoodGroupCard({ group, icon: Icon }: FoodGroupCardProps) {
  const count = getFoodsByGroup(group.id).length;

  return (
    <Link
      href={`/categorias/${group.slug}`}
      className="group relative flex items-center justify-between gap-3 rounded-xl border border-nutridex-border bg-nutridex-surface p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-nutridex-primary/40 focus-visible:outline-2 focus-visible:outline-nutridex-primary"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${group.colorToken}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: group.colorToken }} aria-hidden />
        </span>
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold text-nutridex-text-primary group-hover:text-nutridex-primary transition-colors">
            {group.name}
          </span>
          <span className="text-xs text-nutridex-text-secondary">
            {count > 0 ? `${count} alimento${count !== 1 ? "s" : ""}` : "Por documentar"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: group.colorToken }}
          aria-hidden
        />
        <ChevronRight className="h-4 w-4 text-nutridex-text-secondary group-hover:text-nutridex-primary group-hover:translate-x-0.5 transition-all" aria-hidden />
      </div>
    </Link>
  );
}
