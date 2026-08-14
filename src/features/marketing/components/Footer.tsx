import { StarfieldBackground } from "@/shared/ui/backgrounds";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-canvas">
      <StarfieldBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <p className="font-semibold text-ink">AridentFlow by AridentRIS</p>
        <p className="mt-1 text-sm text-ink-muted">
          A local-first business process simulation and optimization studio.
        </p>
        <p className="mt-4 text-xs text-ink-muted">
          &copy; {year} AridentRIS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
