declare module "bpmn-moddle" {
  export interface BpmnModdleParseResult {
    rootElement: unknown;
    references: unknown[];
    warnings: unknown[];
  }

  export class BpmnModdle {
    constructor(options?: Record<string, unknown>);
    fromXML(xml: string): Promise<BpmnModdleParseResult>;
    toXML(element: unknown, options?: Record<string, unknown>): Promise<{ xml: string }>;
  }
}
