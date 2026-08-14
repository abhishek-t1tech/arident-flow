import { FiAlertCircle } from "react-icons/fi";
import { ScatterDriftBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const pains = [
  "Teams know where activities occur but cannot estimate the distribution of end-to-end completion time.",
  "Improvement proposals are debated using averages, anecdotes or intuition rather than scenario evidence.",
  "Bottlenecks are often identified only after a process is deployed or after SLA failures become visible.",
  "Sensitive operational models may be unsuitable for casual upload to external SaaS tools.",
];

export function Problem() {
  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <ScatterDriftBackground />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Diagrams explain sequence. They don&rsquo;t quantify behavior.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            Organizations frequently document workflows in BPMN diagrams,
            flowcharts, SOPs, spreadsheets, Visio or presentation slides.
            These artifacts explain sequence and responsibility, but usually
            do not quantify how the process behaves under uncertainty.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ul className="flex flex-col gap-5">
            {pains.map((pain) => (
              <li key={pain} className="flex gap-3">
                <FiAlertCircle
                  className="mt-1 h-5 w-5 shrink-0 text-brand-ink"
                  aria-hidden
                />
                <span className="text-ink-muted leading-relaxed">{pain}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
