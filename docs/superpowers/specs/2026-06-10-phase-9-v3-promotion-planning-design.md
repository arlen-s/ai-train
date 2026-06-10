# Phase 9 V3 Promotion Planning Design

Date: 2026-06-10

## Objective

Implement V3 promotion planning without moving industrial features into V2 delivery. The workbench must expose a V3 promotion plan and allow new V3 backlog items to be recorded with source problem, target module, expected value, dependency, priority, and status.

## Scope

In scope:

- V3 promotion plan API
- V3 backlog creation API
- source links from Badcases and V2 limitations to V3 candidates
- Chinese-first UI and docs for V3 planning

Out of scope:

- implementing ROS 2, Gazebo, Isaac Sim, real sensor logs, TensorRT, or fleet ingestion
- project management integrations
- assigning external tickets

## Architecture

`apps/api/app/services/v3_planning.py` owns V3 backlog creation and promotion plan lookup. The existing `V3_BACKLOG` seed list remains the source for current V3 items. New records are appended in memory for this prototype.

## API Contract

- `GET /api/backlog/v3`
- `POST /api/backlog/v3`
- `GET /api/backlog/v3/promotion-plan`

## Testing

API tests verify:

- promotion plan includes industrial-track items and keeps V2 scope locked
- creating a V3 backlog item appends a valid V3 record
- invalid version targets are rejected by schema validation

## Product Impact

This phase makes the final V2/V3 boundary explicit. It lets reviewers see that V2 is complete enough for portfolio delivery while V3 remains a deliberate industrial upgrade track.

