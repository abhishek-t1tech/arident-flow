import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AridentFlow — Business Process Simulation & Optimization Studio",
    template: "%s · AridentFlow",
  },
  description:
    "AridentFlow is a local-first business process simulation and optimization studio. Model a workflow, run reproducible Monte Carlo simulations, and quantify the impact of process changes before you make them.",
  keywords: [
    "business process simulation",
    "BPMN",
    "process optimization",
    "Monte Carlo simulation",
    "process improvement",
    "AridentFlow",
    "AridentRIS",
  ],
  authors: [{ name: "AridentRIS" }],
  metadataBase: new URL("https://aridentflow.aridentris.com"),
  openGraph: {
    title: "AridentFlow — Model. Simulate. Improve.",
    description:
      "A local-first business process simulation and optimization studio. Private by default, decision-oriented by design.",
    type: "website",
    siteName: "AridentFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "AridentFlow — Model. Simulate. Improve.",
    description:
      "A local-first business process simulation and optimization studio.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3a0f18",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
