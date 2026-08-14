import { describe, expect, it } from "vitest";
import { xmlToGraph } from "./mapping";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="defs" targetNamespace="http://aridentflow.local">
  <process id="p1" name="Purchase Approval" isExecutable="false">
    <startEvent id="start" name="Start" />
    <task id="t1" name="Review Request" />
    <exclusiveGateway id="gw" name="Amount check" />
    <task id="t2" name="Manager Approval" />
    <task id="t3" name="Auto Approve" />
    <endEvent id="end" name="End" />
    <sequenceFlow id="f1" sourceRef="start" targetRef="t1" />
    <sequenceFlow id="f2" sourceRef="t1" targetRef="gw" />
    <sequenceFlow id="f3" sourceRef="gw" targetRef="t2" />
    <sequenceFlow id="f4" sourceRef="gw" targetRef="t3" />
    <sequenceFlow id="f5" sourceRef="t2" targetRef="end" />
    <sequenceFlow id="f6" sourceRef="t3" targetRef="end" />
    <parallelGateway id="pg1" name="Unsupported fork" />
  </process>
</definitions>`;

describe("xmlToGraph", () => {
  it("maps supported BPMN elements into a domain process graph", async () => {
    const { graph, unsupportedElements } = await xmlToGraph(SAMPLE_XML);

    expect(graph.nodes).toHaveLength(6);
    expect(graph.flows).toHaveLength(6);
    expect(graph.nodes.find((n) => n.id === "gw")?.type).toBe("exclusiveGateway");
    expect(unsupportedElements.some((w) => w.elementId === "pg1")).toBe(true);
  });
});
