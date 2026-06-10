# AGENTS.md

This file is the entry point for AI coding agents working on this repository.
Read it before making product, architecture, code, data, model, or testing changes.

## Project

Project name: LawnBot AI Closed-Loop System

Goal: build a complete portfolio-grade intelligent lawn mowing robot AI project that demonstrates a V3-ready V2 product:

- scenario data planning and governance
- annotation taxonomy and quality control
- perception model training and evaluation
- reinforcement learning agent training for coverage path behavior
- multi-scenario generalization testing with simulated sensor and dynamic obstacle coverage
- Badcase analysis and closed-loop iteration
- product, engineering, and model documentation with a clear V3 industrial upgrade path

The project targets an AI/data role for robotic lawn mower scenarios. It is not a simple demo. Treat it as a complete product prototype with engineering artifacts.

## Required Reading Order

Before implementing any feature, read these files in order:

1. `docs/superpowers/specs/2026-06-09-lawnbot-ai-closed-loop-design.md`
2. `docs/product/jd-capability-matrix.md`
3. `docs/product/prd.md`
4. `docs/product/requirement-decomposition.md`
5. `docs/product/prototype-notes.md`
6. `docs/product/v2-backlog.md`
7. `docs/engineering/development-workflow.md`
8. `docs/engineering/ai-skill-discovery.md`
9. `docs/engineering/implementation-roadmap.md`
10. `docs/engineering/repository-structure.md`
11. `docs/engineering/architecture.md`
12. `docs/engineering/testing-strategy.md`

For data/model/RL work, also read:

- `docs/engineering/data-pipeline.md`
- `docs/engineering/model-training.md`
- `docs/engineering/rl-agent-training.md`
- `docs/engineering/evaluation-and-badcase.md`

Before final delivery, read:

- `docs/engineering/delivery-checklist.md`

## Scope Rules

The current formal delivery target is V2 with V3-ready architecture. V1 remains a historical foundation layer only.

V2 must deliver:

- PM-oriented dashboard and workflow surfaces
- scenario matrix management
- dataset governance and version records
- annotation task and quality-control workflow
- perception training records for obstacle detection and lawn/boundary segmentation
- 2D lawn mowing simulation environment with V3-ready simulator interfaces
- PPO-based RL agent training
- multi-scenario generalization evaluation
- simulated LiDAR and ultrasonic sensor inputs
- dynamic people/pet obstacle scenarios
- 3D episode replay or 3D-ready replay data model
- traditional coverage planner baselines
- ONNX export metadata and inference latency benchmark records
- curriculum learning and domain randomization configuration
- Badcase recommendation records for data, annotation, model, RL, or evaluation actions
- Badcase library and closed-loop iteration records
- report export and project documentation

V3 or later may include:

- ROS 2 / Gazebo or Isaac Sim
- real LiDAR/RTK/GNSS/IMU logs
- multi-sensor fusion
- edge deployment optimization
- real robot or small vehicle testing
- fleet data ingestion

Do not move V3 industrial items into V2 unless the product docs are updated first.

## Development Flow

Follow this sequence for all work:

1. map the requested change to JD capability and product requirement
2. run the AI skill/tool discovery gate
3. update or confirm the PM project requirements document
4. update or confirm PM prototype requirements
5. update PRD/backlog if behavior changes
6. design data/API/model interfaces before implementation
7. implement the smallest vertical slice that can be tested
8. add or update tests
9. run verification commands
10. update technical documentation
11. summarize impact and remaining risks

## Product Rules

The UI is an operational AI/DataOps tool, not a marketing site.

Primary in-app display language is Simplified Chinese. Keep established technical terms in English when they are clearer or industry-standard, such as `AI/DataOps`, `RL`, `PPO`, `ONNX`, `mAP`, `IoU`, `LiDAR`, `RTK/GNSS`, `IMU`, `Badcase`, `Dataset`, `Model`, `Policy`, `API`, and version ids.

V2 UI must read as a robotics AI training workbench, not as a generic backend admin console. Prefer a cockpit/workflow-tab structure with simulation replay, sensor overlays, training/evaluation state, and Badcase decisions in the first viewport. Use tables for dense detail workflows, but do not let a sidebar menu become the dominant product signal.

Use dense, practical screens:

- dashboard for project health and metrics
- tables for datasets, model versions, Badcases, training runs
- charts for distributions, metrics, and comparisons
- detail panels for samples, episodes, labels, and failures
- explicit V2/V3 labels for roadmap items

PM prototype work must include V2 target features and reserve entry points for V3 features even when they are not implemented.

PM prototype work must not start from blank screens. It must be derived from the PM project requirements document in `docs/product/prd.md`, including target users, core flows, V2 requirements, non-functional requirements, and out-of-scope boundaries.

The static PM wireframe artifact is `docs/product/prototypes/pm-wireframes.html`. Keep it aligned with `docs/product/prd.md`, `docs/product/requirement-decomposition.md`, and `docs/product/prototype-notes.md`.

## Engineering Rules

- Before implementation, check `docs/engineering/ai-skill-discovery.md` and use relevant available skills/tools. Prefer `find-skills` when the Vercel Labs skill or Skills CLI is installed; if it is unavailable locally, document the fallback discovery mechanism.
- Keep product, backend, data pipeline, model training, RL, and evaluation modules separate.
- Do not overwrite datasets, model artifacts, training logs, or evaluation outputs.
- Every dataset, model, and RL policy version needs a version id and metadata.
- Prefer reproducible configuration files over hardcoded experiment parameters.
- Store generated reports and metrics in structured formats where possible.
- Keep demo data small enough for local development, but design interfaces for larger datasets.

## Testing Rules

Every change must define how it is verified.

Minimum expectations:

- API changes include API tests.
- Data processing changes include fixture-based data validation tests.
- RL environment changes include `reset`, `step`, reward, termination, and collision tests.
- Model evaluation changes include metric calculation tests.
- Frontend changes include critical workflow checks.
- Documentation-only changes must still be checked for contradictions and stale references.

## Delivery Rules

A feature is not done until these are true:

- behavior works for the intended workflow
- tests or verification steps pass
- documentation is updated
- V2/V3 scope remains clear
- Badcase or evaluation implications are recorded when relevant
