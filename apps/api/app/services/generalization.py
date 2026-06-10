from typing import Optional

from app.schemas.core import PolicyComparison, RLEvaluationReport
from app.services.seed_data import POLICY_COMPARISONS, RL_EVALUATIONS


def list_rl_evaluations() -> list[RLEvaluationReport]:
    return RL_EVALUATIONS


def get_rl_evaluation_or_none(report_id: str) -> Optional[RLEvaluationReport]:
    return next((report for report in RL_EVALUATIONS if report.id == report_id), None)


def list_policy_comparisons() -> list[PolicyComparison]:
    return POLICY_COMPARISONS

