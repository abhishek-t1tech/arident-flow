import { ScenarioConfig } from "@/domain";
import { ProcessTemplate } from "./types";

const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_PurchaseApproval" targetNamespace="http://aridentflow.local/bpmn">
  <bpmn:process id="Process_PurchaseApproval" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_StartReview</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="ReviewRequest" name="Review Request">
      <bpmn:incoming>Flow_StartReview</bpmn:incoming>
      <bpmn:outgoing>Flow_ReviewGateway</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="AmountCheck" name="Amount Check">
      <bpmn:incoming>Flow_ReviewGateway</bpmn:incoming>
      <bpmn:outgoing>Flow_Low</bpmn:outgoing>
      <bpmn:outgoing>Flow_High</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="AutoApprove" name="Auto Approve">
      <bpmn:incoming>Flow_Low</bpmn:incoming>
      <bpmn:outgoing>Flow_AutoEnd</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="ManagerApproval" name="Manager Approval">
      <bpmn:incoming>Flow_High</bpmn:incoming>
      <bpmn:outgoing>Flow_ManagerEnd</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_Auto" name="End">
      <bpmn:incoming>Flow_AutoEnd</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_Manager" name="End">
      <bpmn:incoming>Flow_ManagerEnd</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_StartReview" sourceRef="StartEvent_1" targetRef="ReviewRequest" />
    <bpmn:sequenceFlow id="Flow_ReviewGateway" sourceRef="ReviewRequest" targetRef="AmountCheck" />
    <bpmn:sequenceFlow id="Flow_Low" name="Low value" sourceRef="AmountCheck" targetRef="AutoApprove" />
    <bpmn:sequenceFlow id="Flow_High" name="High value" sourceRef="AmountCheck" targetRef="ManagerApproval" />
    <bpmn:sequenceFlow id="Flow_AutoEnd" sourceRef="AutoApprove" targetRef="EndEvent_Auto" />
    <bpmn:sequenceFlow id="Flow_ManagerEnd" sourceRef="ManagerApproval" targetRef="EndEvent_Manager" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_PurchaseApproval">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="60" y="182" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ReviewRequest_di" bpmnElement="ReviewRequest">
        <dc:Bounds x="150" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="AmountCheck_di" bpmnElement="AmountCheck">
        <dc:Bounds x="320" y="175" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="AutoApprove_di" bpmnElement="AutoApprove">
        <dc:Bounds x="440" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ManagerApproval_di" bpmnElement="ManagerApproval">
        <dc:Bounds x="440" y="280" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Auto_di" bpmnElement="EndEvent_Auto">
        <dc:Bounds x="610" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Manager_di" bpmnElement="EndEvent_Manager">
        <dc:Bounds x="610" y="302" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_StartReview_di" bpmnElement="Flow_StartReview">
        <di:waypoint x="96" y="200" />
        <di:waypoint x="150" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_ReviewGateway_di" bpmnElement="Flow_ReviewGateway">
        <di:waypoint x="250" y="200" />
        <di:waypoint x="320" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Low_di" bpmnElement="Flow_Low">
        <di:waypoint x="345" y="175" />
        <di:waypoint x="345" y="100" />
        <di:waypoint x="440" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_High_di" bpmnElement="Flow_High">
        <di:waypoint x="345" y="225" />
        <di:waypoint x="345" y="320" />
        <di:waypoint x="440" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_AutoEnd_di" bpmnElement="Flow_AutoEnd">
        <di:waypoint x="540" y="100" />
        <di:waypoint x="610" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_ManagerEnd_di" bpmnElement="Flow_ManagerEnd">
        <di:waypoint x="540" y="320" />
        <di:waypoint x="610" y="320" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const scenarioConfig: ScenarioConfig = {
  slaTargetHours: 24,
  iterations: 5000,
  seed: 1,
  tasks: [
    { nodeId: "ReviewRequest", duration: { type: "fixed", hours: 1 }, cost: 5 },
    { nodeId: "AutoApprove", duration: { type: "fixed", hours: 0.5 }, cost: 2 },
    {
      nodeId: "ManagerApproval",
      duration: { type: "triangular", minHours: 4, modeHours: 18, maxHours: 36 },
      cost: 15,
    },
  ],
  gateways: [
    {
      nodeId: "AmountCheck",
      branchProbabilities: {
        Flow_Low: 0.4,
        Flow_High: 0.6,
      },
    },
  ],
};

export const purchaseApprovalTemplate: ProcessTemplate = {
  id: "purchase-approval",
  name: "Purchase Approval",
  story:
    "A purchase request is reviewed, then routed by amount: low-value requests auto-approve quickly, while high-value requests wait on manager approval — a common source of SLA breaches.",
  bpmnXml,
  scenarioConfig,
};
