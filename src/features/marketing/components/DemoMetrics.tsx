import { SparklineBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const metrics = [
  { label: "Average cycle time", before: "31.4h", after: "19.7h" },
  { label: "SLA compliance", before: "38%", after: "81%" },
];

export function DemoMetrics() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <SparklineBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <FadeIn>
          <span className="inline-block rounded-full border border-accent-500/50 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-accent-300 uppercase">
            Illustrative example
          </span>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-muted">
            A purchase approval process misses its 24-hour SLA. Run the
            baseline, identify <span className="text-accent-300">Manager
            Approval</span> as the dominant contributor, test a targeted
            change, and quantify the improvement.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {metrics.map(({ label, before, after }, i) => (
            <FadeIn key={label} delay={0.1 + i * 0.08}>
              <div className="rounded-lg border border-brand-700 bg-brand-900 p-6">
                <p className="text-sm text-on-dark-muted">{label}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg text-on-dark-muted line-through decoration-brand-400">
                    {before}
                  </span>
                  <span className="text-2xl font-semibold text-white">
                    {after}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn delay={0.26}>
            <div className="rounded-lg border border-accent-500 bg-brand-900 p-6">
              <p className="text-sm text-on-dark-muted">Primary constraint</p>
              <p className="mt-3 text-2xl font-semibold text-accent-300">
                Manager Approval
              </p>
            </div>
          </FadeIn>
        </div>
        <p className="mt-8 text-sm text-on-dark-muted">
          Sample scenario for illustration. Figures shown here are example
          data — inside the studio, results are calculated from the process
          model and assumptions you configure.
        </p>
      </div>
    </section>
  );
}
