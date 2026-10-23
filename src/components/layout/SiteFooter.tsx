import Link from "next/link";
import { NutriDexLogo } from "@/components/ui/Logo";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-nutridex-border bg-nutridex-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex flex-col gap-3">
          <Link href="/" className="inline-flex w-fit items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-4">
            <NutriDexLogo size={25} />
            <span className="text-sm font-semibold tracking-tight text-nutridex-text-primary">NutriDex</span>
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-nutridex-text-secondary">
            Equivalencias claras. Nutrición inteligente.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href="/acerca-de"
            className="w-fit text-xs font-medium text-nutridex-text-secondary transition-colors hover:text-nutridex-primary focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
          >
            Acerca de NutriDex
          </Link>
          <div className="flex items-center gap-2.5 rounded-lg border border-nutridex-border bg-nutridex-background px-3 py-2">
            <span className="text-[11px] text-nutridex-text-secondary">Tecnología por</span>
            <ThinkBaseLogo markSize={22} />
          </div>
        </div>
      </div>
      <div
        className="border-t border-nutridex-border/70 px-4 py-3 pb-[calc(5rem+env(safe-area-inset-bottom))] text-center text-[11px] text-nutridex-text-secondary md:pb-3 md:pl-[260px]"
      >
        © {new Date().getFullYear()} NutriDex · Una herramienta de consulta y organización alimenticia.
      </div>
    </footer>
  );
}
