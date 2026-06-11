# Phase 13 One-Screen Cockpit Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the industrial cockpit into a dense one-screen simulation console that keeps the center Three.js viewport dominant while preventing right-column content from stretching the whole page.

**Architecture:** Keep all work in `apps/web/src/components/industrial` and `apps/web/src/styles.css`. Move compact sensor/telemetry visualization into the Three.js viewport shell, make the right rail an internal scroll area for Fleet/Issue/Regional context, and keep the bottom benchmark suite inside the same cockpit viewport.

**Tech Stack:** React, TypeScript, Three.js, CSS Grid, Vitest, Chrome headless screenshot verification.

---

### Task 1: Lock Layout Contract With Tests

**Files:**
- Modify: `apps/web/src/components/industrial/IndustrialCockpit.test.tsx`
- Modify: `apps/web/src/components/industrial/ThreeSimulationViewport.test.tsx`

- [ ] Add assertions that `IndustrialCockpit` renders `industrial-frame`, `viewport-sensor-dock`, `viewport-bottom-strip`, and `Fleet Rail`.
- [ ] Run `npm test -- --run src/components/industrial/IndustrialCockpit.test.tsx src/components/industrial/ThreeSimulationViewport.test.tsx`.
- [ ] Confirm tests fail because the new layout markers do not exist yet.

### Task 2: Move Sensor Context Into The Viewport

**Files:**
- Modify: `apps/web/src/components/industrial/ThreeSimulationViewport.tsx`
- Modify: `apps/web/src/components/industrial/SensorStack.tsx`
- Modify: `apps/web/src/components/industrial/IndustrialCockpit.tsx`

- [ ] Add a compact sensor dock inside `ThreeSimulationViewport` with LiDAR, Depth, Semantic, Occupancy, and Telemetry panels.
- [ ] Add a bottom viewport strip with RGB Camera, Planned Path, Coverage Map, Terrain Slope, Grass Height, Ultrasonic, and GNSS Trajectory tiles.
- [ ] Keep `SensorStack` available only as compact reusable sensor panel markup if needed, not as the full right-column driver.
- [ ] Replace the right rail contents with Scenario Summary, Fleet/Deployment, Issue Queue, and Regional Adaptation.

### Task 3: Convert The Page To A One-Screen Cockpit

**Files:**
- Modify: `apps/web/src/styles.css`

- [ ] Make `.industrial-cockpit` and `.industrial-grid` fit within `calc(100vh - ...)`.
- [ ] Make `.industrial-right` and `.pipeline-panel` internally scrollable with stable max heights.
- [ ] Increase the center viewport's visual dominance and keep benchmark content inside the same screen.
- [ ] Add compact styles for `viewport-sensor-dock`, `viewport-bottom-strip`, and the right rail.

### Task 4: Verify And Commit

**Files:**
- Modify: `docs/engineering/repository-structure.md`

- [ ] Add a Phase 13 note describing the one-screen cockpit rule and internal scroll behavior.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Generate a Chrome headless desktop screenshot at 1680x1050.
- [ ] Inspect the screenshot and run a nonblank pixel sanity check.
- [ ] Commit as `feat: compact cockpit into one-screen layout`.
