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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleChange(value - 0.5)}
          disabled={disabled || value <= 0.5}
          aria-label="Reducir cantidad"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-nutridex-border bg-nutridex-surface text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Minus className="h-5 w-5" aria-hidden />
        </button>
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
          className="h-11 w-24 rounded-xl border border-nutridex-border bg-nutridex-surface px-3 text-center text-lg font-semibold text-nutridex-text-primary focus:outline-2 focus:outline-nutridex-primary disabled:opacity-40"
        />
        <button
          type="button"
          onClick={() => handleChange(value + 0.5)}
          disabled={disabled}
          aria-label="Aumentar cantidad"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-nutridex-border bg-nutridex-surface text-nutridex-text-primary transition-colors hover:bg-nutridex-surface-muted disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
        >
          <Plus className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {allowCustom && (
        <div className="flex flex-wrap gap-2">
          {ALLOWED_EQUIVALENTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              disabled={disabled}
              aria-pressed={Math.abs(value - preset) < 0.001}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2 ${
                Math.abs(value - preset) < 0.001
                  ? "border-nutridex-primary bg-nutridex-primary text-white"
                  : "border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
