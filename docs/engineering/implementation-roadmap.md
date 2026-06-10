# Implementation Roadmap

## Purpose

This roadmap turns the product and engineering documents into an execution sequence for future AI development agents.

Use it after reading:

- `AGENTS.md`
- `docs/product/jd-capability-matrix.md`
- `docs/product/prd.md`
- `docs/product/requirement-decomposition.md`
- `docs/product/prototype-notes.md`
- `docs/engineering/development-workflow.md`
- `docs/engineering/ai-skill-discovery.md`
- `docs/engineering/repository-structure.md`

## Phase Keyword Index

- Product foundation
- App skeleton
- Dataset governance
- Annotation
- Perception
- RL environment
- Generalization
- Report export
- V3 promotion

## Phase 0: Product Foundation

Goal: make the project understandable before code exists.

Deliverables:

- PM project requirements document
- requirement decomposition
- PM wireframe artifact
- JD capability matrix
- V2/V3 scope boundaries
- AI skill/tool discovery gate

Exit criteria:

- `docs/product/prd.md` is current
- `docs/product/requirement-decomposition.md` is current
- `docs/product/prototypes/pm-wireframes.html` exists
- `docs/engineering/ai-skill-discovery.md` exists

## Phase 1: App Skeleton And Data Model

Goal: create a runnable application shell and core metadata model.

Deliverables:

- repository structure
- frontend shell
- backend API shell
- database schema for core entities
- seed data for PM prototype flows
- test framework

Core entities:

- Scenario
- DatasetVersion
- AnnotationTask
- TrainingRun
- ModelVersion
- RLEnvironmentVersion
- RLPolicyVersion
- EvaluationReport
- Badcase
- V3BacklogItem

Exit criteria:

- app starts locally
- core entity schemas exist
- smoke tests pass
- dashboard can read seeded summary data

## Phase 2: Dataset Governance

Goal: implement scenario matrix and dataset version workflows.

Deliverables:

- scenario matrix API and UI
- dataset version API and UI
- scenario coverage summary
- dataset quality status
- V2 simulated sensor fields in metadata
- V3 reserved real-log fields in metadata

Exit criteria:

- user can create/read scenario records
- user can create/read dataset version records
- weak scenario coverage is visible
- data validation tests pass

## Phase 3: Annotation And QC

Goal: implement annotation task and quality-control workflow.

Deliverables:

- label schema definitions
- annotation task records
- QC issue categories
- annotation task detail page
- link from QC issue to Badcase

Exit criteria:

- detection and segmentation schemas are visible
- QC status can be updated
- invalid labels are rejected
- QC issue categories match documentation

## Phase 4: Perception Training And Evaluation Records

Goal: implement perception training run and evaluation reporting workflows.

Deliverables:

- training run records
- model version records
- detection metrics
- segmentation metrics
- scenario-specific evaluation breakdown
- perception Badcase creation

Exit criteria:

- training run can be linked to dataset version
- evaluation report can be linked to model version
- metrics are displayed in UI
- controlled metric tests pass

## Phase 5: RL Environment And PPO Training

Goal: implement a custom 2D mowing environment and PPO training workflow.

Deliverables:

- 2D map generator
- observation space
- action space
- reward function
- termination rules
- PPO training script or workflow record
- random and rule-based baselines
- simulation replay data model

Exit criteria:

- environment reset and step work
- collision, boundary, reward, and termination tests pass
- training run metadata can be recorded
- replay data can be displayed

## Phase 6: Generalization Evaluation And Badcase Loop

Goal: compare perception models and RL policies across normal, difficult, and unseen scenarios.

Deliverables:

- training/validation/unseen scenario split records
- RL policy evaluation metrics
- model/policy comparison pages
- Badcase library
- root cause and recommended action workflow

Exit criteria:

- evaluation supports split-level metrics
- Badcases can be filtered by source, category, severity, and scenario tags
- Badcases can generate next actions or V3 backlog items

## Phase 7: Report Export And Delivery Package

Goal: produce portfolio-ready delivery artifacts.

Deliverables:

- project summary report
- data coverage report
- perception training and evaluation report
- RL training and generalization report
- Badcase analysis report
- V3 backlog report
- resume-ready project summary

Exit criteria:

- report includes JD mapping, architecture, data, model, RL, evaluation, Badcases, limitations, and V3 plan
- delivery checklist is reviewed
- verification commands are recorded

## Phase 8: V2 Enhancement Completion

Goal: complete the V2 enhancements that make the project stronger than the original foundation scope.

Required V2 enhancements:

- simulated LiDAR and ultrasonic sensor inputs
- dynamic people/pet obstacles
- richer planner baselines
- ONNX export
- inference latency benchmark
- curriculum learning
- domain randomization
- Badcase recommendation engine
- dataset drift dashboard
- model regression guardrail

Exit criteria:

- promoted item has updated PRD section
- prototype notes are updated
- architecture and testing strategy are updated
- V2 scope remains stable

## Phase 9: V3 Promotion Planning

Goal: select industrial-track items for the next major version.

Candidate V3 promotions:

- ROS 2 / Gazebo or Isaac Sim bridge
- real sensor log ingestion for rosbag and MCAP
- real multi-sensor fusion baseline
- edge deployment optimization with TensorRT or quantization
- real robot or small-vehicle test loop
- fleet log ingestion and remote replay

Exit criteria:

- promoted item has an updated PRD section
- prototype notes are updated
- architecture and testing strategy are updated
- V2 delivery scope remains stable
