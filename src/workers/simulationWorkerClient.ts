import { SimulationRunResult, ProcessGraph, ScenarioConfig } from "@/domain";
import {
  DEFAULT_PROGRESS_INTERVAL_ITERATIONS,
  SimulationWorkerMessage,
} from "./protocol";

export interface SimulationProgress {
  completedIterations: number;
  totalIterations: number;
}

interface PendingRequest {
  resolve: (result: SimulationRunResult) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: SimulationProgress) => void;
}

export class SimulationWorkerClient {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRequest>();

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL("./simulation.worker.ts", import.meta.url), {
        type: "module",
      });
      this.worker.addEventListener("message", (event: MessageEvent<SimulationWorkerMessage>) => {
        this.handleMessage(event.data);
      });
    }
    return this.worker;
  }

  private handleMessage(message: SimulationWorkerMessage): void {
    const pending = this.pending.get(message.requestId);
    if (!pending) return;

    switch (message.type) {
      case "progress":
        pending.onProgress?.({
          completedIterations: message.completedIterations,
          totalIterations: message.totalIterations,
        });
        return;
      case "result":
        this.pending.delete(message.requestId);
        pending.resolve(message.result);
        return;
      case "error":
        this.pending.delete(message.requestId);
        pending.reject(new Error(message.message));
        return;
      case "cancelled":
        this.pending.delete(message.requestId);
        pending.reject(new DOMException("Simulation cancelled by user.", "AbortError"));
        return;
    }
  }

  run(
    graph: ProcessGraph,
    config: ScenarioConfig,
    onProgress?: (progress: SimulationProgress) => void,
  ): { requestId: string; promise: Promise<SimulationRunResult> } {
    const requestId = crypto.randomUUID();
    const worker = this.ensureWorker();

    const promise = new Promise<SimulationRunResult>((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject, onProgress });
      worker.postMessage({
        type: "run",
        requestId,
        graph,
        config,
        progressIntervalIterations: DEFAULT_PROGRESS_INTERVAL_ITERATIONS,
      });
    });

    return { requestId, promise };
  }

  cancel(requestId: string): void {
    this.worker?.postMessage({ type: "cancel", requestId });
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
  }
}
