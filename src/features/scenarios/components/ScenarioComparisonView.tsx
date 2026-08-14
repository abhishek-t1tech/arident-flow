"use client";

import { ReactNode } from "react";
import { RunSummary, ScenarioComparison, compareScenarios, DeltaDirection } from "@/domain";
import { ScenarioRecord } from "@/infrastructure/persistence/schema";
import { Badge, BadgeTone } from "@/shared/ui/Badge";
import { EmptyState } from "@/shared/ui/Panel";
import { Button } from "@/shared/ui/Button";

interface ScenarioSide {
  scenario: ScenarioRecord;
  summary: RunSummary;
}

interface ScenarioComparisonViewProps {
  baseline: ScenarioSide | null;
  proposed: ScenarioSide | null;
  onOpenWhyThisChanged?: () => void;
}

const directionTone: Record<DeltaDirection, BadgeTone> = {
  improved: "positive",
  regressed: "negative",
  unchanged: "neutral",
};

function directionLabel(direction: DeltaDirection, words: [string, string, string]): string {
  if (direction === "improved") return words[0];
  if (direction === "regressed") return words[1];
  return words[2];
}

function formatHours(value: number): string {
  return `${value.toFixed(1)}h`;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function DeltaRow({
  label,
  baselineValue,
  proposedValue,
  delta,
  words,
}: {
  label: string;
  baselineValue: string;
  proposedValue: string;
  delta: ScenarioComparison["cycleTimeMean"];
  words: [string, string, string];
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border py-3 text-sm last:border-b-0">
      <span className="font-medium text-ink">{label}</span>
      <span className="tabular-nums text-ink-muted">{baselineValue}</span>
      <span className="tabular-nums text-ink">{proposedValue}</span>
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-xs text-ink-muted">
          {delta.absoluteDelta >= 0 ? "+" : ""}
          {delta.percentageDelta !== 0 ? formatPercent(delta.percentageDelta) : "0%"}
        </span>
        <Badge tone={directionTone[delta.direction]}>{directionLabel(delta.direction, words)}</Badge>
      </div>
    </div>
  );
}

export function ScenarioComparisonView({
  baseline,
  proposed,
  onOpenWhyThisChanged,
}: ScenarioComparisonViewProps): ReactNode {
  if (!baseline || !proposed) {
    return (
      <EmptyState
        title="Comparison unavailable"
        description="Both scenarios need a completed simulation run before they can be compared. Run the simulation for each scenario, then return here."
      />
    );
  }

  const comparison = compareScenarios(baseline.summary, proposed.summary);

  return (
    <div className="flex flex-col gap-4">
      {comparison.isStale ? (
        <div className="flex items-center gap-2 rounded-md border border-warning bg-warning-muted px-3 py-2">
          <Badge tone="warning">Stale</Badge>
          <span className="text-sm text-ink">
            These results may be stale — a scenario assumption has changed since the last run.
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <span>Metric</span>
        <span>{baseline.scenario.name}</span>
        <span>{proposed.scenario.name}</span>
        <span>Delta</span>
      </div>

      <div>
        <DeltaRow
          label="Cycle time (mean)"
          baselineValue={formatHours(comparison.cycleTimeMean.baseline)}
          proposedValue={formatHours(comparison.cycleTimeMean.proposed)}
          delta={comparison.cycleTimeMean}
          words={["Faster", "Slower", "No change"]}
        />
        <DeltaRow
          label="Cycle time (P95)"
          baselineValue={formatHours(comparison.cycleTimeP95.baseline)}
          proposedValue={formatHours(comparison.cycleTimeP95.proposed)}
          delta={comparison.cycleTimeP95}
          words={["Faster", "Slower", "No change"]}
        />
        <DeltaRow
          label="Expected cost"
          baselineValue={formatCurrency(comparison.expectedCost.baseline)}
          proposedValue={formatCurrency(comparison.expectedCost.proposed)}
          delta={comparison.expectedCost}
          words={["Cheaper", "More expensive", "No change"]}
        />
        <DeltaRow
          label="SLA compliance rate"
          baselineValue={formatPercent(comparison.slaComplianceRate.baseline)}
          proposedValue={formatPercent(comparison.slaComplianceRate.proposed)}
          delta={comparison.slaComplianceRate}
          words={["More reliable", "Less reliable", "No change"]}
        />
      </div>

      {onOpenWhyThisChanged ? (
        <div>
          <Button variant="secondary" size="sm" onClick={onOpenWhyThisChanged}>
            Why this changed
          </Button>
        </div>
      ) : null}
    </div>
  );
}
