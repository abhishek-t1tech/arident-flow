import { describe, expect, it } from "vitest";
import { runSimulation } from "./engine";
import { summarizeRun } from "../analytics/aggregate";
import {
  exclusiveGatewayConfig,
  exclusiveGatewayGraph,
  linearFixedDurationConfig,
  linearFixedDurationGraph,
} from "../../../tests/fixtures/graphs";

describe("determinism", () => {
  it("produces identical results for identical inputs and seed", () => {
    const graph = linearFixedDurationGraph();
    const config = linearFixedDurationConfig();

    const resultA = runSimulation(graph, config);
    const resultB = runSimulation(graph, config);

    expect(resultA).toEqual(resultB);
  });

  it("produces a different result for a different seed", () => {
    const graph = exclusiveGatewayGraph();
    const resultA = runSimulation(graph, exclusiveGatewayConfig({ seed: 1 }));
    const resultB = runSimulation(graph, exclusiveGatewayConfig({ seed: 2 }));

    expect(resultA.iterations).not.toEqual(resultB.iterations);
  });
});

describe("fixed duration processes", () => {
  it("produces the analytically predictable cycle time", () => {
    const graph = linearFixedDurationGraph();
    const config = linearFixedDurationConfig();
    const result = runSimulation(graph, config);
    const summary = summarizeRun(result);

    expect(summary.meanHours).toBeCloseTo(8, 5);
    expect(summary.p50Hours).toBeCloseTo(8, 5);
    expect(summary.stdDevHours).toBeCloseTo(0, 5);
    expect(summary.expectedCost).toBeCloseTo(150, 5);
  });
});

describe("exclusive gateway routing", () => {
  it("converges to configured branch probabilities over a large sample", () => {
    const graph = exclusiveGatewayGraph();
    const config = exclusiveGatewayConfig();
    const result = runSimulation(graph, config);
    const summary = summarizeRun(result);

    const pathA = summary.pathFrequencies.find((path) => path.pathKey === "f1>fa>f2");
    const pathB = summary.pathFrequencies.find((path) => path.pathKey === "f1>fb>f3");

    expect(pathA?.frequency ?? 0).toBeCloseTo(0.3, 1);
    expect(pathB?.frequency ?? 0).toBeCloseTo(0.7, 1);
  });
});

describe("SLA and percentile calculations", () => {
  it("matches known fixtures for a fixed-duration process", () => {
    const graph = linearFixedDurationGraph();
    const config = linearFixedDurationConfig({ slaTargetHours: 7 });
    const result = runSimulation(graph, config);
    const summary = summarizeRun(result);

    expect(summary.slaBreachRate).toBe(1);
    expect(summary.slaComplianceRate).toBe(0);
  });

  it("reports full compliance when the SLA target is never breached", () => {
    const graph = linearFixedDurationGraph();
    const config = linearFixedDurationConfig({ slaTargetHours: 9 });
    const result = runSimulation(graph, config);
    const summary = summarizeRun(result);

    expect(summary.slaComplianceRate).toBe(1);
  });
});
