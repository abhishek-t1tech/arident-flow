import { RunSummary, TaskContribution } from "./aggregate";

export interface BottleneckEntry extends TaskContribution {
  rank: number;
}

export function rankBottlenecks(summary: RunSummary): BottleneckEntry[] {
  return summary.taskContributions.map((contribution, index) => ({
    ...contribution,
    rank: index + 1,
  }));
}
