"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface BeamSweepBackgroundProps {
  className?: string;
}

export function BeamSweepBackground({ className }: BeamSweepBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-20", className)}>
      <motion.div
        className="absolute top-0 h-full w-1/3 -skew-x-12 will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent-400), transparent)",
        }}
        initial={{ left: "-40%" }}
        animate={reduceMotion ? undefined : { left: ["-40%", "120%"] }}
        transition={{ duration: 8, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
    </div>
  );
}
