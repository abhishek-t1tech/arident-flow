"use client";

import { BottleneckEntry, ProcessGraph, findNode } from "@/domain";

interface BottleneckTableProps {
  bottlenecks: BottleneckEntry[];
  graph: ProcessGraph;
  onSelectTask?: (nodeId: string) => void;
}

export function BottleneckTable({ bottlenecks, graph, onSelectTask }: BottleneckTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
          <th className="px-4 py-2 font-medium">Rank</th>
          <th className="px-4 py-2 font-medium">Task</th>
          <th className="px-4 py-2 font-medium">Frequency</th>
          <th className="px-4 py-2 font-medium">Avg hours</th>
          <th className="px-4 py-2 font-medium">Share of cycle time</th>
        </tr>
      </thead>
      <tbody>
        {bottlenecks.map((entry) => {
          const node = findNode(graph, entry.nodeId);
          const name = node?.name ?? entry.nodeId;
          const sharePercent = entry.shareOfCycleTime * 100;

          return (
            <tr
              key={entry.nodeId}
              onClick={onSelectTask ? () => onSelectTask(entry.nodeId) : undefined}
              className={
                onSelectTask
                  ? "cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted"
                  : "border-b border-border last:border-0"
              }
            >
              <td className="tabular-nums px-4 py-2 text-ink-muted">{entry.rank}</td>
              <td className="px-4 py-2 text-ink">{name}</td>
              <td className="tabular-nums px-4 py-2 text-ink">{(entry.frequency * 100).toFixed(0)}%</td>
              <td className="tabular-nums px-4 py-2 text-ink">{entry.avgHours.toFixed(1)}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${Math.min(100, sharePercent)}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-xs text-ink-muted">{sharePercent.toFixed(0)}%</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
