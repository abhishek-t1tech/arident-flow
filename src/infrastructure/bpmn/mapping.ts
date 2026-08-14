import { BpmnModdle } from "bpmn-moddle";
import { ProcessGraph, ProcessNode, ProcessNodeType, SequenceFlow } from "@/domain";
import { BpmnImportResult, BpmnImportWarning, SUPPORTED_BPMN_TYPES } from "./types";

interface ModdleElement {
  $type: string;
  id: string;
  name?: string;
  sourceRef?: ModdleElement;
  targetRef?: ModdleElement;
}

interface ModdleProcess {
  $type: string;
  id: string;
  name?: string;
  flowElements?: ModdleElement[];
}

interface ModdleDefinitions {
  rootElements?: ModdleProcess[];
}

const TYPE_MAP: Record<string, ProcessNodeType> = {
  "bpmn:StartEvent": "startEvent",
  "bpmn:EndEvent": "endEvent",
  "bpmn:Task": "task",
  "bpmn:UserTask": "userTask",
  "bpmn:ServiceTask": "serviceTask",
  "bpmn:ExclusiveGateway": "exclusiveGateway",
};

export async function xmlToGraph(xml: string): Promise<BpmnImportResult> {
  const moddle = new BpmnModdle();
  const { rootElement } = await moddle.fromXML(xml);
  const definitions = rootElement as unknown as ModdleDefinitions;
  const process = definitions.rootElements?.find((el) => el.$type === "bpmn:Process");

  const nodes: ProcessNode[] = [];
  const flows: SequenceFlow[] = [];
  const unsupportedElements: BpmnImportWarning[] = [];

  for (const element of process?.flowElements ?? []) {
    if (!SUPPORTED_BPMN_TYPES.has(element.$type)) {
      unsupportedElements.push({
        message: `Element type "${element.$type}" is not supported by AridentFlow simulation and was excluded.`,
        elementId: element.id,
      });
      continue;
    }

    if (element.$type === "bpmn:SequenceFlow") {
      if (!element.sourceRef || !element.targetRef) {
        unsupportedElements.push({
          message: "A sequence flow is missing a source or target and was excluded.",
          elementId: element.id,
        });
        continue;
      }
      flows.push({
        id: element.id,
        sourceId: element.sourceRef.id,
        targetId: element.targetRef.id,
        name: element.name,
      });
      continue;
    }

    nodes.push({
      id: element.id,
      type: TYPE_MAP[element.$type],
      name: element.name ?? element.id,
    });
  }

  return {
    graph: {
      id: process?.id ?? "process",
      name: process?.name ?? "Imported process",
      nodes,
      flows,
    } satisfies ProcessGraph,
    unsupportedElements,
  };
}
