from app.schemas.core import (
    AnnotationTask,
    AugmentationPreset,
    BadcaseRecord,
    BadcaseSummary,
    DatasetVersion,
    DatasetDriftReport,
    DashboardSummary,
    DatasetSummary,
    DynamicActor,
    EvaluationReport,
    LabelClass,
    LabelSchemaVersion,
    ModelVersion,
    ModelRegressionGuardrail,
    PlannerBaseline,
    PolicyComparison,
    PolicyComparisonEntry,
    PerceptionSummary,
    QCUpdateRequest,
    RLEnvironmentVersion,
    RLEvaluationReport,
    RLEpisodeReplay,
    RLPolicyVersion,
    ReplayFrame,
    RLEpisodeCluster,
    RLSummary,
    RLSplitMetric,
    Scenario,
    ScenarioMetricBreakdown,
    TrainingRun,
    V3BacklogItem,
)


SCENARIOS = [
    Scenario(
        id="scenario-dry-flat-clear",
        name="干燥短草、平地、清晰边界",
        grass_type="bermuda",
        grass_height="short",
        moisture="dry",
        terrain="flat",
        boundary_type="clear",
        obstacle_types=["tree"],
        lighting="normal",
        weather="sunny",
        season_time="summer-morning",
        coverage_count=410,
        risk_level="low",
        sensor_modalities=["camera", "lidar", "ultrasonic"],
        dynamic_obstacle_pattern="none",
    ),
    Scenario(
        id="scenario-wet-slope-shadow",
        name="湿高草、坡地、阴影",
        grass_type="mixed",
        grass_height="tall",
        moisture="wet",
        terrain="slope",
        boundary_type="soft-shadow",
        obstacle_types=["stone", "fence"],
        lighting="shadow",
        weather="after-rain",
        season_time="spring-evening",
        coverage_count=68,
        risk_level="medium",
        sensor_modalities=["camera", "imu", "gnss"],
        dynamic_obstacle_pattern="none",
    ),
    Scenario(
        id="scenario-dense-dynamic-pet",
        name="密集障碍物、动态宠物、不规则边界",
        grass_type="mixed",
        grass_height="medium",
        moisture="mixed",
        terrain="irregular-slope",
        boundary_type="irregular",
        obstacle_types=["person", "pet", "stone", "tree", "fence"],
        lighting="glare-and-shadow",
        weather="sunny",
        season_time="autumn-afternoon",
        coverage_count=22,
        risk_level="high",
        sensor_modalities=["camera", "lidar", "ultrasonic", "trajectory"],
        dynamic_obstacle_pattern="person-pet-crossing",
    ),
]


DATASETS = [
    DatasetVersion(
        id="dataset-v1",
        name="baseline mower perception dataset",
        sample_count=2400,
        source="现场外采 + 合成增强",
        scenario_distribution={
            "scenario-dry-flat-clear": 410,
            "scenario-wet-slope-shadow": 42,
            "scenario-dense-dynamic-pet": 8,
        },
        annotation_schema_version="label-schema-v1",
        qc_status="baseline QC completed",
        quality_score=0.78,
        sensor_modalities=["camera"],
        immutable_after_training=True,
        linked_training_runs=["det-yolo-v1"],
        linked_evaluation_reports=["eval-perception-v1"],
        linked_badcases=["badcase-small-stone-001"],
        known_limitations=["强光样本不足", "动态障碍样本不足", "无模拟 LiDAR"],
    ),
    DatasetVersion(
        id="dataset-v2",
        name="v2 sensor-aware closed-loop dataset",
        sample_count=3180,
        source="现场外采 + 机端回传 + 仿真生成",
        scenario_distribution={
            "scenario-dry-flat-clear": 410,
            "scenario-wet-slope-shadow": 68,
            "scenario-dense-dynamic-pet": 22,
        },
        annotation_schema_version="label-schema-v2",
        qc_status="QC 通过，12 条待复核",
        quality_score=0.86,
        sensor_modalities=["camera", "lidar", "ultrasonic", "imu", "gnss", "trajectory"],
        immutable_after_training=True,
        linked_training_runs=["det-yolo-v2", "seg-boundary-v1"],
        linked_evaluation_reports=["eval-unseen-014", "eval-perception-v2"],
        linked_badcases=["badcase-shadow-boundary-001", "badcase-ppo-stuck-014"],
        known_limitations=["雨天样本仍偏少", "密集动态障碍覆盖不足", "真实 rosbag/MCAP 日志待 V3 接入"],
        v3_real_log_sources=["rosbag", "MCAP", "fleet-upload"],
    ),
]


