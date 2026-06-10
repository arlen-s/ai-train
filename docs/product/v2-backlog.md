# V2 Target And V3 Backlog

This file is kept at the original path for compatibility with earlier agents.

Current decision: V2 is now the formal delivery target. The former V2 candidate features below are promoted into the active V2 scope unless a later PRD update explicitly removes them.

V3 remains the next major industrial upgrade path.

## Priority Legend

- P0: likely needed to make the project much stronger
- P1: valuable enhancement
- P2: later extension

## V2 Required Features

| ID | Priority | Feature | Module | Reason |
|---|---:|---|---|---|
| V2-001 | P0 | Simulated LiDAR and ultrasonic sensor inputs | RL environment | Better matches robotic mower sensor requirements |
| V2-002 | P0 | Dynamic people/pet obstacle scenarios | RL environment | Tests real avoidance behavior beyond static maps |
| V2-003 | P0 | Traditional coverage planner baselines | Evaluation | Enables credible RL vs rule-based comparison |
| V2-004 | P0 | ONNX export for perception models | Model deployment | Shows deployment awareness without full edge stack |
| V2-005 | P0 | Inference latency benchmark | Evaluation | Adds practical model readiness metric |
| V2-006 | P1 | Curriculum learning for RL scenarios | RL training | Improves learning stability and generalization |
| V2-007 | P1 | Domain randomization controls | RL training | Reduces overfitting to fixed maps |
| V2-008 | P1 | Badcase recommendation engine | Badcase loop | Suggests collect/relabel/retrain/reward-change actions |
| V2-009 | P1 | Synthetic data augmentation presets | Data pipeline | Covers shadows, glare, rain, fog, blur, occlusion |
| V2-010 | P1 | Dataset drift dashboard | Data governance | Shows scenario distribution changes over versions |
| V2-011 | P1 | Model regression guardrail | Evaluation | Blocks worse model/policy promotion |
| V2-012 | P1 | RL episode clustering | Evaluation | Groups similar failures for faster analysis |
| V2-013 | P2 | Semi-automatic segmentation pre-labeling | Annotation | Speeds up annotation with SAM-like workflow |
| V2-014 | P2 | Human review assignment workflow | Annotation/QC | More realistic team collaboration |
| V2-015 | P2 | Energy consumption proxy model | RL evaluation | Better reflects mowing efficiency |

## V3 / Industrial Track

| ID | Feature | Reason |
|---|---|---|
| V3-001 | ROS 2 / Gazebo or Isaac Sim integration | Closer to robotics development workflow |
| V3-002 | Real LiDAR / RTK / GNSS / IMU log ingestion | Covers multi-sensor data requirement |
| V3-003 | Multi-sensor fusion baseline | Extends beyond vision-only perception |
| V3-004 | Edge deployment with TensorRT / quantization | Tests latency, power, and memory constraints |
| V3-005 | Real robot or small vehicle deployment | Converts simulated loop into real-world loop |
| V3-006 | Fleet data ingestion and remote log replay | Moves toward production data operations |

## V3 Promotion Rule

Before promoting a V3 item into V2, update:

- `docs/product/prd.md`
- `docs/product/prototype-notes.md`
- `docs/engineering/architecture.md`
- `docs/engineering/testing-strategy.md`
