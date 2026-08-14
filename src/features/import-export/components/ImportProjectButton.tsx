"use client";

import { ChangeEvent, useRef, useState } from "react";
import { importProjectPackage } from "@/application/portabilityUseCases";
import { MAX_IMPORT_FILE_SIZE_BYTES, readTextFile } from "@/infrastructure/files/download";
import { ProjectRecord } from "@/infrastructure/persistence/schema";
import { Button } from "@/shared/ui/Button";

interface ImportProjectButtonProps {
  onImported: (project: ProjectRecord) => void;
}

export function ImportProjectButton({ onImported }: ImportProjectButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
      setError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is ${
          MAX_IMPORT_FILE_SIZE_BYTES / (1024 * 1024)
        }MB.`,
      );
      return;
    }

    setLoading(true);
    try {
      const text = await readTextFile(file);
      const project = await importProjectPackage(text);
      onImported(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to import this project package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant="secondary"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "Importing..." : "Import project"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,.aridentflow.json"
        className="hidden"
        onChange={handleChange}
      />
      {error ? <p className="text-xs text-negative">{error}</p> : null}
    </div>
  );
}