LABEL_SCHEMA_CURRENT = LabelSchemaVersion(
    id="label-schema-v2",
    version="2.0",
    allowed_tools=["LabelImg", "LabelMe", "CVAT"],
    detection_classes=[
        LabelClass(
            name="person",
            display_name="人",
            target_type="detection",
            boundary_rule="完整可见人体按外接框标注，截断目标标到可见区域。",
            occlusion_rule="遮挡超过 60% 时保留 occlusion 标记。",
            small_object_rule="高度小于 16px 的远处人只在清晰可辨时标注。",
        ),
        LabelClass(
            name="pet",
            display_name="宠物",
            target_type="detection",
            boundary_rule="猫狗等宠物按完整身体外接框标注。",
            occlusion_rule="被草丛或树影遮挡时标记 occlusion。",
            small_object_rule="小目标宠物必须保留，用于动态避障长尾样本。",
        ),
        LabelClass(
            name="stone",
            display_name="石头",
            target_type="detection",
            boundary_rule="按可见石块外轮廓外接框标注。",
            occlusion_rule="被高草遮挡时标记 occlusion。",
            small_object_rule="低对比小石块仍需标注，进入 QC 重点检查。",
        ),
        LabelClass(
            name="tree",
            display_name="树木",
            target_type="detection",
            boundary_rule="树干和低垂树冠按障碍区域外接框标注。",
            occlusion_rule="树影不作为 tree 标注。",
            small_object_rule="远处树木不影响路径时可忽略。",
        ),
        LabelClass(
            name="fence",
            display_name="围栏",
            target_type="detection",
            boundary_rule="连续围栏按可见段落分框标注。",
            occlusion_rule="遮挡段落不补画。",
            small_object_rule="细窄围栏保留，用于边界误判分析。",
        ),
        LabelClass(
            name="obstacle-other",
            display_name="其他障碍物",
            target_type="detection",
            boundary_rule="无法归类但影响行驶的实体按外接框标注。",
            occlusion_rule="不确定类别时在 reviewer_notes 说明。",
            small_object_rule="小目标按安全风险优先保留。",
        ),
    ],
    segmentation_classes=[
        LabelClass(
            name="lawn",
            display_name="草坪",
            target_type="segmentation",
            boundary_rule="沿草坪可割区域边界贴边标注。",
            occlusion_rule="被障碍物遮挡区域不补全。",
            small_object_rule="碎片草坪小区域保留，便于覆盖率评估。",
        ),
        LabelClass(
            name="soil",
            display_name="泥土",
            target_type="segmentation",
            boundary_rule="裸露土地区域按真实可见边界标注。",
            occlusion_rule="阴影不改变 soil 类别。",
            small_object_rule="小泥土区域可合并到相邻 soil 面。",
        ),
        LabelClass(
            name="boundary",
            display_name="边界",
            target_type="segmentation",
            boundary_rule="围栏、石板、花坛边缘等禁越边界需贴边标注。",
            occlusion_rule="遮挡边界用可见端点连接，不凭空延伸。",
            small_object_rule="窄边界必须保留，进入越界评估。",
        ),
        LabelClass(
            name="forbidden-zone",
            display_name="禁割区",
            target_type="segmentation",
            boundary_rule="花坛、水坑、宠物活动区等按禁割区域边界标注。",
            occlusion_rule="遮挡区域不补画。",
            small_object_rule="小禁割区保留，安全优先。",
        ),
        LabelClass(
            name="obstacle-region",
            display_name="障碍物区域",
            target_type="segmentation",
            boundary_rule="树根、石块群等不可通行区域按外轮廓标注。",
            occlusion_rule="遮挡区域按可见部分标注。",
            small_object_rule="小障碍区域保留给路径规划评估。",
        ),
    ],
    point_cloud_classes=[
        LabelClass(
            name="obstacle-point-cluster",
            display_name="点云障碍簇",
            target_type="point-cloud",
            boundary_rule="V2 记录模拟点云簇，V3 可替换为真实 LiDAR cluster。",
            occlusion_rule="点云稀疏区域标记 low-confidence。",
            small_object_rule="低矮障碍点云簇保留，进入安全评估。",
        )
    ],
    qc_issue_categories=[
        "missing-label",
        "wrong-class",
        "poor-boundary",
        "occlusion",
        "small-object",
        "blur",
        "image-quality",
    ],
    annotation_rules={
        "language": "zh-CN",
        "occlusion": "遮挡、模糊、小目标必须显式保留 QC 标记。",
        "boundary": "边界类标签按安全风险优先，不允许随意平滑。",
        "v3_ready": "点云标签使用 V2 模拟簇，保留 V3 真实 LiDAR 替换入口。",
    },
)


