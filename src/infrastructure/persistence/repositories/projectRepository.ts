import { getDatabase } from "../db";
import { ProjectRecord } from "../schema";

export async function listProjects(): Promise<ProjectRecord[]> {
  const db = getDatabase();
  return db.projects.orderBy("updatedAt").reverse().toArray();
}

export async function getProject(id: string): Promise<ProjectRecord | undefined> {
  return getDatabase().projects.get(id);
}

export async function putProject(project: ProjectRecord): Promise<void> {
  await getDatabase().projects.put(project);
}

export async function deleteProject(id: string): Promise<void> {
  const db = getDatabase();
  await db.transaction("rw", db.projects, db.scenarios, db.simulationRuns, async () => {
    const scenarios = await db.scenarios.where("projectId").equals(id).toArray();
    await db.simulationRuns.where("projectId").equals(id).delete();
    await db.scenarios.bulkDelete(scenarios.map((scenario) => scenario.id));
    await db.projects.delete(id);
  });
}

export async function duplicateProject(
  source: ProjectRecord,
  newId: string,
  newName: string,
  now: number,
): Promise<ProjectRecord> {
  const duplicate: ProjectRecord = {
    ...source,
    id: newId,
    name: newName,
    createdAt: now,
    updatedAt: now,
  };
  await putProject(duplicate);
  return duplicate;
}
