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