ANNOTATION_TASKS = [
    AnnotationTask(
        id="ann-boundary-009",
        dataset_version_id="dataset-v2",
        task_type="segmentation",
        label_schema_id="label-schema-v2",
        tool="CVAT",
        qc_status="review",
        assignee="segmentation-labeler",
        reviewer="qa-reviewer",
        reviewer_notes="阴影边界 mask 粗糙，需复核 forbidden-zone 与 boundary 的交界。",
        sample_count=360,
        issue_count=11,
        qc_issue_categories=["poor-boundary", "occlusion"],
        linked_badcases=["badcase-shadow-boundary-001"],
    ),
    AnnotationTask(
        id="ann-obstacle-014",
        dataset_version_id="dataset-v2",
        task_type="detection",
        label_schema_id="label-schema-v2",
        tool="LabelImg",
        qc_status="passed",
        assignee="detection-labeler",
        reviewer="qa-reviewer",
        reviewer_notes="小石块和宠物遮挡样本已补标。",
        sample_count=420,
        issue_count=3,
        qc_issue_categories=["small-object", "occlusion"],
        linked_badcases=["badcase-small-stone-001", "badcase-pet-occlusion-002"],
    ),
]


TRAINING_RUNS = [
    TrainingRun(
        id="det-yolo-v2",
        dataset_version_id="dataset-v2",
        task="obstacle-detection",
        model_family="YOLOv8n-transfer",
        config={
            "base_model": "yolov8n.pt",
            "augmentation": "shadow-glare-rain-fog-crop",
            "split": "train/validation/unseen",
            "label_schema": "label-schema-v2",
        },
        hyperparameters={
            "learning_rate": 0.001,
            "batch_size": 16,
            "epochs": 80,
            "image_size": 640,
        },
        final_metrics={
            "precision": 0.84,
            "recall": 0.78,
            "f1": 0.81,
            "mAP": 0.82,
            "false_positive_rate": 0.09,
            "false_negative_rate": 0.14,
        },
        status="completed",
        artifact_path="artifacts/models/det-yolo-v2/model.pt",
        onnx_export_status="ready",
        latency_ms=38,
        linked_model_version_id="model-det-yolo-v2",
        linked_evaluation_reports=["eval-perception-v2"],
        linked_badcases=["badcase-small-stone-001", "badcase-pet-occlusion-002"],
        known_limitations=["强眩光下 fence/person 混淆", "小石块 recall 仍低于安全阈值"],
    ),
    TrainingRun(
        id="seg-boundary-v1",
        dataset_version_id="dataset-v2",
        task="boundary-segmentation",
        model_family="DeepLabV3Plus-MobileNet",
        config={
            "base_model": "deeplabv3plus-mobilenet",
            "augmentation": "shadow-blur-boundary-crop",
            "split": "train/validation/unseen",
            "label_schema": "label-schema-v2",
        },
        hyperparameters={
            "learning_rate": 0.0005,
            "batch_size": 8,
            "epochs": 60,
            "image_size": 512,
        },
        final_metrics={
            "mean_iou": 0.76,
            "boundary_iou": 0.71,
            "forbidden_zone_iou": 0.79,
            "boundary_deviation_px": 5.8,
            "forbidden_zone_error_rate": 0.06,
        },
        status="completed",
        artifact_path="artifacts/models/seg-boundary-v1/model.pt",
        onnx_export_status="ready",
        latency_ms=44,
        linked_model_version_id="model-seg-boundary-v1",
        linked_evaluation_reports=["eval-boundary-v1"],
        linked_badcases=["badcase-shadow-boundary-001"],
        known_limitations=["阴影软边界 mask 偏粗", "窄边界场景仍需补充标注"],
    ),
]


