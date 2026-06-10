# Product Requirements Document

## Role In Development Flow

This document is produced by the PM role before prototype design. It defines what the product must solve, who uses it, what V2 must include, what is out of scope, and which V3 extension points must be reserved.

The PM prototype must be derived from this document. If prototype design changes product behavior, update this PRD before changing engineering scope.

## Product Name

LawnBot AI Closed-Loop System

## Current Target

The current formal delivery target is a V3-ready V2 product.

V2 is not a small demo. It includes the complete data, annotation, perception, RL, evaluation, Badcase, and reporting loop, plus simulated sensors, dynamic obstacles, 3D-ready replay, planner baselines, ONNX/latency records, curriculum/domain randomization, and stronger Badcase recommendations.

V2 should present as an AI robotics training workbench, not as a generic backend management system. The first screen should prioritize simulation replay, training/evaluation state, data-loop progress, and Badcase decision context. Navigation should feel like workflow switching or cockpit tabs, not a traditional admin sidebar.

V3 is the next major industrial upgrade. It adds ROS 2 / Gazebo or Isaac Sim, real robot logs, real multi-sensor fusion, edge deployment optimization, and fleet feedback.

## Target Users

- PM reviewing AI product workflow completeness
- data engineer managing datasets and annotations
- algorithm engineer training perception and RL models
- test engineer reviewing Badcases and evaluation reports
- interviewer assessing end-to-end AI project ability

## Product Goal

Provide a complete workflow for intelligent lawn mowing robot AI development:

1. define scenario coverage
2. manage datasets and annotations
3. train perception models
4. train RL mowing agent
5. evaluate across scenarios
6. analyze Badcases
7. generate reports and next-version backlog

## Core User Flows

### Flow 1: Scenario To Dataset

User defines a scenario matrix covering grass type, terrain, boundary, obstacle, lighting, weather, and season. The system shows which scenarios have enough samples, which are weak, and which should be collected or generated next.

### Flow 2: Dataset To Perception Model

User selects a dataset version, reviews annotation quality, starts or records a training run, reviews metrics, and compares model versions.

### Flow 3: Perception Badcase Loop

User reviews false positives, false negatives, boundary mistakes, shadow confusion, small-object misses, and unclear labels. Each Badcase can be assigned to a root cause and linked to a next action.

### Flow 4: RL Agent Training

User defines training scenario distributions, reward configuration, baseline planner, and PPO training parameters. The system records policy versions, training curves, and evaluation metrics.

### Flow 5: Generalization Evaluation

User compares policies across training, validation, and unseen scenario sets. The system highlights weak conditions such as narrow passages, dense obstacles, irregular boundaries, dynamic obstacles, and high repeat coverage.

### Flow 6: Report And V3 Planning

User exports a project report and pushes unresolved industrial limitations into the V3 backlog.

## V2 Functional Requirements

- dashboard with project health, data coverage, model metrics, RL metrics, and Badcase count
- scenario matrix CRUD
- dataset version list/detail
- annotation task and QC status tracking
- perception model run list/detail
- RL training run list/detail
- simulated LiDAR and ultrasonic sensor metadata
- dynamic obstacle scenario records for people and pets
- 3D-ready simulation episode replay data
- planner baseline comparison records
- ONNX export and inference latency benchmark records
- curriculum learning and domain randomization configuration
- evaluation report list/detail
- Badcase library
- Badcase recommendation workflow
- V3 backlog management
- exportable markdown report

## Non-Functional Requirements

- workflows must be reproducible
- version records must be immutable by default
- reports must be easy to read in portfolio/interview context
- UI must favor operational clarity over decoration
- in-app display language must be Simplified Chinese by default, with English reserved for standard technical labels such as `PPO`, `ONNX`, `mAP`, `IoU`, `LiDAR`, `RTK/GNSS`, `IMU`, `Badcase`, `Dataset`, `Model`, and `Policy`
- generated metrics must identify source dataset/model/policy versions

## Out Of Scope For V2

- real robot deployment
- real-time inference service
- ROS/Gazebo integration
- real multi-sensor fusion
- team permission system
- production-grade data warehouse

## V3 Extension Points

- `SimulatorAdapter` for Gazebo or Isaac Sim integration
- `SensorFrame` for real camera, LiDAR, RTK/GNSS, IMU, ultrasonic, trajectory, vibration, and current logs
- `RLEnvironment` interface compatible with Gymnasium-style agents
- `EvaluationPipeline` extensible to sim-to-real gap, edge latency, and real-machine safety metrics
- `DataIngestion` path for rosbag, MCAP, and fleet logs
