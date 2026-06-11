import type { WorkbenchData } from "../lib/types";

export function createMockWorkbenchData(): WorkbenchData {
  return {
    dashboard: {
      product_name: "LawnBot AI 训练工作台",
      target_version: "V2",
      architecture_mode: "V3-ready",
      ui_language: "zh-CN",
      dataset: {
        version_id: "dataset-v2",
        coverage_rate: 0.72,
        sample_count: 3180,
        weak_scenarios: ["雨天", "强眩光", "窄边界", "密集动态障碍"],
        qc_status: "QC 通过，12 条待复核"
      },
      perception: {
        model_id: "det-yolo-v2",
        task: "obstacle-detection",
        mAP: 0.81,
        recall: 0.78,
        onnx_status: "ready",
        latency_ms: 38
      },
      rl: {
        policy_id: "ppo-v2",
        algorithm: "PPO",
        unseen_success_rate: 0.68,
        coverage_rate: 0.82,
        dynamic_obstacle_response_ms: 900,
        curriculum_stage: "curriculum-stage-3"
      },
      badcases: {
        open_count: 37,
        high_severity_count: 11,
        recommendation_count: 24,
        top_root_causes: ["reward misspecification", "动态障碍样本不足"]
      },
      workflow: ["场景", "Dataset/QC", "感知训练", "RL 仿真", "泛化评估", "Badcase 决策"],
      source_versions: { dataset: "dataset-v2", model: "det-yolo-v2", policy: "ppo-v2", evaluation: "eval-unseen-014" }
    },
    scenarioCoverage: [
      {
        scenario_id: "scenario-dense-dynamic-pet",
        scenario_name: "密集障碍物、动态宠物、不规则边界",
        sample_count: 22,
        required_min_count: 120,
        coverage_level: "gap",
        risk_level: "high",
        recommended_action: "补充动态障碍仿真",
        sensor_modalities: ["camera", "LiDAR", "ultrasonic"],
        dynamic_obstacle_pattern: "person-pet-crossing"
      }
    ],
    datasets: [
      {
        id: "dataset-v2",
        name: "v2 sensor-aware closed-loop dataset",
        sample_count: 3180,
        source: "现场外采 + 机端回传 + 仿真生成",
        scenario_distribution: { "scenario-dense-dynamic-pet": 22 },
        qc_status: "QC 通过，12 条待复核",
        quality_score: 0.86,
        sensor_modalities: ["camera", "LiDAR", "ultrasonic", "IMU"],
        linked_training_runs: ["det-yolo-v2", "seg-boundary-v1"],
        linked_evaluation_reports: ["eval-unseen-014", "eval-perception-v2"],
        linked_badcases: ["badcase-shadow-boundary-001"],
        known_limitations: ["雨天样本仍偏少"]
      }
    ],
    annotationTasks: [
      {
        id: "ann-boundary-009",
        dataset_version_id: "dataset-v2",
        task_type: "segmentation",
        tool: "CVAT",
        qc_status: "review",
        assignee: "segmentation-labeler",
        reviewer: "qa-reviewer",
        reviewer_notes: "阴影边界 mask 粗糙",
        sample_count: 360,
        issue_count: 11,
        qc_issue_categories: ["poor-boundary", "occlusion"],
        linked_badcases: ["badcase-shadow-boundary-001"]
      }
    ],
    labelSchema: {
      id: "label-schema-v2",
      allowed_tools: ["LabelImg", "LabelMe", "CVAT"],
      detection_classes: [
        { name: "person", display_name: "人" },
        { name: "pet", display_name: "宠物" },
        { name: "stone", display_name: "石头" }
      ],
      segmentation_classes: [
        { name: "lawn", display_name: "草坪" },
        { name: "boundary", display_name: "边界" },
        { name: "forbidden-zone", display_name: "禁割区" }
      ],
      qc_issue_categories: ["missing-label", "wrong-class", "poor-boundary", "occlusion", "small-object"]
    },
    trainingRuns: [
      {
        id: "det-yolo-v2",
        dataset_version_id: "dataset-v2",
        task: "obstacle-detection",
        model_family: "YOLOv8n-transfer",
        hyperparameters: { learning_rate: 0.001, batch_size: 16, epochs: 80 },
        final_metrics: { mAP: 0.82, recall: 0.78, precision: 0.84 },
        status: "completed",
        artifact_path: "artifacts/models/det-yolo-v2/model.pt",
        onnx_export_status: "ready",
        latency_ms: 38,
        linked_model_version_id: "model-det-yolo-v2",
        linked_evaluation_reports: ["eval-perception-v2"],
        linked_badcases: ["badcase-small-stone-001"]
      }
    ],
    models: [
      {
        id: "model-det-yolo-v2",
        training_run_id: "det-yolo-v2",
        task: "obstacle-detection",
        model_family: "YOLOv8n-transfer",
        metrics: { mAP: 0.82, recall: 0.78, latency_ms: 38 },
        promotion_status: "candidate",
        linked_evaluation_reports: ["eval-perception-v2"],
        linked_badcases: ["badcase-small-stone-001"]
      }
    ],
    evaluations: [
      {
        id: "eval-perception-v2",
        target_type: "perception-model",
        target_version_id: "model-det-yolo-v2",
        task: "obstacle-detection",
        metrics: { mAP: 0.82, recall: 0.78 },
        scenario_breakdown: [
          {
            scenario_id: "scenario-dense-dynamic-pet",
            split: "unseen",
            sample_count: 64,
            metrics: { mAP: 0.68, recall: 0.61 },
            weak_signals: ["small-object recall weak"]
          }
        ],
        linked_badcases: ["badcase-small-stone-001"],
        recommendations: ["补充小石块和宠物遮挡样本"]
      }
    ],
    rlEnvironments: [
      {
        id: "rl-env-v2-grid",
        map_generator: "grid-irregular-lawn-v2",
        observation_space: ["simulated_lidar", "ultrasonic"],
        action_space: { actions: ["forward", "turn_left", "turn_right", "slow_stop"] },
        reward_config: { new_coverage: 1, collision: -6 },
        termination_rules: ["collision", "target_coverage"],
        sensor_modalities: ["LiDAR", "ultrasonic"],
        scenario_features: ["dynamic people/pet actors"],
        simulator_adapter: "SimulatorAdapter:v2-grid"
      }
    ],
    rlPolicies: [
      {
        id: "ppo-v2",
        environment_version_id: "rl-env-v2-grid",
        algorithm: "PPO",
        training_config: { learning_rate: 0.0003, n_steps: 2048 },
        curriculum_stage: "curriculum-stage-3",
        domain_randomization: ["lighting", "grass_height"],
        metrics: { coverage_rate: 0.82, unseen_success_rate: 0.68 },
        artifact_path: "artifacts/policies/ppo-v2/policy.zip",
        linked_badcases: ["badcase-ppo-stuck-014"]
      }
    ],
    rlBaselines: [
      {
        id: "rule-coverage-planner",
        name: "Rule-based boustrophedon planner",
        baseline_type: "rule-based",
        metrics: { coverage_rate: 0.74, success_rate: 0.53 },
        description: "Traditional row-sweep coverage planner"
      }
    ],
    rlEpisode: {
      id: "episode-v2-dynamic-014",
      policy_version_id: "ppo-v2",
      environment_version_id: "rl-env-v2-grid",
      scenario_id: "scenario-dense-dynamic-pet",
      three_d_ready: true,
      map: { width: 8, height: 6, obstacle_count: 5, forbidden_zone_count: 1 },
      path: [
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [3, 3],
        [4, 3]
      ],
      dynamic_actors: [
        { actor_id: "actor-pet-01", actor_type: "pet", trajectory: [[5, 2], [4, 2], [3, 2]] },
        { actor_id: "actor-person-01", actor_type: "person", trajectory: [[6, 4], [5, 4]] }
      ],
      frames: [
        { step: 0, robot_position: [1, 1], action: "forward", reward: 1, covered_cells: 2, lidar: [3, 4, 4, 2, 1, 1, 1, 4], ultrasonic: [1, 3, 4, 1], event: "new-coverage" },
        { step: 1, robot_position: [2, 1], action: "forward", reward: 1, covered_cells: 3, lidar: [2, 3, 3, 2, 2, 1, 1, 5], ultrasonic: [1, 2, 3, 2], event: "near-miss" }
      ],
      event_markers: ["dynamic-actor-near", "near-miss"],
      timeline_reference: "artifacts/policies/ppo-v2/replays/episode-v2-dynamic-014.timeline.json"
    },
    rlEvaluations: [
      {
        id: "eval-unseen-014",
        policy_version_id: "ppo-v2",
        metrics: { coverage_rate: 0.82, success_rate: 0.68, dynamic_obstacle_response_ms: 900 },
        split_metrics: [
          { split: "train", scenario_count: 64, metrics: { success_rate: 0.84 }, weak_scenario_tags: [] },
          { split: "unseen", scenario_count: 28, metrics: { success_rate: 0.68 }, weak_scenario_tags: ["narrow-passage"] }
        ],
        linked_badcases: ["badcase-ppo-stuck-014"],
        recommendations: ["增加 narrow-passage curriculum"]
      }
    ],
    policyComparisons: [
      {
        id: "policy-comparison-v2",
        entries: [
          { policy_or_baseline_id: "random-policy", kind: "random", metrics: { coverage_rate: 0.31 } },
          { policy_or_baseline_id: "rule-coverage-planner", kind: "rule-based", metrics: { coverage_rate: 0.74 } },
          { policy_or_baseline_id: "ppo-v2", kind: "PPO", metrics: { coverage_rate: 0.82 } }
        ],
        recommended_policy_id: "ppo-v2",
        guardrail_notes: ["unseen narrow-passage success rate 仍需 guardrail"]
      }
    ],
    badcases: [
      {
        id: "badcase-ppo-stuck-014",
        source_type: "rl",
        source_version_id: "ppo-v2",
        category: "rl-stuck",
        severity: "high",
        scenario_tags: ["narrow-passage", "unseen"],
        root_cause: "reward misspecification",
        recommended_action: "adjust reward config",
        owner: "rl-engineer",
        status: "open"
      }
    ],
    report: {
      id: "project-summary-v2",
      title: "LawnBot AI V2 Project Summary",
      source_versions: { dataset: "dataset-v2", policy: "ppo-v2" },
      sections: {
        "JD Mapping": "Covers JD capabilities",
        "RL Generalization": "ppo-v2 is evaluated",
        "V3 Plan": "Promote industrial track"
      },
      verification_commands: ["python3 -m unittest"]
    },
    v3Backlog: [
      {
        id: "V3-001",
        priority: "P0",
        title: "ROS 2 / Gazebo 或 Isaac Sim 接入",
        module: "仿真系统",
        expected_value: "接近真实机器人开发流程",
        dependency: "SimulatorAdapter",
        version_target: "V3",
        status: "planned"
      }
    ],
    v3PromotionPlan: {
      id: "v3-promotion-plan",
      v2_scope_lock: "closed",
      candidate_promotions: ["ROS 2 / Gazebo or Isaac Sim", "real sensor logs"],
      source_limitations: ["V2 simulator is deterministic"],
      scope_guardrails: ["V2 remains metadata/simulation only"]
    }
  };
}
