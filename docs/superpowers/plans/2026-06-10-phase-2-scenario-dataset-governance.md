# Phase 2 Scenario And Dataset Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the V2 scenario matrix and dataset version governance vertical slice with coverage analysis, Chinese-first API metadata, and V3-ready real-log reservation fields.

**Architecture:** Extend the Phase 1 FastAPI metadata shell with focused schemas and services. Persistence remains deterministic in-memory seed data for this phase, with service boundaries designed so a database repository can replace seed data later without changing route contracts.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Modify `apps/api/app/schemas/core.py`: add dataset and scenario coverage schemas.
- Modify `apps/api/app/services/seed_data.py`: add dataset version seed records and coverage helpers.
- Create `apps/api/app/services/governance.py`: scenario coverage and dataset query service functions.
- Modify `apps/api/app/main.py`: add dataset and coverage routes.
- Create `apps/api/tests/test_governance_api.py`: scenario and dataset API tests.
- Modify `apps/web/index.html`: add a scenario and dataset governance summary.
- Modify `apps/api/README.md`: document Phase 2 endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 2 implementation note.

## Task 1: Scenario And Dataset API Tests

**Files:**
- Create: `apps/api/tests/test_governance_api.py`

- [ ] **Step 1: Write failing tests**

```python
import unittest

from fastapi.testclient import TestClient

from app.main import app


class GovernanceApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_scenario_coverage_marks_weak_dynamic_obstacle_group(self) -> None:
        response = self.client.get("/api/scenarios/coverage")

        self.assertEqual(response.status_code, 200)
        coverage = response.json()
        weak_items = [item for item in coverage if item["coverage_level"] == "gap"]
        self.assertTrue(weak_items)
        self.assertEqual(weak_items[0]["scenario_id"], "scenario-dense-dynamic-pet")
        self.assertIn("补充动态障碍仿真", weak_items[0]["recommended_action"])

    def test_dataset_list_contains_immutable_v2_metadata(self) -> None:
        response = self.client.get("/api/datasets")

        self.assertEqual(response.status_code, 200)
        datasets = response.json()
        self.assertGreaterEqual(len(datasets), 2)
        dataset_v2 = next(item for item in datasets if item["id"] == "dataset-v2")
        self.assertTrue(dataset_v2["immutable_after_training"])
        self.assertIn("camera", dataset_v2["sensor_modalities"])
        self.assertIn("lidar", dataset_v2["sensor_modalities"])

    def test_dataset_detail_links_training_evaluation_and_badcases(self) -> None:
        response = self.client.get("/api/datasets/dataset-v2")

        self.assertEqual(response.status_code, 200)
        dataset = response.json()
        self.assertEqual(dataset["id"], "dataset-v2")
        self.assertIn("det-yolo-v2", dataset["linked_training_runs"])
        self.assertIn("eval-unseen-014", dataset["linked_evaluation_reports"])
        self.assertIn("badcase-shadow-boundary-001", dataset["linked_badcases"])

    def test_dataset_coverage_exposes_v3_real_log_reservation(self) -> None:
        response = self.client.get("/api/datasets/dataset-v2/coverage")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["dataset_id"], "dataset-v2")
        self.assertIn("scenario-dense-dynamic-pet", payload["coverage_by_scenario"])
        self.assertIn("rosbag", payload["v3_reserved_sources"])
        self.assertIn("MCAP", payload["v3_reserved_sources"])

    def test_unknown_dataset_returns_404(self) -> None:
        response = self.client.get("/api/datasets/missing-dataset")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Dataset version not found")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_governance_api -v
```

Expected: FAIL or ERROR because coverage and dataset routes do not exist yet.

## Task 2: Schemas And Seed Data

**Files:**
- Modify: `apps/api/app/schemas/core.py`
- Modify: `apps/api/app/services/seed_data.py`

- [ ] **Step 1: Add schemas**

Add `ScenarioCoverage`, `DatasetVersion`, and `DatasetCoverage` models to `core.py`.

- [ ] **Step 2: Add dataset seeds**

Add `DATASETS` with `dataset-v1` and `dataset-v2`, plus deterministic coverage counts and V3 reserved sources.

- [ ] **Step 3: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_governance_api -v
```

Expected: still FAIL because services and routes do not exist yet.

## Task 3: Governance Services And Routes

**Files:**
- Create: `apps/api/app/services/governance.py`
- Modify: `apps/api/app/main.py`

- [ ] **Step 1: Implement service functions**

Implement `list_scenario_coverage`, `list_datasets`, `get_dataset_or_none`, and `get_dataset_coverage_or_none`.

- [ ] **Step 2: Add routes**

Add:

- `GET /api/scenarios/coverage`
- `GET /api/datasets`
- `GET /api/datasets/{dataset_id}`
- `GET /api/datasets/{dataset_id}/coverage`

- [ ] **Step 3: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api -v
```

Expected: all tests pass.

## Task 4: Web And Docs

**Files:**
- Modify: `apps/web/index.html`
- Modify: `apps/api/README.md`
- Modify: `docs/engineering/repository-structure.md`

- [ ] **Step 1: Update web shell**

Add visible Chinese-first scenario and dataset governance summary text.

- [ ] **Step 2: Update API README**

Document the new Phase 2 endpoints.

- [ ] **Step 3: Update repository structure docs**

Add a Phase 2 implementation note.

## Task 5: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app
rg -n "场景治理|Dataset 版本治理|/api/datasets|/api/scenarios/coverage" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add scenario dataset governance slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers Phase 2 scenario coverage, dataset version read/detail, weak scenario visibility, V2 simulated sensor metadata, and V3 real-log reservation metadata.
- Placeholder scan: no placeholders remain.
- Type consistency: route names and schema property names are consistent with the test cases.
