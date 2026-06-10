# JD Capability Matrix

This file maps the target job requirements to product modules, engineering work, and delivery artifacts. Future AI development agents should use this matrix to explain why a feature exists.

## Capability Mapping

| JD Capability | Project Module | PM Screen | Engineering Artifact | Acceptance Signal |
|---|---|---|---|---|
| Scenario data collection planning | Scenario matrix | Scenario Matrix | `data-pipeline.md` | Scenario dimensions cover grass, terrain, boundary, obstacle, light, weather, and season |
| Data cleaning and governance | Dataset versioning | Dataset Versions | data cleaning scripts and dataset records | Dataset versions include sample counts, scenario distribution, QC status, and known limitations |
| Dataset layering and classification | Scenario coverage analysis | Dashboard, Scenario Matrix | scenario taxonomy and metadata model | Weak scenario coverage can be identified |
| Annotation taxonomy | Annotation schema | Annotation/QC | label definitions and QC rules | Detection and segmentation labels have clear definitions |
| Annotation quality control | QC workflow | Annotation/QC | validation checks and issue categories | Missing, wrong, unclear, blur, occlusion, and small-object issues are tracked |
| Small sample and long-tail handling | Data augmentation and Badcase loop | Badcase Library | augmentation plan and dataset iteration records | Badcases can drive dataset v2 improvements |
| Perception model training | Detection and segmentation training | Perception Training | `model-training.md` | Training runs record dataset version, config, metrics, and artifacts |
| Hyperparameter tuning | Experiment records | Perception Training | MLflow or structured training logs | Baseline and improved runs can be compared |
| RL path planning | RL environment and PPO agent | RL Training, Simulation Replay | `rl-agent-training.md` | PPO policy is trained and evaluated against baselines |
| Model evaluation | Evaluation reports | Generalization Evaluation | `evaluation-and-badcase.md` | Metrics include mAP, IoU, recall, false positives, false negatives, and boundary errors |
| Extreme and boundary testing | Multi-scenario evaluation | Generalization Evaluation | unseen scenario split and stress tests | Policy/model performance is reported by scenario type |
| Badcase analysis | Badcase library | Badcase Library | Badcase records | Failures have category, severity, root cause, and next action |
| Closed-loop iteration | Dataset/model/policy version loop | Dashboard, Badcase Library | version comparison reports | V2 demonstrates at least one complete iteration loop |
| Documentation and collaboration | Project docs | Report Export | PRD, architecture, training docs, evaluation docs | Delivery package is complete and readable |

## Interview Narrative

The project should support this story:

1. I translated robotic mower job requirements into a data and model workflow.
2. I designed a scenario matrix for real mowing conditions.
3. I built dataset governance and annotation/QC rules.
4. I trained or recorded perception baselines for obstacles and lawn/boundary segmentation.
5. I built a 2D RL environment and trained a PPO mowing agent.
6. I evaluated perception models and RL policies across normal, difficult, and unseen scenarios.
7. I classified Badcases and used them to drive data/model/RL iteration.
8. I documented the workflow so a PM, data engineer, and algorithm engineer can continue development.

## Coverage Target

V2 should cover roughly 90-95% of the job requirements at portfolio depth.

The remaining industrial gap belongs to V3:

- real multi-sensor logs
- ROS/Gazebo or Isaac Sim
- edge deployment
- real robot testing
- fleet data collection
