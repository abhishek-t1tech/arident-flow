"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface ScatterDriftBackgroundProps {
  className?: string;
}

const DOTS = [
  { top: "20%", left: "15%", dx: 30, dy: -20, size: 7, duration: 9, delay: 0 },
  { top: "70%", left: "25%", dx: -25, dy: 25, size: 5, duration: 11, delay: 1.5 },
  { top: "35%", left: "45%", dx: 20, dy: 30, size: 6, duration: 10, delay: 3 },
  { top: "60%", left: "60%", dx: -30, dy: -15, size: 8, duration: 12, delay: 0.8 },
  { top: "15%", left: "75%", dx: -20, dy: 20, size: 5, duration: 9.5, delay: 2.2 },
  { top: "80%", left: "85%", dx: 25, dy: -25, size: 6, duration: 11.5, delay: 4 },
];

export function ScatterDriftBackground({ className }: ScatterDriftBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {DOTS.map((dot, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-brand-600 blur-[1px]"
          style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, dot.dx, 0],
                  y: [0, dot.dy, 0],
                  opacity: [0, 0.5, 0],
                }
          }
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
