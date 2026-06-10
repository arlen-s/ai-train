# Phase 7 Report Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement structured project summary and Markdown report export APIs for the V2 delivery package.

**Architecture:** Add report schemas and a focused report service under `apps/api`. Use deterministic seed records and avoid external document generation dependencies.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Modify `apps/api/app/schemas/core.py`: add `ProjectSummaryReport`, `ReportExportRequest`, and `ReportExportResult`.
- Create `apps/api/app/services/reports.py`: assemble structured report and Markdown content.
- Modify `apps/api/app/main.py`: add report routes.
- Create `apps/api/tests/test_report_export_api.py`: API tests.
- Modify `apps/web/index.html`: add report export section.
- Modify `apps/api/README.md`: document report endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 7 implementation note.

## Task 1: API Tests

- [ ] **Step 1: Write failing tests**

Create `apps/api/tests/test_report_export_api.py` with tests for:

- `GET /api/reports/project-summary`
- `POST /api/reports/export` with Markdown format
- invalid export format returning validation error

- [ ] **Step 2: Run red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_report_export_api -v
```

Expected: FAIL because report routes and schemas do not exist.

## Task 2: Implementation

- [ ] **Step 1: Add schemas**

Add report schemas to `apps/api/app/schemas/core.py`.

- [ ] **Step 2: Add report service**

Create `apps/api/app/services/reports.py` with `build_project_summary_report` and `export_project_summary_report`.

- [ ] **Step 3: Add routes**

Add report endpoints in `apps/api/app/main.py`.

- [ ] **Step 4: Run report tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_report_export_api -v
```

Expected: PASS.

## Task 3: Web And Docs

- [ ] **Step 1: Add UI section**

Add Chinese-first report export content to `apps/web/index.html`.

- [ ] **Step 2: Update docs**

Update `apps/api/README.md` and `docs/engineering/repository-structure.md`.

## Task 4: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api apps.api.tests.test_report_export_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env
rg -n "报告导出|/api/reports/project-summary|/api/reports/export|JD Mapping|V3 Plan" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add report export slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers Phase 7 roadmap and RQ-010 report export scope.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

