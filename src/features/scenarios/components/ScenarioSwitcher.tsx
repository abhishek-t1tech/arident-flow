"use client";

import { useState } from "react";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import { ScenarioRecord } from "@/infrastructure/persistence/schema";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

interface ScenarioSwitcherProps {
  scenarios: ScenarioRecord[];
  activeScenarioId: string;
  onSelect: (id: string) => void;
  onDuplicate: (scenario: ScenarioRecord) => void;
  onRename: (scenario: ScenarioRecord, name: string) => void;
  onDelete: (scenario: ScenarioRecord) => void;
}

function ScenarioTab({
  scenario,
  active,
  onSelect,
  onDuplicate,
  onRename,
  onDelete,
}: {
  scenario: ScenarioRecord;
  active: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(scenario.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const commitRename = () => {
    setEditing(false);
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== scenario.name) {
      onRename(trimmed);
    } else {
      setDraftName(scenario.name);
    }
  };

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setConfirmingDelete(false);
    onDelete();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
        active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-border bg-surface text-ink hover:bg-surface-muted",
      )}
    >
      {editing ? (
        <input
          autoFocus
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitRename();
            if (event.key === "Escape") {
              setDraftName(scenario.name);
              setEditing(false);
            }
          }}
          className="w-32 rounded border border-border bg-surface px-1 text-sm text-ink outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          onDoubleClick={() => setEditing(true)}
          className="font-medium"
        >
          {scenario.name}
        </button>
      )}

      {scenario.isBaseline ? <Badge tone="neutral">Baseline</Badge> : null}

      <button
        type="button"
        aria-label={`Duplicate ${scenario.name}`}
        onClick={onDuplicate}
        className={active ? "text-on-dark-muted hover:text-white" : "text-ink-muted hover:text-ink"}
      >
        <FiCopy aria-hidden />
      </button>

      {!scenario.isBaseline ? (
        <button
          type="button"
          aria-label={confirmingDelete ? `Confirm delete ${scenario.name}` : `Delete ${scenario.name}`}
          onClick={handleDeleteClick}
          onBlur={() => setConfirmingDelete(false)}
          className={cn(
            "flex items-center gap-1",
            active ? "text-on-dark-muted hover:text-white" : "text-ink-muted hover:text-negative",
            confirmingDelete && (active ? "font-semibold text-white" : "font-semibold text-negative"),
          )}
        >
          <FiTrash2 aria-hidden />
          {confirmingDelete ? "Confirm?" : null}
        </button>
      ) : null}
    </div>
  );
}

export function ScenarioSwitcher({
  scenarios,
  activeScenarioId,
  onSelect,
  onDuplicate,
  onRename,
  onDelete,
}: ScenarioSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {scenarios.map((scenario) => (
        <ScenarioTab
          key={scenario.id}
          scenario={scenario}
          active={scenario.id === activeScenarioId}
          onSelect={() => onSelect(scenario.id)}
          onDuplicate={() => onDuplicate(scenario)}
          onRename={(name) => onRename(scenario, name)}
          onDelete={() => onDelete(scenario)}
        />
      ))}
    </div>
  );
}
