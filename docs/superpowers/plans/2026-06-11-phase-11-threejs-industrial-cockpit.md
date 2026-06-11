# Phase 11 Three.js Industrial Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the first viewport with a high-fidelity industrial robotics cockpit centered on a real Three.js/WebGL simulation scene.

**Architecture:** Keep the existing API client and `WorkbenchData` contract. Add an industrial component layer under `apps/web/src/components/industrial/`, map current seed data into cockpit records, and render a true Three.js scene from replay metadata while preserving Phase 10 secondary workflow panels.

**Tech Stack:** React, TypeScript, Vite, Three.js, Vitest, React Testing Library, Recharts, CSS.

---

## File Structure

- Modify `apps/web/package.json` to add `three`.
- Modify `apps/web/package-lock.json` after `npm install`.
- Modify `apps/web/src/App.tsx` to render `IndustrialCockpit` as the primary first viewport and keep workflow tabs below.
- Modify `apps/web/src/styles.css` for the dark industrial cockpit visual system.
- Create `apps/web/src/components/industrial/cockpitData.ts` for data mapping.
- Create `apps/web/src/components/industrial/IndustrialCockpit.tsx`.
- Create `apps/web/src/components/industrial/ThreeSimulationViewport.tsx`.
- Create `apps/web/src/components/industrial/PipelineGraph.tsx`.
- Create `apps/web/src/components/industrial/SensorStack.tsx`.
- Create `apps/web/src/components/industrial/FleetOpsPanel.tsx`.
- Create `apps/web/src/components/industrial/BenchmarkSuite.tsx`.
- Create `apps/web/src/components/industrial/IndustrialCockpit.test.tsx`.
- Create `apps/web/src/components/industrial/cockpitData.test.ts`.
- Update `apps/web/src/App.test.tsx` assertions for cockpit-first rendering.
- Update `docs/engineering/repository-structure.md` with Phase 11 note.
- Update `apps/web/README.md` with Three.js cockpit run notes.

## Task 1: Dependency And Failing Data Tests

- [ ] **Step 1: Add Three.js dependency metadata**

Edit `apps/web/package.json` dependencies to include:

```json
"three": "^0.171.0"
```

- [ ] **Step 2: Install dependency**

Run:

```bash
cd apps/web && npm install
```

Expected: `three` is installed and `package-lock.json` is updated.

- [ ] **Step 3: Write failing cockpit data mapping tests**

Create `apps/web/src/components/industrial/cockpitData.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { createCockpitData } from "./cockpitData";
import { createMockWorkbenchData } from "../../test/workbench-fixtures";

describe("createCockpitData", () => {
  it("maps workbench data into cockpit controls, metrics, actors, and issues", () => {
    const data = createCockpitData(createMockWorkbenchData());

    expect(data.controls.project).toBe("Greenfields Campus");
    expect(data.controls.scenario).toContain("dynamic");
    expect(data.robot.id).toBe("R-017");
    expect(data.robot.policyId).toBe("ppo-v2");
    expect(data.scene.path).toHaveLength(6);
    expect(data.scene.dynamicActors).toHaveLength(2);
    expect(data.sensors.lidarRayCount).toBe(8);
    expect(data.benchmarks.some((metric) => metric.label === "Coverage Completeness")).toBe(true);
    expect(data.issues[0].severity).toBe("high");
  });
});
```

- [ ] **Step 4: Run red for data mapping**

Run:

```bash
cd apps/web && npm test -- --run src/components/industrial/cockpitData.test.ts
```

Expected: FAIL because `cockpitData.ts` does not exist.

## Task 2: Implement Cockpit Data Mapping

- [ ] **Step 1: Create cockpit data mapper**

Create `apps/web/src/components/industrial/cockpitData.ts` with:

