"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface GridPanBackgroundProps {
  className?: string;
}

const CELL = 56;

export function GridPanBackground({ className }: GridPanBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15]", className)}>
      <motion.div
        className="absolute -inset-x-20 -inset-y-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-brand-600) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-600) 1px, transparent 1px)",
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
        animate={reduceMotion ? undefined : { x: [0, -CELL], y: [0, -CELL] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
