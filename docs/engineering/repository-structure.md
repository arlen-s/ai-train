# Repository Structure

## Purpose

This document defines the recommended code layout for the next engineering phase. It prevents future AI agents from mixing frontend, backend, data pipeline, perception training, RL training, and evaluation logic into one unclear structure.

## Recommended Layout

```text
.
├── AGENTS.md
├── apps
│   ├── web
│   │   ├── src
│   │   │   ├── app
│   │   │   ├── components
│   │   │   ├── features
│   │   │   ├── lib
│   │   │   └── test
│   │   └── package.json
│   └── api
│       ├── app
│       │   ├── main.py
│       │   ├── api
│       │   ├── core
│       │   ├── models
│       │   ├── schemas
│       │   ├── services
│       │   └── tests
│       └── pyproject.toml
├── packages
│   ├── data_pipeline
│   ├── perception
│   ├── rl_env
│   └── evaluation
├── configs
│   ├── data
│   ├── perception
│   └── rl
├── data
│   ├── raw
│   ├── interim
│   ├── processed
│   └── samples
├── artifacts
│   ├── models
│   ├── policies
│   ├── evaluations
│   └── reports
├── docs
│   ├── product
│   ├── engineering
│   └── superpowers
└── tests
    ├── integration
    └── e2e
```

## Ownership Boundaries

`apps/web` owns product UI only. It should not contain model training, RL, or data cleaning logic.

`apps/api` owns API routes, persistence, metadata orchestration, and report endpoints. It should not run heavy training jobs inline.

`packages/data_pipeline` owns ingest, cleaning, scenario classification, annotation validation, and dataset version utilities.

`packages/perception` owns detection and segmentation training/evaluation helpers.

`packages/rl_env` owns the custom Gymnasium-style mowing environment, map generator, reward logic, baselines, and PPO training utilities.

`packages/evaluation` owns shared metric calculations, version comparisons, Badcase generation, and report assembly.

`configs` owns reproducible experiment and pipeline configuration. Training parameters should live here rather than being hardcoded.

`data` stores local development data only. Large or sensitive datasets should not be committed.

`artifacts` stores generated model, policy, evaluation, and report outputs. Generated artifacts should be versioned by run id and excluded from commits unless intentionally included as small portfolio samples.

## First Engineering Milestone

The first code milestone should create:

- app shell
- API shell
- core schemas for Scenario, DatasetVersion, TrainingRun, RLPolicyVersion, EvaluationReport, and Badcase
- seed data matching the PM prototype
- smoke tests

Do not start perception or RL training implementation until the skeleton and metadata model are stable.

## Phase 1 Implementation Note

The current Phase 1 skeleton uses FastAPI, Pydantic schemas, deterministic seed data, and standard-library `unittest` smoke tests. The environment does not currently include SQLAlchemy or pytest, so database persistence and pytest migration are deferred until dependency setup.

The static web shell at `apps/web/index.html` is intentionally lightweight. It preserves the Chinese-first V2 training workbench direction while the backend metadata model stabilizes.

## Phase 2 Implementation Note

The Phase 2 vertical slice adds scenario coverage and Dataset version governance APIs while still using deterministic seed data. `apps/api/app/services/governance.py` owns coverage classification and Dataset lookup logic so future database persistence can replace seed data without changing route contracts.

The web shell now exposes scenario governance and Dataset version governance sections in Chinese, including V2 simulated sensor fields and V3 real-log reservations for rosbag, MCAP, and fleet-upload sources.

## Phase 3 Implementation Note

The Phase 3 vertical slice adds label schema and annotation QC workflow APIs. `apps/api/app/services/annotation.py` owns current label schema retrieval, annotation task lookup, and QC update validation.

The seed label schema covers LabelImg, LabelMe, CVAT, detection classes, segmentation classes, QC issue categories, and a V3-ready point-cloud label reservation. QC updates validate issue categories before mutating the in-memory task state.

## Phase 4 Implementation Note

The Phase 4 vertical slice adds perception training run, Model version, evaluation report, and perception Badcase APIs. `apps/api/app/services/perception.py` owns metadata lookup, source validation, Badcase creation, and root-cause-to-action recommendation mapping.

`packages/evaluation` now owns controlled metric helpers for precision, recall, F1, and binary-mask IoU so future training scripts and report generation can reuse metric logic outside FastAPI. The API still records training and evaluation metadata only; heavy perception training remains outside the request path.

## Phase 5 Implementation Note

