# Phase 5 RL Environment And Training Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a deterministic 2D mowing RL environment plus V2 PPO training, baseline, and episode replay metadata APIs.

**Architecture:** Keep RL environment logic in `packages/rl_env` with no FastAPI dependency. Extend `apps/api` only for metadata routes and seed records, preserving the rule that heavy training does not run inside request handlers.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS web shell.

---

## File Structure

- Create `packages/rl_env/__init__.py`: exports environment classes.
- Create `packages/rl_env/grid_world.py`: map generator, environment state, reset/step/reward/sensor logic.
- Create `packages/rl_env/tests/__init__.py`: unittest discovery marker.
- Create `packages/rl_env/tests/test_grid_world.py`: environment behavior tests.
- Modify `apps/api/app/schemas/core.py`: add RL environment, policy, baseline, replay frame, and episode schemas.
- Modify `apps/api/app/services/seed_data.py`: add RL metadata seed records.
- Create `apps/api/app/services/rl_training.py`: RL metadata lookup service.
- Modify `apps/api/app/main.py`: add RL metadata routes.
- Create `apps/api/tests/test_rl_workflow_api.py`: API tests for RL metadata and replay.
- Modify `apps/web/index.html`: add RL training/replay section.
- Modify `apps/api/README.md`: document RL endpoints.
- Modify `docs/engineering/repository-structure.md`: add Phase 5 implementation note.

## Task 1: RL Environment Tests

- [ ] **Step 1: Write failing tests**

Create `packages/rl_env/tests/test_grid_world.py` with tests that verify:

- deterministic `reset`
- forward step covers new grass and returns positive reward
- revisiting a covered cell applies repeat penalty
- obstacle collision terminates with `event == "collision"`
- boundary violation terminates with `event == "boundary-violation"`
- target coverage terminates with `event == "coverage-complete"`
- LiDAR and ultrasonic observations have stable lengths

- [ ] **Step 2: Run tests to verify red**

Run:

```bash
python3 -m unittest packages.rl_env.tests.test_grid_world -v
```

Expected: FAIL because `packages.rl_env.grid_world` does not exist.

## Task 2: RL API Tests

- [ ] **Step 1: Write failing API tests**

Create `apps/api/tests/test_rl_workflow_api.py` with tests that verify:

- `GET /api/rl/environments` exposes sensor-aware V2 environment records.
- `GET /api/rl/environments/rl-env-v2-grid` exposes action/observation spaces, reward config, termination rules, and `SimulatorAdapter`.
- `GET /api/rl/policies` exposes `ppo-v2` with PPO config, curriculum, domain randomization, metrics, and artifact path.
- `GET /api/rl/baselines` includes `random-policy` and `rule-coverage-planner`.
- `GET /api/rl/episodes/episode-v2-dynamic-014` exposes path, dynamic actors, sensor frames, event markers, and 3D-ready timeline.
- Unknown episode returns `404`.

- [ ] **Step 2: Run tests to verify red**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_rl_workflow_api -v
```

Expected: FAIL because routes and schemas do not exist.

## Task 3: RL Environment Implementation

- [ ] **Step 1: Implement grid world**

Implement `MowingGridEnvironment`, `GridWorldConfig`, and `create_default_training_map` in `packages/rl_env/grid_world.py`.

- [ ] **Step 2: Run environment tests**

Run:

```bash
python3 -m unittest packages.rl_env.tests.test_grid_world -v
```

Expected: PASS.

## Task 4: RL API Implementation

- [ ] **Step 1: Add schemas**

Add RL metadata schemas to `apps/api/app/schemas/core.py`.

- [ ] **Step 2: Add seed records**

Add environment, policy, baseline, and episode replay seed records to `apps/api/app/services/seed_data.py`.

- [ ] **Step 3: Add service and routes**

Create `apps/api/app/services/rl_training.py` and add routes in `apps/api/app/main.py`.

- [ ] **Step 4: Run API tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_rl_workflow_api -v
```

Expected: PASS.

## Task 5: Web And Docs

- [ ] **Step 1: Add RL workbench section**

Add Chinese-first RL content to `apps/web/index.html`, including PPO, curriculum, domain randomization, LiDAR, ultrasonic, dynamic obstacles, baseline comparison, and replay.

- [ ] **Step 2: Update API README**

Document RL endpoints.

- [ ] **Step 3: Update repository structure docs**

Add a Phase 5 implementation note describing `packages/rl_env` and `apps/api/app/services/rl_training.py`.

## Task 6: Verification And Commit

- [ ] **Step 1: Run verification**

Run:

```bash
python3 -m unittest packages.rl_env.tests.test_grid_world -v
python3 -m unittest packages.evaluation.tests.test_perception_metrics -v
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke apps.api.tests.test_governance_api apps.api.tests.test_annotation_qc_api apps.api.tests.test_perception_workflow_api apps.api.tests.test_rl_workflow_api -v
PYTHONPYCACHEPREFIX=/private/tmp/ai-train-pycache python3 -m compileall apps/api/app packages/evaluation packages/rl_env
rg -n "RL 训练|PPO|LiDAR|ultrasonic|/api/rl/environments|/api/rl/policies|/api/rl/episodes" apps/web/index.html apps/api/README.md docs/engineering/repository-structure.md
```

- [ ] **Step 2: Commit**

Run:

```bash
git add .
git commit -m "feat: add rl environment training slice"
```

Expected: commit succeeds locally.

## Self-Review

- Spec coverage: covers RQ-007 and prepares RQ-008.
- Placeholder scan: no implementation placeholders remain.
- Type consistency: route names and schema fields match the API test contract.

