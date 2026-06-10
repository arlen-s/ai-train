# Phase 5 RL Environment And Training Design

Date: 2026-06-10

## Objective

Implement the V2 RL environment and PPO training metadata slice for the LawnBot AI workbench. This phase must provide a deterministic 2D mowing environment that can be unit tested, plus API records for environment versions, PPO policy versions, planner baselines, and 3D-ready episode replay data.

## Scope

In scope:

- deterministic 2D grid lawn map generator
- Gymnasium-style `reset` and `step` API without requiring Gymnasium as a dependency
- discrete action space: move forward, turn left, turn right, slow/stop
- observation dictionary with robot pose, heading, coverage map, obstacle map, simulated LiDAR, ultrasonic, and remaining coverage
- reward function for new coverage, repeat coverage, collision, boundary violation, forbidden zone, and completion
- termination rules for collision, boundary violation, target coverage, and max steps
- random and rule-based baseline metadata
- PPO policy metadata with curriculum and domain randomization records
- simulation episode replay data model for later 3D viewer use
- API endpoints for RL environments, policies, baselines, and episode replay

Out of scope:

- installing or running Stable-Baselines3
- long-running PPO training jobs
- real robot control
- Gazebo, Isaac Sim, or ROS 2 integration

## Architecture

`packages/rl_env` owns environment logic and has no FastAPI dependency. It includes the grid map generator, environment state transitions, reward logic, and deterministic sensor simulation.

`apps/api/app/services/rl_training.py` owns RL metadata records from seed data. The API exposes environment versions, policy versions, baseline records, and episode replay records without running training inline.

The replay model stores frames as structured metadata: robot pose, action, reward, covered cells, simulated LiDAR rays, ultrasonic distances, and event markers. This is intentionally 3D-ready even though V2 uses a 2D local simulator.

## API Contract

- `GET /api/rl/environments`
- `GET /api/rl/environments/{environment_id}`
- `GET /api/rl/policies`
- `GET /api/rl/policies/{policy_id}`
- `GET /api/rl/baselines`
- `GET /api/rl/episodes/{episode_id}`

## Testing

Use standard-library `unittest`.

RL environment tests cover:

- `reset` returns a valid observation and deterministic start state
- moving forward covers new grass and gives positive reward
- repeated coverage is penalized
- collision terminates the episode with a penalty
- boundary violation terminates the episode with a penalty
- target coverage terminates successfully
- simulated LiDAR and ultrasonic observations have stable lengths

API tests cover:

- environment records expose map generator, observation/action spaces, sensors, reward config, and V3 simulator adapter
- policy records expose PPO config, curriculum, domain randomization, metrics, and artifact path
- baselines include random and rule-based coverage planner metadata
- episode replay exposes map, dynamic people/pet actors, path, coverage, sensor frames, event markers, and 3D-ready timeline fields

## Product Impact

This phase gives the project a credible RL agent foundation instead of only dashboard copy. It directly supports the job requirement for reinforcement learning path planning, obstacle avoidance decisions, multi-scenario evaluation readiness, simulated sensors, dynamic obstacles, and replayable Badcase analysis.

