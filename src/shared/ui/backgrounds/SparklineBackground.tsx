"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface SparklineBackgroundProps {
  className?: string;
}

const PATH = "M 0 300 L 100 280 L 200 310 L 300 220 L 400 240 L 500 140 L 600 170 L 700 60 L 800 90";

export function SparklineBackground({ className }: SparklineBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-25", className)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none">
        <motion.path
          d={PATH}
          fill="none"
          stroke="var(--color-accent-400)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={reduceMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: [0, 1], opacity: [0, 0.7, 0.7, 0] }}
          transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
