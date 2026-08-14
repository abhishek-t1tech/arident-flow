"use client";

import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/shared/ui/Button";
import { ProcessTemplate, processTemplates } from "../templates";

interface TemplateGalleryProps {
  onSelectTemplate: (template: ProcessTemplate) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {processTemplates.map((template) => (
        <div
          key={template.id}
          className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4"
        >
          <span className="text-sm font-semibold text-ink">{template.name}</span>
          <p className="flex-1 text-sm text-ink-muted">{template.story}</p>
          <Button size="sm" variant="secondary" onClick={() => onSelectTemplate(template)}>
            Use template
            <FiArrowRight aria-hidden />
          </Button>
        </div>
      ))}
    </div>
  );
}
