import Link from "next/link";
import { FiArrowRight, FiLock, FiTarget, FiLayers } from "react-icons/fi";
import { PulseRingsBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

const pillars = [
  { icon: FiLock, label: "Private by default" },
  { icon: FiTarget, label: "Decision-oriented" },
  { icon: FiLayers, label: "Engineered to scale" },
];

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <PulseRingsBackground />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center sm:px-8">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.2em] text-accent-300 uppercase">
            Model. Simulate. Improve.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring evidence to your next process decision
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Link
            href="/studio"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-500 px-6 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
          >
            Open the studio
            <FiArrowRight aria-hidden />
          </Link>
        </FadeIn>
        <FadeIn delay={0.15}>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-on-dark-muted sm:flex-row sm:gap-8">
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent-300" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