MODEL_VERSIONS = [
    ModelVersion(
        id="model-det-yolo-v2",
        training_run_id="det-yolo-v2",
        dataset_version_id="dataset-v2",
        task="obstacle-detection",
        model_family="YOLOv8n-transfer",
        metrics={
            "precision": 0.84,
            "recall": 0.78,
            "f1": 0.81,
            "mAP": 0.82,
            "latency_ms": 38,
        },
        artifact_path="artifacts/models/det-yolo-v2/model.pt",
        onnx_path="artifacts/models/det-yolo-v2/model.onnx",
        latency_ms=38,
        model_size_mb=12.4,
        promotion_status="candidate",
        linked_evaluation_reports=["eval-perception-v2"],
        linked_badcases=["badcase-small-stone-001", "badcase-pet-occlusion-002"],
        known_limitations=["小目标召回不足", "强眩光 false positive 偏高"],
    ),
    ModelVersion(
        id="model-seg-boundary-v1",
        training_run_id="seg-boundary-v1",
        dataset_version_id="dataset-v2",
        task="boundary-segmentation",
        model_family="DeepLabV3Plus-MobileNet",
        metrics={
            "mean_iou": 0.76,
            "boundary_iou": 0.71,
            "forbidden_zone_iou": 0.79,
            "latency_ms": 44,
        },
        artifact_path="artifacts/models/seg-boundary-v1/model.pt",
        onnx_path="artifacts/models/seg-boundary-v1/model.onnx",
        latency_ms=44,
        model_size_mb=18.7,
        promotion_status="baseline",
        linked_evaluation_reports=["eval-boundary-v1"],
        linked_badcases=["badcase-shadow-boundary-001"],
        known_limitations=["阴影边界和泥土边界仍易混淆"],
    ),
]


EVALUATION_REPORTS = [
    EvaluationReport(
        id="eval-perception-v2",
        target_type="perception-model",
        target_version_id="model-det-yolo-v2",
        dataset_version_id="dataset-v2",
        task="obstacle-detection",
        split="mixed",
        metrics={
            "precision": 0.84,
            "recall": 0.78,
            "f1": 0.81,
            "mAP": 0.82,
            "false_positive_count": 21,
            "false_negative_count": 34,
        },
        scenario_breakdown=[
            ScenarioMetricBreakdown(
                scenario_id="scenario-dry-flat-clear",
                split="validation",
                sample_count=220,
                metrics={"mAP": 0.9, "recall": 0.86, "precision": 0.89},
                weak_signals=[],
            ),
            ScenarioMetricBreakdown(
                scenario_id="scenario-wet-slope-shadow",
                split="validation",
                sample_count=96,
                metrics={"mAP": 0.77, "recall": 0.72, "precision": 0.79},
                weak_signals=["shadow false positive"],
            ),
            ScenarioMetricBreakdown(
                scenario_id="scenario-dense-dynamic-pet",
                split="unseen",
                sample_count=64,
                metrics={"mAP": 0.68, "recall": 0.61, "precision": 0.73},
                weak_signals=["small-object recall weak", "pet occlusion unstable"],
            ),
        ],
        linked_badcases=["badcase-small-stone-001", "badcase-pet-occlusion-002"],
        recommendations=[
            "补充小石块和宠物遮挡样本",
            "对 dense dynamic unseen split 设置 promotion guardrail",
        ],
    ),
    EvaluationReport(
        id="eval-boundary-v1",
        target_type="perception-model",
        target_version_id="model-seg-boundary-v1",
        dataset_version_id="dataset-v2",
        task="boundary-segmentation",
        split="mixed",
        metrics={
            "mean_iou": 0.76,
            "boundary_iou": 0.71,
            "forbidden_zone_iou": 0.79,
            "boundary_deviation_px": 5.8,
            "forbidden_zone_error_rate": 0.06,
        },
        scenario_breakdown=[
            ScenarioMetricBreakdown(
                scenario_id="scenario-dry-flat-clear",
                split="validation",
                sample_count=180,
                metrics={"mean_iou": 0.83, "boundary_iou": 0.8},
                weak_signals=[],
            ),
            ScenarioMetricBreakdown(
                scenario_id="scenario-wet-slope-shadow",
                split="unseen",
                sample_count=72,
                metrics={"mean_iou": 0.69, "boundary_iou": 0.62},
                weak_signals=["shadow boundary drift", "forbidden-zone edge coarse"],
            ),
        ],
        linked_badcases=["badcase-shadow-boundary-001"],
        recommendations=["复核阴影边界标注并增加 boundary crop augmentation"],
    ),
]


