"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

import { RunSummary, isReadyToSimulate, validateSimulationReadiness, validateStructure } from "@/domain";
import { saveProjectXml } from "@/application/projectUseCases";
import { updateScenarioConfig } from "@/application/scenarioUseCases";
import { getProject } from "@/infrastructure/persistence/repositories/projectRepository";
import { getScenario } from "@/infrastructure/persistence/repositories/scenarioRepository";
import { latestRunForScenario } from "@/infrastructure/persistence/repositories/simulationRunRepository";
import { ProjectRecord, ScenarioRecord } from "@/infrastructure/persistence/schema";
import { AutosaveStatus, useAutosave } from "@/shared/hooks/useAutosave";
import { useStudioUiStore } from "@/shared/state/studioUiStore";
import { Button } from "@/shared/ui/Button";
import { BeamSweepBackground } from "@/shared/ui/backgrounds";
import { EmptyState, Panel } from "@/shared/ui/Panel";
import { SaveStatusIndicator } from "@/shared/ui/SaveStatusIndicator";
import { cn } from "@/shared/utils/cn";

import { ModelerSelection } from "@/features/process-modeler/components/ModelerCanvas";
import { PropertiesInspector } from "@/features/process-modeler/components/PropertiesInspector";
import { useProcessGraph } from "@/features/process-modeler/hooks/useProcessGraph";
import { ValidationPanel } from "@/features/process-validation/ValidationPanel";
import { RunConfigForm } from "@/features/simulation/components/RunConfigForm";
import { RunControls } from "@/features/simulation/components/RunControls";
import { useSimulationRun } from "@/features/simulation/hooks/useSimulationRun";
import { AnalyticsWorkspace } from "@/features/analytics/AnalyticsWorkspace";
import { useScenarios } from "@/features/scenarios/hooks/useScenarios";
import { ScenarioSwitcher } from "@/features/scenarios/components/ScenarioSwitcher";
import { ScenarioComparisonView } from "@/features/scenarios/components/ScenarioComparisonView";
import { ExportMenu } from "@/features/import-export/components/ExportMenu";
import { ExecutiveReport } from "@/features/import-export/components/ExecutiveReport";

import { ViewTabs } from "./components/ViewTabs";

const ModelerCanvas = dynamic(
  () => import("@/features/process-modeler/components/ModelerCanvas").then((mod) => mod.ModelerCanvas),
  { ssr: false },
);

interface StudioShellProps {
  projectId: string;
  scenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
  onExitToWorkspace: () => void;
}

function combineSaveStatus(a: AutosaveStatus, b: AutosaveStatus): AutosaveStatus {
  if (a === "error" || b === "error") return "error";
  if (a === "saving" || b === "saving") return "saving";
  if (a === "saved" || b === "saved") return "saved";
  return "idle";
}

