# Phase 9 V3 Promotion Planning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add V3 promotion plan and V3 backlog creation APIs while preserving the V2/V3 boundary.

**Architecture:** Add V3 planning schemas and service methods under `apps/api`. Reuse the current in-memory `V3_BACKLOG` seed list.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Modify `apps/api/app/schemas/core.py`: add `V3BacklogCreateRequest` and `V3PromotionPlan`.
- Create `apps/api/app/services/v3_planning.py`: V3 backlog creation and promotion plan lookup.
- Modify `apps/api/app/main.py`: add V3 planning routes.
- Create `apps/api/tests/test_v3_planning_api.py`: API tests.
- Modify `apps/web/index.html`: add V3 promotion planning section.
- Modify `apps/api/README.md`: document V3 planning endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 9 implementation note.

## Task 1: API Tests

- [ ] **Step 1: Write failing tests**

Create `apps/api/tests/test_v3_planning_api.py` with tests for:

- `GET /api/backlog/v3/promotion-plan`
- `POST /api/backlog/v3`
- invalid `version_target` rejected with 422

- [ ] **Step 2: Run red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_v3_planning_api -v
```

Expected: FAIL because routes and schemas do not exist.

## Task 2: Implementation

- [ ] **Step 1: Add schemas**

Add V3 planning schemas to `apps/api/app/schemas/core.py`.

- [ ] **Step 2: Add service**

Create `apps/api/app/services/v3_planning.py`.

- [ ] **Step 3: Add routes**

Add V3 planning routes in `apps/api/app/main.py`.

- [ ] **Step 4: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_v3_planning_api -v
```

Expected: PASS.

## Task 3: Web And Docs

- [ ] **Step 1: Add UI section**

Add Chinese-first V3 promotion planning content to `apps/web/index.html`.

- [ ] **Step 2: Update docs**

Update `apps/api/README.md` and `docs/engineering/repository-structure.md`.

## Task 4: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api apps.api.tests.test_report_export_api apps.api.tests.test_v2_enhancements_api apps.api.tests.test_v3_planning_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env
rg -n "V3 promotion|/api/backlog/v3/promotion-plan|/api/backlog/v3" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add v3 promotion planning slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers Phase 9 roadmap and preserves V2/V3 scope boundary.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

