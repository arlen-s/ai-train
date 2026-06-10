# PM Prototype Notes

## Input Dependency

Prototype design starts only after the PM project requirements document is written or updated.

Primary input:

- `docs/product/prd.md`
- `docs/product/requirement-decomposition.md`

Static prototype artifact:

- `docs/product/prototypes/pm-wireframes.html`

The prototype must implement the PRD's target users, core flows, V2 requirements, non-functional requirements, and V3 reservation points. If the prototype reveals a missing requirement, update the PRD first.

## Design Direction

The product should feel like an AI/DataOps operations console for a robotics team. It should be dense, calm, and workflow-oriented.

Do not design it as a landing page.

V2 must not look like a generic backend admin system. Avoid making the left menu the dominant visual signal. The first viewport should read as a robotics AI training workbench: simulation replay, sensor overlays, training/evaluation status, data-loop health, and Badcase decisions should be visible before detailed CRUD tables.

Use workflow tabs, top navigation, split workbench surfaces, and inspector panels instead of a heavy admin sidebar. Tables are still allowed for Dataset, QC, Model, and Badcase detail areas, but they should support the training loop rather than define the product personality.

V3 can look more like a full robotics platform, with industrial simulation, fleet operations, real log ingestion, and edge deployment surfaces.

The main interface language is Simplified Chinese. Keep industry-standard technical labels in English when they are more recognizable than translation, including `AI/DataOps`, `RL`, `PPO`, `ONNX`, `mAP`, `IoU`, `LiDAR`, `RTK/GNSS`, `IMU`, `Badcase`, `Dataset`, `Model`, `Policy`, and version ids.

## Required Screens

### 1. Overview Dashboard

Purpose: show project status at a glance.

Must include:

- dataset coverage summary
- annotation QC status
- latest perception model metrics
- latest RL policy metrics
- Badcase trend
- V2/V3 scope status

Primary actions:

- view weak scenarios
- open latest evaluation
- review Badcases
- export report

### 2. Scenario Matrix

Purpose: manage coverage requirements for real and simulated mowing scenarios.

Dimensions:

- grass type
- grass height
- dry/wet state
- flat/slope terrain
- boundary type
- obstacles
- lighting
- weather
- season/time

PM note: V2 must expose simulated LiDAR, ultrasonic, IMU/GNSS-like pose, vibration, and current telemetry. Reserve V3 fields for real robot log imports.

### 3. Dataset Versions

Purpose: track dataset lifecycle.

Must show:

- version id
- sample count
- scenario distribution
- annotation status
- quality score
- linked training runs
- linked Badcases

### 4. Annotation And QC

Purpose: show labeling workflow and quality control.

Must show:

- detection labels
- segmentation labels
- QC pass/fail status
- missed labels
- unclear boundaries
- small object issues
- occlusion and blur flags

### 5. Perception Training

Purpose: track detection and segmentation experiments.

Must show:

- dataset version
- model type
- hyperparameters
- training curves
- mAP / IoU / recall / precision
- linked model artifacts
- linked Badcases

### 6. RL Training

Purpose: track agent training.

Must show:

- environment version
- scenario generator configuration
- action space
- reward configuration
- PPO parameters
- training curves
- policy version
- curriculum stage
- domain randomization profile
- dynamic obstacle scenario mix

### 7. Simulation Replay

Purpose: let users inspect agent behavior.

Must show:

- lawn map
- boundary and forbidden zones
- obstacles
- dynamic people/pet actors
- robot path
- covered/uncovered area
- simulated LiDAR and ultrasonic overlays
- collision/near-miss markers
- repeat coverage heatmap
- 3D-ready episode timeline

### 8. Generalization Evaluation

Purpose: compare models and policies across training, validation, and unseen scenarios.

Must show:

- success rate
- coverage rate
- repeat coverage rate
- collisions
- boundary violations
- path length
- completion time
- energy proxy
- dynamic obstacle response time
- planner baseline comparison
- ONNX or inference latency status when linked to perception runs

### 9. Badcase Library

Purpose: turn failures into next iteration tasks.

Badcase categories:

- perception false positive
- perception false negative
- boundary segmentation error
- shadow/glare confusion
- small object miss
- RL collision
- RL stuck
- RL repeated mowing
- RL boundary violation
- RL poor generalization

### 10. V3 Backlog

Purpose: collect industrial-track improvements without polluting V2 delivery.

Must include:

- feature title
- source problem
- target module
- expected value
- dependency
- priority
- V3 classification
