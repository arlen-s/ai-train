# Phase 8 V2 Enhancement Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Dataset drift, model regression guardrail, augmentation preset, and RL episode clustering APIs.

**Architecture:** Add focused Pydantic schemas and a metadata service under `apps/api`. Keep all records deterministic and dependency-free.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Modify `apps/api/app/schemas/core.py`: add V2 enhancement schemas.
- Modify `apps/api/app/services/seed_data.py`: add drift, guardrail, augmentation, and episode cluster seed records.
- Create `apps/api/app/services/enhancements.py`: V2 enhancement lookup service.
- Modify `apps/api/app/main.py`: add V2 enhancement routes.
- Create `apps/api/tests/test_v2_enhancements_api.py`: API tests.
- Modify `apps/web/index.html`: add V2 enhancement section.
- Modify `apps/api/README.md`: document endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 8 implementation note.

## Task 1: API Tests

- [ ] **Step 1: Write failing tests**

Create `apps/api/tests/test_v2_enhancements_api.py` with tests for:

- `GET /api/datasets/drift`
- `GET /api/model-guardrails/regression`
- `GET /api/augmentation-presets`
- `GET /api/rl/episode-clusters`

- [ ] **Step 2: Run red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_v2_enhancements_api -v
```

Expected: FAIL because endpoints do not exist.

## Task 2: Implementation

- [ ] **Step 1: Add schemas**

Add `DatasetDriftReport`, `ModelRegressionGuardrail`, `AugmentationPreset`, and `RLEpisodeCluster`.

- [ ] **Step 2: Add seed data**

Add deterministic records to `seed_data.py`.

- [ ] **Step 3: Add service and routes**

Create `enhancements.py` and route handlers in `main.py`.

- [ ] **Step 4: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_v2_enhancements_api -v
```

Expected: PASS.

## Task 3: Web And Docs

- [ ] **Step 1: Add UI section**

Add Chinese-first V2 enhancement content to `apps/web/index.html`.

- [ ] **Step 2: Update docs**

Update `apps/api/README.md` and `docs/engineering/repository-structure.md`.

## Task 4: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api apps.api.tests.test_report_export_api apps.api.tests.test_v2_enhancements_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env
rg -n "Dataset drift|model regression guardrail|augmentation presets|episode clusters|/api/datasets/drift|/api/model-guardrails/regression|/api/augmentation-presets|/api/rl/episode-clusters" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add v2 enhancement completion slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers Phase 8 roadmap and remaining V2 enhancement gaps.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

