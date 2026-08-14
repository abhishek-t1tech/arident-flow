import { CURRENT_SCHEMA_VERSION, ProjectRecord, ScenarioRecord } from "@/infrastructure/persistence/schema";
import {
  deleteProject as deleteProjectRecord,
  duplicateProject as duplicateProjectRecord,
  getProject,
  listProjects,
  putProject,
} from "@/infrastructure/persistence/repositories/projectRepository";
import { listScenarios, putScenario } from "@/infrastructure/persistence/repositories/scenarioRepository";
import { ScenarioConfig } from "@/domain";

export function createProjectId(): string {
  return crypto.randomUUID();
}

export function createScenarioId(): string {
  return crypto.randomUUID();
}

export const DEFAULT_SCENARIO_CONFIG: ScenarioConfig = {
  slaTargetHours: 24,
  iterations: 5000,
  seed: 1,
  tasks: [],
  gateways: [],
};

export async function createProject(
  name: string,
  bpmnXml: string,
  scenarioConfig: ScenarioConfig = DEFAULT_SCENARIO_CONFIG,
): Promise<{ project: ProjectRecord; scenario: ScenarioRecord }> {
  const now = Date.now();
  const project: ProjectRecord = {
    id: createProjectId(),
    name,
    bpmnXml,
    createdAt: now,
    updatedAt: now,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };

  const scenario: ScenarioRecord = {
    id: createScenarioId(),
    projectId: project.id,
    name: "Baseline",
    isBaseline: true,
    config: scenarioConfig,
    createdAt: now,
    updatedAt: now,
  };

  await putProject(project);
  await putScenario(scenario);

  return { project, scenario };
}

export async function renameProject(projectId: string, name: string): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found.");
  await putProject({ ...project, name, updatedAt: Date.now() });
}

export async function duplicateProjectWithScenarios(projectId: string, newName: string): Promise<ProjectRecord> {
  const source = await getProject(projectId);
  if (!source) throw new Error("Project not found.");

  const now = Date.now();
  const duplicate = await duplicateProjectRecord(source, createProjectId(), newName, now);

  const scenarios = await listScenarios(projectId);
  for (const scenario of scenarios) {
    await putScenario({
      ...scenario,
      id: createScenarioId(),
      projectId: duplicate.id,
      createdAt: now,
      updatedAt: now,
    });
  }

  return duplicate;
}

export async function deleteProjectCascade(projectId: string): Promise<void> {
  await deleteProjectRecord(projectId);
}

export async function saveProjectXml(projectId: string, bpmnXml: string): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found.");
  await putProject({ ...project, bpmnXml, updatedAt: Date.now() });
}

export async function getRecentProjects(limit = 12): Promise<ProjectRecord[]> {
  const projects = await listProjects();
  return projects.slice(0, limit);
}
