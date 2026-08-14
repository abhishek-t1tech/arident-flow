import { RunSummary, compareScenarios } from "@/domain";
import { ProjectRecord, ScenarioRecord } from "@/infrastructure/persistence/schema";

interface ScenarioSide {
  scenario: ScenarioRecord;
  summary: RunSummary;
}

interface ExecutiveReportProps {
  project: ProjectRecord;
  baseline: ScenarioSide;
  proposed?: ScenarioSide;
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

function KpiRow({
  label,
  baselineValue,
  proposedValue,
}: {
  label: string;
  baselineValue: string;
  proposedValue?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-border py-2 text-sm print:border-black">
      <span className="font-medium text-ink print:text-black">{label}</span>
      <span className="tabular-nums text-ink print:text-black">{baselineValue}</span>
      <span className="tabular-nums text-ink print:text-black">{proposedValue ?? "-"}</span>
    </div>
  );
}

function buildNarrative(project: ProjectRecord, baseline: ScenarioSide, proposed?: ScenarioSide): string {
  const baselineSentence = `${project.name} baseline shows a P95 cycle time of ${formatHours(
    baseline.summary.p95Hours,
  )} with ${formatPercent(baseline.summary.slaComplianceRate)} SLA compliance.`;

  if (!proposed) {
    return baselineSentence;
  }

  const comparison = compareScenarios(baseline.summary, proposed.summary);
  const speedWord = comparison.cycleTimeP95.direction === "improved" ? "faster" : "slower";
  const speedPercent = Math.abs(comparison.cycleTimeP95.percentageDelta * 100).toFixed(1);

  return `${baselineSentence} The proposed scenario '${proposed.scenario.name}' would change this to ${formatHours(
    proposed.summary.p95Hours,
  )} (${speedPercent}% ${speedWord}) with ${formatPercent(proposed.summary.slaComplianceRate)} SLA compliance.`;
}

export function ExecutiveReport({ project, baseline, proposed }: ExecutiveReportProps) {
  const narrative = buildNarrative(project, baseline, proposed);

  return (
    <div className="flex flex-col gap-6 bg-surface p-8 text-ink print:bg-white print:p-0 print:text-black">
      <header className="flex flex-col gap-1 border-b border-border pb-4 print:border-black">
        <h1 className="text-xl font-semibold text-ink print:text-black">{project.name}</h1>
        <p className="text-sm text-ink-muted print:text-black">
          Executive summary — {baseline.scenario.name}
          {proposed ? ` vs. ${proposed.scenario.name}` : ""}
        </p>
      </header>

      <section className="flex flex-col gap-1">
        <div className="grid grid-cols-3 gap-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted print:border-black print:text-black">
          <span>Metric</span>
          <span>{baseline.scenario.name}</span>
          <span>{proposed ? proposed.scenario.name : "Proposed"}</span>
        </div>
        <KpiRow
          label="Cycle time (mean)"
          baselineValue={formatHours(baseline.summary.meanHours)}
          proposedValue={proposed ? formatHours(proposed.summary.meanHours) : undefined}
        />
        <KpiRow
          label="Cycle time (P95)"
          baselineValue={formatHours(baseline.summary.p95Hours)}
          proposedValue={proposed ? formatHours(proposed.summary.p95Hours) : undefined}
        />
        <KpiRow
          label="Expected cost"
          baselineValue={formatCurrency(baseline.summary.expectedCost)}
          proposedValue={proposed ? formatCurrency(proposed.summary.expectedCost) : undefined}
        />
        <KpiRow
          label="SLA compliance rate"
          baselineValue={formatPercent(baseline.summary.slaComplianceRate)}
          proposedValue={proposed ? formatPercent(proposed.summary.slaComplianceRate) : undefined}
        />
      </section>

      <section className="flex flex-col gap-2 print:break-inside-avoid">
        <h2 className="text-sm font-semibold text-ink print:text-black">Summary</h2>
        <p className="text-sm leading-relaxed text-ink-muted print:text-black">{narrative}</p>
      </section>
    </div>
  );
}
