"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface RisingParticlesBackgroundProps {
  variant?: "dark" | "light";
  className?: string;
}

const PARTICLES = [
  { left: "8%", size: 10, duration: 12, delay: 0 },
  { left: "22%", size: 6, duration: 16, delay: 2 },
  { left: "38%", size: 8, duration: 14, delay: 4 },
  { left: "54%", size: 5, duration: 18, delay: 1 },
  { left: "68%", size: 9, duration: 13, delay: 3 },
  { left: "82%", size: 7, duration: 17, delay: 5 },
  { left: "92%", size: 6, duration: 15, delay: 2.5 },
];

export function RisingParticlesBackground({ variant = "light", className }: RisingParticlesBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const color = variant === "dark" ? "var(--color-accent-400)" : "var(--color-brand-500)";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {PARTICLES.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute bottom-0 rounded-full blur-[2px]"
          style={{ left: particle.left, width: particle.size, height: particle.size, background: color }}
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -420],
                  opacity: [0, 0.5, 0.5, 0],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
