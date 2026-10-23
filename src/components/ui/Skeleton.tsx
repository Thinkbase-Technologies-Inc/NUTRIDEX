export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties } = {}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-nutridex-border ${className}`}
      style={style}
      aria-hidden
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string } = {}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-nutridex-border rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`h-10 w-10 shrink-0 rounded-xl bg-nutridex-border ${className}`} aria-hidden />
  );
}

export function SkeletonRect({ className = "" }: { className?: string } = {}) {
  return <div className={`h-24 w-full rounded-xl bg-nutridex-border ${className}`} aria-hidden />;
}

export function SkeletonButton({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`h-10 rounded-full bg-nutridex-border ${className}`} aria-hidden />
  );
}

export function SkeletonPill({ className = "" }: { className?: string } = {}) {
  return <div className={`h-8 w-24 rounded-full bg-nutridex-border ${className}`} aria-hidden />;
}
