"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface PulseRingsBackgroundProps {
  className?: string;
}

const RINGS = [0, 1.3, 2.6, 3.9];

export function PulseRingsBackground({ className }: PulseRingsBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden", className)}
    >
      {RINGS.map((delay, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-accent-400"
          style={{ width: 80, height: 80 }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={reduceMotion ? undefined : { scale: [1, 9], opacity: [0.5, 0] }}
          transition={{ duration: 5.2, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
