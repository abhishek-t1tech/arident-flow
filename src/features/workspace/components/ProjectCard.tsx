"use client";

import { useState } from "react";
import { FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/Field";
import { ProjectRecord } from "@/infrastructure/persistence/schema";

function formatRelativeTime(timestampMs: number): string {
  const diffMs = Date.now() - timestampMs;
  const diffSeconds = Math.round(diffMs / 1000);
  if (diffSeconds < 60) return "just now";

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;

  const diffYears = Math.round(diffMonths / 12);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

interface ProjectCardProps {
  project: ProjectRecord;
  onOpen: (project: ProjectRecord) => void;
  onRename: (id: string, name: string) => Promise<void>;
  onDuplicate: (id: string, name: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectCard({ project, onOpen, onRename, onDuplicate, onDelete }: ProjectCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleRenameSubmit() {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === project.name) {
      setIsRenaming(false);
      setRenameValue(project.name);
      return;
    }
    setBusy(true);
    try {
      await onRename(project.id, trimmed);
      setIsRenaming(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleDuplicate() {
    setBusy(true);
    try {
      await onDuplicate(project.id, `${project.name} copy`);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteClick() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setBusy(true);
    try {
      await onDelete(project.id);
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand-600">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="flex flex-1 flex-col items-start gap-1 text-left"
      >
        {isRenaming ? (
          <div className="w-full" onClick={(event) => event.stopPropagation()}>
            <TextField
              label="Name"
              value={renameValue}
              onChange={setRenameValue}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleRenameSubmit();
                if (event.key === "Escape") {
                  setIsRenaming(false);
                  setRenameValue(project.name);
                }
              }}
            />
          </div>
        ) : (
          <span className="text-sm font-semibold text-ink">{project.name}</span>
        )}
        <span className="text-xs text-ink-muted">Updated {formatRelativeTime(project.updatedAt)}</span>
      </button>

      <div className="flex items-center gap-2">
        {isRenaming ? (
          <>
            <Button size="sm" variant="primary" disabled={busy} onClick={() => void handleRenameSubmit()}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setIsRenaming(false);
                setRenameValue(project.name);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setIsRenaming(true)}>
              <FiEdit2 aria-hidden />
              Rename
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => void handleDuplicate()}>
              <FiCopy aria-hidden />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={busy}
              onClick={() => void handleDeleteClick()}
              onBlur={() => setConfirmingDelete(false)}
            >
              <FiTrash2 aria-hidden />
              {confirmingDelete ? "Confirm delete" : "Delete"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
