import { SimulationIteration, SimulationRunResult } from "../simulation/types";
import { mean, percentile, standardDeviation } from "./percentiles";

export interface TaskContribution {
  nodeId: string;
  frequency: number;
  totalHours: number;
  avgHours: number;
  shareOfCycleTime: number;
}

export interface PathFrequency {
  pathKey: string;
  flowIds: string[];
  count: number;
  frequency: number;
}

export interface RunSummary {
  sampleCount: number;
  meanHours: number;
  p50Hours: number;
  p90Hours: number;
  p95Hours: number;
  minHours: number;
  maxHours: number;
  stdDevHours: number;
  expectedCost: number;
  slaComplianceRate: number;
  slaBreachRate: number;
  taskContributions: TaskContribution[];
  pathFrequencies: PathFrequency[];
  configFingerprint: string;
  seed: number;
}

export function summarizeRun(result: SimulationRunResult): RunSummary {
  const { iterations } = result;
  const durations = iterations.map((it) => it.totalDurationHours);
  const costs = iterations.map((it) => it.totalCost);
  const sampleCount = iterations.length;

  const slaBreaches = iterations.filter((it) => it.slaBreached).length;

  return {
    sampleCount,
    meanHours: mean(durations),
    p50Hours: percentile(durations, 50),
    p90Hours: percentile(durations, 90),
    p95Hours: percentile(durations, 95),
    minHours: durations.length ? Math.min(...durations) : 0,
    maxHours: durations.length ? Math.max(...durations) : 0,
    stdDevHours: standardDeviation(durations),
    expectedCost: mean(costs),
    slaComplianceRate: sampleCount ? (sampleCount - slaBreaches) / sampleCount : 0,
    slaBreachRate: sampleCount ? slaBreaches / sampleCount : 0,
    taskContributions: summarizeTaskContributions(iterations, mean(durations)),
    pathFrequencies: summarizePathFrequencies(iterations),
    configFingerprint: result.configFingerprint,
    seed: result.seed,
  };
}

function summarizeTaskContributions(
  iterations: SimulationIteration[],
  meanCycleHours: number,
): TaskContribution[] {
  const totals = new Map<string, { totalHours: number; frequency: number }>();

  for (const iteration of iterations) {
    for (const [nodeId, hours] of Object.entries(iteration.taskDurationsHours)) {
      const entry = totals.get(nodeId) ?? { totalHours: 0, frequency: 0 };
      entry.totalHours += hours;
      entry.frequency += 1;
      totals.set(nodeId, entry);
    }
  }

  return Array.from(totals.entries())
    .map(([nodeId, { totalHours, frequency }]) => {
      const avgHours = totalHours / iterations.length;
      return {
        nodeId,
        frequency: frequency / iterations.length,
        totalHours,
        avgHours,
        shareOfCycleTime: meanCycleHours > 0 ? avgHours / meanCycleHours : 0,
      };
    })
    .sort((a, b) => b.totalHours - a.totalHours);
}

function summarizePathFrequencies(iterations: SimulationIteration[]): PathFrequency[] {
  const counts = new Map<string, { flowIds: string[]; count: number }>();

  for (const iteration of iterations) {
    const key = iteration.traversedFlowIds.join(">");
    const entry = counts.get(key) ?? { flowIds: iteration.traversedFlowIds, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }

  return Array.from(counts.entries())
    .map(([pathKey, { flowIds, count }]) => ({
      pathKey,
      flowIds,
      count,
      frequency: count / iterations.length,
    }))
    .sort((a, b) => b.count - a.count);
}
