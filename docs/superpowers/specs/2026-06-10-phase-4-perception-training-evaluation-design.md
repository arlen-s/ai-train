# Phase 4 Perception Training And Evaluation Design

Date: 2026-06-10

## Objective

Implement the V2 perception training and evaluation metadata slice for obstacle detection and lawn/boundary segmentation. The slice must let the workbench show which Dataset version produced a training run, which Model version resulted from it, how the model performed across scenario splits, and which perception Badcases should drive the next iteration.

## Scope

This phase implements records and metric utilities, not heavy model training jobs. The API records training outputs that a future training script can register back into the system.

In scope:

- perception training run list and detail records
- model version list records
- perception evaluation report list and detail records
- scenario-specific metric breakdowns
- perception Badcase list and creation workflow
- controlled metric helpers for precision, recall, F1, and IoU
- Chinese-first static workbench section for perception training/evaluation

Out of scope:

- running YOLO, segmentation, or SAM training inside the API
- uploading model artifacts
- ROS 2, Gazebo, Isaac Sim, or real robot log ingestion
- RL environment and PPO policy training

## Architecture

`packages/evaluation` owns reusable metric calculations that can be used by API tests, future training scripts, and report generation. It has no FastAPI dependency.

`apps/api/app/services/perception.py` owns in-memory lookup and mutation logic for training runs, model versions, evaluation reports, and Badcase creation. FastAPI routes remain thin and return Pydantic schema objects from `apps/api/app/schemas/core.py`.

`apps/api/app/services/seed_data.py` continues to provide deterministic V2 records. The route contracts are shaped so the in-memory lists can later be replaced by database persistence without changing UI or tests.

## API Contract

- `GET /api/training-runs`
- `GET /api/training-runs/{run_id}`
- `GET /api/models`
- `GET /api/evaluations`
- `GET /api/evaluations/{report_id}`
- `GET /api/badcases`
- `POST /api/badcases`

Training runs must include dataset version id, task, model family, config, hyperparameters, final metrics, artifact path, ONNX export status, latency, linked model version, linked evaluations, linked Badcases, and known limitations.

Model versions must include training run id, dataset version id, task, metrics, artifact path, ONNX path, latency, model size, promotion status, linked evaluations, and linked Badcases.

Evaluation reports must include target model id, dataset version id, aggregate metrics, scenario split breakdowns, linked Badcases, and recommendations.

Badcases must include source version, scenario tags, category, severity, root cause, evidence reference, recommended action, owner, and status.

## Testing

Use standard-library `unittest`.

API tests cover:

- training run list/detail
- model version list
- evaluation report list/detail with scenario breakdowns
- Badcase list and perception Badcase creation
- unknown training run and invalid Badcase source handling

Metric tests cover:

- precision, recall, and F1 on controlled counts
- IoU on controlled binary masks
- validation errors for negative counts and mismatched mask shapes

## Product Impact

The workbench gains a credible perception model loop that matches the job requirement for training, hyperparameter records, evaluation metrics, Badcase analysis, and iterative model improvement. The UI remains a robotics AI training workbench, not a generic backend admin system.

