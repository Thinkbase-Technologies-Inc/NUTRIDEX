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
      className="group flex flex-col rounded-xl border border-nutridex-border bg-nutridex-surface p-4 transition-all duration-150 hover:shadow-sm hover:border-nutridex-primary/30 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${group.colorToken}18` }}
      >
        <Icon className="h-5 w-5" style={{ color: group.colorToken }} aria-hidden />
      </div>
      <span className="text-sm font-semibold text-nutridex-text-primary leading-snug">
        {group.name}
      </span>
      <span className="mt-1 text-xs text-nutridex-text-secondary">
        {count} alimento{count !== 1 ? "s" : ""}
      </span>
    </Link>
  );
}
