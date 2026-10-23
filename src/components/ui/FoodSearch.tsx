"use client";

import { Search, X } from "lucide-react";

interface FoodSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function FoodSearch({ value, onChange, placeholder = "Busca manzana, tortilla, pollo, avena...", className, autoFocus }: FoodSearchProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar alimentos"
        autoFocus={autoFocus}
        className="w-full rounded-full border border-nutridex-border bg-nutridex-surface py-3 pl-11 pr-11 text-sm text-nutridex-text-primary placeholder:text-nutridex-text-secondary transition-shadow focus:outline-none focus:ring-2 focus:ring-nutridex-primary/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-nutridex-text-secondary hover:bg-nutridex-surface-muted focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
