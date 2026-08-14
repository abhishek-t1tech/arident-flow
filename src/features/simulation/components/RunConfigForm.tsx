"use client";

import { ScenarioConfig } from "@/domain";
import { randomSeed } from "@/domain";
import { Button } from "@/shared/ui/Button";
import { NumberField } from "@/shared/ui/Field";
import { FiRefreshCw } from "react-icons/fi";

interface RunConfigFormProps {
  config: ScenarioConfig;
  onChange: (config: ScenarioConfig) => void;
}

export function RunConfigForm({ config, onChange }: RunConfigFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <NumberField
        label="SLA target (hours)"
        value={config.slaTargetHours}
        min={0.1}
        step={0.5}
        onChange={(slaTargetHours) => onChange({ ...config, slaTargetHours })}
      />
      <NumberField
        label="Iterations"
        hint="Higher counts produce steadier percentile estimates."
        value={config.iterations}
        min={100}
        max={100000}
        step={100}
        onChange={(iterations) => onChange({ ...config, iterations })}
      />
      <div className="flex items-end gap-2">
        <NumberField
          label="Seed"
          hint="Same seed and inputs always reproduce the same result."
          value={config.seed}
          onChange={(seed) => onChange({ ...config, seed })}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => onChange({ ...config, seed: randomSeed() })}
          aria-label="Regenerate seed"
        >
          <FiRefreshCw aria-hidden />
        </Button>
      </div>
    </div>
  );
}
