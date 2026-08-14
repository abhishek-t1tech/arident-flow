import { ScenarioConfig } from "@/domain";
import { ProcessTemplate } from "./types";

const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_EmployeeOnboarding" targetNamespace="http://aridentflow.local/bpmn">
  <bpmn:process id="Process_EmployeeOnboarding" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_StartIT</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="ITProvisioning" name="IT Provisioning">
      <bpmn:incoming>Flow_StartIT</bpmn:incoming>
      <bpmn:outgoing>Flow_ITManager</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="ManagerIntroduction" name="Manager Introduction">
      <bpmn:incoming>Flow_ITManager</bpmn:incoming>
      <bpmn:outgoing>Flow_ManagerCompliance</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="ComplianceTraining" name="Compliance Training">
      <bpmn:incoming>Flow_ManagerCompliance</bpmn:incoming>
      <bpmn:outgoing>Flow_ComplianceWorkstation</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="WorkstationSetup" name="Workstation Setup">
      <bpmn:incoming>Flow_ComplianceWorkstation</bpmn:incoming>
      <bpmn:outgoing>Flow_WorkstationEnd</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_WorkstationEnd</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_StartIT" sourceRef="StartEvent_1" targetRef="ITProvisioning" />
    <bpmn:sequenceFlow id="Flow_ITManager" sourceRef="ITProvisioning" targetRef="ManagerIntroduction" />
    <bpmn:sequenceFlow id="Flow_ManagerCompliance" sourceRef="ManagerIntroduction" targetRef="ComplianceTraining" />
    <bpmn:sequenceFlow id="Flow_ComplianceWorkstation" sourceRef="ComplianceTraining" targetRef="WorkstationSetup" />
    <bpmn:sequenceFlow id="Flow_WorkstationEnd" sourceRef="WorkstationSetup" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_EmployeeOnboarding">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="60" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ITProvisioning_di" bpmnElement="ITProvisioning">
        <dc:Bounds x="150" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ManagerIntroduction_di" bpmnElement="ManagerIntroduction">
        <dc:Bounds x="310" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ComplianceTraining_di" bpmnElement="ComplianceTraining">
        <dc:Bounds x="470" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WorkstationSetup_di" bpmnElement="WorkstationSetup">
        <dc:Bounds x="630" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="790" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_StartIT_di" bpmnElement="Flow_StartIT">
        <di:waypoint x="96" y="200" />
        <di:waypoint x="150" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_ITManager_di" bpmnElement="Flow_ITManager">
        <di:waypoint x="250" y="200" />
        <di:waypoint x="310" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_ManagerCompliance_di" bpmnElement="Flow_ManagerCompliance">
        <di:waypoint x="410" y="200" />
        <di:waypoint x="470" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_ComplianceWorkstation_di" bpmnElement="Flow_ComplianceWorkstation">
        <di:waypoint x="570" y="200" />
        <di:waypoint x="630" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WorkstationEnd_di" bpmnElement="Flow_WorkstationEnd">
        <di:waypoint x="730" y="200" />
        <di:waypoint x="790" y="200" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const scenarioConfig: ScenarioConfig = {
  slaTargetHours: 40,
  iterations: 5000,
  seed: 2,
  tasks: [
    { nodeId: "ITProvisioning", duration: { type: "uniform", minHours: 2, maxHours: 6 }, cost: 10 },
    { nodeId: "ManagerIntroduction", duration: { type: "fixed", hours: 1 }, cost: 3 },
    {
      nodeId: "ComplianceTraining",
      duration: { type: "triangular", minHours: 2, modeHours: 4, maxHours: 8 },
      cost: 8,
    },
    { nodeId: "WorkstationSetup", duration: { type: "uniform", minHours: 1, maxHours: 3 }, cost: 6 },
  ],
  gateways: [],
};

export const employeeOnboardingTemplate: ProcessTemplate = {
  id: "employee-onboarding",
  name: "Employee Onboarding",
  story:
    "A new hire moves through a straightforward chain of onboarding steps — IT provisioning, a manager introduction, compliance training, and workstation setup — useful for spotting which single step drags out total ramp-up time.",
  bpmnXml,
  scenarioConfig,
};
