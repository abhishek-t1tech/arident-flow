"use client";

import { RunSummary } from "@/domain";

interface KpiHeaderProps {
  summary: RunSummary;
  scenarioName: string;
  runSize: number;
  configFingerprint: string;
  timestamp: number;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function KpiHeader({ summary, scenarioName, runSize, configFingerprint, timestamp }: KpiHeaderProps) {
  const meanHours = summary.meanHours.toFixed(1);
  const p95Hours = summary.p95Hours.toFixed(1);
  const complianceLabel = (summary.slaComplianceRate * 100).toFixed(0);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-ink">
        Across {summary.sampleCount} simulated runs, expected cycle time is{" "}
        <span className="tabular-nums">{meanHours}</span> hours with a 95th-percentile of{" "}
        <span className="tabular-nums">{p95Hours}</span> hours &mdash; SLA compliance is{" "}
        <span className="tabular-nums">{complianceLabel}%</span>.
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span>
          Scenario: <span className="font-medium text-ink">{scenarioName}</span>
        </span>
        <span aria-hidden>&middot;</span>
        <span>
          Run size: <span className="tabular-nums font-medium text-ink">{runSize}</span> iterations
        </span>
        <span aria-hidden>&middot;</span>
        <span>
          Fingerprint: <span className="font-mono text-ink">{configFingerprint.slice(0, 8)}</span>
        </span>
        <span aria-hidden>&middot;</span>
        <span>{formatTimestamp(timestamp)}</span>
      </div>
    </div>
  );
}
