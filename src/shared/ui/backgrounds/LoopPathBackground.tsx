"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface LoopPathBackgroundProps {
  className?: string;
}

export function LoopPathBackground({ className }: LoopPathBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-40", className)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <path
          id="loop-track"
          d="M 120 320 C 120 160, 320 60, 480 100 C 680 150, 700 300, 560 340 C 420 380, 160 340, 120 320 Z"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="2 10"
        />
        {!reduceMotion && (
          <>
            <motion.circle
              r="7"
              fill="var(--color-brand-600)"
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: "path('M 120 320 C 120 160, 320 60, 480 100 C 680 150, 700 300, 560 340 C 420 380, 160 340, 120 320 Z')" }}
            />
            <motion.circle
              r="5"
              fill="var(--color-accent-500)"
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 14, delay: -9.24, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: "path('M 120 320 C 120 160, 320 60, 480 100 C 680 150, 700 300, 560 340 C 420 380, 160 340, 120 320 Z')" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
