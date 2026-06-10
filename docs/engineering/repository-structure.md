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