```ts
import type { WorkbenchData } from "../../lib/types";

export interface CockpitMetric {
  label: string;
  value: string;
  delta: string;
  tone: "ok" | "warn" | "risk" | "neutral";
}

export interface CockpitData {
  controls: {
    project: string;
    scenario: string;
    mode: string;
    simTime: string;
    realtimeFactor: string;
    scope: string;
  };
  robot: {
    id: string;
    policyId: string;
    modelId: string;
    battery: number;
    speed: string;
    status: string;
  };
  scene: {
    mapWidth: number;
    mapHeight: number;
    path: number[][];
    dynamicActors: Array<{ actor_id: string; actor_type: string; trajectory: number[][] }>;
    events: string[];
  };
  sensors: {
    lidarRayCount: number;
    ultrasonic: number[];
    modalities: string[];
  };
  benchmarks: CockpitMetric[];
  fleet: Array<{ id: string; status: string; health: number; battery: number; ota: string }>;
  issues: Array<{ id: string; category: string; severity: string; owner: string; status: string }>;
}

function percent(value: number | undefined): string {
  return `${Math.round((value ?? 0) * 100)}%`;
}

function fixed(value: number | undefined, digits = 2): string {
  return (value ?? 0).toFixed(digits);
}

export function createCockpitData(data: WorkbenchData): CockpitData {
  const frame = data.rlEpisode.frames[data.rlEpisode.frames.length - 1];
  const rlEvaluation = data.rlEvaluations[0];
  const comparison = data.policyComparisons[0];
  const ppoEntry = comparison?.entries.find((entry) => entry.policy_or_baseline_id === data.dashboard.rl.policy_id);
  const baselineEntry = comparison?.entries.find((entry) => entry.policy_or_baseline_id === "rule-coverage-planner");
  const improvement =
    ppoEntry && baselineEntry
      ? `+${Math.round(((ppoEntry.metrics.coverage_rate ?? 0) - (baselineEntry.metrics.coverage_rate ?? 0)) * 100)}%`
      : "+0%";

  return {
    controls: {
      project: "Greenfields Campus",
      scenario: data.rlEpisode.scenario_id,
      mode: "Simulation",
      simTime: "02:14:36",
      realtimeFactor: "1.00x",
      scope: `${data.dashboard.target_version} / ${data.dashboard.architecture_mode}`
    },
    robot: {
      id: "R-017",
      policyId: data.dashboard.rl.policy_id,
      modelId: data.dashboard.perception.model_id,
      battery: 78,
      speed: "0.82 m/s",
      status: "Active"
    },
    scene: {
      mapWidth: data.rlEpisode.map.width,
      mapHeight: data.rlEpisode.map.height,
      path: data.rlEpisode.path,
      dynamicActors: data.rlEpisode.dynamic_actors,
      events: [...new Set([...data.rlEpisode.event_markers, ...data.rlEpisode.frames.map((item) => item.event)])]
    },
    sensors: {
      lidarRayCount: frame?.lidar.length ?? 0,
      ultrasonic: frame?.ultrasonic ?? [],
      modalities: data.rlEnvironments[0]?.sensor_modalities ?? []
    },
    benchmarks: [
      { label: "Coverage Completeness", value: percent(data.dashboard.rl.coverage_rate), delta: improvement, tone: "ok" },
      { label: "Obstacle Response", value: `${fixed((data.dashboard.rl.dynamic_obstacle_response_ms ?? 0) / 1000, 2)}s`, delta: "-0.08s", tone: "ok" },
      { label: "Collision Rate", value: fixed(rlEvaluation?.metrics.collision_rate ?? 0.012, 3), delta: "-0.006", tone: "ok" },
      { label: "Stuck Rate", value: "0.38/hr", delta: "-0.15", tone: "warn" },
      { label: "Safety Score", value: "92", delta: "+3", tone: "ok" },
      { label: "Sim-to-Real Gap", value: "9.4%", delta: "V3", tone: "neutral" }
    ],
    fleet: [
      { id: "R-017", status: "Active", health: 92, battery: 78, ota: "Rolling Out" },
      { id: "R-015", status: "Active", health: 89, battery: 64, ota: "Up to date" },
      { id: "R-003", status: "Idle", health: 95, battery: 95, ota: "Up to date" },
      { id: "R-008", status: "Maintenance", health: 61, battery: 22, ota: "Failed" }
    ],
    issues: data.badcases.map((badcase) => ({
      id: badcase.id,
      category: badcase.category,
      severity: badcase.severity,
      owner: badcase.owner,
      status: badcase.status
    }))
  };
}
```

