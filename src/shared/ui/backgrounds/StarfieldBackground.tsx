"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface StarfieldBackgroundProps {
  className?: string;
}

const STARS = Array.from({ length: 18 }, (_, i) => ({
  top: `${(i * 53) % 100}%`,
  left: `${(i * 37) % 100}%`,
  size: 2 + (i % 3),
  duration: 3 + (i % 4),
  delay: (i % 6) * 0.5,
}));

export function StarfieldBackground({ className }: StarfieldBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {STARS.map((star, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-accent-500"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          initial={{ opacity: 0.15 }}
          animate={reduceMotion ? undefined : { opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
