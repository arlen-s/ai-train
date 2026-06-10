from typing import Optional

from fastapi import FastAPI, HTTPException

from app.schemas.core import (
    AnnotationTask,
    AugmentationPreset,
    BadcaseCreateRequest,
    BadcaseRecommendation,
    BadcaseRecord,
    BadcaseUpdateRequest,
    DashboardSummary,
    DatasetCoverage,
    DatasetDriftReport,
    DatasetVersion,
    EvaluationReport,
    LabelSchemaVersion,
    ModelVersion,
    ModelRegressionGuardrail,
    PlannerBaseline,
    PolicyComparison,
    QCUpdateRequest,
    RLEnvironmentVersion,
    RLEvaluationReport,
    RLEpisodeReplay,
    RLPolicyVersion,
    ProjectSummaryReport,
    ReportExportRequest,
    ReportExportResult,
    RLEpisodeCluster,
    Scenario,
    ScenarioCoverage,
    TrainingRun,
    V3BacklogCreateRequest,
    V3BacklogItem,
    V3PromotionPlan,
)
from app.services.annotation import (
    get_annotation_task_or_none,
    get_current_label_schema,
    list_annotation_tasks,
    update_annotation_task_qc,
)
from app.services.badcases import (
    build_badcase_recommendation_or_none,
    get_badcase_or_none,
    list_badcases_filtered,
    update_badcase_or_none,
)
from app.services.dashboard import get_dashboard_summary
from app.services.enhancements import (
    get_dataset_drift_report,
    list_augmentation_presets,
    list_model_regression_guardrails,
    list_rl_episode_clusters,
)
from app.services.generalization import (
    get_rl_evaluation_or_none,
    list_policy_comparisons,
    list_rl_evaluations,
)
from app.services.governance import (
    get_dataset_coverage_or_none,
    get_dataset_or_none,
    list_datasets,
    list_scenario_coverage,
)
from app.services.perception import (
    create_perception_badcase,
    get_evaluation_report_or_none,
    get_training_run_or_none,
    list_evaluation_reports,
    list_model_versions,
    list_training_runs,
)
from app.services.rl_training import (
    get_rl_environment_or_none,
    get_rl_episode_or_none,
    get_rl_policy_or_none,
    list_rl_baselines,
    list_rl_environments,
    list_rl_policies,
)
from app.services.reports import build_project_summary_report, export_project_summary_report
from app.services.seed_data import SCENARIOS, V3_BACKLOG
from app.services.v3_planning import create_v3_backlog_item, get_v3_promotion_plan

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


@app.get("/api/datasets/drift", response_model=DatasetDriftReport)
def dataset_drift() -> DatasetDriftReport:
    return get_dataset_drift_report()


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


@app.get("/api/label-schemas/current", response_model=LabelSchemaVersion)
def current_label_schema() -> LabelSchemaVersion:
    return get_current_label_schema()


@app.get("/api/annotation-tasks", response_model=list[AnnotationTask])
def annotation_tasks() -> list[AnnotationTask]:
    return list_annotation_tasks()


