import { getDatabase } from "../db";
import { SimulationRunRecord } from "../schema";

export async function listRunsForScenario(scenarioId: string): Promise<SimulationRunRecord[]> {
  const runs = await getDatabase()
    .simulationRuns.where("scenarioId")
    .equals(scenarioId)
    .toArray();
  return runs.sort((a, b) => b.createdAt - a.createdAt);
}

export async function latestRunForScenario(
  scenarioId: string,
): Promise<SimulationRunRecord | undefined> {
  const runs = await listRunsForScenario(scenarioId);
  return runs[0];
}

export async function putSimulationRun(run: SimulationRunRecord): Promise<void> {
  await getDatabase().simulationRuns.put(run);
}
