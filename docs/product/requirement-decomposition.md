# Requirement Decomposition

## Purpose

This document decomposes the PM requirements into implementation-ready product, data, model, RL, evaluation, and documentation work.

It is the bridge between the PM requirements document and engineering implementation. Future AI development agents should use this file before creating routes, APIs, data models, training scripts, or UI pages.

Current target: V3-ready V2. V1 is treated as the completed foundation scope; V2 is the implementation target; V3 remains the industrial upgrade backlog.

## Decomposition Rules

Each requirement includes:

- source capability
- target page or module
- user story
- data entities
- API needs
- acceptance criteria
- test plan
- scope classification

UI acceptance criteria must assume Simplified Chinese as the main display language. Standard technical labels may stay in English when that improves recognition or avoids awkward translation.

## V2 Target Requirements

### RQ-001 Overview Dashboard

Source capability: documentation, cross-team visibility, model evaluation.

Target page or module: Overview Dashboard.

User story: As a PM or reviewer, I can see whether the project has enough data coverage, perception progress, RL progress, and unresolved Badcases.

Data entities:

- DatasetVersion
- TrainingRun
- ModelVersion
- RLPolicyVersion
- EvaluationReport
- Badcase

API needs:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends`

Acceptance criteria:

- Shows dataset coverage summary.
- Shows latest perception model metrics.
- Shows latest RL policy metrics.
- Shows Badcase severity counts.
- Links to weak scenarios, model evaluation, RL evaluation, and Badcase library.

Test plan:

- API test verifies summary response contains dataset, perception, RL, and Badcase sections.
- UI workflow check verifies dashboard links navigate to the correct screens.

Scope: V2.

### RQ-002 Scenario Matrix

Source capability: industry scenario data collection planning.

Target page or module: Scenario Matrix.

User story: As a data owner, I can define and inspect mowing scenarios across grass, terrain, obstacle, boundary, weather, lighting, and season dimensions.

Data entities:

- Scenario
- ScenarioCoverage
- DatasetVersion

API needs:

- `GET /api/scenarios`
- `POST /api/scenarios`
- `PATCH /api/scenarios/{scenario_id}`
- `GET /api/scenarios/coverage`

Acceptance criteria:

- Supports grass type, grass height, wet/dry state, flat/slope terrain, boundary type, obstacle type, lighting, weather, and season/time fields.
- Shows weak or missing scenario coverage.
- Exposes V2 simulated sensor fields for LiDAR, ultrasonic, IMU/GNSS-like pose, vibration, and current logs.
- Reserves V3 real-log fields for rosbag, MCAP, and fleet upload references.

Test plan:

- API tests create and update scenario records.
- Data validation test rejects invalid scenario labels.
- UI check confirms weak scenarios are visible.

Scope: V2 with V3 reserved fields.

### RQ-003 Dataset Version Management

Source capability: data governance, data layering, version management, database maintenance.

Target page or module: Dataset Versions.

User story: As a data engineer, I can track dataset versions, scenario distribution, quality status, and linked model/RL runs.

Data entities:

- DatasetVersion
- ScenarioCoverage
- AnnotationTask
- TrainingRun
- EvaluationReport

API needs:

- `GET /api/datasets`
- `POST /api/datasets`
- `GET /api/datasets/{dataset_id}`
- `GET /api/datasets/{dataset_id}/coverage`

Acceptance criteria:

- Each dataset version records sample count, source, scenario distribution, annotation schema, QC summary, and known limitations.
- Dataset versions are immutable by default after they are used for training.
- Dataset detail links to annotation tasks, training runs, evaluations, and Badcases.

Test plan:

- API test verifies dataset version metadata can be created and read.
- Data validation test confirms missing source or empty sample count is rejected.
- UI check confirms linked artifacts are displayed.

Scope: V2.

### RQ-004 Annotation And QC Workflow

Source capability: label taxonomy, high-quality annotation, quality control review.

Target page or module: Annotation And QC.

User story: As an annotation reviewer, I can inspect label schemas, task status, issue categories, and QC results.

Data entities:

- AnnotationTask
- LabelSchema
- QCReport
- DatasetVersion
- Badcase

API needs:

- `GET /api/annotation-tasks`
- `POST /api/annotation-tasks`
- `GET /api/annotation-tasks/{task_id}`
- `PATCH /api/annotation-tasks/{task_id}/qc`

Acceptance criteria:

- Detection classes include person, pet, stone, tree, fence, and obstacle-other.
- Segmentation classes include lawn, soil, boundary, forbidden-zone, and obstacle-region.
- QC issue categories include missing label, wrong class, poor boundary, unclear occlusion, small object issue, and blur/image quality issue.
- Annotation issues can be linked to Badcases.

Test plan:

- API test verifies QC status update.
- Data validation test rejects labels outside the schema.
- UI check confirms issue categories are visible.

Scope: V2.

### RQ-005 Perception Training Records

Source capability: AI model training, transfer learning, fine-tuning, hyperparameter tuning.

Target page or module: Perception Training.

User story: As an algorithm engineer, I can record detection and segmentation training runs and compare model versions.

Data entities:

- TrainingRun
- ModelVersion
- DatasetVersion
- EvaluationReport

API needs:

- `GET /api/training-runs`
- `POST /api/training-runs`
- `GET /api/training-runs/{run_id}`
- `GET /api/models`

Acceptance criteria:

- Records model task, dataset version, config, hyperparameters, metrics, artifact path, and status.
- Supports obstacle detection and lawn/boundary/forbidden-zone segmentation runs.
- Links training runs to evaluation reports and Badcases.

Test plan:

- API test creates training run with valid dataset reference.
- Validation test rejects training run without dataset version.
- UI check confirms metrics and linked artifacts are visible.

Scope: V2.

### RQ-006 Perception Evaluation

Source capability: model evaluation, test set design, boundary/extreme case testing.

Target page or module: Perception Evaluation.

User story: As a reviewer, I can compare model versions by metrics and scenario-specific weaknesses.

Data entities:

- ModelVersion
- EvaluationReport
- Badcase
- Scenario

API needs:

- `GET /api/evaluations`
- `POST /api/evaluations`
- `GET /api/evaluations/{report_id}`

Acceptance criteria:

- Detection metrics include precision, recall, F1, mAP, false positives, and false negatives.
- Segmentation metrics include IoU, mean IoU, boundary deviation, and forbidden-zone error.
- Metrics are broken down by scenario tags.

Test plan:

- Metric tests validate IoU and precision/recall on controlled examples.
- API test verifies evaluation report persistence.
- UI check confirms scenario breakdown is displayed.

Scope: V2.

### RQ-007 RL Environment And Agent Training

Source capability: reinforcement learning path planning and avoidance decision model.

Target page or module: RL Training and Simulation Replay.

User story: As an algorithm engineer, I can define a 2D mowing environment, train a PPO agent, replay episodes, and compare against baselines.

Data entities:

- RLEnvironmentVersion
- RLPolicyVersion
- EvaluationReport
- Badcase

API needs:

- `GET /api/rl/environments`
- `POST /api/rl/environments`
- `GET /api/rl/policies`
- `POST /api/rl/policies`
- `GET /api/rl/episodes/{episode_id}`

Acceptance criteria:

- Environment defines map generator, observation space, action space, reward config, and termination rules.
- PPO policy records training config, curves, metrics, and artifact path.
- Replay shows lawn map, boundary, obstacles, dynamic people/pets, path, covered area, repeat coverage, simulated LiDAR/ultrasonic readings, and failures.
- Replay data can drive a 3D episode viewer even if the first implementation uses a simplified renderer.

Test plan:

- RL unit tests cover reset, step, reward, collision, boundary violation, and termination.
- API test records environment and policy metadata.
- UI check confirms replay data can be inspected.

Scope: V2.

### RQ-008 Generalization Evaluation

Source capability: extreme condition testing, coverage completeness, avoidance response, iteration optimization.

Target page or module: Generalization Evaluation.

User story: As a reviewer, I can compare policies across training, validation, and unseen scenario splits.

Data entities:

- RLPolicyVersion
- EvaluationReport
- Scenario
- Badcase

API needs:

- `GET /api/rl/evaluations`
- `POST /api/rl/evaluations`
- `GET /api/rl/evaluations/{report_id}`

Acceptance criteria:

- Reports coverage rate, repeat coverage rate, collision count, boundary violations, completion time, path length, stuck rate, success rate, sensor near-miss count, dynamic obstacle avoidance response, and unseen scenario success rate.
- Compares random baseline, rule-based planner, PPO policy, and improved PPO policy when available.
- Highlights weak scenario groups across curriculum stages and domain-randomized scenario distributions.

Test plan:

- Metric tests verify coverage and repeat coverage calculations.
- API test persists split-level evaluation results.
- UI check confirms model/policy comparison table is visible.

Scope: V2.

### RQ-009 Badcase Library And Closed Loop

Source capability: Badcase analysis, targeted data/model iteration, closed-loop optimization.

Target page or module: Badcase Library.

User story: As a PM, data engineer, or algorithm engineer, I can classify failures, assign root causes, and connect them to next actions.

Data entities:

- Badcase
- DatasetVersion
- ModelVersion
- RLPolicyVersion
- EvaluationReport

API needs:

- `GET /api/badcases`
- `POST /api/badcases`
- `GET /api/badcases/{badcase_id}`
- `PATCH /api/badcases/{badcase_id}`

Acceptance criteria:

- Badcases include source version, scenario tags, failure category, severity, root cause, screenshot/replay reference, recommended action, and status.
- Supports perception and RL failure categories.
- Badcases can generate recommended actions for data collection, relabeling, augmentation, model retraining, reward changes, evaluation changes, or V3 backlog items.

Test plan:

- API test creates and updates Badcase status.
- UI check filters Badcases by severity, category, and source.
- Documentation check verifies root cause categories are listed.

Scope: V2.

### RQ-010 Report Export And V3 Planning

Source capability: documentation standards, knowledge base, version records, cross-functional support.

Target page or module: Report Export and V3 Backlog.

User story: As a project owner, I can export a coherent project report and maintain a future improvement backlog.

Data entities:

- EvaluationReport
- Badcase
- V3BacklogItem

API needs:

- `GET /api/reports/project-summary`
- `POST /api/reports/export`
- `GET /api/backlog/v3`
- `POST /api/backlog/v3`

Acceptance criteria:

- Export includes project objective, JD mapping, data coverage, model results, RL results, Badcase summary, limitations, and next actions.
- V3 items show title, source problem, module, expected value, dependency, priority, and industrial-track classification.

Test plan:

- API test verifies exported report contains required sections.
- UI check confirms V3 backlog is visible but separated from V2 delivery.

Scope: V2.

## V2 Required Enhancements

These items are now part of the current V2 target:

- simulated LiDAR and ultrasonic sensor inputs
- dynamic people/pet obstacles
- richer planner baselines
- ONNX export
- inference latency benchmark
- curriculum learning
- domain randomization
- Badcase recommendation engine
- synthetic augmentation presets
- dataset drift dashboard
- model regression guardrail
- RL episode clustering

## V3 Reservation Requirements

V3 items are industrial-track extensions:

- ROS 2 / Gazebo or Isaac Sim
- real LiDAR / RTK / GNSS / IMU logs
- multi-sensor fusion
- TensorRT or quantization
- real robot testing
- fleet log ingestion
