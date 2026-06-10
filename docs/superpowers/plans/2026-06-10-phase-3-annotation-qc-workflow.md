# Phase 3 Annotation And QC Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the V2 annotation taxonomy and QC workflow vertical slice with label schema, annotation task list/detail, QC status updates, and Badcase links.

**Architecture:** Extend the FastAPI metadata shell with annotation-focused Pydantic schemas, deterministic mutable seed state, and a focused annotation service. Persistence remains in memory for this phase, but the route contracts are shaped for later database replacement.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Modify `apps/api/app/schemas/core.py`: add label schema, annotation task, and QC update schemas.
- Modify `apps/api/app/services/seed_data.py`: add label schema and annotation task seed state.
- Create `apps/api/app/services/annotation.py`: task lookup, label schema retrieval, QC validation and update logic.
- Modify `apps/api/app/main.py`: add label schema and annotation task routes.
- Create `apps/api/tests/test_annotation_qc_api.py`: TDD tests for label schema and QC workflow.
- Modify `apps/web/index.html`: add annotation/QC workbench section.
- Modify `apps/api/README.md`: document annotation endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 3 implementation note.

## Task 1: Annotation/QC API Tests

**Files:**
- Create: `apps/api/tests/test_annotation_qc_api.py`

- [ ] **Step 1: Write failing tests**

Tests must verify:

- `GET /api/label-schemas/current` exposes detection, segmentation, point-cloud classes, allowed tools, and QC issue categories.
- `GET /api/annotation-tasks` returns tasks linked to `dataset-v2`.
- `GET /api/annotation-tasks/{task_id}` exposes linked Badcases and current QC status.
- `PATCH /api/annotation-tasks/{task_id}/qc` updates QC status and reviewer notes.
- Invalid QC issue categories return `400` with a clear detail message.

- [ ] **Step 2: Run tests to verify red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_annotation_qc_api -v
```

Expected: FAIL because routes and schemas do not exist.

## Task 2: Schemas And Seed State

**Files:**
- Modify: `apps/api/app/schemas/core.py`
- Modify: `apps/api/app/services/seed_data.py`

- [ ] **Step 1: Add schemas**

Add `LabelClass`, `LabelSchemaVersion`, `AnnotationTask`, and `QCUpdateRequest`.

- [ ] **Step 2: Add seed state**

Add `LABEL_SCHEMA_CURRENT` and `ANNOTATION_TASKS`, covering detection, segmentation, point-cloud reservation, QC issue categories, LabelImg/LabelMe/CVAT, and Badcase links.

- [ ] **Step 3: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_annotation_qc_api -v
```

Expected: still FAIL because routes do not exist.

## Task 3: Annotation Service And Routes

**Files:**
- Create: `apps/api/app/services/annotation.py`
- Modify: `apps/api/app/main.py`

- [ ] **Step 1: Implement annotation service**

Implement:

- `get_current_label_schema`
- `list_annotation_tasks`
- `get_annotation_task_or_none`
- `update_annotation_task_qc`

- [ ] **Step 2: Add routes**

Add:

- `GET /api/label-schemas/current`
- `GET /api/annotation-tasks`
- `GET /api/annotation-tasks/{task_id}`
- `PATCH /api/annotation-tasks/{task_id}/qc`

- [ ] **Step 3: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api -v
```

Expected: all tests pass.

## Task 4: Web And Docs

**Files:**
- Modify: `apps/web/index.html`
- Modify: `apps/api/README.md`
- Modify: `docs/engineering/repository-structure.md`

- [ ] **Step 1: Add annotation/QC section to web shell**

Add Chinese-first visible text for label taxonomy, allowed tools, QC categories, and Badcase links.

- [ ] **Step 2: Update API README**

Document the annotation endpoints and QC update route.

- [ ] **Step 3: Update repository structure docs**

Add Phase 3 implementation note.

## Task 5: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app
rg -n "标注质检|LabelImg|LabelMe|CVAT|/api/annotation-tasks|/api/label-schemas/current" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add annotation qc workflow slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers V2 label schema, annotation tools, QC issue categories, annotation tasks, QC update workflow, and Badcase links.
- Placeholder scan: no placeholders remain.
- Type consistency: route names and schema fields match the test contract.
