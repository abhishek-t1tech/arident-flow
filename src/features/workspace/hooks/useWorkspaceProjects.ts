"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SCENARIO_CONFIG,
  createProject,
  deleteProjectCascade,
  duplicateProjectWithScenarios,
  getRecentProjects,
  renameProject,
} from "@/application/projectUseCases";
import { ProjectRecord } from "@/infrastructure/persistence/schema";
import { EMPTY_PROCESS_XML } from "@/features/process-modeler/constants/emptyProcess";
import { ProcessTemplate } from "../templates";

export interface UseWorkspaceProjects {
  projects: ProjectRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
  createFromTemplate: (template: ProcessTemplate) => Promise<ProjectRecord>;
  createBlank: (name: string) => Promise<ProjectRecord>;
  rename: (id: string, name: string) => Promise<void>;
  duplicate: (id: string, name: string) => Promise<ProjectRecord>;
  remove: (id: string) => Promise<void>;
}

export function useWorkspaceProjects(): UseWorkspaceProjects {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const recent = await getRecentProjects();
    setProjects(recent);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getRecentProjects().then((recent) => {
      if (cancelled) return;
      setProjects(recent);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const createFromTemplate = useCallback(
    async (template: ProcessTemplate) => {
      const { project } = await createProject(template.name, template.bpmnXml, template.scenarioConfig);
      await refresh();
      return project;
    },
    [refresh],
  );

  const createBlank = useCallback(
    async (name: string) => {
      const { project } = await createProject(name, EMPTY_PROCESS_XML, DEFAULT_SCENARIO_CONFIG);
      await refresh();
      return project;
    },
    [refresh],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await renameProject(id, name);
      await refresh();
    },
    [refresh],
  );

  const duplicate = useCallback(
    async (id: string, name: string) => {
      const duplicated = await duplicateProjectWithScenarios(id, name);
      await refresh();
      return duplicated;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProjectCascade(id);
      await refresh();
    },
    [refresh],
  );

  return { projects, loading, refresh, createFromTemplate, createBlank, rename, duplicate, remove };
}
