"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface AuroraBackgroundProps {
  className?: string;
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -inset-[40%] opacity-40 blur-3xl will-change-transform"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, var(--color-brand-700), var(--color-accent-500), var(--color-brand-500), var(--color-brand-800), var(--color-brand-700))",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-[30%] opacity-25 blur-3xl will-change-transform"
        style={{
          background:
            "conic-gradient(from 180deg at 60% 40%, var(--color-accent-400), transparent, var(--color-brand-600), transparent)",
        }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