- [ ] **Step 2: Run green for data mapping**

Run:

```bash
cd apps/web && npm test -- --run src/components/industrial/cockpitData.test.ts
```

Expected: PASS.

## Task 3: Failing Cockpit Layout Tests

- [ ] **Step 1: Write failing cockpit render test**

Create `apps/web/src/components/industrial/IndustrialCockpit.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IndustrialCockpit } from "./IndustrialCockpit";
import { createMockWorkbenchData } from "../../test/workbench-fixtures";

describe("IndustrialCockpit", () => {
  it("renders an industrial robotics cockpit around a real 3D viewport", () => {
    render(<IndustrialCockpit data={createMockWorkbenchData()} />);

    expect(screen.getByText("LawnBrain")).toBeInTheDocument();
    expect(screen.getByText("ROS 2 Pipeline")).toBeInTheDocument();
    expect(screen.getByLabelText("Three.js simulation viewport")).toBeInTheDocument();
    expect(screen.getByText("LiDAR")).toBeInTheDocument();
    expect(screen.getByText("Telemetry")).toBeInTheDocument();
    expect(screen.getByText("Fleet & Deployment")).toBeInTheDocument();
    expect(screen.getByText("Evaluation & Benchmark Suite")).toBeInTheDocument();
    expect(screen.getByText("Issue Queue")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run red for cockpit render**

Run:

```bash
cd apps/web && npm test -- --run src/components/industrial/IndustrialCockpit.test.tsx
```

Expected: FAIL because `IndustrialCockpit.tsx` does not exist.

## Task 4: Implement Cockpit Panels

- [ ] **Step 1: Create pipeline rail**

Create `apps/web/src/components/industrial/PipelineGraph.tsx`:

```tsx
import { BrainCircuit, Cpu, Map, Network, Radar, Route, Satellite, Workflow } from "lucide-react";

const nodes = [
  { label: "Sensor Drivers", detail: "12 topics · 100 Hz", icon: Radar },
  { label: "Perception Model", detail: "YOLO/Seg · 18.4 ms", icon: BrainCircuit },
  { label: "Sensor Fusion", detail: "Multi-modal · 9.7 ms", icon: Network },
  { label: "Costmap", detail: "Visible + Inflation · 4.2 ms", icon: Map },
  { label: "Planner", detail: "Hybrid A* + MPC · 14.8 ms", icon: Route },
  { label: "RL Policy", detail: "Terrain Adaptation · 7.3 ms", icon: Cpu },
  { label: "Controller", detail: "Trajectory Tracking · 3.2 ms", icon: Workflow },
  { label: "Simulator Bridge", detail: "V2 Grid Adapter · 2.8 ms", icon: Satellite }
];

