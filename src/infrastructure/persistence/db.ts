import Dexie, { Table } from "dexie";
import {
  ProjectRecord,
  ScenarioRecord,
  SimulationRunRecord,
  UserPreferenceRecord,
} from "./schema";

export class AridentFlowDatabase extends Dexie {
  projects!: Table<ProjectRecord, string>;
  scenarios!: Table<ScenarioRecord, string>;
  simulationRuns!: Table<SimulationRunRecord, string>;
  preferences!: Table<UserPreferenceRecord, string>;

  constructor() {
    super("aridentflow");

    this.version(1).stores({
      projects: "id, updatedAt",
      scenarios: "id, projectId, updatedAt",
      simulationRuns: "id, projectId, scenarioId, createdAt",
      preferences: "id",
    });
  }
}

let instance: AridentFlowDatabase | null = null;

export function getDatabase(): AridentFlowDatabase {
  if (!instance) {
    instance = new AridentFlowDatabase();
  }
  return instance;
}
