"use client";

import { useState } from "react";
import { exportBpmnXml, exportProject } from "@/application/portabilityUseCases";
import { Button } from "@/shared/ui/Button";

interface ExportMenuProps {
  projectId: string;
}

type ExportKind = "package" | "bpmn" | null;

export function ExportMenu({ projectId }: ExportMenuProps) {
  const [pending, setPending] = useState<ExportKind>(null);
  const [error, setError] = useState<string | null>(null);

  const runExport = async (kind: Exclude<ExportKind, null>, action: () => Promise<void>) => {
    setPending(kind);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={pending !== null}
          onClick={() => runExport("package", () => exportProject(projectId))}
        >
          {pending === "package" ? "Exporting..." : "Export project package"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending !== null}
          onClick={() => runExport("bpmn", () => exportBpmnXml(projectId))}
        >
          {pending === "bpmn" ? "Exporting..." : "Export BPMN"}
        </Button>
      </div>
      {error ? <p className="text-xs text-negative">{error}</p> : null}
    </div>
  );
}
