"use client";

import { PathFrequency, ProcessGraph } from "@/domain";

interface PathFrequencyListProps {
  pathFrequencies: PathFrequency[];
  graph: ProcessGraph;
}

const TOP_PATH_COUNT = 5;

export function PathFrequencyList({ pathFrequencies, graph }: PathFrequencyListProps) {
  const topPaths = pathFrequencies.slice(0, TOP_PATH_COUNT);

  return (
    <ul className="flex flex-col gap-2">
      {topPaths.map((path, index) => {
        const stepCount = path.flowIds.length;
        const label = describePath(path, graph);

        return (
          <li
            key={path.pathKey}
            className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="tabular-nums text-xs font-semibold text-ink-muted">#{index + 1}</span>
              <span className="text-sm text-ink">{label}</span>
              <span className="text-xs text-ink-muted">({stepCount} steps)</span>
            </div>
            <span className="tabular-nums text-sm font-semibold text-ink">
              {(path.frequency * 100).toFixed(0)}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function describePath(path: PathFrequency, graph: ProcessGraph): string {
  const flowNames = path.flowIds
    .map((flowId) => graph.flows.find((flow) => flow.id === flowId)?.name)
    .filter((name): name is string => Boolean(name));

  if (flowNames.length > 0) {
    return flowNames.slice(0, 3).join(" -> ") + (flowNames.length > 3 ? " -> ..." : "");
  }

  return `Path ${path.pathKey.slice(0, 12)}`;
}
