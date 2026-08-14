"use client";

import { ProcessGraph } from "@/domain";
import { BpmnImportWarning } from "@/infrastructure/bpmn/types";
import { xmlToGraph } from "@/infrastructure/bpmn/mapping";
import { useEffect, useState } from "react";

interface ProcessGraphState {
  graph: ProcessGraph | null;
  unsupportedElements: BpmnImportWarning[];
  parsing: boolean;
  parseError: string | null;
}

export function useProcessGraph(xml: string): ProcessGraphState {
  const [state, setState] = useState<ProcessGraphState>({
    graph: null,
    unsupportedElements: [],
    parsing: true,
    parseError: null,
  });

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      xmlToGraph(xml)
        .then(({ graph, unsupportedElements }) => {
          if (cancelled) return;
          setState({ graph, unsupportedElements, parsing: false, parseError: null });
        })
        .catch((error) => {
          if (cancelled) return;
          setState({
            graph: null,
            unsupportedElements: [],
            parsing: false,
            parseError: error instanceof Error ? error.message : "Unable to parse this process.",
          });
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [xml]);

  return state;
}
