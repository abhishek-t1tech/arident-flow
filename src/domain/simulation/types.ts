export type DurationDistribution =
  | { type: "fixed"; hours: number }
  | { type: "uniform"; minHours: number; maxHours: number }
  | { type: "triangular"; minHours: number; modeHours: number; maxHours: number };

export interface TaskAssumption {
  nodeId: string;
  duration: DurationDistribution;
  cost: number;
  resourceLabel?: string;
}

export interface GatewayAssumption {
  nodeId: string;
  branchProbabilities: Record<string, number>;
}

export interface ScenarioConfig {
  slaTargetHours: number;
  iterations: number;
  seed: number;
  tasks: TaskAssumption[];
  gateways: GatewayAssumption[];
}

export interface SimulationIteration {
  totalDurationHours: number;
  totalCost: number;
  visitedNodeIds: string[];
  traversedFlowIds: string[];
  taskDurationsHours: Record<string, number>;
  slaBreached: boolean;
}

export interface SimulationRunResult {
  iterations: SimulationIteration[];
  configFingerprint: string;
  seed: number;
  iterationCount: number;
}
