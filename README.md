# AridentFlow

A local-first business process simulation and optimization studio by AridentRIS.

Model a process, attach duration/cost/SLA/routing assumptions, run reproducible Monte Carlo simulations in a Web Worker, and compare baseline vs. proposed scenarios with evidence — entirely client-side.

## Stack

Next.js (App Router, static export) · TypeScript (strict) · Tailwind CSS v4 · bpmn-js · Dexie.js (IndexedDB) · Apache ECharts · Zustand · Zod · Vitest.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — produce the static export (`out/`)
- `npm run lint` — ESLint
- `npm run test` — Vitest (domain, infrastructure)

## Architecture

```
src/domain          framework-independent process graph, simulation engine, analytics
src/application      use cases orchestrating domain + infrastructure
src/infrastructure    Dexie persistence, BPMN mapping, file import/export
src/workers           Web Worker simulation protocol
src/features/*        feature-oriented UI modules
src/shared            design-system primitives and cross-cutting utilities
```

Dependency direction: `domain ← application ← features/infrastructure ← app`. The domain layer has zero dependency on React, Next.js, bpmn-js, Dexie, or ECharts.