The Phase 5 vertical slice adds a deterministic 2D mowing RL environment in `packages/rl_env`. It exposes a lightweight Gymnasium-style `reset` and `step` contract, discrete actions, coverage rewards, collision and boundary termination, simulated LiDAR, and ultrasonic observations without adding heavy training dependencies.

`apps/api/app/services/rl_training.py` owns RL metadata lookup for environment versions, PPO policy versions, planner baselines, and 3D-ready replay records. The API records PPO training workflow metadata only; Stable-Baselines3 training is deferred to a future training script outside FastAPI request handling.

## Phase 6 Implementation Note

The Phase 6 vertical slice adds split-level RL generalization evaluation records, policy comparison records, and Badcase closed-loop actions. `apps/api/app/services/generalization.py` owns RL evaluation and comparison lookups.

`apps/api/app/services/badcases.py` owns Badcase filtering, detail lookup, owner/status updates, and recommendation generation. Simulator limitations can now produce a V3 escalation recommendation while data, annotation, model, and reward issues stay inside the V2 iteration loop.

## Phase 7 Implementation Note

The Phase 7 vertical slice adds structured project summary and Markdown report export APIs. `apps/api/app/services/reports.py` assembles deterministic report content from existing V2 source versions, including JD mapping, data coverage, annotation QC, perception results, RL generalization, Badcase loop, limitations, V3 plan, and verification commands.

The report API returns content for portfolio delivery without introducing PDF, Word, cloud storage, or document rendering dependencies.

## Phase 8 Implementation Note

The Phase 8 vertical slice adds the remaining V2 enhancement metadata for Dataset drift, model regression guardrails, synthetic augmentation presets, and RL episode clusters. `apps/api/app/services/enhancements.py` owns these lookup workflows.

These records close the loop for distribution monitoring, model promotion safety, long-tail sample expansion, and repeated RL failure grouping without adding external DVC, augmentation, or embedding-clustering dependencies.

## Phase 9 Implementation Note

The Phase 9 vertical slice adds V3 promotion planning and V3 backlog creation APIs. `apps/api/app/services/v3_planning.py` owns the V3 promotion plan and appends new V3 backlog records to the in-memory seed list.

This phase keeps V2 scope locked while documenting industrial-track upgrades such as ROS 2 / Gazebo or Isaac Sim, real sensor logs, multi-sensor fusion, edge deployment, and fleet log replay.

## Phase 10 Implementation Note

The Phase 10 vertical slice upgrades `apps/web` from a static HTML shell to a Vite + React + TypeScript workbench. `apps/web/src/lib/api.ts` owns typed API loading for the existing FastAPI metadata endpoints, while `apps/web/src/App.tsx` and focused components render the Chinese-first cockpit, workflow tabs, Dataset/QC panels, perception training views, RL replay, Evaluation/Badcase surfaces, report export, and V3 planning entry points.

The frontend remains a product UI layer only. It consumes deterministic metadata APIs and does not run data cleaning, perception training, RL training, or evaluation jobs in the browser.

## Phase 11 Implementation Note

The Phase 11 vertical slice adds an industrial robotics cockpit under `apps/web/src/components/industrial`. The central simulation viewport uses Three.js/WebGL geometry, lighting, materials, shadows, paths, coverage overlays, sensor rays, and actor meshes rather than a screenshot background.

This remains V2 simulation visualization. The UI may label ROS 2, real sensor logs, and sim-to-real validation as V3-ready context, but it does not claim real ROS/Gazebo/Isaac Sim integration or real robot deployment inside V2.

## Phase 12 Implementation Note

The Phase 12 cockpit refinement keeps the same `apps/web/src/components/industrial` boundary and improves the first viewport toward a high-fidelity industrial simulation console. The center view remains a real Three.js/WebGL scene with procedural terrain, mower geometry, dynamic actors, route replay, sensor rays, grid/costmap overlays, lighting, shadows, and scene instrumentation. Reference imagery must not be used as a background or texture.

The detailed React workbench remains available through the top-right cockpit action. The first viewport should prioritize simulation replay, sensor overlays, scenario generalization controls, benchmark status, and Badcase/fleet context while preserving the V2/V3 boundary: ROS 2, real logs, Isaac Sim, Gazebo, and real robot deployment remain V3-ready labels only unless the product scope is updated.

Frontend verification for this phase includes Vitest workflow checks, production build, Chrome headless screenshot review, and a screenshot nonblank sanity check.
