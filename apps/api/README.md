# LawnBot AI API

Phase 1 provides a FastAPI metadata shell for the V3-ready V2 training workbench. Phase 2 adds scenario coverage and Dataset version governance endpoints. Phase 3 adds label schema and annotation QC workflow endpoints. Phase 4 adds perception training, model version, evaluation, and Badcase workflow endpoints.

Run the API:

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

Run tests:

```bash
python3 -m unittest packages.evaluation.tests.test_perception_metrics -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api -v
```

Current scope:

- health endpoint
- dashboard summary
- scenario seed records
- scenario coverage records at `/api/scenarios/coverage`
- Dataset version records at `/api/datasets`
- Dataset detail records at `/api/datasets/{dataset_id}`
- Dataset coverage records at `/api/datasets/{dataset_id}/coverage`
- current label schema at `/api/label-schemas/current`
- annotation task records at `/api/annotation-tasks`
- annotation task detail records at `/api/annotation-tasks/{task_id}`
- QC update workflow at `/api/annotation-tasks/{task_id}/qc`
- perception training run records at `/api/training-runs`
- perception training run detail records at `/api/training-runs/{run_id}`
- model version records at `/api/models`
- evaluation report records at `/api/evaluations`
- evaluation report detail records at `/api/evaluations/{report_id}`
- Badcase records and creation workflow at `/api/badcases`
- V3 backlog seed records
