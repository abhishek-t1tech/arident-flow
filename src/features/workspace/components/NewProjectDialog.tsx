"use client";

import { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/Field";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void | Promise<void>;
}

export function NewProjectDialog({ open, onClose, onCreate }: NewProjectDialogProps) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const closeAndReset = useCallback(() => {
    setName("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAndReset();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeAndReset]);

  if (!open) return null;

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await onCreate(trimmed);
      setName("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-dialog-title"
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-project-dialog-title" className="text-sm font-semibold text-ink">
            New project
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={closeAndReset}
            className="text-ink-muted hover:text-ink"
          >
            <FiX aria-hidden />
          </button>
        </div>

        <TextField
          label="Project name"
          value={name}
          onChange={setName}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") void handleSubmit();
          }}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={closeAndReset} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleSubmit()} disabled={busy || !name.trim()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
