import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { AuroraBackground } from "@/shared/ui/backgrounds";
import { FadeIn } from "./FadeIn";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <AuroraBackground />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 sm:px-8 sm:py-32 lg:py-40">
        <FadeIn mode="mount">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent-300 uppercase">
            Model. Simulate. Improve.
          </p>
        </FadeIn>
        <FadeIn mode="mount" delay={0.05}>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Turn a static process diagram into a measurable business
            experiment
          </h1>
        </FadeIn>
        <FadeIn mode="mount" delay={0.1}>
          <p className="max-w-2xl text-lg leading-relaxed text-on-dark-muted sm:text-xl">
            AridentFlow is a local-first business process simulation and
            optimization studio. Model your process, attach quantitative
            assumptions, run stochastic simulations, and compare alternatives
            with evidence — entirely in your browser.
          </p>
        </FadeIn>
        <FadeIn mode="mount" delay={0.15}>
          <p className="max-w-xl text-sm text-on-dark-muted">
            Private by default. Decision-oriented by design.
          </p>
        </FadeIn>
        <FadeIn mode="mount" delay={0.2}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/studio"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent-500 px-4 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300 sm:w-auto"
            >
              Open the studio
              <FiArrowRight aria-hidden />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-white underline decoration-accent-400 decoration-2 underline-offset-4 hover:text-accent-300"
            >
              See how it works
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