@app.get("/api/annotation-tasks/{task_id}", response_model=AnnotationTask)
def annotation_task_detail(task_id: str) -> AnnotationTask:
    task = get_annotation_task_or_none(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Annotation task not found")
    return task


@app.patch("/api/annotation-tasks/{task_id}/qc", response_model=AnnotationTask)
def update_annotation_task_qc_route(task_id: str, request: QCUpdateRequest) -> AnnotationTask:
    try:
        task = update_annotation_task_qc(task_id, request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if task is None:
        raise HTTPException(status_code=404, detail="Annotation task not found")
    return task


@app.get("/api/training-runs", response_model=list[TrainingRun])
def training_runs() -> list[TrainingRun]:
    return list_training_runs()


@app.get("/api/training-runs/{run_id}", response_model=TrainingRun)
def training_run_detail(run_id: str) -> TrainingRun:
    run = get_training_run_or_none(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Training run not found")
    return run


@app.get("/api/models", response_model=list[ModelVersion])
def model_versions() -> list[ModelVersion]:
    return list_model_versions()


@app.get("/api/model-guardrails/regression", response_model=list[ModelRegressionGuardrail])
def model_regression_guardrails() -> list[ModelRegressionGuardrail]:
    return list_model_regression_guardrails()


@app.get("/api/evaluations", response_model=list[EvaluationReport])
def evaluation_reports() -> list[EvaluationReport]:
    return list_evaluation_reports()


@app.get("/api/evaluations/{report_id}", response_model=EvaluationReport)
def evaluation_report_detail(report_id: str) -> EvaluationReport:
    report = get_evaluation_report_or_none(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Evaluation report not found")
    return report


@app.get("/api/badcases", response_model=list[BadcaseRecord])
def badcase_records(
    source_type: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    scenario_tag: Optional[str] = None,
) -> list[BadcaseRecord]:
    return list_badcases_filtered(source_type, category, severity, scenario_tag)


@app.post("/api/badcases", response_model=BadcaseRecord)
def create_badcase(request: BadcaseCreateRequest) -> BadcaseRecord:
    try:
        return create_perception_badcase(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/badcases/{badcase_id}", response_model=BadcaseRecord)
def badcase_detail(badcase_id: str) -> BadcaseRecord:
    badcase = get_badcase_or_none(badcase_id)
    if badcase is None:
        raise HTTPException(status_code=404, detail="Badcase not found")
    return badcase


@app.patch("/api/badcases/{badcase_id}", response_model=BadcaseRecord)
def update_badcase(badcase_id: str, request: BadcaseUpdateRequest) -> BadcaseRecord:
    badcase = update_badcase_or_none(badcase_id, request)
    if badcase is None:
        raise HTTPException(status_code=404, detail="Badcase not found")
    return badcase


@app.post("/api/badcases/{badcase_id}/recommendation", response_model=BadcaseRecommendation)
def badcase_recommendation(badcase_id: str) -> BadcaseRecommendation:
    recommendation = build_badcase_recommendation_or_none(badcase_id)
    if recommendation is None:
        raise HTTPException(status_code=404, detail="Badcase not found")
    return recommendation


@app.get("/api/augmentation-presets", response_model=list[AugmentationPreset])
def augmentation_presets() -> list[AugmentationPreset]:
    return list_augmentation_presets()


@app.get("/api/rl/environments", response_model=list[RLEnvironmentVersion])
def rl_environments() -> list[RLEnvironmentVersion]:
    return list_rl_environments()


@app.get("/api/rl/environments/{environment_id}", response_model=RLEnvironmentVersion)
def rl_environment_detail(environment_id: str) -> RLEnvironmentVersion:
    environment = get_rl_environment_or_none(environment_id)
    if environment is None:
        raise HTTPException(status_code=404, detail="RL environment not found")
    return environment


@app.get("/api/rl/policies", response_model=list[RLPolicyVersion])
def rl_policies() -> list[RLPolicyVersion]:
    return list_rl_policies()


@app.get("/api/rl/policies/{policy_id}", response_model=RLPolicyVersion)
def rl_policy_detail(policy_id: str) -> RLPolicyVersion:
    policy = get_rl_policy_or_none(policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="RL policy not found")
    return policy


@app.get("/api/rl/baselines", response_model=list[PlannerBaseline])
def rl_baselines() -> list[PlannerBaseline]:
    return list_rl_baselines()


@app.get("/api/rl/evaluations", response_model=list[RLEvaluationReport])
def rl_evaluations() -> list[RLEvaluationReport]:
    return list_rl_evaluations()


@app.get("/api/rl/episode-clusters", response_model=list[RLEpisodeCluster])
def rl_episode_clusters() -> list[RLEpisodeCluster]:
    return list_rl_episode_clusters()


@app.get("/api/rl/evaluations/{report_id}", response_model=RLEvaluationReport)
def rl_evaluation_detail(report_id: str) -> RLEvaluationReport:
    report = get_rl_evaluation_or_none(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="RL evaluation not found")
    return report


@app.get("/api/policy-comparisons", response_model=list[PolicyComparison])
def policy_comparisons() -> list[PolicyComparison]:
    return list_policy_comparisons()


@app.get("/api/reports/project-summary", response_model=ProjectSummaryReport)
def project_summary_report() -> ProjectSummaryReport:
    return build_project_summary_report()


@app.post("/api/reports/export", response_model=ReportExportResult)
def export_report(request: ReportExportRequest) -> ReportExportResult:
    return export_project_summary_report(request)


@app.get("/api/rl/episodes/{episode_id}", response_model=RLEpisodeReplay)
def rl_episode_detail(episode_id: str) -> RLEpisodeReplay:
    episode = get_rl_episode_or_none(episode_id)
    if episode is None:
        raise HTTPException(status_code=404, detail="RL episode not found")
    return episode


@app.get("/api/backlog/v3", response_model=list[V3BacklogItem])
def list_v3_backlog() -> list[V3BacklogItem]:
    return V3_BACKLOG


@app.post("/api/backlog/v3", response_model=V3BacklogItem)
def create_v3_backlog(request: V3BacklogCreateRequest) -> V3BacklogItem:
    return create_v3_backlog_item(request)


@app.get("/api/backlog/v3/promotion-plan", response_model=V3PromotionPlan)
def v3_promotion_plan() -> V3PromotionPlan:
    return get_v3_promotion_plan()
