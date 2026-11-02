"use client";

import { useState } from "react";

interface Icons8ImgProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function Icons8Img({
  src,
  alt,
  size = 24,
  className = "",
  fallbackIcon,
}: Icons8ImgProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-hidden
      >
        {fallbackIcon ?? <span className="h-2 w-2 rounded-full bg-nutridex-primary" />}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`shrink-0 object-contain transition-transform duration-200 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
