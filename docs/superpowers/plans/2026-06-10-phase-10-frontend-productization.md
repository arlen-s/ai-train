# Phase 10 Frontend Productization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real React/Vite frontend workbench that consumes the FastAPI V2 metadata APIs and replaces the static HTML shell.

**Architecture:** `apps/web` becomes a Vite React TypeScript app. API access is centralized in `src/lib/api.ts`; UI is split into focused components and styled through `src/styles.css`.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Recharts, lucide-react, CSS.

---

## File Structure

- Create `apps/web/package.json`
- Create `apps/web/index.html`
- Create `apps/web/tsconfig.json`
- Create `apps/web/tsconfig.node.json`
- Create `apps/web/vite.config.ts`
- Create `apps/web/src/main.tsx`
- Create `apps/web/src/App.tsx`
- Create `apps/web/src/styles.css`
- Create `apps/web/src/lib/api.ts`
- Create `apps/web/src/lib/types.ts`
- Create `apps/web/src/test/setup.ts`
- Create `apps/web/src/App.test.tsx`
- Create focused components under `apps/web/src/components/`
- Update `apps/web/README.md`
- Update `docs/engineering/repository-structure.md`

## Task 1: Scaffold And Dependency Setup

- [ ] **Step 1: Create package files**

Create Vite React TypeScript configuration and dependency metadata.

- [ ] **Step 2: Install dependencies**

Run:

```bash
cd apps/web && npm install
```

Expected: dependencies install and `package-lock.json` is created.

## Task 2: API Client Tests

- [ ] **Step 1: Write failing tests**

Create Vitest tests for API client error handling and app rendering with mocked responses.

- [ ] **Step 2: Run red**

Run:

```bash
cd apps/web && npm test -- --run
```

Expected: FAIL before implementation.

## Task 3: API Client And Types

- [ ] **Step 1: Implement types**

Add TypeScript interfaces matching backend API payloads.

- [ ] **Step 2: Implement API client**

Add `fetchJson`, `loadWorkbenchData`, and `exportReportMarkdown`.

- [ ] **Step 3: Run tests**

Run frontend tests until green.

## Task 4: Product UI

- [ ] **Step 1: Implement cockpit shell**

Overview first viewport with metrics, workflow tabs, status rail, and decision cards.

- [ ] **Step 2: Implement workflow panels**

Data/QC, Perception, RL Replay, Evaluation/Badcase, Report/V3 panels.

- [ ] **Step 3: Implement replay visualization**

SVG replay map with robot path, dynamic actors, LiDAR rays, ultrasonic values, and event markers.

## Task 5: Verification

- [ ] **Step 1: Run tests**

Run:

```bash
cd apps/web && npm test -- --run
```

- [ ] **Step 2: Run build**

Run:

```bash
cd apps/web && npm run build
```

- [ ] **Step 3: Run backend and frontend servers**

Run FastAPI on `8000` and Vite on an available port.

- [ ] **Step 4: Visual verification**

Use browser/screenshot verification to confirm the first viewport, tabs, charts, and replay render correctly.

## Task 6: Commit

- [ ] **Step 1: Commit**

Run:

```bash
git add .
git commit -m "feat: build frontend workbench product"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers frontend requirements from PRD/prototype notes.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: API types align with backend route payloads.

