import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nutridex-surface-muted">
          <Icon className="h-7 w-7 text-nutridex-text-secondary" aria-hidden />
        </div>
      )}
      <h3 className="text-base font-semibold text-nutridex-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-nutridex-text-secondary">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
