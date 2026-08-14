"use client";

import { ProcessGraph, RunSummary, rankBottlenecks } from "@/domain";
import { EmptyState, Panel } from "@/shared/ui/Panel";
import { KpiHeader } from "./components/KpiHeader";
import { KpiTiles } from "./components/KpiTiles";
import { DurationHistogram } from "./components/DurationHistogram";
import { BottleneckTable } from "./components/BottleneckTable";
import { PathFrequencyList } from "./components/PathFrequencyList";

interface AnalyticsWorkspaceProps {
  summary: RunSummary;
  runResult: { iterations: { totalDurationHours: number }[] } | null;
  graph: ProcessGraph;
  scenarioName: string;
  slaTargetHours: number;
  timestamp: number;
  onSelectTask?: (nodeId: string) => void;
}

export function AnalyticsWorkspace({
  summary,
  runResult,
  graph,
  scenarioName,
  slaTargetHours,
  timestamp,
  onSelectTask,
}: AnalyticsWorkspaceProps) {
  if (summary.sampleCount === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          title="No simulation run yet"
          description="Run a simulation to see analytics here."
        />
      </div>
    );
  }

  const bottlenecks = rankBottlenecks(summary);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <KpiHeader
        summary={summary}
        scenarioName={scenarioName}
        runSize={summary.sampleCount}
        configFingerprint={summary.configFingerprint}
        timestamp={timestamp}
      />

      <KpiTiles summary={summary} />

      {runResult ? (
        <Panel title="Cycle time distribution">
          <DurationHistogram iterations={runResult.iterations} slaTargetHours={slaTargetHours} />
        </Panel>
      ) : null}

      <Panel title="Bottleneck tasks">
        <BottleneckTable bottlenecks={bottlenecks} graph={graph} onSelectTask={onSelectTask} />
      </Panel>

      <Panel title="Most frequent paths">
        <div className="p-4">
          <PathFrequencyList pathFrequencies={summary.pathFrequencies} graph={graph} />
        </div>
      </Panel>
    </div>
  );
}
