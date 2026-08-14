"use client";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "./modeler-theme.css";

import Modeler from "bpmn-js/lib/Modeler";
import { useEffect, useRef } from "react";
import { EMPTY_PROCESS_XML } from "../constants/emptyProcess";

export interface ModelerSelection {
  elementId: string | null;
  elementType: string | null;
}

interface ModelerCanvasProps {
  xml?: string;
  onXmlChange: (xml: string) => void;
  onSelectionChange: (selection: ModelerSelection) => void;
  onReady?: (modeler: Modeler) => void;
  focusElementId?: string | null;
}

export function ModelerCanvas({
  xml,
  onXmlChange,
  onSelectionChange,
  onReady,
  focusElementId,
}: ModelerCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<Modeler | null>(null);
  const onXmlChangeRef = useRef(onXmlChange);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onXmlChangeRef.current = onXmlChange;
    onSelectionChangeRef.current = onSelectionChange;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new Modeler({ container: containerRef.current });
    modelerRef.current = modeler;
    onReady?.(modeler);

    modeler.importXML(xml ?? EMPTY_PROCESS_XML).catch(() => {
      onSelectionChangeRef.current({ elementId: null, elementType: null });
    });

    const eventBus = modeler.get("eventBus") as {
      on: (event: string, callback: (event: unknown) => void) => void;
    };

    eventBus.on("selection.changed", (event) => {
      const selection = event as { newSelection: Array<{ id: string; type: string }> };
      const first = selection.newSelection[0];
      onSelectionChangeRef.current(
        first ? { elementId: first.id, elementType: first.type } : { elementId: null, elementType: null },
      );
    });

    eventBus.on("commandStack.changed", () => {
      modeler
        .saveXML({ format: false })
        .then(({ xml: savedXml }) => {
          if (savedXml) onXmlChangeRef.current(savedXml);
        })
        .catch(() => undefined);
    });

    return () => {
      modeler.destroy();
      modelerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const modeler = modelerRef.current;
    if (!modeler || !focusElementId) return;

    const elementRegistry = modeler.get("elementRegistry") as {
      get: (id: string) => unknown;
    };
    const canvas = modeler.get("canvas") as {
      scrollToElement: (element: unknown) => void;
    };
    const selection = modeler.get("selection") as {
      select: (element: unknown) => void;
    };

    const element = elementRegistry.get(focusElementId);
    if (element) {
      selection.select(element);
      canvas.scrollToElement(element);
    }
  }, [focusElementId]);

  return <div ref={containerRef} className="h-full w-full bg-surface" />;
}
