import { OrbitBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

export function Thesis() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <OrbitBackground variant="light" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <FadeIn>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">
            Working thesis
          </p>
          <p className="mt-4 text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            AridentFlow should make a static process model behave like a
            measurable business experiment: configure assumptions, simulate
            outcomes, identify constraints, compare alternatives and
            communicate the expected impact.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
