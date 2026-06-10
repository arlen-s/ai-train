from typing import Optional

from app.schemas.core import DatasetCoverage, DatasetVersion, ScenarioCoverage
from app.services.seed_data import DATASETS, SCENARIOS


def _coverage_level(sample_count: int) -> str:
    if sample_count >= 300:
        return "strong"
    if sample_count >= 60:
        return "weak"
    return "gap"


def _recommended_action(scenario_id: str, level: str) -> str:
    if scenario_id == "scenario-dense-dynamic-pet":
        return "补充动态障碍仿真、增加 pet/person crossing curriculum，并加入 Badcase 回归测试"
    if level == "weak":
        return "补充定向采集与增强样本，优先进入下一轮 Dataset 版本"
    if level == "gap":
        return "补充场景生成器样本并建立专项评估用例"
    return "保持 baseline 验证覆盖"


def list_scenario_coverage() -> list[ScenarioCoverage]:
    coverage: list[ScenarioCoverage] = []
    for scenario in SCENARIOS:
        level = _coverage_level(scenario.coverage_count)
        coverage.append(
            ScenarioCoverage(
                scenario_id=scenario.id,
                scenario_name=scenario.name,
                sample_count=scenario.coverage_count,
                required_min_count=100,
                coverage_level=level,
                risk_level=scenario.risk_level,
                recommended_action=_recommended_action(scenario.id, level),
                sensor_modalities=scenario.sensor_modalities,
                dynamic_obstacle_pattern=scenario.dynamic_obstacle_pattern,
            )
        )
    return coverage


def list_datasets() -> list[DatasetVersion]:
    return DATASETS


def get_dataset_or_none(dataset_id: str) -> Optional[DatasetVersion]:
    return next((dataset for dataset in DATASETS if dataset.id == dataset_id), None)


def get_dataset_coverage_or_none(dataset_id: str) -> Optional[DatasetCoverage]:
    dataset = get_dataset_or_none(dataset_id)
    if dataset is None:
        return None

    weak_scenarios = [
        scenario_id
        for scenario_id, count in dataset.scenario_distribution.items()
        if 60 <= count < 100
    ]
    gap_scenarios = [
        scenario_id
        for scenario_id, count in dataset.scenario_distribution.items()
        if count < 60
    ]

    return DatasetCoverage(
        dataset_id=dataset.id,
        coverage_by_scenario=dataset.scenario_distribution,
        weak_scenarios=weak_scenarios,
        gap_scenarios=gap_scenarios,
        sensor_modalities=dataset.sensor_modalities,
        v3_reserved_sources=dataset.v3_real_log_sources,
    )
