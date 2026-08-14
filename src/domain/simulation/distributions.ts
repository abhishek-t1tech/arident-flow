import { DurationDistribution } from "./types";
import { RandomFn } from "./random";

export function sampleDuration(distribution: DurationDistribution, rng: RandomFn): number {
  switch (distribution.type) {
    case "fixed":
      return distribution.hours;
    case "uniform":
      return sampleUniform(distribution.minHours, distribution.maxHours, rng);
    case "triangular":
      return sampleTriangular(distribution.minHours, distribution.modeHours, distribution.maxHours, rng);
  }
}

export function sampleUniform(min: number, max: number, rng: RandomFn): number {
  if (max <= min) return min;
  return min + rng() * (max - min);
}

export function sampleTriangular(min: number, mode: number, max: number, rng: RandomFn): number {
  if (max <= min) return min;
  const u = rng();
  const c = (mode - min) / (max - min);

  if (u < c) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  }
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

export function pickWeightedBranch(
  branchProbabilities: Record<string, number>,
  rng: RandomFn,
): string | undefined {
  const entries = Object.entries(branchProbabilities);
  if (entries.length === 0) return undefined;

  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) return entries[0][0];

  const roll = rng() * total;
  let cumulative = 0;
  for (const [flowId, weight] of entries) {
    cumulative += weight;
    if (roll < cumulative) return flowId;
  }
  return entries[entries.length - 1][0];
}
