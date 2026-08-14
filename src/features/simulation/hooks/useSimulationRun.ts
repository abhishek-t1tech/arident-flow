"use client";

import { RunSummary, SimulationRunResult } from "@/domain";
import { runScenarioSimulation } from "@/application/simulationUseCases";
import { ScenarioRecord } from "@/infrastructure/persistence/schema";
import { SimulationProgress, SimulationWorkerClient } from "@/workers/simulationWorkerClient";
import { useCallback, useEffect, useRef, useState } from "react";

export type SimulationStatus = "idle" | "running" | "completed" | "error" | "cancelled";

interface SimulationRunState {
  status: SimulationStatus;
  progress: SimulationProgress | null;
  summary: RunSummary | null;
  rawResult: SimulationRunResult | null;
  error: string | null;
}

export function useSimulationRun() {
  const workerRef = useRef<SimulationWorkerClient | null>(null);
  const requestIdRef = useRef<string | null>(null);
  const [state, setState] = useState<SimulationRunState>({
    status: "idle",
    progress: null,
    summary: null,
    rawResult: null,
    error: null,
  });

  useEffect(() => {
    return () => {
      workerRef.current?.dispose();
    };
  }, []);

  const run = useCallback(async (bpmnXml: string, scenario: ScenarioRecord) => {
    if (!workerRef.current) {
      workerRef.current = new SimulationWorkerClient();
    }

    setState({ status: "running", progress: null, summary: null, rawResult: null, error: null });

    try {
      const { summary, result } = await runScenarioSimulation(
        workerRef.current,
        bpmnXml,
        scenario,
        (progress) => setState((prev) => ({ ...prev, progress })),
        (requestId) => {
          requestIdRef.current = requestId;
        },
      );
      setState({ status: "completed", progress: null, summary, rawResult: result, error: null });
      return summary;
    } catch (error) {
      const isCancelled = error instanceof DOMException && error.name === "AbortError";
      setState({
        status: isCancelled ? "cancelled" : "error",
        progress: null,
        summary: null,
        rawResult: null,
        error: isCancelled ? null : error instanceof Error ? error.message : "Simulation failed.",
      });
      return null;
    } finally {
      requestIdRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (requestIdRef.current && workerRef.current) {
      workerRef.current.cancel(requestIdRef.current);
    }
  }, []);

  return { ...state, run, cancel };
}