BADCASES = [
    BadcaseRecord(
        id="badcase-small-stone-001",
        source_type="perception",
        source_version_id="model-det-yolo-v2",
        category="perception-false-negative",
        severity="high",
        scenario_tags=["small-object", "stone", "unseen"],
        root_cause="class imbalance",
        evidence_reference="artifacts/evaluations/eval-perception-v2/small-stone-fn-001.png",
        recommended_action="rebalance dataset with targeted small-stone samples and add crop augmentation",
        owner="algorithm-engineer",
        status="open",
        linked_evaluation_report_id="eval-perception-v2",
    ),
    BadcaseRecord(
        id="badcase-pet-occlusion-002",
        source_type="perception",
        source_version_id="model-det-yolo-v2",
        category="perception-false-negative",
        severity="high",
        scenario_tags=["pet", "occlusion", "dynamic-obstacle"],
        root_cause="missing scenario",
        evidence_reference="artifacts/evaluations/eval-perception-v2/pet-occlusion-002.png",
        recommended_action="collect or generate pet crossing samples with partial occlusion",
        owner="data-engineer",
        status="open",
        linked_evaluation_report_id="eval-perception-v2",
    ),
    BadcaseRecord(
        id="badcase-shadow-boundary-001",
        source_type="perception",
        source_version_id="model-seg-boundary-v1",
        category="boundary-segmentation-error",
        severity="medium",
        scenario_tags=["shadow", "boundary", "forbidden-zone"],
        root_cause="unclear annotation",
        evidence_reference="artifacts/evaluations/eval-boundary-v1/shadow-boundary-001.png",
        recommended_action="relabel samples and update QC boundary rule for shadow-soft edges",
        owner="qa-reviewer",
        status="in-progress",
        linked_evaluation_report_id="eval-boundary-v1",
    ),
    BadcaseRecord(
        id="badcase-ppo-stuck-014",
        source_type="rl",
        source_version_id="ppo-v2",
        category="rl-stuck",
        severity="high",
        scenario_tags=["narrow-passage", "unseen", "dense-obstacle"],
        root_cause="reward misspecification",
        evidence_reference="artifacts/policies/ppo-v2/replays/episode-v2-dynamic-014.timeline.json",
        recommended_action="adjust reward config for local loop penalties and retrain PPO with narrow-passage curriculum",
        owner="rl-engineer",
        status="open",
        linked_evaluation_report_id="eval-unseen-014",
    ),
    BadcaseRecord(
        id="badcase-sim-gap-001",
        source_type="rl",
        source_version_id="ppo-v2",
        category="simulator-limitation",
        severity="medium",
        scenario_tags=["sim-to-real", "dynamic-obstacle", "sensor-gap"],
        root_cause="simulator limitation",
        evidence_reference="artifacts/policies/ppo-v2/replays/sim-gap-001.timeline.json",
        recommended_action="create V3 simulator backlog for ROS 2 / Gazebo or Isaac Sim validation with real sensor logs",
        owner="platform-engineer",
        status="open",
        linked_evaluation_report_id="eval-unseen-014",
    ),
]


RL_ENVIRONMENTS = [
    RLEnvironmentVersion(
        id="rl-env-v2-grid",
        map_generator="grid-irregular-lawn-v2",
        observation_space=[
            "local_occupancy",
            "local_coverage",
            "robot_heading",
            "distance_to_boundary",
            "remaining_coverage",
            "simulated_lidar",
            "ultrasonic",
            "dynamic_actor_velocity",
            "slope_resistance",
        ],
        action_space={"type": ["discrete"], "actions": ["forward", "turn_left", "turn_right", "slow_stop"]},
        reward_config={
            "new_coverage": 1.0,
            "repeat_coverage": -0.2,
            "collision": -6.0,
            "boundary_violation": -6.0,
            "forbidden_zone": -7.0,
            "completion": 8.0,
        },
        termination_rules=["collision", "boundary_violation", "forbidden_zone", "target_coverage", "max_steps"],
        sensor_modalities=["camera", "LiDAR", "ultrasonic", "IMU/GNSS-like pose"],
        scenario_features=[
            "irregular boundary",
            "forbidden zones",
            "dynamic people/pet actors",
            "slope resistance",
        ],
        simulator_adapter="SimulatorAdapter:v2-grid",
        max_steps=160,
    )
]


