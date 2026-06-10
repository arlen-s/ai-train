# LawnBot AI API

Phase 1 provides a FastAPI metadata shell for the V3-ready V2 training workbench.

Run the API:

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

Run tests:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

Current scope:

- health endpoint
- dashboard summary
- scenario seed records
- V3 backlog seed records
