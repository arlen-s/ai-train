from fastapi import FastAPI, HTTPException

from app.schemas.core import (
    DashboardSummary,
    DatasetCoverage,
    DatasetVersion,
    Scenario,
    ScenarioCoverage,
    V3BacklogItem,
)
from app.services.dashboard import get_dashboard_summary
from app.services.governance import (
    get_dataset_coverage_or_none,
    get_dataset_or_none,
    list_datasets,
    list_scenario_coverage,
)
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


@app.get("/api/scenarios/coverage", response_model=list[ScenarioCoverage])
def scenario_coverage() -> list[ScenarioCoverage]:
    return list_scenario_coverage()


@app.get("/api/datasets", response_model=list[DatasetVersion])
def datasets() -> list[DatasetVersion]:
    return list_datasets()


@app.get("/api/datasets/{dataset_id}", response_model=DatasetVersion)
def dataset_detail(dataset_id: str) -> DatasetVersion:
    dataset = get_dataset_or_none(dataset_id)
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset version not found")
    return dataset


@app.get("/api/datasets/{dataset_id}/coverage", response_model=DatasetCoverage)
def dataset_coverage(dataset_id: str) -> DatasetCoverage:
    coverage = get_dataset_coverage_or_none(dataset_id)
    if coverage is None:
        raise HTTPException(status_code=404, detail="Dataset version not found")
    return coverage


@app.get("/api/backlog/v3", response_model=list[V3BacklogItem])
def list_v3_backlog() -> list[V3BacklogItem]:
    return V3_BACKLOG
