"use client";

import { DurationDistribution, GatewayAssumption, ProcessGraph, ScenarioConfig, TaskAssumption, outgoingFlows } from "@/domain";
import { NumberField, SelectField } from "@/shared/ui/Field";
import { EmptyState } from "@/shared/ui/Panel";
import { ModelerSelection } from "./ModelerCanvas";

interface PropertiesInspectorProps {
  selection: ModelerSelection;
  graph: ProcessGraph | null;
  config: ScenarioConfig;
  onConfigChange: (config: ScenarioConfig) => void;
}

const DISTRIBUTION_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "uniform", label: "Uniform" },
  { value: "triangular", label: "Triangular" },
];

export function PropertiesInspector({ selection, graph, config, onConfigChange }: PropertiesInspectorProps) {
  if (!selection.elementId || !graph) {
    return (
      <EmptyState
        title="No element selected"
        description="Select a task or gateway on the canvas to configure its simulation assumptions."
      />
    );
  }

  const node = graph.nodes.find((n) => n.id === selection.elementId);
  if (!node) {
    return (
      <EmptyState
        title="Element not simulated"
        description="This element type is not part of AridentFlow's supported simulation semantics."
      />
    );
  }

  if (node.type === "task" || node.type === "userTask" || node.type === "serviceTask") {
    const assumption = config.tasks.find((task) => task.nodeId === node.id) ?? {
      nodeId: node.id,
      duration: { type: "fixed", hours: 1 } as DurationDistribution,
      cost: 0,
    };

    function updateTask(next: TaskAssumption) {
      const tasks = config.tasks.filter((task) => task.nodeId !== node!.id);
      onConfigChange({ ...config, tasks: [...tasks, next] });
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm font-semibold text-ink">{node.name}</p>
        <SelectField
          label="Duration distribution"
          value={assumption.duration.type}
          onChange={(type) => updateTask({ ...assumption, duration: distributionForType(type, assumption.duration) })}
          options={DISTRIBUTION_OPTIONS}
        />
        <DurationFields
          distribution={assumption.duration}
          onChange={(duration) => updateTask({ ...assumption, duration })}
        />
        <NumberField
          label="Fixed cost"
          hint="Cost incurred each time this task executes."
          value={assumption.cost}
          min={0}
          step={1}
          onChange={(cost) => updateTask({ ...assumption, cost })}
        />
      </div>
    );
  }

  if (node.type === "exclusiveGateway") {
    const outgoing = outgoingFlows(graph, node.id);
    if (outgoing.length <= 1) {
      return (
        <EmptyState
          title="No branching configured"
          description="This gateway currently has one outgoing path, so no probability is required."
        />
      );
    }

    const assumption: GatewayAssumption =
      config.gateways.find((gateway) => gateway.nodeId === node.id) ?? {
        nodeId: node.id,
        branchProbabilities: Object.fromEntries(outgoing.map((flow) => [flow.id, 1 / outgoing.length])),
      };

    function updateGateway(next: GatewayAssumption) {
      const gateways = config.gateways.filter((gateway) => gateway.nodeId !== node!.id);
      onConfigChange({ ...config, gateways: [...gateways, next] });
    }

    const total = outgoing.reduce((sum, flow) => sum + (assumption.branchProbabilities[flow.id] ?? 0), 0);

    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm font-semibold text-ink">{node.name}</p>
        <p className="text-xs text-ink-muted">Branch probabilities must sum to 100%.</p>
        {outgoing.map((flow) => (
          <NumberField
            key={flow.id}
            label={flow.name || `Path ${flow.id}`}
            value={Math.round((assumption.branchProbabilities[flow.id] ?? 0) * 1000) / 10}
            min={0}
            max={100}
            step={1}
            onChange={(percent) =>
              updateGateway({
                ...assumption,
                branchProbabilities: { ...assumption.branchProbabilities, [flow.id]: percent / 100 },
              })
            }
          />
        ))}
        <p className={`text-xs font-semibold ${Math.abs(total - 1) > 0.001 ? "text-negative" : "text-positive"}`}>
          Total: {(total * 100).toFixed(1)}%
        </p>
      </div>
    );
  }

  return (
    <EmptyState
      title={node.name}
      description="Start and end events do not require simulation assumptions."
    />
  );
}

function distributionForType(type: string, previous: DurationDistribution): DurationDistribution {
  if (type === "fixed") return { type: "fixed", hours: hoursOf(previous) };
  if (type === "uniform") return { type: "uniform", minHours: hoursOf(previous), maxHours: hoursOf(previous) + 1 };
  return { type: "triangular", minHours: hoursOf(previous), modeHours: hoursOf(previous), maxHours: hoursOf(previous) + 1 };
}

function hoursOf(distribution: DurationDistribution): number {
  if (distribution.type === "fixed") return distribution.hours;
  if (distribution.type === "uniform") return distribution.minHours;
  return distribution.minHours;
}

function DurationFields({
  distribution,
  onChange,
}: {
  distribution: DurationDistribution;
  onChange: (distribution: DurationDistribution) => void;
}) {
  if (distribution.type === "fixed") {
    return (
      <NumberField
        label="Duration (hours)"
        value={distribution.hours}
        min={0}
        step={0.25}
        onChange={(hours) => onChange({ type: "fixed", hours })}
      />
    );
  }

  if (distribution.type === "uniform") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Min hours"
          value={distribution.minHours}
          min={0}
          step={0.25}
          onChange={(minHours) => onChange({ ...distribution, minHours })}
        />
        <NumberField
          label="Max hours"
          value={distribution.maxHours}
          min={0}
          step={0.25}
          onChange={(maxHours) => onChange({ ...distribution, maxHours })}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <NumberField
        label="Min"
        value={distribution.minHours}
        min={0}
        step={0.25}
        onChange={(minHours) => onChange({ ...distribution, minHours })}
      />
      <NumberField
        label="Mode"
        value={distribution.modeHours}
        min={0}
        step={0.25}
        onChange={(modeHours) => onChange({ ...distribution, modeHours })}
      />
      <NumberField
        label="Max"
        value={distribution.maxHours}
        min={0}
        step={0.25}
        onChange={(maxHours) => onChange({ ...distribution, maxHours })}
      />
    </div>
  );
}
