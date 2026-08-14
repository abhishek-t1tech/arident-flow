import { getDatabase } from "../db";
import { ScenarioRecord } from "../schema";

export async function listScenarios(projectId: string): Promise<ScenarioRecord[]> {
  return getDatabase().scenarios.where("projectId").equals(projectId).sortBy("createdAt");
}

export async function getScenario(id: string): Promise<ScenarioRecord | undefined> {
  return getDatabase().scenarios.get(id);
}

export async function putScenario(scenario: ScenarioRecord): Promise<void> {
  await getDatabase().scenarios.put(scenario);
}

export async function deleteScenario(id: string): Promise<void> {
  const db = getDatabase();
  await db.transaction("rw", db.scenarios, db.simulationRuns, async () => {
    await db.simulationRuns.where("scenarioId").equals(id).delete();
    await db.scenarios.delete(id);
  });
}
