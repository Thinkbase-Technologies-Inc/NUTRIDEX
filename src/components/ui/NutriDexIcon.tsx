"use client";

import { useState } from "react";

interface NutriDexIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

/**
 * Official NutriDex Brand Icon.
 * Features a modern glassmorphic squircle with deep emerald gradients,
 * an iconic stylized 'N' fused with a vital nutritional leaf sprout and cyan energy arc.
 */
export function NutriDexIcon({
  size = 38,
  className = "",
  glow = true,
}: NutriDexIconProps) {
  const [imgError, setImgError] = useState(false);

  // If raster asset exists and loaded cleanly, we can show it, otherwise pure crisp SVG vector
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[1rem] ${
        glow ? "shadow-[0_0_16px_rgba(34,197,94,0.35)]" : "shadow-xs"
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {!imgError ? (
        <img
          src="/icons/nutridex-app-icon.png"
          alt="NutriDex"
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : null}

      {/* Pure Vector SVG Artwork Fallback / Primary Engine */}
      {imgError ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            {/* Dark Forest Emerald Glass Gradient */}
            <linearGradient id="ndx-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#142c1d" />
              <stop offset="0.5" stopColor="#0c1d13" />
              <stop offset="1" stopColor="#06110a" />
            </linearGradient>

            {/* Glowing Emerald-Mint Gradient */}
            <linearGradient id="ndx-emerald" x1="15" y1="85" x2="65" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="0.6" stopColor="#22c55e" />
              <stop offset="1" stopColor="#86efac" />
            </linearGradient>

            {/* Cyan Accent Gradient */}
            <linearGradient id="ndx-cyan" x1="45" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>

            {/* Glass Highlight Gradient */}
            <linearGradient id="ndx-sheen" x1="20" y1="0" x2="80" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.25" />
              <stop offset="1" stopColor="white" stopOpacity="0.02" />
            </linearGradient>

            <filter id="ndx-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle App Icon Base */}
          <rect width="100" height="100" rx="24" fill="url(#ndx-bg)" />
          <rect x="1" y="1" width="98" height="98" rx="23" stroke="url(#ndx-sheen)" strokeWidth="1.5" />

          {/* Glowing Ambient Glow inside Squircle */}
          <circle cx="50" cy="50" r="32" fill="#22c55e" opacity="0.16" filter="url(#ndx-glow)" />

          {/* Stylized 'N' + Nutrition Leaf Sprout Artwork */}
          {/* Left Vertical Pillar */}
          <path
            d="M24 76V30C24 26.6863 26.6863 24 30 24C33.3137 24 36 26.6863 36 30V76C36 79.3137 33.3137 82 30 82C26.6863 82 24 79.3137 24 76Z"
            fill="url(#ndx-emerald)"
          />

          {/* Dynamic Leaf Sprout Diagonal */}
          <path
            d="M31 34C31 34 45 48 57 60C62 65 67 69 73 69C76.3137 69 79 66.3137 79 63C79 57 65 37 54 26C48 20 40 18 34 23C30 26 31 34 31 34Z"
            fill="url(#ndx-emerald)"
            opacity="0.95"
          />

          {/* Right Precision Column & Cyan Energy Spark */}
          <path
            d="M66 28C66 24.6863 68.6863 22 72 22C75.3137 22 78 24.6863 78 28V72C78 75.3137 75.3137 78 72 78C68.6863 78 66 75.3137 66 72V28Z"
            fill="url(#ndx-cyan)"
          />

          {/* Nutrition Vitality Core (Dewdrop / Energy Dot) */}
          <circle cx="52" cy="46" r="4.5" fill="#38bdf8" filter="url(#ndx-glow)" />

          {/* Organic Sprout Vein Curve */}
          <path
            d="M40 38C46 44 54 50 62 58"
            stroke="#dcfce7"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      ) : null}
    </span>
  );
}
