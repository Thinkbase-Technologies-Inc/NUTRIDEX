"use client";

import { Search, X } from "lucide-react";

interface FoodSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function FoodSearch({
  value,
  onChange,
  placeholder = "Busca por nombre o grupo (ej. manzana, avena, pechuga)...",
  className,
  autoFocus,
}: FoodSearchProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar alimentos"
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-nutridex-border bg-nutridex-surface py-2.5 pl-10 pr-10 text-sm text-nutridex-text-primary placeholder:text-nutridex-text-secondary transition-all focus:border-nutridex-primary focus:outline-none focus:ring-2 focus:ring-nutridex-primary/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
