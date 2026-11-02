import Link from "next/link";
import { NutriDexIcon } from "@/components/ui/NutriDexIcon";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-nutridex-border bg-nutridex-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-4 group"
          >
            <NutriDexIcon size={26} glow={false} />
            <span className="text-sm font-bold tracking-tight text-nutridex-text-primary group-hover:text-nutridex-primary transition-colors">
              NutriDex
            </span>
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-nutridex-text-secondary">
            Equivalencias claras. Nutrición inteligente. Diseñado para simplificar tus porciones y comidas diarias.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-4 text-xs font-medium text-nutridex-text-secondary">
            <Link
              href="/alimentos"
              className="hover:text-nutridex-primary transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary rounded"
            >
              Catálogo
            </Link>
            <Link
              href="/calculadora"
              className="hover:text-nutridex-primary transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary rounded"
            >
              Calculadora
            </Link>
            <Link
              href="/acerca-de"
              className="hover:text-nutridex-primary transition-colors focus-visible:outline-2 focus-visible:outline-nutridex-primary rounded"
            >
              Acerca de
            </Link>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-nutridex-border bg-nutridex-surface-muted px-4 py-2 shadow-2xs">
            <span className="text-xs font-semibold text-nutridex-text-secondary">Diseñado por</span>
            <ThinkBaseLogo markSize={24} variant="icon" showWordmark={true} glow />
          </div>
        </div>
      </div>
      <div className="border-t border-nutridex-border/60 px-5 py-3 pb-[calc(5rem+env(safe-area-inset-bottom))] text-center text-xs text-nutridex-text-secondary md:pb-3">
        © {new Date().getFullYear()} NutriDex · Herramienta informativa basada en el Sistema de Alimentos Equivalentes.
      </div>
    </footer>
  );
}
