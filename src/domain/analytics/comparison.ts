import { RunSummary } from "./aggregate";

export type DeltaDirection = "improved" | "regressed" | "unchanged";

export interface MetricDelta {
  baseline: number;
  proposed: number;
  absoluteDelta: number;
  percentageDelta: number;
  direction: DeltaDirection;
}

export interface ScenarioComparison {
  cycleTimeMean: MetricDelta;
  cycleTimeP95: MetricDelta;
  expectedCost: MetricDelta;
  slaComplianceRate: MetricDelta;
  isStale: boolean;
}

function buildDelta(baseline: number, proposed: number, lowerIsBetter: boolean): MetricDelta {
  const absoluteDelta = proposed - baseline;
  const percentageDelta = baseline !== 0 ? absoluteDelta / baseline : 0;

  let direction: DeltaDirection = "unchanged";
  if (absoluteDelta !== 0) {
    const proposedIsBetter = lowerIsBetter ? absoluteDelta < 0 : absoluteDelta > 0;
    direction = proposedIsBetter ? "improved" : "regressed";
  }

  return { baseline, proposed, absoluteDelta, percentageDelta, direction };
}

export function compareScenarios(
  baseline: RunSummary,
  proposed: RunSummary,
  baselineFingerprintExpected?: string,
): ScenarioComparison {
  return {
    cycleTimeMean: buildDelta(baseline.meanHours, proposed.meanHours, true),
    cycleTimeP95: buildDelta(baseline.p95Hours, proposed.p95Hours, true),
    expectedCost: buildDelta(baseline.expectedCost, proposed.expectedCost, true),
    slaComplianceRate: buildDelta(baseline.slaComplianceRate, proposed.slaComplianceRate, false),
    isStale: Boolean(
      baselineFingerprintExpected && baselineFingerprintExpected !== baseline.configFingerprint,
    ),
  };
}
