import { Info } from "lucide-react";
import { NutriDexLogo } from "@/components/ui/Logo";

export const metadata = {
  title: "Acerca de",
};

export default function AcercaDePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-center gap-3">
        <NutriDexLogo size={40} />
        <div>
          <h1 className="text-2xl font-bold text-nutridex-text-primary">NutriDex</h1>
          <p className="text-sm text-nutridex-text-secondary">Equivalencias claras. Nutrición inteligente.</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">¿Qué es NutriDex?</h2>
        <p className="mt-2 text-sm leading-relaxed text-nutridex-text-secondary">
          NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. Transforma una lista
          tradicional de alimentos equivalentes en una plataforma digital interactiva para que cualquier persona
          pueda encontrar un alimento, conocer su porción, calcular sus equivalentes e identificar alternativas de
          su mismo grupo alimenticio en pocos segundos.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Fuente de datos</h2>
        <p className="mt-2 text-sm leading-relaxed text-nutridex-text-secondary">
          El catálogo se basa en la tabla de alimentos equivalentes proporcionada. Cada registro incluye
          información sobre su página de origen y estado de validación. Los porcentajes de grasa y las
          clasificaciones de los grupos siguen la estructura del documento original.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-nutridex-warning/30 bg-nutridex-warning/5 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-nutridex-warning" aria-hidden />
          <div>
            <h3 className="text-sm font-semibold text-nutridex-warning">Aviso importante</h3>
            <p className="mt-1 text-sm leading-relaxed text-nutridex-text-secondary">
              NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. No sustituye una
              valoración individual realizada por un profesional de la nutrición. Los cálculos presentados no
              constituyen recomendaciones médicas personalizadas.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Limitaciones</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-nutridex-text-secondary">
          <li>El catálogo inicial puede contener registros pendientes de verificación.</li>
          <li>No se presentan calorías ni macronutrientes, ya que el documento fuente no los incluye de forma individualizada.</li>
          <li>Las conversiones volumétricas no se inventan; solo se multiplican pesos documentados.</li>
          <li>El intercambio de alimentos conserva el número de equivalentes dentro del mismo grupo.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-nutridex-text-primary">Privacidad</h2>
        <p className="mt-2 text-sm leading-relaxed text-nutridex-text-secondary">
          NutriDex funciona sin cuenta de usuario y no recopila datos clínicos. Tus datos se guardan localmente en
          tu navegador. Puedes exportarlos o eliminarlos en cualquier momento desde Configuración.
        </p>
      </section>
    </div>
  );
}
