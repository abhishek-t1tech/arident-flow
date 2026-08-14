"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/shared/ui/Button";
import { Panel, EmptyState } from "@/shared/ui/Panel";
import { ProjectRecord } from "@/infrastructure/persistence/schema";
import { ImportProjectButton } from "@/features/import-export/components/ImportProjectButton";
import { GridPanBackground } from "@/shared/ui/backgrounds";
import { useWorkspaceProjects } from "../hooks/useWorkspaceProjects";
import { ProcessTemplate } from "../templates";
import { ProjectCard } from "./ProjectCard";
import { TemplateGallery } from "./TemplateGallery";
import { NewProjectDialog } from "./NewProjectDialog";

interface WorkspaceScreenProps {
  onOpenProject: (project: ProjectRecord) => void;
}

export function WorkspaceScreen({ onOpenProject }: WorkspaceScreenProps) {
  const { projects, loading, createFromTemplate, createBlank, rename, duplicate, remove, refresh } =
    useWorkspaceProjects();
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleImported(project: ProjectRecord) {
    await refresh();
    onOpenProject(project);
  }

  async function handleCreateBlank(name: string) {
    const project = await createBlank(name);
    setDialogOpen(false);
    onOpenProject(project);
  }

  async function handleSelectTemplate(template: ProcessTemplate) {
    const project = await createFromTemplate(template);
    onOpenProject(project);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <GridPanBackground className="fixed" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-ink">AridentFlow</h1>
            <p className="text-sm text-ink-muted">Model, simulate, and compare business processes.</p>
          </div>
          <div className="flex items-center gap-2">
            <ImportProjectButton onImported={(project) => void handleImported(project)} />
            <Button onClick={() => setDialogOpen(true)}>
              <FiPlus aria-hidden />
              New project
            </Button>
          </div>
        </div>

        <Panel title="Recent projects">
          {loading ? (
            <div className="p-6 text-sm text-ink-muted">Loading projects…</div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Start from a blank canvas or pick one of the curated templates below."
              action={
                <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                  Create your first project
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={onOpenProject}
                  onRename={rename}
                  onDuplicate={duplicate}
                  onDelete={remove}
                />
              ))}
            </div>
          )}
        </Panel>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">Templates</h2>
            <p className="text-sm text-ink-muted">Curated processes to get started quickly.</p>
          </div>
          <TemplateGallery onSelectTemplate={(template) => void handleSelectTemplate(template)} />
        </div>

        <NewProjectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onCreate={(name) => handleCreateBlank(name)}
        />
      </div>
    </div>
  );
}
