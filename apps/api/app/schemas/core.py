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
