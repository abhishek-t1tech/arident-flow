"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface WaveBarsBackgroundProps {
  className?: string;
}

const BARS = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i / 23) * 100}%`,
  duration: 3 + (i % 5) * 0.6,
  delay: (i % 8) * 0.18,
  baseHeight: 18 + ((i * 37) % 40),
}));

export function WaveBarsBackground({ className }: WaveBarsBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]", className)}>
      <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between px-4">
        {BARS.map((bar, index) => (
          <motion.div
            key={index}
            className="w-1.5 rounded-t-full bg-accent-600"
            style={{ height: bar.baseHeight, transformOrigin: "bottom" }}
            animate={reduceMotion ? undefined : { scaleY: [1, 1.8, 0.6, 1] }}
            transition={{
              duration: bar.duration,
              delay: bar.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
