export interface BpmnImportWarning {
  message: string;
  elementId?: string;
}

export interface BpmnImportResult {
  graph: import("@/domain").ProcessGraph;
  unsupportedElements: BpmnImportWarning[];
}

export const SUPPORTED_BPMN_TYPES = new Set([
  "bpmn:StartEvent",
  "bpmn:EndEvent",
  "bpmn:Task",
  "bpmn:UserTask",
  "bpmn:ServiceTask",
  "bpmn:ExclusiveGateway",
  "bpmn:SequenceFlow",
]);
