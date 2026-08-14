export type ProcessNodeType =
  | "startEvent"
  | "endEvent"
  | "task"
  | "userTask"
  | "serviceTask"
  | "exclusiveGateway";

export interface ProcessNode {
  id: string;
  type: ProcessNodeType;
  name: string;
}

export interface SequenceFlow {
  id: string;
  sourceId: string;
  targetId: string;
  name?: string;
}

export interface ProcessGraph {
  id: string;
  name: string;
  nodes: ProcessNode[];
  flows: SequenceFlow[];
}

export function isTaskNode(node: ProcessNode): boolean {
  return node.type === "task" || node.type === "userTask" || node.type === "serviceTask";
}

export function isGatewayNode(node: ProcessNode): boolean {
  return node.type === "exclusiveGateway";
}

export function outgoingFlows(graph: ProcessGraph, nodeId: string): SequenceFlow[] {
  return graph.flows.filter((flow) => flow.sourceId === nodeId);
}

export function incomingFlows(graph: ProcessGraph, nodeId: string): SequenceFlow[] {
  return graph.flows.filter((flow) => flow.targetId === nodeId);
}

export function findNode(graph: ProcessGraph, nodeId: string): ProcessNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId);
}

export function startNodes(graph: ProcessGraph): ProcessNode[] {
  return graph.nodes.filter((node) => node.type === "startEvent");
}

export function endNodes(graph: ProcessGraph): ProcessNode[] {
  return graph.nodes.filter((node) => node.type === "endEvent");
}
