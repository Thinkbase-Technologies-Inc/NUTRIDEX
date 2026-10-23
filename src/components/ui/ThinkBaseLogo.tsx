interface ThinkBaseLogoProps {
  markSize?: number;
  showWordmark?: boolean;
  className?: string;
}

/** ThinkBase signature mark, based on the supplied cyan–blue–violet artwork. */
export function ThinkBaseLogo({
  markSize = 34,
  showWordmark = true,
  className = "",
}: ThinkBaseLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        aria-hidden="true"
        width={markSize}
        height={markSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="thinkbase-gradient" x1="7" y1="8" x2="88" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14E4F4" />
            <stop offset="0.48" stopColor="#124BFF" />
            <stop offset="1" stopColor="#C84BFF" />
          </linearGradient>
        </defs>
        <path
          d="M15 12H70C88 12 94 31 80 43L31 84H82"
          stroke="url(#thinkbase-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 47V82"
          stroke="url(#thinkbase-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M18 48L47 24"
          stroke="url(#thinkbase-gradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-semibold tracking-[-0.035em] text-nutridex-text-primary">
          Think<span className="font-normal text-nutridex-text-secondary">Base</span>
        </span>
      )}
    </span>
  );
}
