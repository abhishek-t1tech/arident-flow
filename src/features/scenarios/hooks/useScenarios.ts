"use client";

import { useCallback, useEffect, useState } from "react";
import {
  duplicateScenario,
  listProjectScenarios,
  removeScenario,
  renameScenario,
} from "@/application/scenarioUseCases";
import { ScenarioRecord } from "@/infrastructure/persistence/schema";

export interface UseScenarios {
  scenarios: ScenarioRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
  duplicate: (scenarioId: string, newName: string) => Promise<ScenarioRecord>;
  rename: (scenarioId: string, name: string) => Promise<void>;
  remove: (scenarioId: string) => Promise<void>;
}

export function useScenarios(projectId: string): UseScenarios {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await listProjectScenarios(projectId);
    setScenarios(list);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    listProjectScenarios(projectId).then((list) => {
      if (cancelled) return;
      setScenarios(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const duplicate = useCallback(
    async (scenarioId: string, newName: string) => {
      const created = await duplicateScenario(scenarioId, newName);
      await refresh();
      return created;
    },
    [refresh],
  );

  const rename = useCallback(
    async (scenarioId: string, name: string) => {
      await renameScenario(scenarioId, name);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (scenarioId: string) => {
      await removeScenario(scenarioId);
      await refresh();
    },
    [refresh],
  );

  return { scenarios, loading, refresh, duplicate, rename, remove };
}
