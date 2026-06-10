from typing import Optional

from app.schemas.core import (
    BadcaseCreateRequest,
    BadcaseRecord,
    EvaluationReport,
    ModelVersion,
    TrainingRun,
)
from app.services.seed_data import BADCASES, EVALUATION_REPORTS, MODEL_VERSIONS, TRAINING_RUNS


def list_training_runs() -> list[TrainingRun]:
    return TRAINING_RUNS


def get_training_run_or_none(run_id: str) -> Optional[TrainingRun]:
    return next((run for run in TRAINING_RUNS if run.id == run_id), None)


def list_model_versions() -> list[ModelVersion]:
    return MODEL_VERSIONS


def list_evaluation_reports() -> list[EvaluationReport]:
    return EVALUATION_REPORTS


def get_evaluation_report_or_none(report_id: str) -> Optional[EvaluationReport]:
    return next((report for report in EVALUATION_REPORTS if report.id == report_id), None)


def list_badcases() -> list[BadcaseRecord]:
    return BADCASES


def create_perception_badcase(request: BadcaseCreateRequest) -> BadcaseRecord:
    if request.source_type == "perception":
        if not _model_version_exists(request.source_version_id):
            raise ValueError(f"Unknown perception source version: {request.source_version_id}")

    if request.linked_evaluation_report_id and get_evaluation_report_or_none(request.linked_evaluation_report_id) is None:
        raise ValueError(f"Unknown evaluation report: {request.linked_evaluation_report_id}")

    badcase = BadcaseRecord(
        id=f"badcase-perception-{len(BADCASES) + 1:03d}",
        source_type=request.source_type,
        source_version_id=request.source_version_id,
        category=request.category,
        severity=request.severity,
        scenario_tags=request.scenario_tags,
        root_cause=request.root_cause,
        evidence_reference=request.evidence_reference,
        recommended_action=_recommend_action(request.root_cause),
        owner=request.owner,
        status="open",
        linked_evaluation_report_id=request.linked_evaluation_report_id,
    )
    BADCASES.append(badcase)
    return badcase


def _model_version_exists(model_id: str) -> bool:
    return any(model.id == model_id for model in MODEL_VERSIONS)


def _recommend_action(root_cause: str) -> str:
    normalized = root_cause.strip().lower()
    recommendation_by_root_cause = {
        "class imbalance": "rebalance dataset and add targeted augmentation for underrepresented classes",
        "missing scenario": "collect or generate targeted scenario samples before retraining",
        "unclear annotation": "relabel samples and update QC rules before the next training run",
        "model false positive": "add hard-negative samples and compare the next model against regression guardrails",
        "model false negative": "add missed-object samples and raise recall guardrail for safety-critical classes",
        "model regression": "block promotion and rerun comparison against the previous stable model",
    }
    return recommendation_by_root_cause.get(
        normalized,
        "add regression test, inspect data/model root cause, and schedule a targeted retraining action",
    )

