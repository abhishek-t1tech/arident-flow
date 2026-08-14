import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, actions, children, className, ...props }: PanelProps) {
  return (
    <div
      className={cn("flex flex-col rounded-lg border border-border bg-surface", className)}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title ? <h3 className="text-sm font-semibold text-ink">{title}</h3> : <span />}
          {actions}
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {action}
    </div>
  );
}
