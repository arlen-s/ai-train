# Phase 4 Perception Training And Evaluation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement V2 perception training run, model version, evaluation report, and perception Badcase metadata workflows with controlled metric tests.

**Architecture:** Add reusable metric helpers under `packages/evaluation`, then extend the FastAPI metadata shell with perception schemas, deterministic seed records, a focused perception service, and route handlers. Persistence remains in memory for this phase while preserving route contracts for later database replacement.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Create `packages/__init__.py`: namespace marker for local package tests.
- Create `packages/evaluation/__init__.py`: exports metric helper functions.
- Create `packages/evaluation/metrics.py`: precision/recall/F1 and binary-mask IoU helpers.
- Create `packages/evaluation/tests/__init__.py`: unittest discovery marker.
- Create `packages/evaluation/tests/test_perception_metrics.py`: controlled metric tests.
- Modify `apps/api/app/schemas/core.py`: add `TrainingRun`, `ModelVersion`, `ScenarioMetricBreakdown`, `EvaluationReport`, `BadcaseRecord`, and `BadcaseCreateRequest`.
- Modify `apps/api/app/services/seed_data.py`: add deterministic Phase 4 seed records.
- Create `apps/api/app/services/perception.py`: list/detail lookups and Badcase creation.
- Modify `apps/api/app/main.py`: add perception training, model, evaluation, and Badcase routes.
- Create `apps/api/tests/test_perception_workflow_api.py`: API tests for Phase 4.
- Modify `apps/web/index.html`: add perception training/evaluation section.
- Modify `apps/api/README.md`: document Phase 4 endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 4 implementation note.

## Task 1: Metric Tests

- [ ] **Step 1: Write failing metric tests**

Create `packages/evaluation/tests/test_perception_metrics.py` with tests for:

```python
calculate_precision_recall_f1(true_positive=8, false_positive=2, false_negative=4)
binary_mask_iou([[1, 1, 0], [0, 1, 0]], [[1, 0, 0], [0, 1, 1]])
```

The first call must return precision `0.8`, recall `0.6667`, and F1 `0.7273` when rounded to four decimals. The second call must return IoU `0.5`.

- [ ] **Step 2: Run tests to verify red**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics -v
```

Expected: FAIL because `packages.evaluation.metrics` does not exist.

## Task 2: API Tests

- [ ] **Step 1: Write failing API tests**

Create `apps/api/tests/test_perception_workflow_api.py` with tests that verify:

- `GET /api/training-runs` returns detection and segmentation runs linked to `dataset-v2`.
- `GET /api/training-runs/det-yolo-v2` exposes hyperparameters, ONNX status, latency, linked model, evaluations, and Badcases.
- `GET /api/models` returns `model-det-yolo-v2` with promotion status and linked evaluation.
- `GET /api/evaluations/eval-perception-v2` exposes aggregate metrics, scenario breakdown, and linked Badcases.
- `POST /api/badcases` creates a perception Badcase and maps the root cause to a concrete recommended action.
- Unknown training run returns `404`.
- Badcase creation with an unknown source version returns `400`.

- [ ] **Step 2: Run tests to verify red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_perception_workflow_api -v
```

Expected: FAIL because routes and schemas do not exist.

## Task 3: Metric Implementation

- [ ] **Step 1: Implement metric helpers**

Create `packages/evaluation/metrics.py` with:

```python
def calculate_precision_recall_f1(true_positive: int, false_positive: int, false_negative: int) -> dict[str, float]:
    ...

def binary_mask_iou(prediction: list[list[int]], target: list[list[int]]) -> float:
    ...
```

Both helpers must validate inputs and raise `ValueError` for negative counts or mismatched mask shapes.

- [ ] **Step 2: Run metric tests**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics -v
```

Expected: PASS.

## Task 4: API Schemas, Seed State, Service, And Routes

- [ ] **Step 1: Add schemas**

Add Phase 4 Pydantic models to `apps/api/app/schemas/core.py`.

- [ ] **Step 2: Add seed state**

Add `TRAINING_RUNS`, `MODEL_VERSIONS`, `EVALUATION_REPORTS`, and `BADCASES` to `apps/api/app/services/seed_data.py`.

- [ ] **Step 3: Implement perception service**

Create `apps/api/app/services/perception.py` with list/detail helpers and `create_perception_badcase`.

- [ ] **Step 4: Add routes**

Add Phase 4 routes to `apps/api/app/main.py`.

- [ ] **Step 5: Run full API tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api -v
```

Expected: PASS.

## Task 5: Web And Docs

- [ ] **Step 1: Add web section**

Add Chinese-first perception training/evaluation content to `apps/web/index.html`, including `mAP`, `IoU`, `ONNX`, latency, scenario breakdown, and Badcase links.

- [ ] **Step 2: Update API README**

Document the Phase 4 endpoints.

- [ ] **Step 3: Update repository structure docs**

Add a Phase 4 implementation note describing `packages/evaluation` and `apps/api/app/services/perception.py`.

## Task 6: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation
rg -n "感知训练|mAP|IoU|ONNX|/api/training-runs|/api/evaluations|/api/badcases" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add perception training evaluation slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers RQ-005 and RQ-006, plus the perception side of Badcase creation.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

