from fastapi import FastAPI

from app.schemas.core import DashboardSummary, Scenario, V3BacklogItem
from app.services.dashboard import get_dashboard_summary
from app.services.seed_data import SCENARIOS, V3_BACKLOG

app = FastAPI(
    title="LawnBot AI V2 Workbench API",
    version="0.1.0",
    description="V3-ready V2 metadata API for the LawnBot AI training workbench.",
)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "target": "V2",
        "architecture_mode": "V3-ready",
        "ui_language": "zh-CN",
    }


@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary() -> DashboardSummary:
    return get_dashboard_summary()


@app.get("/api/scenarios", response_model=list[Scenario])
def list_scenarios() -> list[Scenario]:
    return SCENARIOS


@app.get("/api/backlog/v3", response_model=list[V3BacklogItem])
def list_v3_backlog() -> list[V3BacklogItem]:
    return V3_BACKLOG
