export type RandomFn = () => number;

export function createSeededRandom(seed: number): RandomFn {
  let state = (seed >>> 0) || 1;

  return function next(): number {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
