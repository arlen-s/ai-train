from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class Scenario(BaseModel):
    id: str
    name: str
    grass_type: str
    grass_height: str
    moisture: Literal["dry", "wet", "mixed"]
    terrain: str
    boundary_type: str
    obstacle_types: List[str]
    lighting: str
    weather: str
    season_time: str
    coverage_count: int = Field(ge=0)
    risk_level: Literal["low", "medium", "high"]
    sensor_modalities: List[str]
    dynamic_obstacle_pattern: str
    v3_real_log_reference: Optional[str] = None


class ScenarioCoverage(BaseModel):
    scenario_id: str
    scenario_name: str
    sample_count: int = Field(ge=0)
    required_min_count: int = Field(gt=0)
    coverage_level: Literal["strong", "weak", "gap"]
    risk_level: Literal["low", "medium", "high"]
    recommended_action: str
    sensor_modalities: List[str]
    dynamic_obstacle_pattern: str


class DatasetVersion(BaseModel):
    id: str
    name: str
    sample_count: int = Field(ge=0)
    source: str
    scenario_distribution: Dict[str, int]
    annotation_schema_version: str
    qc_status: str
    quality_score: float = Field(ge=0, le=1)
    sensor_modalities: List[str]
    immutable_after_training: bool
    linked_training_runs: List[str]
    linked_evaluation_reports: List[str]
    linked_badcases: List[str]
    known_limitations: List[str]
    v3_real_log_sources: List[str] = Field(default_factory=list)


class DatasetCoverage(BaseModel):
    dataset_id: str
    coverage_by_scenario: Dict[str, int]
    weak_scenarios: List[str]
    gap_scenarios: List[str]
    sensor_modalities: List[str]
    v3_reserved_sources: List[str]


class LabelClass(BaseModel):
    name: str
    display_name: str
    target_type: Literal["detection", "segmentation", "point-cloud"]
    boundary_rule: str
    occlusion_rule: str
    small_object_rule: str


class LabelSchemaVersion(BaseModel):
    id: str
    version: str
    allowed_tools: List[str]
    detection_classes: List[LabelClass]
    segmentation_classes: List[LabelClass]
    point_cloud_classes: List[LabelClass]
    qc_issue_categories: List[str]
    annotation_rules: Dict[str, str]


class AnnotationTask(BaseModel):
    id: str
    dataset_version_id: str
    task_type: Literal["detection", "segmentation", "point-cloud"]
    label_schema_id: str
    tool: str
    qc_status: Literal["pending", "review", "passed", "failed"]
    assignee: str
    reviewer: Optional[str] = None
    reviewer_notes: str = ""
    sample_count: int = Field(ge=0)
    issue_count: int = Field(ge=0)
    qc_issue_categories: List[str]
    linked_badcases: List[str]


class QCUpdateRequest(BaseModel):
    qc_status: Literal["review", "passed", "failed"]
    qc_issue_categories: List[str]
    reviewer: str
    reviewer_notes: str


class TrainingRun(BaseModel):
    id: str
    dataset_version_id: str
    task: Literal["obstacle-detection", "boundary-segmentation"]
    model_family: str
    config: Dict[str, str]
    hyperparameters: Dict[str, float]
    final_metrics: Dict[str, float]
    status: Literal["queued", "running", "completed", "failed"]
    artifact_path: str
    onnx_export_status: Literal["not-started", "ready", "failed"]
    latency_ms: int = Field(ge=0)
    linked_model_version_id: str
    linked_evaluation_reports: List[str]
    linked_badcases: List[str]
    known_limitations: List[str]


class ModelVersion(BaseModel):
    id: str
    training_run_id: str
    dataset_version_id: str
    task: Literal["obstacle-detection", "boundary-segmentation"]
    model_family: str
    metrics: Dict[str, float]
    artifact_path: str
    onnx_path: Optional[str] = None
    latency_ms: int = Field(ge=0)
    model_size_mb: float = Field(ge=0)
    promotion_status: Literal["baseline", "candidate", "promoted", "blocked"]
    linked_evaluation_reports: List[str]
    linked_badcases: List[str]
    known_limitations: List[str]


class ScenarioMetricBreakdown(BaseModel):
    scenario_id: str
    split: Literal["train", "validation", "unseen"]
    sample_count: int = Field(ge=0)
    metrics: Dict[str, float]
    weak_signals: List[str]


