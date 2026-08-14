import { ScenarioConfig } from "@/domain";

export interface ProcessTemplate {
  id: string;
  name: string;
  story: string;
  bpmnXml: string;
  scenarioConfig: ScenarioConfig;
}
