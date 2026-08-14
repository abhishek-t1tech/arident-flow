import { createSeededRandom, fingerprint, runIteration, SimulationIteration } from "@/domain";
import { SimulationWorkerMessage, SimulationWorkerRequest } from "./protocol";

const cancelledRequestIds = new Set<string>();

function post(message: SimulationWorkerMessage): void {
  (self as unknown as Worker).postMessage(message);
}

self.addEventListener("message", (event: MessageEvent<SimulationWorkerRequest>) => {
  const message = event.data;

  if (message.type === "cancel") {
    cancelledRequestIds.add(message.requestId);
    return;
  }

  if (message.type === "run") {
    void executeRun(message);
  }
});

async function executeRun(request: Extract<SimulationWorkerRequest, { type: "run" }>): Promise<void> {
  const { requestId, graph, config, progressIntervalIterations } = request;

  try {
    const rng = createSeededRandom(config.seed);
    const iterations: SimulationIteration[] = [];

    for (let i = 0; i < config.iterations; i++) {
      if (cancelledRequestIds.has(requestId)) {
        cancelledRequestIds.delete(requestId);
        post({ type: "cancelled", requestId });
        return;
      }

      iterations.push(runIteration(graph, config, rng));

      const isProgressTick = (i + 1) % progressIntervalIterations === 0;
      if (isProgressTick) {
        post({
          type: "progress",
          requestId,
          completedIterations: i + 1,
          totalIterations: config.iterations,
        });
        await yieldToEventLoop();
      }
    }

    post({
      type: "result",
      requestId,
      result: {
        iterations,
        configFingerprint: fingerprint({ graph, config }),
        seed: config.seed,
        iterationCount: config.iterations,
      },
    });
  } catch (error) {
    post({
      type: "error",
      requestId,
      message: error instanceof Error ? error.message : "Simulation failed unexpectedly.",
    });
  }
}

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
