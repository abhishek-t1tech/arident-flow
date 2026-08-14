"use client";

import { Button } from "@/shared/ui/Button";
import { FiPlay, FiSquare } from "react-icons/fi";
import { SimulationStatus } from "../hooks/useSimulationRun";
import { SimulationProgress } from "@/workers/simulationWorkerClient";

interface RunControlsProps {
  status: SimulationStatus;
  progress: SimulationProgress | null;
  ready: boolean;
  onRun: () => void;
  onCancel: () => void;
}

export function RunControls({ status, progress, ready, onRun, onCancel }: RunControlsProps) {
  const isRunning = status === "running";
  const percent = progress ? Math.round((progress.completedIterations / progress.totalIterations) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 p-4">
      {isRunning ? (
        <Button type="button" variant="danger" onClick={onCancel}>
          <FiSquare aria-hidden />
          Cancel simulation
        </Button>
      ) : (
        <Button type="button" variant="primary" onClick={onRun} disabled={!ready}>
          <FiPlay aria-hidden />
          Run simulation
        </Button>
      )}

      {isRunning && (
        <div className="flex flex-col gap-1" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-ink-muted tabular-nums">
            {progress?.completedIterations ?? 0} / {progress?.totalIterations ?? 0} iterations
          </span>
        </div>
      )}

      {!ready && !isRunning && (
        <p className="text-xs text-negative">Resolve validation errors before running a simulation.</p>
      )}
    </div>
  );
}
