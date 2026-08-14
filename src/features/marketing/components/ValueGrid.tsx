import { FiBarChart2, FiCrosshair, FiShield, FiFileText } from "react-icons/fi";
import { GridPanBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const values = [
  {
    icon: FiBarChart2,
    title: "Quantify before changing",
    body: "Run the numbers on a proposed change before committing to it.",
  },
  {
    icon: FiCrosshair,
    title: "See the real constraint",
    body: "Bottleneck analysis goes beyond visual intuition on a diagram.",
  },
  {
    icon: FiShield,
    title: "Keep sensitive models local",
    body: "No account and no upload required to work on your process.",
  },
  {
    icon: FiFileText,
    title: "Communicate decisions clearly",
    body: "Executive summaries and visual comparisons built for stakeholders.",
  },
];

export function ValueGrid() {
  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <GridPanBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <FadeIn>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built for the decision, not just the diagram
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, body }, i) => (
            <FadeIn key={title} delay={i * 0.06}>
              <div className="flex gap-4 rounded-lg border border-border bg-surface p-6">
                <Icon
                  className="h-6 w-6 shrink-0 text-brand-ink"
                  aria-hidden
                />
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-ink-muted leading-relaxed">{body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
