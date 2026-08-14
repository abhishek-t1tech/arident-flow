import { ProcessGraph, ScenarioConfig, SimulationRunResult } from "@/domain";

export interface SimulationRunRequest {
  type: "run";
  requestId: string;
  graph: ProcessGraph;
  config: ScenarioConfig;
  progressIntervalIterations: number;
}

export interface SimulationCancelRequest {
  type: "cancel";
  requestId: string;
}

export type SimulationWorkerRequest = SimulationRunRequest | SimulationCancelRequest;

export interface SimulationProgressMessage {
  type: "progress";
  requestId: string;
  completedIterations: number;
  totalIterations: number;
}

export interface SimulationResultMessage {
  type: "result";
  requestId: string;
  result: SimulationRunResult;
}

export interface SimulationErrorMessage {
  type: "error";
  requestId: string;
  message: string;
}

export interface SimulationCancelledMessage {
  type: "cancelled";
  requestId: string;
}

export type SimulationWorkerMessage =
  | SimulationProgressMessage
  | SimulationResultMessage
  | SimulationErrorMessage
  | SimulationCancelledMessage;

export const DEFAULT_PROGRESS_INTERVAL_ITERATIONS = 500;
