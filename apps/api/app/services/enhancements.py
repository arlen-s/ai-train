from app.schemas.core import (
    AugmentationPreset,
    DatasetDriftReport,
    ModelRegressionGuardrail,
    RLEpisodeCluster,
)
from app.services.seed_data import (
    AUGMENTATION_PRESETS,
    DATASET_DRIFT_REPORT,
    MODEL_REGRESSION_GUARDRAILS,
    RL_EPISODE_CLUSTERS,
)


def get_dataset_drift_report() -> DatasetDriftReport:
    return DATASET_DRIFT_REPORT


def list_model_regression_guardrails() -> list[ModelRegressionGuardrail]:
    return MODEL_REGRESSION_GUARDRAILS


def list_augmentation_presets() -> list[AugmentationPreset]:
    return AUGMENTATION_PRESETS


def list_rl_episode_clusters() -> list[RLEpisodeCluster]:
    return RL_EPISODE_CLUSTERS

