import { FiLock, FiTarget, FiLayers } from "react-icons/fi";
import { RisingParticlesBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const pillars = [
  {
    icon: FiLock,
    label: "Private by default",
    body: "Core project data remains in the browser.",
  },
  {
    icon: FiTarget,
    label: "Decision-oriented",
    body: "Insights explain what changes and why it matters.",
  },
  {
    icon: FiLayers,
    label: "Engineered to scale",
    body: "Domain logic stays portable beyond the first frontend.",
  },
];

export function Pillars() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <RisingParticlesBackground variant="light" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, label, body }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div className="flex flex-col gap-3">
                <Icon className="h-6 w-6 text-accent-ink" aria-hidden />
                <h3 className="text-sm font-semibold tracking-[0.12em] text-brand-ink uppercase">
                  {label}
                </h3>
                <p className="text-ink-muted leading-relaxed">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
