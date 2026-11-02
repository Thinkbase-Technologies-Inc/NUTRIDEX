"use client";

import { Minus, Plus } from "lucide-react";
import { ALLOWED_EQUIVALENTS } from "@/domain/calculation";

interface EquivalentStepperProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  allowCustom?: boolean;
}

function formatPresetLabel(val: number): string {
  if (val === 0.5) return "½";
  if (val === 1.5) return "1 ½";
  if (val === 2.5) return "2 ½";
  if (val === 0.25) return "¼";
  if (val === 0.75) return "¾";
  return `${val}`;
}

export function EquivalentStepper({
  value,
  onChange,
  disabled,
  allowCustom = true,
}: EquivalentStepperProps) {
  const isValid = (n: number) => n > 0 && n <= 100;

  const handleChange = (next: number) => {
    if (isValid(next)) {
      onChange(Math.round(next * 1000) / 1000);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main interactive counter */}
      <div className="flex items-center justify-between rounded-2xl border border-nutridex-border bg-nutridex-surface p-2 shadow-xs">
        <button
          type="button"
          onClick={() => handleChange(value - 0.5)}
          disabled={disabled || value <= 0.5}
          aria-label="Reducir 0.5 equivalentes"
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-nutridex-surface-muted text-nutridex-text-primary transition-all active:scale-90 hover:bg-nutridex-border/60 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <Minus className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </button>

        <div className="flex flex-col items-center justify-center px-4">
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={value}
              onChange={(e) => {
                const n = parseFloat(e.target.value);
                if (!isNaN(n)) handleChange(n);
              }}
              min={0.5}
              max={100}
              step={0.5}
              disabled={disabled}
              aria-label="Número de equivalentes"
              className="nx-num w-20 bg-transparent text-center text-3xl sm:text-4xl font-extrabold text-nutridex-text-primary focus:outline-none disabled:opacity-40"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary">
            {value === 1 ? "Equivalente" : "Equivalentes"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleChange(value + 0.5)}
          disabled={disabled || value >= 100}
          aria-label="Aumentar 0.5 equivalentes"
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-nutridex-primary text-white transition-all active:scale-90 hover:bg-nutridex-primary-hover disabled:opacity-30 disabled:pointer-events-none shadow-sm focus-visible:outline-2 focus-visible:outline-nutridex-primary"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </button>
      </div>

      {/* Quick selection preset chips */}
      {allowCustom && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-medium text-nutridex-text-secondary shrink-0 pr-1">
            Rápido:
          </span>
          {ALLOWED_EQUIVALENTS.map((preset) => {
            const active = Math.abs(value - preset) < 0.001;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                disabled={disabled}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-nutridex-primary ${
                  active
                    ? "bg-nutridex-primary text-white shadow-xs"
                    : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:border-nutridex-primary/40 hover:text-nutridex-text-primary"
                }`}
              >
                {formatPresetLabel(preset)} eq
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
