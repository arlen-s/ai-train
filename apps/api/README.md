# LawnBot AI API

Phase 1 provides a FastAPI metadata shell for the V3-ready V2 training workbench. Phase 2 adds scenario coverage and Dataset version governance endpoints.

Run the API:

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

Run tests:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api -v
```

Current scope:

- health endpoint
- dashboard summary
- scenario seed records
- scenario coverage records at `/api/scenarios/coverage`
- Dataset version records at `/api/datasets`
- Dataset detail records at `/api/datasets/{dataset_id}`
- Dataset coverage records at `/api/datasets/{dataset_id}/coverage`
- V3 backlog seed records
