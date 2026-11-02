"use client";

import { useState } from "react";

interface ThinkBaseLogoProps {
  markSize?: number;
  showWordmark?: boolean;
  variant?: "icon" | "full";
  className?: string;
  glow?: boolean;
}

export const THINKBASE_LOGOS = {
  // Official icon requested by user
  icon: "https://i.ibb.co/KpZGhWnG/Thinkbase-Icono-B-Git-Hub-Menos-1-MB.png",
  // Full technological banner with neon glow (1774 x 887 HD)
  full: "https://i.ibb.co/7xZjKSmF/Logo-tecnolo-gico-Thinkbase-con-brillo-neo-n.png",
  localIcon: "/images/thinkbase-icon.png",
  localFull: "/images/thinkbase-full.png",
};

/**
 * ThinkBase Logo component with official neon-glow artwork & icon assets.
 */
export function ThinkBaseLogo({
  markSize = 26,
  showWordmark = true,
  variant = "icon",
  className = "",
  glow = false,
}: ThinkBaseLogoProps) {
  const [hasError, setHasError] = useState(false);

  const imgSrc = hasError
    ? variant === "full"
      ? THINKBASE_LOGOS.localFull
      : THINKBASE_LOGOS.localIcon
    : variant === "full"
    ? THINKBASE_LOGOS.full
    : THINKBASE_LOGOS.icon;

  if (variant === "full") {
    return (
      <span
        className={`inline-flex items-center ${
          glow ? "drop-shadow-[0_0_12px_rgba(20,228,244,0.45)]" : ""
        } ${className}`}
      >
        <img
          src={imgSrc}
          alt="ThinkBase Technology"
          className="h-auto w-auto object-contain transition-transform duration-200 hover:scale-102"
          style={{ maxHeight: `${markSize}px` }}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 ${
          glow ? "shadow-[0_0_12px_rgba(20,228,244,0.4)]" : "shadow-xs"
        }`}
        style={{ width: `${markSize}px`, height: `${markSize}px` }}
      >
        <img
          src={imgSrc}
          alt="ThinkBase Icon"
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </span>
      {showWordmark && (
        <span className="font-extrabold tracking-tight text-nutridex-text-primary text-xs sm:text-sm">
          Think<span className="text-nutridex-cyan font-bold">Base</span>
        </span>
      )}
    </span>
  );
}
