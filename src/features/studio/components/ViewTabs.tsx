"use client";

import { StudioView } from "@/shared/state/studioUiStore";
import { cn } from "@/shared/utils/cn";

const VIEWS: { id: StudioView; label: string }[] = [
  { id: "model", label: "Model" },
  { id: "simulate", label: "Simulate" },
  { id: "analytics", label: "Analytics" },
  { id: "compare", label: "Compare" },
];

interface ViewTabsProps {
  active: StudioView;
  onChange: (view: StudioView) => void;
}

export function ViewTabs({ active, onChange }: ViewTabsProps) {
  return (
    <div role="tablist" aria-label="Studio views" className="flex gap-1 rounded-md bg-surface-muted p-1">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          role="tab"
          type="button"
          aria-selected={active === view.id}
          onClick={() => onChange(view.id)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition-colors",
            active === view.id ? "bg-brand-700 text-white shadow-sm" : "text-ink-muted hover:text-ink",
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
