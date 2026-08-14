import { BeamSweepBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

export function Positioning() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface">
      <BeamSweepBackground />
      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <FadeIn>
          <h2 className="text-lg font-semibold text-ink">
            What AridentFlow isn&rsquo;t
          </h2>
          <p className="mt-3 text-ink-muted leading-relaxed">
            AridentFlow models and simulates process behavior; it does not
            execute production workflows. It emphasizes explainable
            quantitative insight over opaque AI recommendations, and isn&rsquo;t
            attempting to be a full BPMN execution engine or a real-time
            collaboration platform in this release.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
