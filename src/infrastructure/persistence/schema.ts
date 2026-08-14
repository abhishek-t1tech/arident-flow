import { z } from "zod";

export const durationDistributionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("fixed"), hours: z.number().nonnegative() }),
  z.object({
    type: z.literal("uniform"),
    minHours: z.number().nonnegative(),
    maxHours: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal("triangular"),
    minHours: z.number().nonnegative(),
    modeHours: z.number().nonnegative(),
    maxHours: z.number().nonnegative(),
  }),
]);

export const taskAssumptionSchema = z.object({
  nodeId: z.string().min(1),
  duration: durationDistributionSchema,
  cost: z.number().nonnegative(),
  resourceLabel: z.string().optional(),
});

export const gatewayAssumptionSchema = z.object({
  nodeId: z.string().min(1),
  branchProbabilities: z.record(z.string(), z.number().min(0).max(1)),
});

export const scenarioConfigSchema = z.object({
  slaTargetHours: z.number().positive(),
  iterations: z.number().int().positive().max(100000),
  seed: z.number().int(),
  tasks: z.array(taskAssumptionSchema),
  gateways: z.array(gatewayAssumptionSchema),
});

export const projectRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  bpmnXml: z.string().min(1),
  createdAt: z.number(),
  updatedAt: z.number(),
  schemaVersion: z.number().int().positive(),
});

export const scenarioRecordSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  name: z.string().min(1).max(200),
  isBaseline: z.boolean(),
  config: scenarioConfigSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const simulationRunRecordSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  scenarioId: z.string().min(1),
  seed: z.number().int(),
  iterations: z.number().int().positive(),
  configFingerprint: z.string().min(1),
  summary: z.record(z.string(), z.unknown()),
  createdAt: z.number(),
});

export const userPreferenceRecordSchema = z.object({
  id: z.literal("default"),
  theme: z.enum(["light", "dark", "system"]),
  reducedMotion: z.boolean(),
  density: z.enum(["comfortable", "compact"]),
  defaultIterations: z.number().int().positive(),
});

export const CURRENT_SCHEMA_VERSION = 1;

export const projectPackageSchema = z.object({
  schemaVersion: z.number().int().positive(),
  productVersion: z.string(),
  exportedAt: z.number(),
  project: projectRecordSchema,
  scenarios: z.array(scenarioRecordSchema),
  simulationRuns: z.array(simulationRunRecordSchema).optional(),
});

export type ProjectRecord = z.infer<typeof projectRecordSchema>;
export type ScenarioRecord = z.infer<typeof scenarioRecordSchema>;
export type SimulationRunRecord = z.infer<typeof simulationRunRecordSchema>;
export type UserPreferenceRecord = z.infer<typeof userPreferenceRecordSchema>;
export type ProjectPackage = z.infer<typeof projectPackageSchema>;
