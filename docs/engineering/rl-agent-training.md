# RL Agent Training

## Goal

Train a lawn mowing coverage agent that can generalize across multiple generated scenarios while avoiding obstacles, boundaries, and forbidden zones.

## Environment

Use a custom Gymnasium-style environment.

The environment includes:

- 2D lawn map
- boundary
- forbidden zones
- static obstacles
- dynamic people/pet obstacles
- grass coverage state
- robot position and heading
- local sensor-like observation
- simulated LiDAR and ultrasonic readings

## Observation Space

V2 observation should include:

- local occupancy map
- local coverage map
- robot heading
- distance to boundary
- nearby obstacle indicators
- remaining coverage estimate
- simulated LiDAR rays
- ultrasonic distances
- dynamic obstacle velocities
- slope or terrain resistance

## Action Space

Start with discrete actions:

- move forward
- turn left
- turn right
- slow/stop

V3 can consider continuous linear and angular velocity when a robotics simulator is connected.

## Reward Design

Positive rewards:

- newly covered lawn
- completing target coverage
- efficient progress

Penalties:

- collision
- boundary violation
- entering forbidden zone
- repeated mowing
- excessive path length
- stuck behavior
- timeout

## Training Method

V2 baseline:

- PPO with Stable-Baselines3

Required comparisons:

- random policy
- simple rule-based coverage planner
- PPO policy

## Generalization Evaluation

Use separate scenario splits:

- training maps
- validation maps
- unseen maps

Evaluate:

- rectangular lawns
- irregular lawns
- narrow passages
- scattered obstacles
- dense obstacles
- forbidden zones
- boundary-heavy maps

## Metrics

- coverage rate
- success rate
- repeat coverage rate
- collisions
- boundary violations
- completion time
- path length
- energy proxy
- stuck episodes
- unseen scenario success rate

## Failure Categories

- stuck near obstacle
- fails narrow passage
- repeats same area
- violates boundary
- ignores uncovered area
- overfits to training map shape
- unstable behavior near dynamic obstacle
