interface NutriDexLogoProps {
  size?: number;
}

export function NutriDexLogo({ size = 32 }: NutriDexLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Grid de celdas - referencia a datos tabulares */}
      <rect x="4" y="4" width="12" height="12" rx="2" fill="var(--nutridex-primary)" opacity="0.9" />
      <rect x="16" y="4" width="12" height="12" rx="2" fill="var(--nutridex-primary)" opacity="0.4" />
      <rect x="28" y="4" width="8" height="12" rx="2" fill="var(--nutridex-primary)" opacity="0.15" />
      {/* N geométrica central */}
      <rect x="4" y="16" width="12" height="20" rx="2" fill="var(--nutridex-primary)" opacity="0.9" />
      <rect x="24" y="16" width="12" height="20" rx="2" fill="var(--nutridex-primary)" opacity="0.9" />
      {/* Diagonal de la N */}
      <path
        d="M10 36L30 16"
        stroke="var(--nutridex-primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Celda de la derecha */}
      <rect x="16" y="28" width="8" height="8" rx="2" fill="var(--nutridex-primary)" opacity="0.4" />
    </svg>
  );
}