class EvaluationReport(BaseModel):
    id: str
    target_type: Literal["perception-model", "rl-policy"]
    target_version_id: str
    dataset_version_id: str
    task: str
    split: Literal["train", "validation", "unseen", "mixed"]
    metrics: Dict[str, float]
    scenario_breakdown: List[ScenarioMetricBreakdown]
    linked_badcases: List[str]
    recommendations: List[str]


class BadcaseRecord(BaseModel):
    id: str
    source_type: Literal["perception", "rl", "annotation", "dataset"]
    source_version_id: str
    category: str
    severity: Literal["low", "medium", "high", "critical"]
    scenario_tags: List[str]
    root_cause: str
    evidence_reference: str
    recommended_action: str
    owner: str
    status: Literal["open", "in-progress", "resolved", "deferred"]
    linked_evaluation_report_id: Optional[str] = None


class BadcaseCreateRequest(BaseModel):
    source_type: Literal["perception", "rl", "annotation", "dataset"]
    source_version_id: str
    category: str
    severity: Literal["low", "medium", "high", "critical"]
    scenario_tags: List[str]
    root_cause: str
    evidence_reference: str
    owner: str
    linked_evaluation_report_id: Optional[str] = None


class RLEnvironmentVersion(BaseModel):
    id: str
    map_generator: str
    observation_space: List[str]
    action_space: Dict[str, List[str]]
    reward_config: Dict[str, float]
    termination_rules: List[str]
    sensor_modalities: List[str]
    scenario_features: List[str]
    simulator_adapter: str
    max_steps: int = Field(gt=0)


class RLPolicyVersion(BaseModel):
    id: str
    environment_version_id: str
    algorithm: Literal["PPO", "random", "rule-based"]
    training_config: Dict[str, float]
    curriculum_stage: str
    domain_randomization: List[str]
    metrics: Dict[str, float]
    artifact_path: str
    linked_evaluation_reports: List[str]
    linked_badcases: List[str]


class PlannerBaseline(BaseModel):
    id: str
    name: str
    baseline_type: Literal["random", "rule-based"]
    environment_version_id: str
    metrics: Dict[str, float]
    description: str


class DynamicActor(BaseModel):
    actor_id: str
    actor_type: str
    trajectory: List[List[int]]


class ReplayFrame(BaseModel):
    step: int = Field(ge=0)
    robot_position: List[int]
    action: str
    reward: float
    covered_cells: int = Field(ge=0)
    lidar: List[float]
    ultrasonic: List[float]
    event: str


class RLEpisodeReplay(BaseModel):
    id: str
    policy_version_id: str
    environment_version_id: str
    scenario_id: str
    three_d_ready: bool
    map: Dict[str, int]
    path: List[List[int]]
    dynamic_actors: List[DynamicActor]
    frames: List[ReplayFrame]
    event_markers: List[str]
    timeline_reference: str


class DatasetSummary(BaseModel):
    version_id: str
    coverage_rate: float = Field(ge=0, le=1)
    sample_count: int = Field(ge=0)
    weak_scenarios: List[str]
    qc_status: str


class PerceptionSummary(BaseModel):
    model_id: str
    task: str
    map_score: float = Field(alias="mAP", ge=0, le=1)
    recall: float = Field(ge=0, le=1)
    onnx_status: str
    latency_ms: int = Field(ge=0)


class RLSummary(BaseModel):
    policy_id: str
    algorithm: str
    unseen_success_rate: float = Field(ge=0, le=1)
    coverage_rate: float = Field(ge=0, le=1)
    dynamic_obstacle_response_ms: int = Field(ge=0)
    curriculum_stage: str


class BadcaseSummary(BaseModel):
    open_count: int = Field(ge=0)
    high_severity_count: int = Field(ge=0)
    recommendation_count: int = Field(ge=0)
    top_root_causes: List[str]


class V3BacklogItem(BaseModel):
    id: str
    priority: Literal["P0", "P1", "P2"]
    title: str
    module: str
    expected_value: str
    dependency: str
    version_target: Literal["V3"]
    status: str


class DashboardSummary(BaseModel):
    product_name: str
    target_version: Literal["V2"]
    architecture_mode: str
    ui_language: Literal["zh-CN"]
    dataset: DatasetSummary
    perception: PerceptionSummary
    rl: RLSummary
    badcases: BadcaseSummary
    v3_backlog: List[V3BacklogItem]
    workflow: List[str]
    source_versions: Dict[str, str]
