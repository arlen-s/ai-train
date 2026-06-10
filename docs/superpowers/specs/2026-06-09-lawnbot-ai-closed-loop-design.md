# LawnBot AI Closed-Loop System Design

Date: 2026-06-09

## Objective

Build a complete portfolio-grade V3-ready V2 project for an intelligent lawn mowing robot AI workflow. The project demonstrates the full path from industry scenario data planning to annotation, perception model training, RL agent training, simulated sensor and dynamic obstacle evaluation, Badcase analysis, and next-version V3 product planning.

The target is not a minimal demo. The target is a credible end-to-end system that can be shown in a portfolio, discussed in interviews, and extended by future AI development agents.

## Positioning

The system is an AI/DataOps and robotics training platform for lawn mowing scenarios. It supports PM, data, model, and evaluation workflows:

- PM first defines the project requirements document, then derives product workflows, screens, V2 target scope, and V3 extension points.
- Data workflow manages scenario matrices, dataset versions, annotations, and quality checks.
- Model workflow trains obstacle detection and lawn/boundary segmentation models.
- RL workflow trains and evaluates a mowing agent in a 2D simulation environment with V3-ready simulator boundaries.
- Evaluation workflow compares model and agent versions, analyzes Badcases, and drives iteration.

## V2 Scope

V2 includes:

- project dashboard
- scenario matrix
- dataset version records
- annotation and QC workflow
- perception training run records
- perception evaluation and Badcase review
- 2D lawn mowing simulator with `SimulatorAdapter` boundary
- PPO RL agent training
- multi-scenario generalization evaluation
- simulated LiDAR and ultrasonic inputs
- dynamic people/pet obstacles
- 3D-ready episode replay data model
- planner baseline comparison
- ONNX export and latency benchmark records
- curriculum learning and domain randomization configuration
- Badcase recommendation workflow
- report export
- V3 backlog and technical documentation

V2 excludes:

- real robot deployment
- full ROS/Gazebo integration
- real LiDAR/RTK/GNSS/IMU ingestion
- production edge optimization
- fleet data ingestion

## Architecture

The system is organized into six bounded areas:

1. Product/UI layer
   - dashboard
   - dataset pages
   - annotation/QC pages
   - training run pages
   - RL training and evaluation pages
   - Badcase library
   - report pages
   - V3 backlog page

2. Backend/API layer
   - project metadata
   - scenario matrix
   - dataset versions
   - annotation tasks
   - training runs
   - model versions
   - RL policies
   - sensor frames
   - evaluation reports
   - Badcase records
   - V3 backlog records

3. Data pipeline
   - ingest samples
   - clean and deduplicate data
   - classify samples by scenario
   - validate annotations
   - record dataset versions

4. Perception training
   - obstacle detection baseline and iterations
   - lawn/boundary/forbidden-zone segmentation baseline and iterations
   - training logs and metrics
   - model registry records

5. RL environment and agent
   - 2D lawn map generator
   - static and dynamic obstacles
   - robot state, actions, rewards, termination rules
   - simulated LiDAR and ultrasonic observations
   - PPO training
   - planner baseline comparison

6. Evaluation and closed loop
   - metrics
   - model and policy comparison
   - failure classification
   - Badcase library
   - next data/model/RL iteration suggestions

## Core Data Flow

Scenario matrix -> data ingest -> data cleaning -> annotation/QC -> dataset version -> perception training -> perception evaluation -> Badcase analysis -> dataset/model iteration.

Scenario generator -> RL training scenarios -> policy training -> validation scenarios -> unseen scenarios -> failure episode analysis -> reward/environment iteration.

Both flows converge in the dashboard and report system.

## PM Prototype Requirements

PM must produce the project requirements document before prototype design. The requirements document defines target users, user problems, core flows, V2 requirements, non-functional requirements, out-of-scope boundaries, and V3 reservation points.

The main interface language is Simplified Chinese. Use English for standard technical labels such as `RL`, `PPO`, `ONNX`, `mAP`, `IoU`, `LiDAR`, `RTK/GNSS`, `IMU`, `Badcase`, `Dataset`, `Model`, and `Policy`.

The prototype must include the following pages:

- overview dashboard
- scenario matrix
- dataset version list and detail
- annotation task list and QC detail
- perception model training list and detail
- RL training list and detail
- simulation episode replay page
- multi-scenario evaluation page
- Badcase library
- report export page
- V3 backlog page

Each page must show the workflow state, key metrics, primary user actions, and links to upstream/downstream workflow steps.

## Success Criteria

The project is successful when it can demonstrate:

- clear mapping from JD capability requirements to implemented modules
- repeatable data and model version records
- at least one obstacle detection workflow
- at least one segmentation workflow
- at least one PPO RL agent training workflow
- multi-scenario validation and unseen-scene evaluation
- simulated sensor and dynamic obstacle evaluation
- Badcase classification and iteration recommendations
- complete PM, engineering, testing, and training documentation

## Risks

Main risks:

- scope creep from industrial V3 features
- spending too much time on UI before closing the model/RL loop
- weak annotation or data version story
- RL agent working only on memorized maps
- no credible baseline comparison
- documentation drifting away from implementation

Mitigation:

- keep V2/V3 boundaries explicit
- develop vertical slices
- version all datasets, models, policies, and reports
- evaluate on unseen generated scenarios
- compare RL against traditional coverage baselines
- update docs whenever behavior changes
