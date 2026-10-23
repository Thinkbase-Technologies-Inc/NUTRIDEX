"use client";

import { Minus, Plus } from "lucide-react";
import { ALLOWED_EQUIVALENTS } from "@/domain/calculation";

interface EquivalentStepperProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  allowCustom?: boolean;
}

export function EquivalentStepper({ value, onChange, disabled, allowCustom = true }: EquivalentStepperProps) {
  const isValid = (n: number) => n > 0 && n <= 100;

  const handleChange = (next: number) => {
    if (isValid(next)) {
      onChange(Math.round(next * 1000) / 1000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 rounded-full border border-nutridex-border bg-nutridex-surface p-2">
        <button
          type="button"
          onClick={() => handleChange(value - 0.5)}
          disabled={disabled || value <= 0.5}
          aria-label="Reducir cantidad"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-primary transition-colors hover:bg-nutridex-border disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Minus className="h-5 w-5" aria-hidden />
        </button>
        <div className="text-center">
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
            className="nx-num w-20 bg-transparent text-center text-2xl font-bold text-nutridex-text-primary focus:outline-none disabled:opacity-40"
          />
          <p className="text-[11px] font-medium uppercase tracking-wide text-nutridex-text-secondary">equivalente(s)</p>
        </div>
        <button
          type="button"
          onClick={() => handleChange(value + 0.5)}
          disabled={disabled}
          aria-label="Aumentar cantidad"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-nutridex-primary text-white transition-colors hover:bg-nutridex-primary-hover disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Plus className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {allowCustom && (
        <div className="flex flex-wrap gap-2">
          {ALLOWED_EQUIVALENTS.map((preset) => {
            const active = Math.abs(value - preset) < 0.001;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                disabled={disabled}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 ${
                  active
                    ? "bg-nutridex-primary text-white"
                    : "border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
