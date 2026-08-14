import { LoopPathBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const steps = [
  {
    step: "01",
    title: "Model",
    body: "Model a process such as purchase approval, employee onboarding, customer support escalation or claims handling.",
  },
  {
    step: "02",
    title: "Simulate",
    body: "Attach duration, cost, SLA and routing assumptions, then run thousands of reproducible simulation cases.",
  },
  {
    step: "03",
    title: "Improve",
    body: "Identify which activities or paths contribute most to delay, cost or service risk, then compare alternatives with evidence.",
  },
];

export function CoreLoop() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-canvas">
      <LoopPathBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <FadeIn>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">
            The core loop
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Model. Simulate. Improve.
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {steps.map(({ step, title, body }, i) => (
            <FadeIn key={step} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col gap-4 bg-surface p-8">
                <span className="text-sm font-semibold text-accent-ink">
                  {step}
                </span>
                <h3 className="text-xl font-semibold text-ink">{title}</h3>
                <p className="text-ink-muted leading-relaxed">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
