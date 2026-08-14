import { ScenarioConfig } from "@/domain";
import { ProcessTemplate } from "./types";

const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_CustomerSupportEscalation" targetNamespace="http://aridentflow.local/bpmn">
  <bpmn:process id="Process_CustomerSupportEscalation" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_StartTriage</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Triage" name="Triage">
      <bpmn:incoming>Flow_StartTriage</bpmn:incoming>
      <bpmn:outgoing>Flow_TriageGateway</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="SeverityCheck" name="Severity Check">
      <bpmn:incoming>Flow_TriageGateway</bpmn:incoming>
      <bpmn:outgoing>Flow_Standard</bpmn:outgoing>
      <bpmn:outgoing>Flow_Escalate</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="ResolveStandard" name="Resolve Standard">
      <bpmn:incoming>Flow_Standard</bpmn:incoming>
      <bpmn:outgoing>Flow_StandardEnd</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="EscalateToSpecialist" name="Escalate to Specialist">
      <bpmn:incoming>Flow_Escalate</bpmn:incoming>
      <bpmn:outgoing>Flow_EscalateResolve</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="ResolveEscalated" name="Resolve Escalated">
      <bpmn:incoming>Flow_EscalateResolve</bpmn:incoming>
      <bpmn:outgoing>Flow_EscalatedEnd</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_Standard" name="End">
      <bpmn:incoming>Flow_StandardEnd</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_Escalated" name="End">
      <bpmn:incoming>Flow_EscalatedEnd</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_StartTriage" sourceRef="StartEvent_1" targetRef="Triage" />
    <bpmn:sequenceFlow id="Flow_TriageGateway" sourceRef="Triage" targetRef="SeverityCheck" />
    <bpmn:sequenceFlow id="Flow_Standard" name="Standard" sourceRef="SeverityCheck" targetRef="ResolveStandard" />
    <bpmn:sequenceFlow id="Flow_Escalate" name="Escalate" sourceRef="SeverityCheck" targetRef="EscalateToSpecialist" />
    <bpmn:sequenceFlow id="Flow_StandardEnd" sourceRef="ResolveStandard" targetRef="EndEvent_Standard" />
    <bpmn:sequenceFlow id="Flow_EscalateResolve" sourceRef="EscalateToSpecialist" targetRef="ResolveEscalated" />
    <bpmn:sequenceFlow id="Flow_EscalatedEnd" sourceRef="ResolveEscalated" targetRef="EndEvent_Escalated" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_CustomerSupportEscalation">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="60" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Triage_di" bpmnElement="Triage">
        <dc:Bounds x="150" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SeverityCheck_di" bpmnElement="SeverityCheck">
        <dc:Bounds x="320" y="175" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ResolveStandard_di" bpmnElement="ResolveStandard">
        <dc:Bounds x="440" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EscalateToSpecialist_di" bpmnElement="EscalateToSpecialist">
        <dc:Bounds x="440" y="280" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ResolveEscalated_di" bpmnElement="ResolveEscalated">
        <dc:Bounds x="600" y="280" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Standard_di" bpmnElement="EndEvent_Standard">
        <dc:Bounds x="610" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Escalated_di" bpmnElement="EndEvent_Escalated">
        <dc:Bounds x="770" y="302" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_StartTriage_di" bpmnElement="Flow_StartTriage">
        <di:waypoint x="96" y="200" />
        <di:waypoint x="150" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_TriageGateway_di" bpmnElement="Flow_TriageGateway">
        <di:waypoint x="250" y="200" />
        <di:waypoint x="320" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Standard_di" bpmnElement="Flow_Standard">
        <di:waypoint x="345" y="175" />
        <di:waypoint x="345" y="100" />
        <di:waypoint x="440" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Escalate_di" bpmnElement="Flow_Escalate">
        <di:waypoint x="345" y="225" />
        <di:waypoint x="345" y="320" />
        <di:waypoint x="440" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_StandardEnd_di" bpmnElement="Flow_StandardEnd">
        <di:waypoint x="540" y="100" />
        <di:waypoint x="610" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_EscalateResolve_di" bpmnElement="Flow_EscalateResolve">
        <di:waypoint x="540" y="320" />
        <di:waypoint x="600" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_EscalatedEnd_di" bpmnElement="Flow_EscalatedEnd">
        <di:waypoint x="700" y="320" />
        <di:waypoint x="770" y="320" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const scenarioConfig: ScenarioConfig = {
  slaTargetHours: 8,
  iterations: 5000,
  seed: 3,
  tasks: [
    { nodeId: "Triage", duration: { type: "fixed", hours: 0.5 }, cost: 3 },
    { nodeId: "ResolveStandard", duration: { type: "fixed", hours: 1.5 }, cost: 5 },
    {
      nodeId: "EscalateToSpecialist",
      duration: { type: "triangular", minHours: 2, modeHours: 6, maxHours: 24 },
      cost: 20,
    },
    { nodeId: "ResolveEscalated", duration: { type: "uniform", minHours: 1, maxHours: 3 }, cost: 8 },
  ],
  gateways: [
    {
      nodeId: "SeverityCheck",
      branchProbabilities: {
        Flow_Standard: 0.75,
        Flow_Escalate: 0.25,
      },
    },
  ],
};

export const customerSupportEscalationTemplate: ProcessTemplate = {
  id: "customer-support-escalation",
  name: "Customer Support Escalation",
  story:
    "Most support tickets are triaged and resolved on the spot, but a quarter get escalated to a specialist with a long-tail resolution time — a good test of how rare-but-slow paths affect SLA compliance.",
  bpmnXml,
  scenarioConfig,
};
