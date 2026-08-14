import { ProcessGraph } from "@/domain";
import { ScenarioConfig } from "@/domain";

export function linearFixedDurationGraph(): ProcessGraph {
  return {
    id: "graph-linear",
    name: "Linear fixed duration",
    nodes: [
      { id: "start", type: "startEvent", name: "Start" },
      { id: "taskA", type: "task", name: "Task A" },
      { id: "taskB", type: "task", name: "Task B" },
      { id: "end", type: "endEvent", name: "End" },
    ],
    flows: [
      { id: "f1", sourceId: "start", targetId: "taskA" },
      { id: "f2", sourceId: "taskA", targetId: "taskB" },
      { id: "f3", sourceId: "taskB", targetId: "end" },
    ],
  };
}

export function linearFixedDurationConfig(overrides?: Partial<ScenarioConfig>): ScenarioConfig {
  return {
    slaTargetHours: 10,
    iterations: 500,
    seed: 42,
    tasks: [
      { nodeId: "taskA", duration: { type: "fixed", hours: 3 }, cost: 100 },
      { nodeId: "taskB", duration: { type: "fixed", hours: 5 }, cost: 50 },
    ],
    gateways: [],
    ...overrides,
  };
}

export function exclusiveGatewayGraph(): ProcessGraph {
  return {
    id: "graph-gateway",
    name: "Exclusive gateway",
    nodes: [
      { id: "start", type: "startEvent", name: "Start" },
      { id: "gw", type: "exclusiveGateway", name: "Route" },
      { id: "taskA", type: "task", name: "Path A" },
      { id: "taskB", type: "task", name: "Path B" },
      { id: "end", type: "endEvent", name: "End" },
    ],
    flows: [
      { id: "f1", sourceId: "start", targetId: "gw" },
      { id: "fa", sourceId: "gw", targetId: "taskA" },
      { id: "fb", sourceId: "gw", targetId: "taskB" },
      { id: "f2", sourceId: "taskA", targetId: "end" },
      { id: "f3", sourceId: "taskB", targetId: "end" },
    ],
  };
}

export function exclusiveGatewayConfig(overrides?: Partial<ScenarioConfig>): ScenarioConfig {
  return {
    slaTargetHours: 10,
    iterations: 20000,
    seed: 7,
    tasks: [
      { nodeId: "taskA", duration: { type: "fixed", hours: 1 }, cost: 10 },
      { nodeId: "taskB", duration: { type: "fixed", hours: 2 }, cost: 20 },
    ],
    gateways: [{ nodeId: "gw", branchProbabilities: { fa: 0.3, fb: 0.7 } }],
    ...overrides,
  };
}
