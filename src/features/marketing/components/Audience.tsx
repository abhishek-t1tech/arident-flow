import { WaveBarsBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const roles = [
  {
    role: "Business Analysts",
    body: "Model and validate process improvement hypotheses with evidence.",
  },
  {
    role: "Operations Managers",
    body: "Understand where delay and service risk actually come from.",
  },
  {
    role: "Process Consultants",
    body: "Run client workshops backed by quantified recommendations.",
  },
  {
    role: "Transformation Leads",
    body: "Prioritize redesign and automation investment with data.",
  },
];

export function Audience() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <WaveBarsBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <FadeIn>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-ink uppercase">
            Who it&rsquo;s for
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ role, body }, i) => (
            <FadeIn key={role} delay={i * 0.06}>
              <h3 className="border-t-2 border-accent-500 pt-4 font-semibold text-ink">
                {role}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {body}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