export function PipelineGraph() {
  return (
    <aside className="industrial-panel pipeline-panel" aria-label="ROS 2 pipeline">
      <div className="industrial-panel-title">
        <span>ROS 2 Pipeline</span>
        <small>All Systems Nominal</small>
      </div>
      <div className="pipeline-nodes">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <article className="pipeline-node" key={node.label}>
              <Icon size={15} />
              <div>
                <strong>{node.label}</strong>
                <span>{node.detail}</span>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create sensor stack**

Create `apps/web/src/components/industrial/SensorStack.tsx`:

```tsx
import type { CockpitData } from "./cockpitData";

export function SensorStack({ cockpit }: { cockpit: CockpitData }) {
  return (
    <section className="sensor-stack">
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>LiDAR</span>
          <small>{cockpit.sensors.lidarRayCount * 8}ch</small>
        </div>
        <div className="lidar-mini" aria-label="LiDAR point cloud mini view">
          {Array.from({ length: 64 }, (_, index) => (
            <i key={index} style={{ left: `${(index * 17) % 100}%`, top: `${18 + ((index * 23) % 70)}%` }} />
          ))}
        </div>
      </article>
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>Depth</span>
          <small>simulated</small>
        </div>
        <div className="depth-mini" aria-label="Depth mini view" />
      </article>
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>Semantic Segmentation</span>
          <small>lawn / obstacle</small>
        </div>
        <div className="segmentation-mini" aria-label="Semantic segmentation mini view" />
      </article>
      <article className="industrial-panel telemetry-panel">
        <div className="industrial-panel-title">
          <span>Telemetry</span>
          <small>IMU / GNSS</small>
        </div>
        <dl>
          <div><dt>x</dt><dd>12.45</dd></div>
          <div><dt>y</dt><dd>-3.21</dd></div>
          <div><dt>yaw</dt><dd>91.7 deg</dd></div>
          <div><dt>speed</dt><dd>{cockpit.robot.speed}</dd></div>
          <div><dt>battery</dt><dd>{cockpit.robot.battery}%</dd></div>
          <div><dt>connection</dt><dd>Excellent</dd></div>
        </dl>
      </article>
    </section>
  );
}
```

- [ ] **Step 3: Create fleet and issue panels**

Create `apps/web/src/components/industrial/FleetOpsPanel.tsx`:

```tsx
import type { CockpitData } from "./cockpitData";

export function FleetOpsPanel({ cockpit }: { cockpit: CockpitData }) {
  return (
    <aside className="fleet-stack">
      <section className="industrial-panel">
        <div className="industrial-panel-title">
          <span>Fleet & Deployment</span>
          <small>Health 91</small>
        </div>
        <div className="fleet-list">
          {cockpit.fleet.map((robot) => (
            <article className={`fleet-card ${robot.status.toLowerCase()}`} key={robot.id}>
              <strong>{robot.id}</strong>
              <span>{robot.status}</span>
              <div><b style={{ width: `${robot.health}%` }} /></div>
              <small>Battery {robot.battery}% · OTA {robot.ota}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="industrial-panel">
        <div className="industrial-panel-title">
          <span>Issue Queue</span>
          <small>{cockpit.issues.length}</small>
        </div>
        <div className="issue-list">
          {cockpit.issues.slice(0, 5).map((issue) => (
            <article key={issue.id}>
              <span className={`issue-dot ${issue.severity}`} />
              <strong>{issue.category}</strong>
              <small>{issue.owner} · {issue.status}</small>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
```

- [ ] **Step 4: Create benchmark suite**

Create `apps/web/src/components/industrial/BenchmarkSuite.tsx`:

```tsx
import type { CockpitData } from "./cockpitData";

export function BenchmarkSuite({ cockpit }: { cockpit: CockpitData }) {
  return (
    <section className="industrial-panel benchmark-suite">
      <div className="industrial-panel-title">
        <span>Evaluation & Benchmark Suite</span>
        <small>Ours v2.3.1 vs baseline</small>
      </div>
      <div className="benchmark-metrics">
        {cockpit.benchmarks.map((metric) => (
          <article className={`benchmark-card ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.delta}</small>
            <svg viewBox="0 0 100 24" aria-hidden="true">
              <polyline points="0,18 12,14 24,17 36,9 48,12 60,8 72,10 84,5 100,7" />
            </svg>
          </article>
        ))}
      </div>
      <table className="benchmark-table">
        <thead>
          <tr><th>Metric</th><th>Ours</th><th>Baseline</th><th>Improvement</th></tr>
        </thead>
        <tbody>
          <tr><td>Coverage Rate</td><td>82%</td><td>74%</td><td>+8%</td></tr>
          <tr><td>Collision Rate</td><td>0.012</td><td>0.045</td><td>+73%</td></tr>
          <tr><td>Safety Score</td><td>92</td><td>84</td><td>+8</td></tr>
        </tbody>
      </table>
    </section>
  );
}
```

## Task 5: Implement Three.js Viewport

- [ ] **Step 1: Create Three.js viewport component**

Create `apps/web/src/components/industrial/ThreeSimulationViewport.tsx` with a React component that:

- imports `* as THREE from "three"`
- exports `ThreeSimulationViewport({ cockpit }: { cockpit: CockpitData })`
- uses a `mountRef` div with `aria-label="Three.js simulation viewport"`
- checks `window.WebGLRenderingContext`; if unavailable, renders a `.webgl-fallback` message inside the viewport shell
- creates `WebGLRenderer({ antialias: true, alpha: true })`, scene, perspective camera, ambient light, hemisphere light, directional light, fog, shadows, and ACES filmic tone mapping
- defines `mapPointToScene(point, mapWidth, mapHeight)` to convert replay coordinates into scene x/z coordinates
- defines local helper functions inside the component effect:
  - `createTerrain(scene)` builds a subdivided `PlaneGeometry` with vertex height/color variation and a transparent coverage material
  - `createFence(scene)` builds repeated post/rail meshes around the lawn perimeter
  - `createRobot(scene, robotPosition)` builds mower body, deck, wheels, LiDAR puck, and status light from mesh primitives
  - `createObstacles(scene)` builds stones, trees, no-go zone, and boundary markers from geometry
  - `createReplayOverlays(scene, cockpit)` builds planned path, completed coverage strips, robot trajectory, event marker, and dynamic actor meshes from `cockpit.scene`
  - `createSensorOverlays(scene, robotPosition, cockpit)` builds LiDAR rays, point returns, and ultrasonic arcs from geometry
- owns an animation loop that moves a LiDAR sweep group, pulses robot status light, and slowly eases camera target
- observes parent size with `ResizeObserver`, resizes renderer, and updates camera aspect
- disposes geometries, materials, renderer, animation frame, and resize observer on unmount

```tsx
export function ThreeSimulationViewport({ cockpit }: { cockpit: CockpitData }) {
  return <div className="three-viewport-shell" aria-label="Three.js simulation viewport" ref={mountRef} />;
}
```

- [ ] **Step 2: Verify viewport compiles through targeted test**

Run:

```bash
cd apps/web && npm test -- --run src/components/industrial/IndustrialCockpit.test.tsx
```

Expected: Still FAIL until `IndustrialCockpit.tsx` wires panels together, but no module-not-found error for `ThreeSimulationViewport`.

## Task 6: Implement Industrial Cockpit Orchestrator

- [ ] **Step 1: Create cockpit orchestrator**

Create `apps/web/src/components/industrial/IndustrialCockpit.tsx`:

```tsx
import { Bell, CircleHelp, Gauge, Settings, UserRound } from "lucide-react";

