import { ProcessGraph, ProcessNode, findNode, isGatewayNode, isTaskNode, outgoingFlows, startNodes } from "../process/types";
import { fingerprint } from "../analytics/fingerprint";
import { pickWeightedBranch, sampleDuration } from "./distributions";
import { createSeededRandom, RandomFn } from "./random";
import { ScenarioConfig, SimulationIteration, SimulationRunResult } from "./types";

const MAX_STEPS_MULTIPLIER = 25;

function taskAssumption(config: ScenarioConfig, nodeId: string) {
  return config.tasks.find((task) => task.nodeId === nodeId);
}

function gatewayAssumption(config: ScenarioConfig, nodeId: string) {
  return config.gateways.find((gateway) => gateway.nodeId === nodeId);
}

export function runIteration(
  graph: ProcessGraph,
  config: ScenarioConfig,
  rng: RandomFn,
): SimulationIteration {
  const start = startNodes(graph)[0];
  const maxSteps = graph.nodes.length * MAX_STEPS_MULTIPLIER;

  let current: ProcessNode | undefined = start;
  let totalDurationHours = 0;
  let totalCost = 0;
  const visitedNodeIds: string[] = [];
  const traversedFlowIds: string[] = [];
  const taskDurationsHours: Record<string, number> = {};
  let steps = 0;

  while (current && current.type !== "endEvent" && steps < maxSteps) {
    visitedNodeIds.push(current.id);

    if (isTaskNode(current)) {
      const assumption = taskAssumption(config, current.id);
      const duration = assumption ? sampleDuration(assumption.duration, rng) : 0;
      const cost = assumption?.cost ?? 0;
      totalDurationHours += duration;
      totalCost += cost;
      taskDurationsHours[current.id] = (taskDurationsHours[current.id] ?? 0) + duration;
    }

    const outgoing = outgoingFlows(graph, current.id);
    if (outgoing.length === 0) break;

    let chosenFlow = outgoing[0];
    if (isGatewayNode(current) && outgoing.length > 1) {
      const assumption = gatewayAssumption(config, current.id);
      const branchProbabilities =
        assumption?.branchProbabilities ??
        Object.fromEntries(outgoing.map((flow) => [flow.id, 1 / outgoing.length]));
      const chosenFlowId = pickWeightedBranch(branchProbabilities, rng);
      chosenFlow = outgoing.find((flow) => flow.id === chosenFlowId) ?? outgoing[0];
    }

    traversedFlowIds.push(chosenFlow.id);
    current = findNode(graph, chosenFlow.targetId);
    steps += 1;
  }

  if (current) {
    visitedNodeIds.push(current.id);
  }

  return {
    totalDurationHours,
    totalCost,
    visitedNodeIds,
    traversedFlowIds,
    taskDurationsHours,
    slaBreached: totalDurationHours > config.slaTargetHours,
  };
}

export function runSimulation(graph: ProcessGraph, config: ScenarioConfig): SimulationRunResult {
  const rng = createSeededRandom(config.seed);
  const iterations: SimulationIteration[] = [];

  for (let i = 0; i < config.iterations; i++) {
    iterations.push(runIteration(graph, config, rng));
  }

  return {
    iterations,
    configFingerprint: fingerprint({ graph, config }),
    seed: config.seed,
    iterationCount: config.iterations,
  };
}
