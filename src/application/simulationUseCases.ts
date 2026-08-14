import {
  isReadyToSimulate,
  RunSummary,
  SimulationRunResult,
  summarizeRun,
  validateSimulationReadiness,
  validateStructure,
  ValidationIssue,
} from "@/domain";
import { xmlToGraph } from "@/infrastructure/bpmn/mapping";
import { putSimulationRun } from "@/infrastructure/persistence/repositories/simulationRunRepository";
import { ScenarioRecord, SimulationRunRecord } from "@/infrastructure/persistence/schema";
import { SimulationProgress, SimulationWorkerClient } from "@/workers/simulationWorkerClient";

export interface SimulationReadinessCheck {
  ready: boolean;
  issues: ValidationIssue[];
}

export async function checkSimulationReadiness(
  bpmnXml: string,
  scenario: ScenarioRecord,
): Promise<SimulationReadinessCheck> {
  const { graph } = await xmlToGraph(bpmnXml);
  const issues = [
    ...validateStructure(graph),
    ...validateSimulationReadiness(graph, scenario.config),
  ];
  return { ready: isReadyToSimulate(issues), issues };
}

export async function runScenarioSimulation(
  worker: SimulationWorkerClient,
  bpmnXml: string,
  scenario: ScenarioRecord,
  onProgress?: (progress: SimulationProgress) => void,
  onStart?: (requestId: string) => void,
): Promise<{ summary: RunSummary; record: SimulationRunRecord; requestId: string; result: SimulationRunResult }> {
  const { graph } = await xmlToGraph(bpmnXml);
  const readiness = [
    ...validateStructure(graph),
    ...validateSimulationReadiness(graph, scenario.config),
  ];

  if (!isReadyToSimulate(readiness)) {
    throw new Error("The process is not ready to simulate. Resolve validation errors first.");
  }

  const { requestId, promise } = worker.run(graph, scenario.config, onProgress);
  onStart?.(requestId);
  const result = await promise;
  const summary = summarizeRun(result);

  const record: SimulationRunRecord = {
    id: crypto.randomUUID(),
    projectId: scenario.projectId,
    scenarioId: scenario.id,
    seed: scenario.config.seed,
    iterations: scenario.config.iterations,
    configFingerprint: result.configFingerprint,
    summary: summary as unknown as Record<string, unknown>,
    createdAt: Date.now(),
  };

  await putSimulationRun(record);

  return { summary, record, requestId, result };
}