RL_POLICIES = [
    RLPolicyVersion(
        id="ppo-v2",
        environment_version_id="rl-env-v2-grid",
        algorithm="PPO",
        training_config={
            "learning_rate": 0.0003,
            "batch_size": 256,
            "n_steps": 2048,
            "gamma": 0.99,
            "gae_lambda": 0.95,
            "total_timesteps": 600000,
        },
        curriculum_stage="curriculum-stage-3",
        domain_randomization=["lighting", "grass_height", "obstacle_density", "dynamic_actor_speed", "slope"],
        metrics={
            "coverage_rate": 0.82,
            "repeat_coverage_rate": 0.11,
            "collision_rate": 0.07,
            "unseen_success_rate": 0.68,
            "dynamic_obstacle_response_ms": 900,
        },
        artifact_path="artifacts/policies/ppo-v2/policy.zip",
        linked_evaluation_reports=["eval-unseen-014"],
        linked_badcases=["badcase-ppo-stuck-014"],
    )
]


RL_BASELINES = [
    PlannerBaseline(
        id="random-policy",
        name="Random action baseline",
        baseline_type="random",
        environment_version_id="rl-env-v2-grid",
        metrics={
            "coverage_rate": 0.31,
            "collision_rate": 0.42,
            "repeat_coverage_rate": 0.27,
            "success_rate": 0.08,
        },
        description="Uniform random discrete actions for sanity checking reward and termination behavior.",
    ),
    PlannerBaseline(
        id="rule-coverage-planner",
        name="Rule-based boustrophedon planner",
        baseline_type="rule-based",
        environment_version_id="rl-env-v2-grid",
        metrics={
            "coverage_rate": 0.74,
            "collision_rate": 0.12,
            "repeat_coverage_rate": 0.18,
            "success_rate": 0.53,
        },
        description="Traditional row-sweep coverage planner with obstacle detours for PPO comparison.",
    ),
]


