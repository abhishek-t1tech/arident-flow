import { describe, expect, it } from "vitest";
import { validateStructure, validateSimulationReadiness, isReadyToSimulate } from "./validate";
import { linearFixedDurationConfig, linearFixedDurationGraph } from "../../../tests/fixtures/graphs";

describe("validateStructure", () => {
  it("passes a well-formed linear process", () => {
    const issues = validateStructure(linearFixedDurationGraph());
    expect(issues).toHaveLength(0);
  });

  it("flags an unreachable element", () => {
    const graph = linearFixedDurationGraph();
    graph.nodes.push({ id: "orphan", type: "task", name: "Orphan" });
    const issues = validateStructure(graph);
    expect(issues.some((issue) => issue.elementId === "orphan")).toBe(true);
  });

  it("flags a missing start event", () => {
    const graph = linearFixedDurationGraph();
    graph.nodes = graph.nodes.filter((node) => node.type !== "startEvent");
    const issues = validateStructure(graph);
    expect(issues.some((issue) => issue.id === "missing-start")).toBe(true);
  });
});

describe("validateSimulationReadiness", () => {
  it("is ready when every task and gateway is configured", () => {
    const issues = validateSimulationReadiness(linearFixedDurationGraph(), linearFixedDurationConfig());
    expect(isReadyToSimulate(issues)).toBe(true);
  });

  it("blocks simulation when a task assumption is missing", () => {
    const config = linearFixedDurationConfig({ tasks: [] });
    const issues = validateSimulationReadiness(linearFixedDurationGraph(), config);
    expect(isReadyToSimulate(issues)).toBe(false);
  });
});
