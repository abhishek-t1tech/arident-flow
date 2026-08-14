import { ProjectPackage, ProjectRecord, ScenarioRecord, SimulationRunRecord, CURRENT_SCHEMA_VERSION, projectPackageSchema } from "../persistence/schema";

const PRODUCT_VERSION = "0.1.0";

export function buildProjectPackage(
  project: ProjectRecord,
  scenarios: ScenarioRecord[],
  simulationRuns: SimulationRunRecord[],
  now: number,
): ProjectPackage {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    productVersion: PRODUCT_VERSION,
    exportedAt: now,
    project,
    scenarios,
    simulationRuns,
  };
}

export interface ProjectPackageParseResult {
  success: boolean;
  data?: ProjectPackage;
  error?: string;
}

export function parseProjectPackage(json: string): ProjectPackageParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { success: false, error: "The selected file is not valid JSON." };
  }

  const result = projectPackageSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: "The project package does not match a supported AridentFlow schema." };
  }

  if (result.data.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return {
      success: false,
      error: "This project package was created by a newer version of AridentFlow.",
    };
  }

  return { success: true, data: result.data };
}

export function serializeProjectPackage(pkg: ProjectPackage): string {
  return JSON.stringify(pkg, null, 2);
}
