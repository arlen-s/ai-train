# Phase 6 Generalization Evaluation And Badcase Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement split-level RL evaluation, policy comparison, Badcase filtering/status updates, and recommendation generation.

**Architecture:** Add reusable RL metric helpers in `packages/evaluation`, then extend FastAPI metadata with generalization evaluation schemas and Badcase service functions. Keep all heavy evaluation jobs outside request handlers.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Create `packages/evaluation/rl_metrics.py`: coverage and repeat coverage helpers.
- Create `packages/evaluation/tests/test_rl_metrics.py`: controlled metric tests.
- Modify `apps/api/app/schemas/core.py`: add RL evaluation, policy comparison, Badcase update, and Badcase recommendation schemas.
- Modify `apps/api/app/services/seed_data.py`: add RL evaluation and policy comparison seed records, plus RL Badcases.
- Create `apps/api/app/services/generalization.py`: RL evaluation and policy comparison lookup.
- Create `apps/api/app/services/badcases.py`: Badcase filtering, detail lookup, status update, and recommendation generation.
- Modify `apps/api/app/services/perception.py`: delegate Badcase list/create behavior to the shared Badcase service or preserve compatibility with shared state.
- Modify `apps/api/app/main.py`: add RL evaluation, comparison, filtered Badcase, detail, update, and recommendation routes.
- Create `apps/api/tests/test_generalization_badcase_api.py`: API tests.
- Modify `apps/web/index.html`: add generalization and Badcase loop section.
- Modify `apps/api/README.md`: document Phase 6 endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 6 implementation note.

## Task 1: RL Metric Tests

- [ ] **Step 1: Write failing tests**

Create `packages/evaluation/tests/test_rl_metrics.py` to verify:

- `calculate_coverage_rate(covered_cells=82, coverable_cells=100)` returns `0.82`.
- `calculate_repeat_coverage_rate(repeat_steps=11, total_steps=100)` returns `0.11`.
- invalid counts raise `ValueError`.

- [ ] **Step 2: Run red**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_rl_metrics -v
```

Expected: FAIL because `packages.evaluation.rl_metrics` does not exist.

## Task 2: API Tests

- [ ] **Step 1: Write failing API tests**

Create `apps/api/tests/test_generalization_badcase_api.py` with tests for:

- `GET /api/rl/evaluations`
- `GET /api/rl/evaluations/eval-unseen-014`
- `GET /api/policy-comparisons`
- `GET /api/badcases?source_type=rl&severity=high&scenario_tag=narrow-passage`
- `GET /api/badcases/badcase-ppo-stuck-014`
- `PATCH /api/badcases/badcase-ppo-stuck-014`
- `POST /api/badcases/badcase-sim-gap-001/recommendation`

- [ ] **Step 2: Run red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_generalization_badcase_api -v
```

Expected: FAIL because routes and schemas do not exist.

## Task 3: Metric Implementation

- [ ] **Step 1: Implement `packages/evaluation/rl_metrics.py`**

Add `calculate_coverage_rate` and `calculate_repeat_coverage_rate` with input validation.

- [ ] **Step 2: Run metric tests**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_rl_metrics -v
```

Expected: PASS.

## Task 4: API Implementation

- [ ] **Step 1: Add schemas**

Add Phase 6 Pydantic schemas to `apps/api/app/schemas/core.py`.

- [ ] **Step 2: Add seed data**

Add RL evaluation, policy comparison, and RL Badcase records to `seed_data.py`.

- [ ] **Step 3: Add services and routes**

Implement `generalization.py`, `badcases.py`, and route handlers in `main.py`.

- [ ] **Step 4: Run API tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_generalization_badcase_api -v
```

Expected: PASS.

## Task 5: Web And Docs

- [ ] **Step 1: Add UI section**

Add Chinese-first generalization evaluation and Badcase decision content to `apps/web/index.html`.

- [ ] **Step 2: Update docs**

Update `apps/api/README.md` and `docs/engineering/repository-structure.md`.

## Task 6: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env
rg -n "泛化评估|Badcase 闭环|/api/rl/evaluations|/api/policy-comparisons|/api/badcases" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add generalization badcase loop slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers Phase 6 roadmap and RQ-008/RQ-009.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

