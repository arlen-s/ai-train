# Phase 8 V2 Enhancement Completion Design

Date: 2026-06-10

## Objective

Close the remaining V2 enhancement gaps that make the project stronger than a basic AI demo: Dataset drift dashboard, model regression guardrail, synthetic augmentation presets, and RL episode clustering metadata.

## Scope

In scope:

- Dataset drift records comparing dataset-v1 and dataset-v2 scenario distributions
- model regression guardrail records for promotion decisions
- augmentation presets for shadows, glare, rain, fog, blur, occlusion, and small objects
- RL episode cluster records for stuck, repeat coverage, near-miss, and boundary violation groups
- Chinese-first UI and API documentation for these V2 enhancements

Out of scope:

- automatic drift visualization rendering
- real DVC integration
- executing augmentation pipelines
- embedding-based episode clustering

## Architecture

`apps/api/app/services/enhancements.py` owns V2 enhancement metadata lookup. The service uses deterministic seed records so the UI and report can surface these capabilities before heavier data/ML infrastructure is introduced.

## API Contract

- `GET /api/datasets/drift`
- `GET /api/model-guardrails/regression`
- `GET /api/augmentation-presets`
- `GET /api/rl/episode-clusters`

## Testing

API tests verify:

- Dataset drift includes source/target datasets, scenario deltas, drift score, weak scenarios, and recommended actions
- model regression guardrail blocks or allows promotion based on metric deltas and safety notes
- augmentation presets include shadow, glare, rain, fog, blur, occlusion, and small-object presets
- RL episode clusters expose failure category, cluster size, linked episodes, representative Badcases, and next actions

## Product Impact

This phase completes several V2 enhancement expectations from the backlog and gives the project a more credible model/data iteration story: detect distribution drift, prevent model regressions, expand long-tail samples, and group repeated RL failures for focused iteration.

