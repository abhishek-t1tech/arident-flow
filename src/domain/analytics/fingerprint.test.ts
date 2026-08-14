import { describe, expect, it } from "vitest";
import { fingerprint } from "./fingerprint";
import { linearFixedDurationConfig, linearFixedDurationGraph } from "../../../tests/fixtures/graphs";

describe("fingerprint", () => {
  it("is stable for identical structures regardless of key order", () => {
    const a = fingerprint({ b: 2, a: 1 });
    const b = fingerprint({ a: 1, b: 2 });
    expect(a).toBe(b);
  });

  it("changes when a persisted assumption changes", () => {
    const graph = linearFixedDurationGraph();
    const before = fingerprint({ graph, config: linearFixedDurationConfig() });
    const after = fingerprint({
      graph,
      config: linearFixedDurationConfig({ slaTargetHours: 20 }),
    });
    expect(before).not.toBe(after);
  });
});
