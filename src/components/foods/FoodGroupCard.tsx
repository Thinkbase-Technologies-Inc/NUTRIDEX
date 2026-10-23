import Link from "next/link";
import type { ComponentType, CSSProperties } from "react";
import type { FoodGroup } from "@/types";
import { getFoodsByGroup } from "@/data/foods";

interface FoodGroupCardProps {
  group: FoodGroup;
  icon: ComponentType<{ className?: string; style?: CSSProperties; "aria-hidden"?: boolean }>;
}

export function FoodGroupCard({ group, icon: Icon }: FoodGroupCardProps) {
  const count = getFoodsByGroup(group.id).length;

  return (
    <Link
      href={`/categorias/${group.slug}`}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-nutridex-border bg-nutridex-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-28px_rgba(24,62,26,0.55)] focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${group.colorToken}1f` }}
      >
        <Icon className="h-5 w-5" style={{ color: group.colorToken }} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-snug text-nutridex-text-primary">
          {group.name}
        </span>
        <span className="mt-0.5 block text-xs text-nutridex-text-secondary">
          {count} alimento{count !== 1 ? "s" : ""}
        </span>
      </span>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: group.colorToken }} aria-hidden />
    </Link>
  );
}
