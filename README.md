# LawnBot AI Closed-Loop System

V3-ready V2 project for an intelligent lawn mowing robot AI workflow.

The project demonstrates scenario data planning, dataset governance, annotation QC, perception training records, RL agent training metadata, simulated sensor coverage, dynamic obstacle evaluation, Badcase decisions, and a V3 industrial upgrade backlog.

## Current Status

- Product target: V2 training workbench with V3-ready architecture.
- Main UI language: Simplified Chinese, with standard technical labels kept in English.
- Backend: FastAPI metadata shell with deterministic seed data.
- Web: static Chinese-first V2 workbench shell.
- Tests: standard-library `unittest` smoke tests.

## Run API

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

## Run Tests

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

## Key Docs

- `AGENTS.md`
- `docs/product/prd.md`
- `docs/product/prototype-notes.md`
- `docs/product/prototypes/pm-wireframes.html`
- `docs/engineering/implementation-roadmap.md`
- `docs/superpowers/plans/2026-06-09-phase-1-app-skeleton-data-model.md`
