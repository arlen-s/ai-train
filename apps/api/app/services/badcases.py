from typing import Optional

from app.schemas.core import BadcaseRecommendation, BadcaseRecord, BadcaseUpdateRequest
from app.services.seed_data import BADCASES


def list_badcases_filtered(
    source_type: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    scenario_tag: Optional[str] = None,
) -> list[BadcaseRecord]:
    records = BADCASES
    if source_type:
        records = [record for record in records if record.source_type == source_type]
    if category:
        records = [record for record in records if record.category == category]
    if severity:
        records = [record for record in records if record.severity == severity]
    if scenario_tag:
        records = [record for record in records if scenario_tag in record.scenario_tags]
    return records


def get_badcase_or_none(badcase_id: str) -> Optional[BadcaseRecord]:
    return next((record for record in BADCASES if record.id == badcase_id), None)


def update_badcase_or_none(badcase_id: str, request: BadcaseUpdateRequest) -> Optional[BadcaseRecord]:
    record = get_badcase_or_none(badcase_id)
    if record is None:
        return None
    if request.status is not None:
        record.status = request.status
    if request.owner is not None:
        record.owner = request.owner
    return record


def build_badcase_recommendation_or_none(badcase_id: str) -> Optional[BadcaseRecommendation]:
    record = get_badcase_or_none(badcase_id)
    if record is None:
        return None

    normalized_root_cause = record.root_cause.strip().lower()
    if normalized_root_cause in {"simulator limitation", "real-log gap", "sensor fusion gap"}:
        return BadcaseRecommendation(
            badcase_id=record.id,
            recommended_action="create V3 backlog item for ROS 2 / Gazebo or Isaac Sim validation with real sensor logs",
            create_v3_backlog_item=True,
            target_module="simulation",
            priority="P1",
        )
    if normalized_root_cause == "reward misspecification":
        return BadcaseRecommendation(
            badcase_id=record.id,
            recommended_action="adjust reward config, increase local-loop penalty, and retrain PPO on targeted curriculum",
            create_v3_backlog_item=False,
            target_module="rl-training",
            priority="P0",
        )
    if normalized_root_cause == "map generator gap":
        return BadcaseRecommendation(
            badcase_id=record.id,
            recommended_action="add scenario generator cases and domain randomization before policy retraining",
            create_v3_backlog_item=False,
            target_module="rl-environment",
            priority="P0",
        )

    return BadcaseRecommendation(
        badcase_id=record.id,
        recommended_action=record.recommended_action,
        create_v3_backlog_item=False,
        target_module=record.source_type,
        priority="P1",
    )

