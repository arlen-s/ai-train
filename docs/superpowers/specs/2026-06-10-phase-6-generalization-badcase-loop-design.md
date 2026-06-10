# Phase 6 Generalization Evaluation And Badcase Loop Design

Date: 2026-06-10

## Objective

Implement V2 generalization evaluation and Badcase closed-loop workflow. This phase must let the workbench compare RL policies across train, validation, and unseen scenario splits, filter Badcases by source/category/severity/scenario tags, update Badcase status, and generate concrete next actions including V3 backlog escalation when the root cause is a simulator or industrial limitation.

## Scope

In scope:

- RL split-level evaluation records for PPO and planner baselines
- policy comparison records across random, rule-based, and PPO approaches
- Badcase list filtering by source type, category, severity, and scenario tag
- Badcase detail and status update workflow
- Badcase recommendation endpoint that maps root causes to next actions
- V3 escalation flag for simulator limitation, real-log gap, edge deployment, or sensor-fusion gaps
- Chinese-first UI section for generalization evaluation and Badcase decisions

Out of scope:

- retraining RL policies
- clustering episodes with embeddings
- creating GitHub/Lark tasks
- exporting final reports

## Architecture

`packages/evaluation/rl_metrics.py` owns reusable controlled metric helpers for coverage rate and repeat coverage rate. `apps/api/app/services/badcases.py` owns Badcase filtering, status updates, and recommendation generation. RL evaluation and policy comparison seed records stay in `seed_data.py` and are exposed through a focused `generalization.py` service.

The Badcase service works on the shared `BADCASES` in-memory list already introduced in Phase 4. This keeps perception and RL failures in one library and prepares the project for a later database-backed Badcase table.

## API Contract

- `GET /api/rl/evaluations`
- `GET /api/rl/evaluations/{report_id}`
- `GET /api/policy-comparisons`
- `GET /api/badcases?source_type=&category=&severity=&scenario_tag=`
- `GET /api/badcases/{badcase_id}`
- `PATCH /api/badcases/{badcase_id}`
- `POST /api/badcases/{badcase_id}/recommendation`

## Testing

Use standard-library `unittest`.

Metric tests cover:

- coverage rate from covered/coverable cells
- repeat coverage rate from repeat/total steps
- validation errors for invalid counts

API tests cover:

- RL evaluation list/detail with train, validation, and unseen split metrics
- policy comparison includes random, rule-based, and PPO records
- Badcase filters return the correct RL failure
- Badcase detail exposes root cause and recommended action
- Badcase status update works
- recommendation endpoint returns V3 escalation for simulator limitation

## Product Impact

This phase connects the RL environment and perception model records into an interview-ready closed-loop story: evaluate across normal/difficult/unseen scenarios, identify failures, assign root causes, recommend next actions, and keep V3 industrial gaps separate from the V2 delivery.

