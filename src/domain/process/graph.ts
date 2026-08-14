import { ProcessGraph, endNodes, outgoingFlows, startNodes } from "./types";

export function reachableFrom(graph: ProcessGraph, originId: string): Set<string> {
  const visited = new Set<string>();
  const queue = [originId];

  while (queue.length > 0) {
    const current = queue.shift() as string;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const flow of outgoingFlows(graph, current)) {
      if (!visited.has(flow.targetId)) {
        queue.push(flow.targetId);
      }
    }
  }

  return visited;
}

export function unreachableNodeIds(graph: ProcessGraph): string[] {
  const starts = startNodes(graph);
  if (starts.length === 0) {
    return graph.nodes.map((node) => node.id);
  }

  const reachable = new Set<string>();
  for (const start of starts) {
    for (const id of reachableFrom(graph, start.id)) {
      reachable.add(id);
    }
  }

  return graph.nodes.filter((node) => !reachable.has(node.id)).map((node) => node.id);
}

export function canReachAnyEnd(graph: ProcessGraph, originId: string): boolean {
  const ends = new Set(endNodes(graph).map((node) => node.id));
  if (ends.size === 0) return false;
  const reached = reachableFrom(graph, originId);
  for (const endId of ends) {
    if (reached.has(endId)) return true;
  }
  return false;
}

export function deadEndNodeIds(graph: ProcessGraph): string[] {
  const ends = endNodes(graph);
  return graph.nodes
    .filter((node) => !ends.some((end) => end.id === node.id))
    .filter((node) => outgoingFlows(graph, node.id).length === 0)
    .map((node) => node.id);
}
