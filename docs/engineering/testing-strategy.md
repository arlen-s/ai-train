# Testing Strategy

## Testing Principles

Testing must cover product behavior, data correctness, model metric calculations, and RL environment reliability.

Do not treat training success as the only test. Training can run while hidden data, reward, and metric bugs remain.

## Test Categories

### Unit Tests

Required for:

- scenario classification logic
- data cleaning rules
- annotation validation
- metric calculations
- reward function pieces
- map generation utilities

### API Tests

Required for:

- scenario CRUD
- dataset version records
- annotation task records
- training run records
- evaluation report records
- Badcase records

### Data Validation Tests

Required checks:

- duplicate detection
- missing metadata
- invalid scenario labels
- invalid annotation categories
- empty dataset splits
- broken artifact references

### RL Environment Tests

Required checks:

- `reset` returns valid observation
- `step` returns valid observation, reward, terminated, truncated, info
- collision creates penalty
- boundary violation creates penalty
- new coverage creates positive reward
- repeated coverage is penalized
- episode termination is stable
- seeded environments are reproducible

### Model Evaluation Tests

Required checks:

- mAP / precision / recall calculation inputs are valid
- IoU calculation is correct for simple masks
- boundary deviation metric works on controlled examples
- regression comparison correctly flags worse versions

### Frontend Workflow Tests

Required checks:

- dashboard loads key metrics
- user can inspect dataset version
- user can inspect training run
- user can inspect evaluation report
- user can inspect Badcase detail
- V3 backlog is visible but separated from V2 delivery
- simulated sensor overlays are visible in episode replay
- dynamic obstacle cases are represented in evaluation views

### V2 Enhancement Tests

Required checks:

- simulated LiDAR rays are deterministic for seeded maps
- ultrasonic distances reflect nearest local obstacle
- dynamic obstacle trajectories update predictably
- planner baseline metrics are comparable with PPO metrics
- ONNX export records include artifact path and latency metrics
- Badcase recommendation maps known root causes to concrete next actions

## Verification Before Delivery

Before marking a feature done, record:

- command run
- result
- remaining risk
- documentation updated