export function StudioShell({ projectId, scenarioId, onScenarioChange, onExitToWorkspace }: StudioShellProps) {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [scenario, setScenario] = useState<ScenarioRecord | null>(null);
  const [xml, setXml] = useState<string>("");
  const [selection, setSelection] = useState<ModelerSelection>({ elementId: null, elementType: null });
  const [baselineSummary, setBaselineSummary] = useState<RunSummary | null>(null);
  const [baselineScenario, setBaselineScenario] = useState<ScenarioRecord | null>(null);
  const [activeRunSummary, setActiveRunSummary] = useState<RunSummary | null>(null);
  const [activeRunTimestamp, setActiveRunTimestamp] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const activeView = useStudioUiStore((state) => state.activeView);
  const setActiveView = useStudioUiStore((state) => state.setActiveView);
  const focusElementId = useStudioUiStore((state) => state.focusElementId);
  const setFocusElementId = useStudioUiStore((state) => state.setFocusElementId);

  const scenariosState = useScenarios(projectId);
  const simulation = useSimulationRun();

  useEffect(() => {
    let cancelled = false;
    getProject(projectId).then((record) => {
      if (!cancelled && record) {
        setProject(record);
        setXml(record.bpmnXml);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    getScenario(scenarioId).then((record) => {
      if (!cancelled) setScenario(record ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  useEffect(() => {
    const baseline = scenariosState.scenarios.find((s) => s.isBaseline);
    if (!baseline) return;
    latestRunForScenario(baseline.id).then((run) => {
      setBaselineScenario(baseline);
      setBaselineSummary(run ? (run.summary as unknown as RunSummary) : null);
    });
  }, [scenariosState.scenarios, simulation.status]);

  useEffect(() => {
    if (!scenario) return;
    let cancelled = false;
    latestRunForScenario(scenario.id).then((run) => {
      if (cancelled) return;
      setActiveRunSummary(run ? (run.summary as unknown as RunSummary) : null);
      setActiveRunTimestamp(run ? run.createdAt : null);
    });
    return () => {
      cancelled = true;
    };
  }, [scenario, simulation.status]);

  useEffect(() => {
    if (scenariosState.loading) return;
    if (scenariosState.scenarios.some((s) => s.id === scenarioId)) return;
    const fallback = scenariosState.scenarios.find((s) => s.isBaseline) ?? scenariosState.scenarios[0];
    if (fallback) onScenarioChange(fallback.id);
  }, [scenariosState.loading, scenariosState.scenarios, scenarioId, onScenarioChange]);

  const xmlSaveStatus = useAutosave(xml, (value) => saveProjectXml(projectId, value), 800, projectId);
  const configSaveStatus = useAutosave(
    scenario?.config ?? null,
    async (config) => {
      if (!scenario || !config) return;
      await updateScenarioConfig(scenario.id, config);
    },
    800,
    scenario?.id,
  );

  const { graph, unsupportedElements, parseError } = useProcessGraph(xml);

  const validationIssues = useMemo(() => {
    if (!graph || !scenario) return [];
    return [...validateStructure(graph), ...validateSimulationReadiness(graph, scenario.config)];
  }, [graph, scenario]);

  const ready = isReadyToSimulate(validationIssues) && !parseError;

  const handleConfigChange = useCallback((config: ScenarioRecord["config"]) => {
    setScenario((prev) => (prev ? { ...prev, config } : prev));
  }, []);

  const handleFocusElement = useCallback(
    (elementId: string) => {
      setFocusElementId(elementId);
      setActiveView("model");
    },
    [setFocusElementId, setActiveView],
  );

  const handleRun = useCallback(() => {
    if (!scenario) return;
    void simulation.run(xml, scenario);
  }, [scenario, xml, simulation]);

  const handleDeleteScenario = useCallback(
    async (target: ScenarioRecord) => {
      const remaining = scenariosState.scenarios.filter((s) => s.id !== target.id);
      await scenariosState.remove(target.id);
      if (target.id === scenarioId) {
        const fallback = remaining.find((s) => s.isBaseline) ?? remaining[0];
        if (fallback) onScenarioChange(fallback.id);
      }
    },
    [scenariosState, scenarioId, onScenarioChange],
  );

  const histogramResult = useMemo(() => {
    if (!simulation.rawResult || !activeRunSummary) return null;
    if (simulation.rawResult.configFingerprint !== activeRunSummary.configFingerprint) return null;
    return { iterations: simulation.rawResult.iterations };
  }, [simulation.rawResult, activeRunSummary]);

  const isComparingBaselineToItself = Boolean(baselineScenario && scenario && baselineScenario.id === scenario.id);

  if (!project || !scenario) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <p className="text-sm text-ink-muted">Loading project…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <header className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-border bg-surface px-4 py-3">
        <BeamSweepBackground className="opacity-60" />
        <div className="relative flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onExitToWorkspace} aria-label="Back to workspace">
            <FiArrowLeft aria-hidden />
          </Button>
          <div>
            <p className="text-sm font-semibold text-ink">{project.name}</p>
            <SaveStatusIndicator status={combineSaveStatus(xmlSaveStatus, configSaveStatus)} />
          </div>
        </div>
        <div className="relative">
          <ViewTabs active={activeView} onChange={setActiveView} />
        </div>
        <div className="relative flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReportOpen(true)}
            disabled={!baselineSummary}
          >
            <FiPrinter aria-hidden />
            Executive report
          </Button>
          <ExportMenu projectId={project.id} />
        </div>
      </header>

      <div className="border-b border-border bg-surface px-4 py-2">
        <ScenarioSwitcher
          scenarios={scenariosState.scenarios}
          activeScenarioId={scenario.id}
          onSelect={onScenarioChange}
          onDuplicate={(source) =>
            scenariosState.duplicate(source.id, `${source.name} copy`).then((next) => onScenarioChange(next.id))
          }
          onRename={(target, name) => scenariosState.rename(target.id, name)}
          onDelete={(target) => void handleDeleteScenario(target)}
        />
      </div>

      <main className="flex flex-1 overflow-hidden">
        <div className={cn("flex flex-1", activeView === "model" ? "" : "hidden")}>
          <div className="flex-1">
            <ModelerCanvas
              xml={xml}
              onXmlChange={setXml}
              onSelectionChange={setSelection}
              focusElementId={focusElementId}
            />
          </div>
          <aside className="flex w-96 flex-col border-l border-border">
            <Panel title="Element properties" className="flex-1 border-0 rounded-none">
              <PropertiesInspector
                selection={selection}
                graph={graph}
                config={scenario.config}
                onConfigChange={handleConfigChange}
              />
            </Panel>
            <Panel title="Validation" className="h-72 border-0 border-t border-border rounded-none">
              <div className="h-full overflow-y-auto">
                <ValidationPanel issues={validationIssues} onFocusElement={handleFocusElement} />
              </div>
            </Panel>
          </aside>
        </div>

        {activeView === "simulate" && (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto p-6">
            <Panel title="Run configuration">
              <RunConfigForm config={scenario.config} onChange={handleConfigChange} />
            </Panel>
            <Panel title="Run">
              <RunControls
                status={simulation.status}
                progress={simulation.progress}
                ready={ready}
                onRun={handleRun}
                onCancel={simulation.cancel}
              />
              {simulation.error && <p className="px-4 pb-4 text-sm text-negative">{simulation.error}</p>}
            </Panel>
            <Panel title="Validation">
              <ValidationPanel issues={validationIssues} onFocusElement={handleFocusElement} />
            </Panel>
          </div>
        )}

        {activeView === "analytics" && graph && (
          <div className="flex-1 overflow-y-auto">
            <AnalyticsWorkspace
              summary={activeRunSummary ?? ({ sampleCount: 0 } as RunSummary)}
              runResult={histogramResult}
              graph={graph}
              scenarioName={scenario.name}
              slaTargetHours={scenario.config.slaTargetHours}
              timestamp={activeRunTimestamp ?? scenario.updatedAt}
              onSelectTask={handleFocusElement}
            />
          </div>
        )}

        {activeView === "compare" && (
          <div className="flex-1 overflow-y-auto p-6">
            {isComparingBaselineToItself ? (
              <EmptyState
                title="Select a proposed scenario"
                description="The baseline is currently active. Duplicate it or switch to another scenario above to compare a proposed change against the baseline."
              />
            ) : (
              <ScenarioComparisonView
                baseline={
                  baselineScenario && baselineSummary
                    ? { scenario: baselineScenario, summary: baselineSummary }
                    : null
                }
                proposed={activeRunSummary ? { scenario, summary: activeRunSummary } : null}
                onOpenWhyThisChanged={() => setActiveView("analytics")}
              />
            )}
          </div>
        )}
      </main>

      {unsupportedElements.length > 0 && (
        <footer className="border-t border-border bg-warning-muted px-4 py-2 text-xs text-warning">
          {unsupportedElements.length} unsupported element(s) were excluded from simulation.
        </footer>
      )}

      {reportOpen && baselineScenario && baselineSummary && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6 print:static print:bg-transparent print:p-0">
          <div className="w-full max-w-3xl rounded-lg bg-surface shadow-lg print:max-w-none print:rounded-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-border p-4 print:hidden">
              <h2 className="text-sm font-semibold text-ink">Executive report</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => window.print()}>
                  Print
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setReportOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            <ExecutiveReport
              project={project}
              baseline={{ scenario: baselineScenario, summary: baselineSummary }}
              proposed={
                !isComparingBaselineToItself && activeRunSummary ? { scenario, summary: activeRunSummary } : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
