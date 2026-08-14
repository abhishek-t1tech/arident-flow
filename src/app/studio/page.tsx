"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { listScenarios } from "@/infrastructure/persistence/repositories/scenarioRepository";
import { ProjectRecord } from "@/infrastructure/persistence/schema";
import { StudioShell } from "@/features/studio/StudioShell";
import { WorkspaceScreen } from "@/features/workspace/components/WorkspaceScreen";

function StudioRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const scenarioId = searchParams.get("scenario");

  const openProject = useCallback(
    async (project: ProjectRecord) => {
      const scenarios = await listScenarios(project.id);
      const baseline = scenarios.find((scenario) => scenario.isBaseline) ?? scenarios[0];
      const params = new URLSearchParams({ project: project.id });
      if (baseline) params.set("scenario", baseline.id);
      router.push(`/studio?${params.toString()}`);
    },
    [router],
  );

  const exitToWorkspace = useCallback(() => {
    router.push("/studio");
  }, [router]);

  const changeScenario = useCallback(
    (nextScenarioId: string) => {
      if (!projectId) return;
      router.push(`/studio?project=${projectId}&scenario=${nextScenarioId}`);
    },
    [projectId, router],
  );

  if (!projectId || !scenarioId) {
    return <WorkspaceScreen onOpenProject={openProject} />;
  }

  return (
    <StudioShell
      projectId={projectId}
      scenarioId={scenarioId}
      onScenarioChange={changeScenario}
      onExitToWorkspace={exitToWorkspace}
    />
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-canvas" />}>
      <StudioRouteContent />
    </Suspense>
  );
}
