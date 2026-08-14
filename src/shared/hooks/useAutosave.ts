"use client";

import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave<T>(
  value: T,
  save: (value: T) => Promise<void>,
  delayMs = 800,
  resetKey?: unknown,
): AutosaveStatus {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const isFirstRun = useRef(true);
  const lastResetKey = useRef(resetKey);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  });

  useEffect(() => {
    if (lastResetKey.current !== resetKey) {
      lastResetKey.current = resetKey;
      isFirstRun.current = true;
    }
  }, [resetKey]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus("saving");
    const timeout = setTimeout(() => {
      saveRef.current(value)
        .then(() => setStatus("saved"))
        .catch(() => setStatus("error"));
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return status;
}
