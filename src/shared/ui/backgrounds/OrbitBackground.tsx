"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface OrbitBackgroundProps {
  variant?: "dark" | "light";
  className?: string;
}

const RINGS = [
  { radius: 160, duration: 22, size: 10, reverse: false },
  { radius: 240, duration: 34, size: 8, reverse: true },
  { radius: 320, duration: 46, size: 12, reverse: false },
];

export function OrbitBackground({ variant = "light", className }: OrbitBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const dotColor = variant === "dark" ? "var(--color-accent-400)" : "var(--color-accent-600)";
  const ringColor = variant === "dark" ? "var(--color-brand-500)" : "var(--color-brand-400)";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-30",
        className,
      )}
    >
      {RINGS.map((ring, index) => (
        <div key={index} className="absolute" style={{ width: ring.radius * 2, height: ring.radius * 2 }}>
          <div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: ringColor, opacity: 0.4 }}
          />
          <motion.div
            className="absolute inset-0"
            animate={reduceMotion ? undefined : { rotate: ring.reverse ? -360 : 360 }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-[1px]"
              style={{ width: ring.size, height: ring.size, background: dotColor }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