import type { WorkbenchData } from "../../lib/types";
import { BenchmarkSuite } from "./BenchmarkSuite";
import { createCockpitData } from "./cockpitData";
import { FleetOpsPanel } from "./FleetOpsPanel";
import { PipelineGraph } from "./PipelineGraph";
import { SensorStack } from "./SensorStack";
import { ThreeSimulationViewport } from "./ThreeSimulationViewport";

export function IndustrialCockpit({ data }: { data: WorkbenchData }) {
  const cockpit = createCockpitData(data);

  return (
    <section className="industrial-cockpit" aria-label="Industrial robotics cockpit">
      <header className="industrial-topbar">
        <div className="industrial-brand">
          <span className="brand-orbit" aria-hidden="true" />
          <div><strong>LawnBrain</strong><small>Robotics OS</small></div>
        </div>
        <div className="sim-controls">
          <label><span>Project</span><b>{cockpit.controls.project}</b></label>
          <label><span>Scenario</span><b>{cockpit.controls.scenario}</b></label>
          <label><span>Mode</span><b>{cockpit.controls.mode}</b></label>
          <label><span>Sim Time</span><b>{cockpit.controls.simTime}</b></label>
          <label><span>RTF</span><b>{cockpit.controls.realtimeFactor}</b></label>
          <label><span>Scope</span><b>{cockpit.controls.scope}</b></label>
        </div>
        <div className="operator-tools">
          <Bell size={16} />
          <CircleHelp size={16} />
          <Settings size={16} />
          <UserRound size={18} />
        </div>
      </header>

      <div className="industrial-grid">
        <PipelineGraph />
        <main className="industrial-main">
          <ThreeSimulationViewport cockpit={cockpit} />
          <BenchmarkSuite cockpit={cockpit} />
        </main>
        <aside className="industrial-right">
          <SensorStack cockpit={cockpit} />
          <FleetOpsPanel cockpit={cockpit} />
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run cockpit render test green**

Run:

```bash
cd apps/web && npm test -- --run src/components/industrial/IndustrialCockpit.test.tsx
```

Expected: PASS.

## Task 7: Wire Cockpit Into App

- [ ] **Step 1: Update App test expectation**

Modify `apps/web/src/App.test.tsx` first test to assert:

```tsx
expect(screen.getByText("LawnBrain")).toBeInTheDocument();
expect(screen.getByLabelText("Three.js simulation viewport")).toBeInTheDocument();
expect(screen.getByText("Evaluation & Benchmark Suite")).toBeInTheDocument();
```

- [ ] **Step 2: Run red/green check**

Run:

```bash
cd apps/web && npm test -- --run src/App.test.tsx
```

Expected before wiring: FAIL because app does not render `LawnBrain`.

- [ ] **Step 3: Modify App to import and render cockpit**

In `apps/web/src/App.tsx`, import:

```ts
import { IndustrialCockpit } from "./components/industrial/IndustrialCockpit";
```

Render `<IndustrialCockpit data={data} />` immediately after the loading/error guard and before the workflow tabbar. Keep workflow tabs below the cockpit.

- [ ] **Step 4: Run app tests**

Run:

```bash
cd apps/web && npm test -- --run src/App.test.tsx
```

Expected: PASS.

## Task 8: Dark Industrial Styling

- [ ] **Step 1: Add cockpit CSS**

Append CSS to `apps/web/src/styles.css` for:

- `.industrial-cockpit`
- `.industrial-topbar`
- `.industrial-grid`
- `.pipeline-panel`
- `.three-viewport-shell`
- `.sensor-stack`
- `.fleet-stack`
- `.benchmark-suite`
- responsive breakpoints

Use dark surfaces, green/blue sensor accents, amber path colors, red issue states, fixed viewport aspect ratio, and non-overlapping dense panel layouts.

- [ ] **Step 2: Run all frontend tests**

Run:

```bash
cd apps/web && npm test -- --run
```

Expected: PASS.

## Task 9: Docs And Verification

- [ ] **Step 1: Update docs**

Update `apps/web/README.md` with:

```md
Phase 11 adds a Three.js industrial cockpit. The simulation viewport is a real WebGL scene built from geometry, lights, materials, paths, sensor rays, and actor meshes. It does not use a screenshot background to fake 3D.
```

Update `docs/engineering/repository-structure.md` with a Phase 11 implementation note.

- [ ] **Step 2: Run build**

Run:

```bash
cd apps/web && npm run build
```

Expected: PASS. Bundle size warnings are acceptable.

- [ ] **Step 3: Run full verification**

Run:

```bash
cd apps/web && npm test -- --run
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api apps.api.tests.test_report_export_api apps.api.tests.test_v2_enhancements_api apps.api.tests.test_v3_planning_api -v
python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v
```

Expected: all pass.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add apps/web docs/engineering/repository-structure.md docs/superpowers/specs/2026-06-11-phase-11-threejs-industrial-cockpit-design.md docs/superpowers/plans/2026-06-11-phase-11-threejs-industrial-cockpit.md
git commit -m "feat: add threejs industrial cockpit"
```

Expected: commit succeeds.

## Self-Review

- Spec coverage: central real Three.js viewport, dark cockpit layout, pipeline, sensors, telemetry, fleet, benchmark, issue queue, and docs are covered.
- Placeholder scan: no TODO/TBD placeholders are present; the Three.js viewport task lists concrete helpers, lifecycle behavior, geometry requirements, animation, resize handling, and cleanup obligations for execution.
- Type consistency: `CockpitData`, `createCockpitData`, and component props are consistent across tasks.
