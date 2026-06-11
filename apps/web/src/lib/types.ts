export interface DashboardSummary {
  product_name: string;
  target_version: "V2";
  architecture_mode: string;
  ui_language: "zh-CN";
  dataset: {
    version_id: string;
    coverage_rate: number;
    sample_count: number;
    weak_scenarios: string[];
    qc_status: string;
  };
  perception: {
    model_id: string;
    task: string;
    mAP: number;
    recall: number;
    onnx_status: string;
    latency_ms: number;
  };
  rl: {
    policy_id: string;
    algorithm: string;
    unseen_success_rate: number;
    coverage_rate: number;
    dynamic_obstacle_response_ms: number;
    curriculum_stage: string;
  };
  badcases: {
    open_count: number;
    high_severity_count: number;
    recommendation_count: number;
    top_root_causes: string[];
  };
  workflow: string[];
  source_versions: Record<string, string>;
}

export interface ScenarioCoverage {
  scenario_id: string;
  scenario_name: string;
  sample_count: number;
  required_min_count: number;
  coverage_level: "strong" | "weak" | "gap";
  risk_level: "low" | "medium" | "high";
  recommended_action: string;
  sensor_modalities: string[];
  dynamic_obstacle_pattern: string;
}

export interface DatasetVersion {
  id: string;
  name: string;
  sample_count: number;
  source: string;
  scenario_distribution: Record<string, number>;
  qc_status: string;
  quality_score: number;
  sensor_modalities: string[];
  linked_training_runs: string[];
  linked_evaluation_reports: string[];
  linked_badcases: string[];
  known_limitations: string[];
}

export interface AnnotationTask {
  id: string;
  dataset_version_id: string;
  task_type: string;
  tool: string;
  qc_status: string;
  assignee: string;
  reviewer?: string;
  reviewer_notes: string;
  sample_count: number;
  issue_count: number;
  qc_issue_categories: string[];
  linked_badcases: string[];
}

export interface LabelSchemaVersion {
  id: string;
  allowed_tools: string[];
  detection_classes: Array<{ name: string; display_name: string }>;
  segmentation_classes: Array<{ name: string; display_name: string }>;
  qc_issue_categories: string[];
}

export interface TrainingRun {
  id: string;
  dataset_version_id: string;
  task: string;
  model_family: string;
  hyperparameters: Record<string, number>;
  final_metrics: Record<string, number>;
  status: string;
  artifact_path: string;
  onnx_export_status: string;
  latency_ms: number;
  linked_model_version_id: string;
  linked_evaluation_reports: string[];
  linked_badcases: string[];
}

export interface ModelVersion {
  id: string;
  training_run_id: string;
  task: string;
  model_family: string;
  metrics: Record<string, number>;
  promotion_status: string;
  linked_evaluation_reports: string[];
  linked_badcases: string[];
}

export interface EvaluationReport {
  id: string;
  target_type: string;
  target_version_id: string;
  task: string;
  metrics: Record<string, number>;
  scenario_breakdown: Array<{
    scenario_id: string;
    split: string;
    sample_count: number;
    metrics: Record<string, number>;
    weak_signals: string[];
  }>;
  linked_badcases: string[];
  recommendations: string[];
}

export interface RLEnvironmentVersion {
  id: string;
  map_generator: string;
  observation_space: string[];
  action_space: { actions: string[] };
  reward_config: Record<string, number>;
  termination_rules: string[];
  sensor_modalities: string[];
  scenario_features: string[];
  simulator_adapter: string;
}

export interface RLPolicyVersion {
  id: string;
  environment_version_id: string;
  algorithm: string;
  training_config: Record<string, number>;
  curriculum_stage: string;
  domain_randomization: string[];
  metrics: Record<string, number>;
  artifact_path: string;
  linked_badcases: string[];
}

export interface PlannerBaseline {
  id: string;
  name: string;
  baseline_type: string;
  metrics: Record<string, number>;
  description: string;
}

export interface RLEpisodeReplay {
  id: string;
  policy_version_id: string;
  environment_version_id: string;
  scenario_id: string;
  three_d_ready: boolean;
  map: { width: number; height: number; obstacle_count: number; forbidden_zone_count: number };
  path: number[][];
  dynamic_actors: Array<{ actor_id: string; actor_type: string; trajectory: number[][] }>;
  frames: Array<{
    step: number;
    robot_position: number[];
    action: string;
    reward: number;
    covered_cells: number;
    lidar: number[];
    ultrasonic: number[];
    event: string;
  }>;
  event_markers: string[];
  timeline_reference: string;
}

export interface RLEvaluationReport {
  id: string;
  policy_version_id: string;
  metrics: Record<string, number>;
  split_metrics: Array<{
    split: string;
    scenario_count: number;
    metrics: Record<string, number>;
    weak_scenario_tags: string[];
  }>;
  linked_badcases: string[];
  recommendations: string[];
}

export interface PolicyComparison {
  id: string;
  entries: Array<{ policy_or_baseline_id: string; kind: string; metrics: Record<string, number> }>;
  recommended_policy_id: string;
  guardrail_notes: string[];
}

export interface BadcaseRecord {
  id: string;
  source_type: string;
  source_version_id: string;
  category: string;
  severity: string;
  scenario_tags: string[];
  root_cause: string;
  recommended_action: string;
  owner: string;
  status: string;
}

export interface ProjectSummaryReport {
  id: string;
  title: string;
  source_versions: Record<string, string>;
  sections: Record<string, string>;
  verification_commands: string[];
}

export interface V3BacklogItem {
  id: string;
  priority: string;
  title: string;
  module: string;
  expected_value: string;
  dependency: string;
  version_target: "V3";
  status: string;
}

export interface V3PromotionPlan {
  id: string;
  v2_scope_lock: "closed";
  candidate_promotions: string[];
  source_limitations: string[];
  scope_guardrails: string[];
}

export interface WorkbenchData {
  dashboard: DashboardSummary;
  scenarioCoverage: ScenarioCoverage[];
  datasets: DatasetVersion[];
  annotationTasks: AnnotationTask[];
  labelSchema: LabelSchemaVersion;
  trainingRuns: TrainingRun[];
  models: ModelVersion[];
  evaluations: EvaluationReport[];
  rlEnvironments: RLEnvironmentVersion[];
  rlPolicies: RLPolicyVersion[];
  rlBaselines: PlannerBaseline[];
  rlEpisode: RLEpisodeReplay;
  rlEvaluations: RLEvaluationReport[];
  policyComparisons: PolicyComparison[];
  badcases: BadcaseRecord[];
  report: ProjectSummaryReport;
  v3Backlog: V3BacklogItem[];
  v3PromotionPlan: V3PromotionPlan;
}

export interface ReportExportResult {
  id: string;
  format: "markdown";
  artifact_path: string;
  content: string;
}
