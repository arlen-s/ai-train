# Evaluation And Badcase Loop

## Purpose

Evaluation must connect data, model, RL behavior, and next iteration decisions. The project should show not only metrics, but also why failures happen and what to do next.

## Perception Evaluation

Detection metrics:

- precision
- recall
- F1
- mAP
- false positive count
- false negative count

Segmentation metrics:

- IoU
- mean IoU
- boundary deviation
- forbidden-zone segmentation error

Scenario breakdown:

- lighting
- weather
- obstacle type
- grass height
- terrain
- boundary type

## RL Evaluation

Metrics:

- coverage rate
- repeat coverage rate
- collision count
- boundary violation count
- completion time
- path length
- stuck rate
- success rate
- unseen scenario success rate
- dynamic obstacle response time
- simulated sensor near-miss count

Compare:

- random baseline
- rule-based coverage planner
- PPO policy
- improved PPO policy

## Badcase Record

Each Badcase should include:

- id
- source dataset/model/policy version
- scenario tags
- failure category
- severity
- root cause
- screenshot/replay reference
- recommended action
- owner/status

## Root Cause Categories

Data:

- missing scenario
- class imbalance
- poor image quality
- unclear annotation

Model:

- false positive
- false negative
- boundary error
- overfitting

RL:

- reward misspecification
- weak exploration
- poor generalization
- map generator gap
- action space limitation

System:

- metric bug
- configuration mismatch
- artifact/version mismatch

## Closed-Loop Actions

Possible actions:

- collect more data
- relabel samples
- add augmentation
- rebalance dataset
- adjust model hyperparameters
- improve reward function
- add scenario generator cases
- retrain policy
- add regression test
- move industrial feature to V3 backlog

## Recommendation Actions

V2 Badcase recommendations must map root causes to concrete next actions:

- data gap -> collect or generate targeted scenario samples
- class imbalance -> rebalance dataset or add augmentation
- unclear label -> relabel samples and update QC rule
- model regression -> block promotion and rerun comparison
- reward misspecification -> adjust reward config and retrain policy
- map generator gap -> add curriculum or domain-randomized scenarios
- simulator limitation -> create V3 backlog item for ROS 2, Gazebo, Isaac Sim, real logs, or edge deployment
