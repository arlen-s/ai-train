# Architecture

## High-Level Modules

```text
frontend
  -> dashboard and workflow screens

backend
  -> APIs and metadata persistence

data_pipeline
  -> ingest, clean, classify, version, validate

perception
  -> detection/segmentation training and evaluation

rl
  -> environment, simulated sensors, agent training, policy evaluation

evaluation
  -> metrics, Badcases, reports, comparisons
```

## Core Entities

Project:

- id
- name
- objective
- status

Scenario:

- id
- grass type
- grass height
- terrain
- boundary type
- obstacle type
- lighting
- weather
- season/time
- V2 simulated sensor fields
- V3 real-log reference fields

DatasetVersion:

- id
- name
- source
- sample count
- scenario distribution
- annotation status
- quality status
- created time

AnnotationTask:

- id
- dataset version id
- task type
- label schema version
- QC status
- issue count

TrainingRun:

- id
- model type
- dataset version id
- config
- metrics
- artifact path
- status

ModelVersion:

- id
- training run id
- metrics
- artifact path
- promotion status

RLEnvironmentVersion:

- id
- scenario generator config
- reward config
- action space
- observation space

RLPolicyVersion:

- id
- environment version id
- training config
- metrics
- artifact path

SensorFrame:

- id
- episode id
- timestamp
- camera frame reference
- simulated LiDAR rays
- ultrasonic distances
- RTK/GNSS-like pose
- IMU-like attitude
- vibration/current telemetry
- V3 real-log source reference

EvaluationReport:

- id
- target type
- target version id
- scenario split
- metrics
- linked Badcases

Badcase:

- id
- source type
- source version
- category
- severity
- root cause
- recommended action
- status

V3BacklogItem:

- id
- source problem
- target module
- expected value
- dependency
- priority
- status

## Boundaries

The backend stores metadata and orchestrates workflows. It should not contain heavy model training logic.

Training scripts read configuration and produce artifacts, metrics, and reports. They should register results back into metadata.

Evaluation should be reusable for both UI display and generated reports.

The RL environment must be testable without the frontend or backend.

V2 simulator code must depend on a `SimulatorAdapter` boundary so V3 can replace the built-in simulator with Gazebo or Isaac Sim without rewriting training, replay, or evaluation modules.

Sensor data must use a `SensorFrame` boundary so V2 simulated readings and V3 real logs share one metadata model.

## Artifact Rules

Do not overwrite:

- raw data
- dataset versions
- trained model artifacts
- RL policies
- evaluation reports

New outputs must use versioned directories or unique run ids.
