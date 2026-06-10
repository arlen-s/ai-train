from app.schemas.core import ProjectSummaryReport, ReportExportRequest, ReportExportResult


SOURCE_VERSIONS = {
    "dataset": "dataset-v2",
    "label_schema": "label-schema-v2",
    "detection_model": "model-det-yolo-v2",
    "segmentation_model": "model-seg-boundary-v1",
    "environment": "rl-env-v2-grid",
    "policy": "ppo-v2",
    "evaluation": "eval-unseen-014",
}


REPORT_SECTIONS = {
    "JD Mapping": (
        "Covers scenario data planning, Dataset governance, annotation/QC, perception training, "
        "RL path planning, multi-scenario evaluation, Badcase iteration, and documentation handoff."
    ),
    "Data Coverage": (
        "dataset-v2 contains 3180 samples from field collection, machine return logs, and simulation. "
        "Weak coverage remains in rainy, glare, narrow-boundary, and dense dynamic obstacle scenarios."
    ),
    "Annotation QC": (
        "label-schema-v2 defines detection, segmentation, and V3-ready point-cloud labels with LabelImg, "
        "LabelMe, CVAT, QC issue categories, and Badcase links."
    ),
    "Perception Results": (
        "model-det-yolo-v2 records mAP 0.82, recall 0.78, ONNX ready status, and 38ms latency. "
        "model-seg-boundary-v1 records mean IoU 0.76 and boundary-specific weaknesses."
    ),
    "RL Generalization": (
        "ppo-v2 is evaluated on train, validation, and unseen splits with 0.82 coverage rate and "
        "0.68 unseen success rate. Random and rule-based planner baselines are retained for comparison."
    ),
    "Badcase Loop": (
        "Badcases track perception false negatives, boundary segmentation errors, RL stuck behavior, "
        "and simulator limitations with owner, status, root cause, and recommended next action."
    ),
    "Limitations": (
        "V2 uses deterministic seed metadata and a lightweight 2D simulator. Real robot logs, ROS 2, "
        "Gazebo or Isaac Sim, multi-sensor fusion, and edge deployment remain V3 work."
    ),
    "V3 Plan": (
        "Promote ROS 2 / Gazebo or Isaac Sim, real LiDAR / RTK / GNSS / IMU logs, multi-sensor fusion, "
        "TensorRT or quantization, real robot tests, and fleet feedback into the industrial track."
    ),
}


VERIFICATION_COMMANDS = [
    "python3 -m unittest packages.evaluation.tests.test_perception_metrics packages.evaluation.tests.test_rl_metrics packages.rl_env.tests.test_grid_world -v",
    "PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api apps.api.tests.test_generalization_badcase_api apps.api.tests.test_report_export_api -v",
    "PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env",
]


def build_project_summary_report() -> ProjectSummaryReport:
    return ProjectSummaryReport(
        id="project-summary-v2",
        format="structured",
        title="LawnBot AI V2 Project Summary",
        source_versions=SOURCE_VERSIONS,
        sections=REPORT_SECTIONS,
        verification_commands=VERIFICATION_COMMANDS,
    )


def export_project_summary_report(request: ReportExportRequest) -> ReportExportResult:
    report = build_project_summary_report()
    content = _to_markdown(report)
    return ReportExportResult(
        id="report-export-v2-markdown",
        format=request.format,
        artifact_path="artifacts/reports/lawnbot-v2-project-summary.md",
        content=content,
        source_versions=report.source_versions,
    )


def _to_markdown(report: ProjectSummaryReport) -> str:
    lines = [f"# {report.title}", ""]
    lines.append("## Source Versions")
    for key, value in report.source_versions.items():
        lines.append(f"- {key}: `{value}`")
    lines.append("")

    for title, body in report.sections.items():
        lines.append(f"## {title}")
        lines.append(body)
        lines.append("")

    lines.append("## Verification")
    for command in report.verification_commands:
        lines.append(f"- `{command}`")
    lines.append("")
    return "\n".join(lines)

