# Phase 11 Three.js Industrial Cockpit Design

Date: 2026-06-11

## Objective

Upgrade the Phase 10 React workbench from a PRD-like workflow dashboard into a high-fidelity robotics AI cockpit. The first viewport must be dominated by a real WebGL-rendered simulation scene, not a static image, background illustration, or screenshot-style texture.

The target visual direction is an industrial robotic mower operations console: dark UI, real-time simulation controls, a central 3D lawn scenario, sensor overlays, telemetry, fleet/deployment state, benchmark metrics, and issue queue context.

## Product Positioning

This remains a V3-ready V2 portfolio product. The cockpit visualizes V2 simulation metadata and 3D-ready replay records. It does not claim ROS 2, Gazebo, Isaac Sim, real robot deployment, or real sensor log ingestion as implemented V2 behavior.

V3-only industrial items can appear as labeled reservations or backlog indicators, but the central Three.js scene is a V2 simulation visualization.

## Rendering Requirement

The central viewport must be a true browser-rendered 3D scene using Three.js/WebGL:

- lawn terrain is geometry with procedural material variation
- robot is modeled from 3D meshes
- rocks, trees, fence segments, forbidden zones, and boundary posts are 3D objects
- people/pet actors are low-poly 3D placeholders, not flat image sprites
- robot path, planned path, completed coverage, no-go zones, LiDAR rays, ultrasonic arcs, and point-cloud-like returns are rendered as Three.js geometry, lines, particles, or transparent meshes
- lighting, shadows, fog, tone mapping, and camera perspective create depth and cockpit realism

Allowed:

- procedural textures or small material maps for PBR-like surface detail
- CSS/SVG UI panels around the viewport
- simplified low-poly models made in code

Not allowed:

- using the provided reference image as a background
- using a single garden screenshot as the simulation viewport
- replacing the 3D scene with a 2D SVG replay
- implying ROS/Gazebo/real robot integration is complete in V2

## First-Viewport Layout

The app should load into an industrial cockpit layout:

1. Top simulation control bar
   - product mark
   - Project selector
   - Scenario selector
   - Mode
   - Sim Time
   - Real Time Factor
   - V2/V3 scope label
   - operator/status icons

2. Left pipeline rail
   - ROS-style V2 simulation pipeline nodes
   - sensor drivers
   - perception model
   - sensor fusion
   - mapping/costmap
   - planner and RL policy
   - controller
   - simulator bridge and edge runtime
   - each node shows a compact latency/status value

3. Central Three.js simulation viewport
   - rendered terrain/garden scene
   - mower robot
   - obstacle/person/pet actors
   - no-go zone and boundary overlays
   - planned path and robot trajectory
   - coverage completed bands
   - LiDAR sweep/rays and ultrasonic arcs
   - overlay legend and robot status card

4. Right sensor and telemetry stack
   - LiDAR point cloud mini panel
   - depth-like mini panel
   - semantic segmentation mini panel
   - occupancy grid mini panel
   - telemetry values for position, orientation, velocity, battery, temperature, and connection

5. Right fleet/deployment stack
   - health score
   - deployed robot cards
   - battery, health, vibration, OTA status
   - issue queue and feedback loop

6. Bottom benchmark suite
   - coverage completeness
   - obstacle response time
   - collision rate
   - stuck rate
   - missed detection
   - path overlap
   - safety score
   - sim-to-real gap placeholder labeled V3 validation
   - benchmark comparison table

## Data Flow

The cockpit consumes the existing `WorkbenchData` loaded by `loadWorkbenchData`.

Three.js viewport input should be derived from:

- `data.rlEpisode` for map size, path, frames, dynamic actors, event markers, LiDAR, and ultrasonic values
- `data.dashboard` for current dataset/model/policy headline metrics
- `data.rlEvaluations` and `data.policyComparisons` for benchmark metrics
- `data.badcases` for issue queue and feedback loop state

The first version does not require new backend endpoints.

## Frontend Architecture

Create focused frontend components under `apps/web/src/components/industrial/`:

- `IndustrialCockpit.tsx`: orchestrates first-viewport cockpit layout and receives `WorkbenchData`
- `ThreeSimulationViewport.tsx`: owns Three.js renderer, scene lifecycle, camera, animation loop, and resize handling
- `PipelineGraph.tsx`: renders V2 pipeline rail
- `SensorStack.tsx`: renders sensor mini panels and telemetry
- `FleetOpsPanel.tsx`: renders fleet, feedback loop, and issue queue
- `BenchmarkSuite.tsx`: renders bottom benchmark metrics and comparison table
- `cockpitData.ts`: maps `WorkbenchData` into UI-friendly records

Keep legacy workflow panels available below the cockpit or as secondary sections so Phase 10 functionality is not deleted. The first screen must prioritize the industrial 3D cockpit.

## Visual System

Use a dark industrial palette:

- near-black background
- blue-green status accents
- amber/yellow control signals
- red critical issues
- subtle panel borders
- dense but readable typography

The UI should feel like a robotics operations console, not a marketing hero and not a generic admin dashboard.

## Testing And Verification

Automated tests:

- `IndustrialCockpit` renders top bar, pipeline, viewport container, telemetry, fleet, benchmark, and issue queue from mock data.
- `ThreeSimulationViewport` initializes without crashing when WebGL is mocked or unavailable, and exposes a fallback status that still preserves layout.
- Data mapping tests verify metrics and actor counts are derived from `WorkbenchData`.

Manual/browser verification:

- dev server renders a dark cockpit first viewport
- canvas is nonblank
- central viewport contains geometry-driven 3D scene
- sensor overlays and benchmark panels are visible without scrolling on desktop
- mobile/tablet layout stacks without text overlap

## Risks

- Browser test environments do not provide full WebGL. Mitigate with dependency-injected renderer setup and fallback DOM assertions.
- Photo-real visual quality is limited without external high-quality 3D assets. Mitigate with procedural geometry, PBR-like materials, strong lighting, and postprocessing-style CSS overlays.
- Three.js can increase bundle size. Acceptable for this portfolio-grade cockpit, but avoid unnecessary helper libraries in the first version.

## Acceptance Criteria

- The first viewport no longer reads as PRD cards.
- The central simulation is a real Three.js canvas/WebGL scene.
- No single background image is used to fake the simulation.
- The cockpit includes pipeline, telemetry, sensor stack, fleet/deployment, benchmark, and issue queue surfaces.
- Existing frontend tests pass and new cockpit tests pass.
- `npm run build` passes.
- Documentation records Phase 11 as a UI/UE visualization upgrade, not a V3 robotics integration.
