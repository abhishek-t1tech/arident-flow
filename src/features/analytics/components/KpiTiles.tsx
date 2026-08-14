"use client";

import { RunSummary } from "@/domain";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

interface KpiTilesProps {
  summary: RunSummary;
}

interface Tile {
  label: string;
  statLabel: string;
  value: string;
  emphasize?: boolean;
}

const SLA_COMPLIANCE_THRESHOLD = 0.9;

export function KpiTiles({ summary }: KpiTilesProps) {
  const tiles: Tile[] = [
    { label: "Mean cycle time", statLabel: "Mean", value: `${summary.meanHours.toFixed(1)} h` },
    { label: "Typical cycle time", statLabel: "P50", value: `${summary.p50Hours.toFixed(1)} h` },
    { label: "Slow-case cycle time", statLabel: "P90", value: `${summary.p90Hours.toFixed(1)} h` },
    {
      label: "Worst-case cycle time",
      statLabel: "P95",
      value: `${summary.p95Hours.toFixed(1)} h`,
      emphasize: true,
    },
    { label: "Expected cost", statLabel: "Mean cost", value: `$${summary.expectedCost.toFixed(0)}` },
  ];

  const compliancePercent = summary.slaComplianceRate * 100;
  const isOnTrack = summary.slaComplianceRate >= SLA_COMPLIANCE_THRESHOLD;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className={cn(
            "flex flex-col gap-1 rounded-lg border border-border bg-surface p-4",
            tile.emphasize && "border-brand-700 bg-brand-700",
          )}
        >
          <span className={cn("text-xs font-medium", tile.emphasize ? "text-on-dark-muted" : "text-ink-muted")}>
            {tile.label} <span className={tile.emphasize ? "text-on-dark-muted" : "text-ink-muted"}>({tile.statLabel})</span>
          </span>
          <span
            className={cn(
              "tabular-nums text-2xl font-semibold",
              tile.emphasize ? "text-white" : "text-ink",
            )}
          >
            {tile.value}
          </span>
        </div>
      ))}
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
        <span className="text-xs font-medium text-ink-muted">SLA compliance</span>
        <span className="tabular-nums text-2xl font-semibold text-ink">{compliancePercent.toFixed(0)}%</span>
        <Badge tone={isOnTrack ? "positive" : "negative"}>{isOnTrack ? "On-time" : "At risk"}</Badge>
      </div>
    </div>
  );
}
