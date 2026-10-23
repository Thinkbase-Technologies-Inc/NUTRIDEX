import type {
  FoodItem,
  CalculationResult,
  FractionalNumber,
} from "@/types";

const MAX_EQUIVALENTS = 100;
const MIN_EQUIVALENTS = 0;

/**
 * Rational number represented as numerator/denominator to avoid
 * floating point accumulation errors in fraction arithmetic.
 */
export class Rational {
  constructor(public n: number, public d: number = 1) {
    if (d === 0) throw new Error("Denominador no puede ser cero");
    this.normalize();
  }

  private normalize(): void {
    if (this.d < 0) {
      this.n = -this.n;
      this.d = -this.d;
    }
    const g = Rational.gcd(Math.abs(this.n), this.d);
    this.n /= g;
    this.d /= g;
  }

  static gcd(a: number, b: number): number {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  }

  static from(value: number | string): Rational {
    if (typeof value === "string") {
      const trimmed = value.trim();
      // handle mixed fractions like "1 1/2"
      const mixed = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
      if (mixed) {
        const whole = Number(mixed[1]);
        const num = Number(mixed[2]);
        const den = Number(mixed[3]);
        return new Rational(whole * den + num, den);
      }
      // handle simple fractions "3/4"
      const frac = trimmed.match(/^(\d+)\/(\d+)$/);
      if (frac) {
        return new Rational(Number(frac[1]), Number(frac[2]));
      }
      const n = Number(trimmed);
      if (!Number.isFinite(n)) throw new Error(`No se puede parsear: ${value}`);
      return new Rational(n);
    }
    return new Rational(value);
  }

  add(other: Rational): Rational {
    return new Rational(
      this.n * other.d + other.n * this.d,
      this.d * other.d
    );
  }

  mul(other: Rational): Rational {
    return new Rational(this.n * other.n, this.d * other.d);
  }

  div(other: Rational): Rational {
    if (other.n === 0) throw new Error("División por cero");
    return new Rational(this.n * other.d, this.d * other.n);
  }

  toNumber(): number {
    return this.n / this.d;
  }

  toMixed(): FractionalNumber | null {
    if (this.d === 1) return { whole: this.n, numerator: 0, denominator: 1 };
    const whole = Math.floor(this.toNumber());
    const remainder = this.sub(new Rational(whole));
    if (remainder.n === 0) return { whole, numerator: 0, denominator: 1 };
    return {
      whole,
      numerator: remainder.n,
      denominator: remainder.d,
    };
  }

  sub(other: Rational): Rational {
    return new Rational(
      this.n * other.d - other.n * this.d,
      this.d * other.d
    );
  }

  isWhole(): boolean {
    return this.d === 1 || this.n % this.d === 0;
  }

  toString(): string {
    if (this.d === 1) return String(this.n);
    const mixed = this.toMixed();
    if (!mixed) return `${this.n}/${this.d}`;
    if (mixed.whole === 0) return `${mixed.numerator}/${mixed.denominator}`;
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
  }
}

/**
 * Validates equivalents input. Returns the numeric value or throws.
 */
export function validateEquivalents(value: unknown): number {
  if (value === null || value === undefined) {
    throw new Error("La cantidad de equivalentes es requerida");
  }
  const num = typeof value === "string" ? Rational.from(value).toNumber() : Number(value);
  if (!Number.isFinite(num)) {
    throw new Error("Ingresa un valor numérico válido");
  }
  if (num <= MIN_EQUIVALENTS) {
    throw new Error("La cantidad debe ser mayor a cero");
  }
  if (num > MAX_EQUIVALENTS) {
    throw new Error("La cantidad no puede exceder 100 equivalentes");
  }
  return num;
}

/**
 * Allowed preset equivalents per the spec.
 */
export const ALLOWED_EQUIVALENTS = [0.5, 1, 1.5, 2, 3];

export function isAllowedEquivalent(value: number): boolean {
  return ALLOWED_EQUIVALENTS.some((v) => Math.abs(v - value) < 1e-9);
}

/**
 * Calculate the result for a given food and number of equivalents.
 * Only multiplies documented grams - no invented conversions.
 */
export function calculateEquivalents(
  food: FoodItem,
  equivalents: number
): CalculationResult {
  const eq = validateEquivalents(equivalents);
  const rationalEq = Rational.from(eq);

  let grams: number | null = null;
  let quantityLabel = food.portionLabel;
  let fraction: FractionalNumber | null = null;

  if (food.grams !== null && food.grams !== undefined) {
    const totalGramsRational = new Rational(food.grams).mul(rationalEq);
    grams = Math.round(totalGramsRational.toNumber() * 10) / 10;
  }

  // Build a readable quantity label from portions when fraction info exists
  if (food.portionNumerator !== null) {
    const base = new Rational(food.portionNumerator, food.portionDenominator ?? 1);
    const total = base.mul(rationalEq);
    fraction = total.toMixed();
    const unit = food.portionUnit || "";
    quantityLabel = `${total.toString()} ${unit}`.trim();
  } else if (fraction === null) {
    quantityLabel = food.portionLabel;
  }

  return {
    food,
    equivalents: eq,
    portionLabel: food.portionLabel,
    quantityLabel,
    grams,
    isApproximate: food.isApproximate,
    fraction,
  };
}

export function formatGrams(grams: number | null): string | null {
  if (grams === null || grams === undefined) return null;
  return `${grams} g`;
}

export function formatEquivalentsLabel(n: number): string {
  const r = Rational.from(n);
  if (r.isWhole()) return `${r.n} equivalente${r.n !== 1 ? "s" : ""}`;
  return `${r.toString()} equivalentes`;
}

export function normalizeSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function searchMatch(food: FoodItem, query: string): boolean {
  const q = removeAccents(query.toLowerCase().trim());
  if (!q) return true;
  const haystack = [
    removeAccents(food.name.toLowerCase()),
    removeAccents(food.normalizedName.toLowerCase()),
    ...food.aliases.map((a) => removeAccents(a.toLowerCase())),
  ].join(" ");
  return haystack.split(/\s+/).some((token) => token.includes(q));
}
