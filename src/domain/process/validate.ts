import { ScenarioConfig } from "../simulation/types";
import { canReachAnyEnd, unreachableNodeIds } from "./graph";
import { ProcessGraph, endNodes, isGatewayNode, isTaskNode, outgoingFlows, startNodes } from "./types";

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  elementId?: string;
}

export function validateStructure(graph: ProcessGraph): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const starts = startNodes(graph);
  const ends = endNodes(graph);

  if (starts.length === 0) {
    issues.push({ id: "missing-start", severity: "error", message: "The process is missing a start event." });
  } else if (starts.length > 1) {
    issues.push({
      id: "multiple-starts",
      severity: "error",
      message: "AridentFlow supports a single start event per process for the MVP.",
      elementId: starts[1].id,
    });
  }

  if (ends.length === 0) {
    issues.push({ id: "missing-end", severity: "error", message: "The process is missing an end event." });
  }

  for (const nodeId of unreachableNodeIds(graph)) {
    issues.push({
      id: `unreachable-${nodeId}`,
      severity: "error",
      message: "This element cannot be reached from the start event.",
      elementId: nodeId,
    });
  }

  if (starts.length > 0 && ends.length > 0 && !canReachAnyEnd(graph, starts[0].id)) {
    issues.push({
      id: "no-path-to-end",
      severity: "error",
      message: "No path connects the start event to an end event.",
      elementId: starts[0].id,
    });
  }

  for (const node of graph.nodes) {
    const isEnd = ends.some((end) => end.id === node.id);
    if (!isEnd && outgoingFlows(graph, node.id).length === 0) {
      issues.push({
        id: `dead-end-${node.id}`,
        severity: "error",
        message: "This element has no outgoing sequence flow.",
        elementId: node.id,
      });
    }
  }

  return issues;
}

export function validateSimulationReadiness(
  graph: ProcessGraph,
  config: ScenarioConfig,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const node of graph.nodes) {
    if (isTaskNode(node)) {
      const assumption = config.tasks.find((task) => task.nodeId === node.id);
      if (!assumption) {
        issues.push({
          id: `missing-task-config-${node.id}`,
          severity: "error",
          message: `"${node.name}" needs a duration and cost assumption before simulation.`,
          elementId: node.id,
        });
      } else if (
        assumption.duration.type === "triangular" &&
        !(assumption.duration.minHours <= assumption.duration.modeHours &&
          assumption.duration.modeHours <= assumption.duration.maxHours)
      ) {
        issues.push({
          id: `invalid-triangular-${node.id}`,
          severity: "error",
          message: `"${node.name}" has an invalid triangular duration: min ≤ mode ≤ max is required.`,
          elementId: node.id,
        });
      } else if (
        assumption.duration.type === "uniform" &&
        assumption.duration.minHours > assumption.duration.maxHours
      ) {
        issues.push({
          id: `invalid-uniform-${node.id}`,
          severity: "error",
          message: `"${node.name}" has an invalid uniform duration range.`,
          elementId: node.id,
        });
      }
    }

    if (isGatewayNode(node)) {
      const outgoing = outgoingFlows(graph, node.id);
      if (outgoing.length > 1) {
        const assumption = config.gateways.find((gateway) => gateway.nodeId === node.id);
        if (!assumption) {
          issues.push({
            id: `missing-gateway-config-${node.id}`,
            severity: "error",
            message: `"${node.name}" needs branch probabilities before simulation.`,
            elementId: node.id,
          });
        } else {
          const total = outgoing.reduce(
            (sum, flow) => sum + (assumption.branchProbabilities[flow.id] ?? 0),
            0,
          );
          if (Math.abs(total - 1) > 0.001) {
            issues.push({
              id: `unnormalized-gateway-${node.id}`,
              severity: "error",
              message: `"${node.name}" branch probabilities must sum to 100%. Currently ${(total * 100).toFixed(1)}%.`,
              elementId: node.id,
            });
          }
        }
      }
    }
  }

  if (config.slaTargetHours <= 0) {
    issues.push({
      id: "invalid-sla",
      severity: "error",
      message: "The process SLA target must be greater than zero.",
    });
  }

  if (config.iterations < 100) {
    issues.push({
      id: "low-iterations",
      severity: "warning",
      message: "Fewer than 100 iterations may produce noisy percentile estimates.",
    });
  }

  return issues;
}

export function isReadyToSimulate(issues: ValidationIssue[]): boolean {
  return !issues.some((issue) => issue.severity === "error");
}
