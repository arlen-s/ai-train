from app.schemas.core import V3BacklogCreateRequest, V3BacklogItem, V3PromotionPlan
from app.services.seed_data import V3_BACKLOG


def create_v3_backlog_item(request: V3BacklogCreateRequest) -> V3BacklogItem:
    item = V3BacklogItem(**request.model_dump())
    V3_BACKLOG.append(item)
    return item


def get_v3_promotion_plan() -> V3PromotionPlan:
    return V3PromotionPlan(
        id="v3-promotion-plan",
        v2_scope_lock="closed",
        candidate_promotions=[
            "ROS 2 / Gazebo or Isaac Sim",
            "real sensor logs",
            "multi-sensor fusion baseline",
            "TensorRT or quantization edge deployment",
            "fleet log replay service",
        ],
        source_limitations=[
            "V2 simulator is deterministic and lightweight",
            "V2 uses seed metadata rather than real rosbag or MCAP ingestion",
            "V2 does not run real-time edge inference",
        ],
        dependencies=[
            "SimulatorAdapter",
            "SensorFrame",
            "DataIngestion rosbag/MCAP path",
            "EvaluationPipeline real-machine safety metrics",
        ],
        readiness_criteria=[
            "V2 report export passes",
            "Badcase simulator limitations are triaged",
            "real log schema and storage choice are approved",
        ],
        scope_guardrails=[
            "V2 remains metadata/simulation only; industrial robotics integrations stay in V3",
            "Do not block V2 portfolio delivery on ROS 2, Gazebo, Isaac Sim, or edge deployment",
        ],
    )

