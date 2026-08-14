import { ScenarioConfig } from "@/domain";
import { ScenarioRecord } from "@/infrastructure/persistence/schema";
import {
  deleteScenario as deleteScenarioRecord,
  getScenario,
  listScenarios,
  putScenario,
} from "@/infrastructure/persistence/repositories/scenarioRepository";
import { createScenarioId } from "./projectUseCases";

export async function listProjectScenarios(projectId: string): Promise<ScenarioRecord[]> {
  return listScenarios(projectId);
}

export async function duplicateScenario(
  scenarioId: string,
  newName: string,
): Promise<ScenarioRecord> {
  const source = await getScenario(scenarioId);
  if (!source) throw new Error("Scenario not found.");

  const now = Date.now();
  const duplicate: ScenarioRecord = {
    ...source,
    id: createScenarioId(),
    name: newName,
    isBaseline: false,
    createdAt: now,
    updatedAt: now,
  };

  await putScenario(duplicate);
  return duplicate;
}

export async function updateScenarioConfig(
  scenarioId: string,
  config: ScenarioConfig,
): Promise<ScenarioRecord> {
  const scenario = await getScenario(scenarioId);
  if (!scenario) throw new Error("Scenario not found.");

  const updated: ScenarioRecord = { ...scenario, config, updatedAt: Date.now() };
  await putScenario(updated);
  return updated;
}

export async function renameScenario(scenarioId: string, name: string): Promise<ScenarioRecord> {
  const scenario = await getScenario(scenarioId);
  if (!scenario) throw new Error("Scenario not found.");

  const updated: ScenarioRecord = { ...scenario, name, updatedAt: Date.now() };
  await putScenario(updated);
  return updated;
}

export async function removeScenario(scenarioId: string): Promise<void> {
  await deleteScenarioRecord(scenarioId);
}
