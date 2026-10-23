import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto mt-6 flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-nutridex-border bg-nutridex-surface/60 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-nutridex-primary-soft">
          <Icon className="h-7 w-7 text-nutridex-primary" aria-hidden />
        </div>
      )}
      <h3 className="text-base font-semibold text-nutridex-text-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-nutridex-text-secondary">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
