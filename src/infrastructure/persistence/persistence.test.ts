import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { getDatabase } from "./db";
import { putProject, listProjects, deleteProject } from "./repositories/projectRepository";
import { putScenario, listScenarios } from "./repositories/scenarioRepository";
import { CURRENT_SCHEMA_VERSION, ScenarioRecord } from "./schema";

beforeEach(async () => {
  const db = getDatabase();
  await db.projects.clear();
  await db.scenarios.clear();
  await db.simulationRuns.clear();
});

describe("project persistence", () => {
  it("survives a write/read round trip", async () => {
    await putProject({
      id: "p1",
      name: "Purchase Approval",
      bpmnXml: "<definitions/>",
      createdAt: 1,
      updatedAt: 1,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });

    const projects = await listProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe("Purchase Approval");
  });

  it("cascades scenario deletion when a project is deleted", async () => {
    await putProject({
      id: "p1",
      name: "Purchase Approval",
      bpmnXml: "<definitions/>",
      createdAt: 1,
      updatedAt: 1,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });

    const scenario: ScenarioRecord = {
      id: "s1",
      projectId: "p1",
      name: "Baseline",
      isBaseline: true,
      config: { slaTargetHours: 10, iterations: 100, seed: 1, tasks: [], gateways: [] },
      createdAt: 1,
      updatedAt: 1,
    };
    await putScenario(scenario);

    await deleteProject("p1");

    expect(await listScenarios("p1")).toHaveLength(0);
  });
});