RL_EPISODES = [
    RLEpisodeReplay(
        id="episode-v2-dynamic-014",
        policy_version_id="ppo-v2",
        environment_version_id="rl-env-v2-grid",
        scenario_id="scenario-dense-dynamic-pet",
        three_d_ready=True,
        map={"width": 8, "height": 6, "obstacle_count": 5, "forbidden_zone_count": 1},
        path=[[1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [4, 3]],
        dynamic_actors=[
            DynamicActor(
                actor_id="actor-pet-01",
                actor_type="pet",
                trajectory=[[5, 2], [4, 2], [3, 2], [2, 2]],
            ),
            DynamicActor(
                actor_id="actor-person-01",
                actor_type="person",
                trajectory=[[6, 4], [5, 4], [4, 4]],
            ),
        ],
        frames=[
            ReplayFrame(
                step=0,
                robot_position=[1, 1],
                action="forward",
                reward=1.0,
                covered_cells=2,
                lidar=[3.0, 4.0, 4.0, 2.0, 1.0, 1.0, 1.0, 4.0],
                ultrasonic=[1.0, 3.0, 4.0, 1.0],
                event="new-coverage",
            ),
            ReplayFrame(
                step=1,
                robot_position=[2, 1],
                action="forward",
                reward=1.0,
                covered_cells=3,
                lidar=[2.0, 3.0, 3.0, 2.0, 2.0, 1.0, 1.0, 5.0],
                ultrasonic=[1.0, 2.0, 3.0, 2.0],
                event="dynamic-actor-near",
            ),
            ReplayFrame(
                step=2,
                robot_position=[3, 1],
                action="turn_right",
                reward=-0.01,
                covered_cells=3,
                lidar=[1.0, 2.0, 3.0, 3.0, 3.0, 1.0, 1.0, 4.0],
                ultrasonic=[1.0, 1.0, 3.0, 3.0],
                event="near-miss",
            ),
        ],
        event_markers=["dynamic-actor-near", "near-miss", "repeat-coverage-risk"],
        timeline_reference="artifacts/policies/ppo-v2/replays/episode-v2-dynamic-014.timeline.json",
    )
]


RL_EVALUATIONS = [
    RLEvaluationReport(
        id="eval-unseen-014",
        policy_version_id="ppo-v2",
        environment_version_id="rl-env-v2-grid",
        scenario_set="train-validation-unseen-v2",
        metrics={
            "coverage_rate": 0.82,
            "repeat_coverage_rate": 0.11,
            "collision_count": 7,
            "boundary_violation_count": 4,
            "completion_time_s": 148.0,
            "path_length_m": 96.4,
            "stuck_rate": 0.09,
            "success_rate": 0.68,
            "dynamic_obstacle_response_ms": 900,
            "sensor_near_miss_count": 5,
        },
        split_metrics=[
            RLSplitMetric(
                split="train",
                scenario_count=64,
                metrics={"success_rate": 0.84, "coverage_rate": 0.88, "collision_rate": 0.03},
                weak_scenario_tags=[],
            ),
            RLSplitMetric(
                split="validation",
                scenario_count=32,
                metrics={"success_rate": 0.74, "coverage_rate": 0.83, "collision_rate": 0.06},
                weak_scenario_tags=["dense-obstacle"],
            ),
            RLSplitMetric(
                split="unseen",
                scenario_count=28,
                metrics={"success_rate": 0.68, "coverage_rate": 0.78, "collision_rate": 0.1},
                weak_scenario_tags=["narrow-passage", "dynamic-pet", "irregular-boundary"],
            ),
        ],
        linked_badcases=["badcase-ppo-stuck-014", "badcase-sim-gap-001"],
        recommendations=[
            "增加 narrow-passage curriculum",
            "对 dynamic-pet unseen split 加入 regression guardrail",
            "将真实传感器仿真差距升级到 V3 simulator backlog",
        ],
    )
]


POLICY_COMPARISONS = [
    PolicyComparison(
        id="policy-comparison-v2",
        environment_version_id="rl-env-v2-grid",
        entries=[
            PolicyComparisonEntry(
                policy_or_baseline_id="random-policy",
                kind="random",
                metrics={"coverage_rate": 0.31, "success_rate": 0.08, "collision_rate": 0.42},
            ),
            PolicyComparisonEntry(
                policy_or_baseline_id="rule-coverage-planner",
                kind="rule-based",
                metrics={"coverage_rate": 0.74, "success_rate": 0.53, "collision_rate": 0.12},
            ),
            PolicyComparisonEntry(
                policy_or_baseline_id="ppo-v2",
                kind="PPO",
                metrics={"coverage_rate": 0.82, "success_rate": 0.68, "collision_rate": 0.07},
            ),
        ],
        recommended_policy_id="ppo-v2",
        guardrail_notes=[
            "ppo-v2 coverage 优于 rule baseline",
            "unseen narrow-passage success rate 仍需 guardrail",
        ],
    )
]


DATASET_DRIFT_REPORT = DatasetDriftReport(
    id="dataset-drift-v1-v2",
    source_dataset_id="dataset-v1",
    target_dataset_id="dataset-v2",
    drift_score=0.27,
    scenario_deltas={
        "scenario-dry-flat-clear": 0,
        "scenario-wet-slope-shadow": 26,
        "scenario-dense-dynamic-pet": 14,
    },
    weak_scenarios=["rain", "glare", "narrow-boundary", "dense-dynamic-obstacle"],
    recommended_actions=[
        "补充密集动态障碍、雨天和强眩光样本，避免 dataset-v2 对晴天平地场景过拟合",
        "对 scenario-dense-dynamic-pet 建立 weekly drift review",
    ],
)


MODEL_REGRESSION_GUARDRAILS = [
    ModelRegressionGuardrail(
        id="guardrail-det-yolo-v2",
        candidate_model_id="model-det-yolo-v2",
        baseline_model_id="model-det-yolo-v1",
        metric_deltas={
            "mAP": 0.06,
            "recall": 0.04,
            "unseen_small_object_recall": -0.03,
            "latency_ms": 4.0,
        },
        promotion_decision="needs-review",
        blocked_reasons=["unseen small-object recall regressed below safety review threshold"],
        safety_notes=[
            "允许进入 candidate，不允许直接 promoted",
            "需要补充 small-object hard negative 和 Badcase 回归",
        ],
    ),
    ModelRegressionGuardrail(
        id="guardrail-seg-boundary-v1",
        candidate_model_id="model-seg-boundary-v1",
        baseline_model_id="model-seg-boundary-v0",
        metric_deltas={"mean_iou": 0.05, "boundary_iou": 0.03, "forbidden_zone_error_rate": -0.02},
        promotion_decision="allow",
        blocked_reasons=[],
        safety_notes=["仍需关注 shadow boundary drift，但当前未触发 blocking guardrail"],
    ),
]


AUGMENTATION_PRESETS = [
    AugmentationPreset(
        id="aug-shadow-glare",
        target_issue="shadow/glare confusion",
        transforms=["brightness-shift", "contrast-jitter", "shadow-polygon", "sun-glare-overlay"],
        target_scenarios=["scenario-wet-slope-shadow", "scenario-dense-dynamic-pet"],
        linked_badcases=["badcase-shadow-boundary-001"],
    ),
    AugmentationPreset(
        id="aug-rain-fog-blur",
        target_issue="rain/fog/blur quality gap",
        transforms=["rain-streak", "fog-overlay", "motion-blur", "low-light-noise"],
        target_scenarios=["rain", "spring-evening", "after-rain"],
        linked_badcases=[],
    ),
    AugmentationPreset(
        id="aug-small-object-occlusion",
        target_issue="small object and partial occlusion",
        transforms=["random-crop", "copy-paste-small-stone", "grass-occlusion", "scale-jitter"],
        target_scenarios=["scenario-dense-dynamic-pet"],
        linked_badcases=["badcase-small-stone-001", "badcase-pet-occlusion-002"],
    ),
]


RL_EPISODE_CLUSTERS = [
    RLEpisodeCluster(
        id="cluster-rl-stuck-narrow-001",
        failure_category="rl-stuck",
        cluster_size=9,
        linked_episodes=["episode-v2-dynamic-014", "episode-v2-narrow-006", "episode-v2-narrow-011"],
        representative_badcases=["badcase-ppo-stuck-014"],
        scenario_tags=["narrow-passage", "dense-obstacle", "unseen"],
        average_energy_proxy=1.34,
        next_actions=["increase local-loop penalty", "add narrow-passage curriculum", "compare with rule-coverage-planner"],
    ),
    RLEpisodeCluster(
        id="cluster-near-miss-dynamic-001",
        failure_category="near-miss",
        cluster_size=6,
        linked_episodes=["episode-v2-dynamic-014", "episode-v2-pet-003"],
        representative_badcases=["badcase-sim-gap-001"],
        scenario_tags=["dynamic-pet", "sensor-gap", "sim-to-real"],
        average_energy_proxy=1.18,
        next_actions=["raise dynamic obstacle response guardrail", "escalate simulator limitation to V3"],
    ),
]


V3_BACKLOG = [
    V3BacklogItem(
        id="V3-001",
        priority="P0",
        title="ROS 2 / Gazebo 或 Isaac Sim 接入",
        module="仿真系统",
        expected_value="接近真实机器人开发流程",
        dependency="SimulatorAdapter",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-002",
        priority="P0",
        title="真实 LiDAR / RTK / GNSS / IMU 日志接入",
        module="数据管线",
        expected_value="覆盖真实多传感器数据要求",
        dependency="SensorFrame",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-003",
        priority="P1",
        title="多传感器融合 baseline",
        module="感知融合",
        expected_value="从视觉扩展到多源感知",
        dependency="real sensor logs",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-004",
        priority="P1",
        title="TensorRT / 量化边缘部署",
        module="部署评估",
        expected_value="评估延迟、功耗和内存约束",
        dependency="ONNX export records",
        version_target="V3",
        status="planned",
    ),
]


def build_dashboard_summary() -> DashboardSummary:
    return DashboardSummary(
        product_name="LawnBot AI 训练工作台",
        target_version="V2",
        architecture_mode="V3-ready",
        ui_language="zh-CN",
        dataset=DatasetSummary(
            version_id="dataset-v2",
            coverage_rate=0.72,
            sample_count=3180,
            weak_scenarios=["雨天", "强眩光", "窄边界", "密集动态障碍"],
            qc_status="QC 通过，12 条待复核",
        ),
        perception=PerceptionSummary(
            model_id="det-yolo-v2",
            task="obstacle-detection",
            mAP=0.81,
            recall=0.78,
            onnx_status="ready",
            latency_ms=38,
        ),
        rl=RLSummary(
            policy_id="ppo-v2",
            algorithm="PPO",
            unseen_success_rate=0.68,
            coverage_rate=0.82,
            dynamic_obstacle_response_ms=900,
            curriculum_stage="curriculum-stage-3",
        ),
        badcases=BadcaseSummary(
            open_count=37,
            high_severity_count=11,
            recommendation_count=24,
            top_root_causes=[
                "reward 对局部循环惩罚不足",
                "动态障碍样本不足",
                "阴影边界标注不稳定",
            ],
        ),
        v3_backlog=V3_BACKLOG,
        workflow=["场景", "Dataset/QC", "感知训练", "RL 仿真", "泛化评估", "Badcase 决策"],
        source_versions={
            "dataset": "dataset-v2",
            "model": "det-yolo-v2",
            "policy": "ppo-v2",
            "evaluation": "eval-unseen-014",
        },
    )
