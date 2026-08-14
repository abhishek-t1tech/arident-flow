import { downloadTextFile } from "@/infrastructure/files/download";
import {
  buildProjectPackage,
  parseProjectPackage,
  serializeProjectPackage,
} from "@/infrastructure/files/projectPackage";
import { getProject } from "@/infrastructure/persistence/repositories/projectRepository";
import { listScenarios, putScenario } from "@/infrastructure/persistence/repositories/scenarioRepository";
import { listRunsForScenario, putSimulationRun } from "@/infrastructure/persistence/repositories/simulationRunRepository";
import { putProject } from "@/infrastructure/persistence/repositories/projectRepository";
import { ProjectRecord } from "@/infrastructure/persistence/schema";
import { createProjectId, createScenarioId } from "./projectUseCases";

export async function exportProject(projectId: string): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found.");

  const scenarios = await listScenarios(projectId);
  const runs = (
    await Promise.all(scenarios.map((scenario) => listRunsForScenario(scenario.id)))
  ).flat();

  const pkg = buildProjectPackage(project, scenarios, runs, Date.now());
  const filename = `${project.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.aridentflow.json`;
  downloadTextFile(filename, serializeProjectPackage(pkg), "application/json");
}

export async function importProjectPackage(json: string): Promise<ProjectRecord> {
  const parsed = parseProjectPackage(json);
  if (!parsed.success || !parsed.data) {
    throw new Error(parsed.error ?? "Unable to import this project package.");
  }

  const now = Date.now();
  const newProjectId = createProjectId();

  const project: ProjectRecord = {
    ...parsed.data.project,
    id: newProjectId,
    name: `${parsed.data.project.name} (Imported)`,
    createdAt: now,
    updatedAt: now,
  };
  await putProject(project);

  for (const scenario of parsed.data.scenarios) {
    const newScenarioId = createScenarioId();
    await putScenario({
      ...scenario,
      id: newScenarioId,
      projectId: newProjectId,
      createdAt: now,
      updatedAt: now,
    });

    const runs = (parsed.data.simulationRuns ?? []).filter((run) => run.scenarioId === scenario.id);
    for (const run of runs) {
      await putSimulationRun({
        ...run,
        id: crypto.randomUUID(),
        projectId: newProjectId,
        scenarioId: newScenarioId,
        createdAt: now,
      });
    }
  }

  return project;
}

export async function exportBpmnXml(projectId: string): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found.");
  const filename = `${project.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.bpmn`;
  downloadTextFile(filename, project.bpmnXml, "application/xml");
}
