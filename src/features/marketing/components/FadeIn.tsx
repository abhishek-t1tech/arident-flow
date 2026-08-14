"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  mode?: "scroll" | "mount";
}

export function FadeIn({ children, delay = 0, className, mode = "scroll" }: FadeInProps) {
  const animation = { opacity: 1, y: 0 };
  const initial = { opacity: 0, y: 16 };
  const transition = { duration: 0.5, delay, ease: "easeOut" as const };

  if (mode === "mount") {
    return (
      <motion.div className={className} initial={initial} animate={animation} transition={transition}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animation}
      viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
