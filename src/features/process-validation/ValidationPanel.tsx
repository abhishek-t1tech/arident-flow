"use client";

import { ValidationIssue } from "@/domain";
import { Badge } from "@/shared/ui/Badge";
import { EmptyState } from "@/shared/ui/Panel";

interface ValidationPanelProps {
  issues: ValidationIssue[];
  onFocusElement: (elementId: string) => void;
}

export function ValidationPanel({ issues, onFocusElement }: ValidationPanelProps) {
  if (issues.length === 0) {
    return (
      <EmptyState
        title="Ready to simulate"
        description="No validation issues were found. Configure a run and start a simulation."
      />
    );
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex gap-2 px-1">
        <Badge tone={errors.length ? "negative" : "positive"}>{errors.length} errors</Badge>
        <Badge tone={warnings.length ? "warning" : "neutral"}>{warnings.length} warnings</Badge>
      </div>
      <ul className="flex flex-col gap-1">
        {issues.map((issue) => (
          <li key={issue.id}>
            <button
              type="button"
              onClick={() => issue.elementId && onFocusElement(issue.elementId)}
              disabled={!issue.elementId}
              className="flex w-full flex-col gap-1 rounded-md p-2 text-left text-sm hover:bg-surface-muted disabled:cursor-default disabled:hover:bg-transparent"
            >
              <span className="flex items-center gap-2">
                <Badge tone={issue.severity === "error" ? "negative" : "warning"}>
                  {issue.severity === "error" ? "Error" : "Warning"}
                </Badge>
              </span>
              <span className="text-ink-muted">{issue.message}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
