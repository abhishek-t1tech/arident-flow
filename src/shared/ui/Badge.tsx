import { ReactNode } from "react";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { cn } from "@/shared/utils/cn";

export type BadgeTone = "positive" | "negative" | "warning" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  positive: "bg-positive-muted text-positive",
  negative: "bg-negative-muted text-negative",
  warning: "bg-warning-muted text-warning",
  neutral: "bg-surface-muted text-ink-muted",
};

const toneIcon: Record<BadgeTone, ReactNode> = {
  positive: <FiCheckCircle aria-hidden />,
  negative: <FiXCircle aria-hidden />,
  warning: <FiAlertTriangle aria-hidden />,
  neutral: null,
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {toneIcon[tone]}
      {children}
    </span>
  );
}
