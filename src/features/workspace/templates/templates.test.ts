import { describe, expect, it } from "vitest";
import { xmlToGraph } from "@/infrastructure/bpmn/mapping";
import { validateSimulationReadiness, validateStructure } from "@/domain";
import { processTemplates } from "./index";

describe("workspace process templates", () => {
  for (const template of processTemplates) {
    it(`${template.id} is a valid, simulation-ready process`, async () => {
      const { graph, unsupportedElements } = await xmlToGraph(template.bpmnXml);

      expect(unsupportedElements).toHaveLength(0);

      const structureErrors = validateStructure(graph).filter((issue) => issue.severity === "error");
      expect(structureErrors).toEqual([]);

      const readinessErrors = validateSimulationReadiness(graph, template.scenarioConfig).filter(
        (issue) => issue.severity === "error",
      );
      expect(readinessErrors).toEqual([]);
    });
  }
});
