import { ReactNode } from "react";
import { FiAlertCircle, FiCheck, FiLoader } from "react-icons/fi";
import { AutosaveStatus } from "@/shared/hooks/useAutosave";
import { cn } from "@/shared/utils/cn";

const LABEL: Record<AutosaveStatus, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved locally",
  error: "Save failed",
};

const ICON: Record<AutosaveStatus, ReactNode> = {
  idle: null,
  saving: <FiLoader className="animate-spin" aria-hidden />,
  saved: <FiCheck aria-hidden />,
  error: <FiAlertCircle aria-hidden />,
};

const TONE: Record<AutosaveStatus, string> = {
  idle: "text-ink-muted",
  saving: "text-ink-muted",
  saved: "text-positive",
  error: "text-negative",
};

export function SaveStatusIndicator({ status }: { status: AutosaveStatus }) {
  if (status === "idle") return null;

  return (
    <span className={cn("flex items-center gap-1.5 text-xs font-medium", TONE[status])}>
      {ICON[status]}
      {LABEL[status]}
    </span>
  );
}
