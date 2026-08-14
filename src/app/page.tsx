import { Hero } from "@/features/marketing/components/Hero";
import { Thesis } from "@/features/marketing/components/Thesis";
import { Pillars } from "@/features/marketing/components/Pillars";
import { Problem } from "@/features/marketing/components/Problem";
import { CoreLoop } from "@/features/marketing/components/CoreLoop";
import { DemoMetrics } from "@/features/marketing/components/DemoMetrics";
import { ValueGrid } from "@/features/marketing/components/ValueGrid";
import { Audience } from "@/features/marketing/components/Audience";
import { Positioning } from "@/features/marketing/components/Positioning";
import { FinalCta } from "@/features/marketing/components/FinalCta";
import { Footer } from "@/features/marketing/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col">
        <Hero />
        <Thesis />
        <Pillars />
        <Problem />
        <CoreLoop />
        <DemoMetrics />
        <ValueGrid />
        <Audience />
        <Positioning />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
