import Link from "next/link";
import { NutriDexLogo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <NutriDexLogo size={56} />
      <h1 className="mt-6 text-3xl font-bold text-nutridex-text-primary">Página no encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-nutridex-text-secondary">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-nutridex-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-nutridex-primary-hover focus-visible:outline-2 focus-visible:outline-nutridex-primary focus-visible:outline-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
