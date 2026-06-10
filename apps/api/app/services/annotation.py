from typing import Optional

from app.schemas.core import AnnotationTask, LabelSchemaVersion, QCUpdateRequest
from app.services.seed_data import ANNOTATION_TASKS, LABEL_SCHEMA_CURRENT


def get_current_label_schema() -> LabelSchemaVersion:
    return LABEL_SCHEMA_CURRENT


def list_annotation_tasks() -> list[AnnotationTask]:
    return ANNOTATION_TASKS


def get_annotation_task_or_none(task_id: str) -> Optional[AnnotationTask]:
    return next((task for task in ANNOTATION_TASKS if task.id == task_id), None)


def update_annotation_task_qc(task_id: str, request: QCUpdateRequest) -> Optional[AnnotationTask]:
    task = get_annotation_task_or_none(task_id)
    if task is None:
        return None

    allowed_categories = set(LABEL_SCHEMA_CURRENT.qc_issue_categories)
    for category in request.qc_issue_categories:
        if category not in allowed_categories:
            raise ValueError(f"Invalid QC issue category: {category}")

    task.qc_status = request.qc_status
    task.qc_issue_categories = request.qc_issue_categories
    task.reviewer = request.reviewer
    task.reviewer_notes = request.reviewer_notes
    task.issue_count = len(request.qc_issue_categories)
    return task
