# Phase 10 Frontend Productization Design

Date: 2026-06-10

## Objective

Turn the static web shell into a real Chinese-first V2 robotics AI training workbench. The frontend must consume the existing FastAPI endpoints and provide a complete visual product surface for Dataset governance, annotation/QC, perception training, RL replay, generalization evaluation, Badcase decisions, report export, and V3 planning.

## Scope

In scope:

- Vite + React + TypeScript application under `apps/web`
- API client for the existing FastAPI metadata endpoints
- cockpit-style overview first viewport, not a backend admin sidebar
- workflow tabs for Overview, Data/QC, Perception, RL Replay, Evaluation/Badcase, Report/V3
- dense metric cards, status panels, tables, charts, and inspector panels
- SVG-based simulation replay with lawn map, robot path, dynamic actors, sensor rays, and event markers
- report export preview from `/api/reports/export`
- loading and error states
- frontend tests and production build

Out of scope:

- authentication
- real-time websocket replay
- editing every entity
- replacing FastAPI seed data with persistence
- true 3D rendering; replay remains 2D but 3D-ready metadata is visible

## Design Direction

The UI is a robotics AI workbench. It uses a top-level workflow tab bar and a split cockpit layout. The first viewport shows simulation replay, training/evaluation status, data-loop health, and Badcase decisions. Tables support the workflow but do not define the product personality.

Primary display language is Simplified Chinese. Keep industry labels in English where expected: `AI/DataOps`, `Dataset`, `Model`, `Policy`, `RL`, `PPO`, `ONNX`, `mAP`, `IoU`, `LiDAR`, `Badcase`, and version ids.

## Architecture

`apps/web/src/lib/api.ts` owns typed fetch helpers. `apps/web/src/App.tsx` orchestrates data loading and workflow tab state. `apps/web/src/components` contains focused visual components:

- cockpit metrics and workflow navigation
- scenario and Dataset panels
- annotation QC panel
- perception model panel
- RL replay panel
- evaluation and Badcase panel
- report and V3 panel

CSS stays local in `src/styles.css` to avoid Tailwind setup risk in the current environment. Recharts provides compact metric charts, and lucide-react provides tool/action icons.

## API Endpoints Used

- `/api/dashboard/summary`
- `/api/scenarios/coverage`
- `/api/datasets`
- `/api/annotation-tasks`
- `/api/label-schemas/current`
- `/api/training-runs`
- `/api/models`
- `/api/evaluations`
- `/api/rl/environments`
- `/api/rl/policies`
- `/api/rl/baselines`
- `/api/rl/episodes/episode-v2-dynamic-014`
- `/api/rl/evaluations`
- `/api/policy-comparisons`
- `/api/badcases`
- `/api/reports/project-summary`
- `/api/reports/export`
- `/api/backlog/v3`
- `/api/backlog/v3/promotion-plan`

## Testing

Use Vitest and React Testing Library.

Tests cover:

- API client URL construction and error handling
- app renders cockpit summary after mocked API responses
- workflow tab switching reveals RL replay and Badcase sections
- replay component renders robot path, LiDAR rays, dynamic actors, and near-miss marker

## Delivery Criteria

- `npm test -- --run` passes
- `npm run build` passes
- local dev server starts
- Playwright or browser verification confirms the first viewport renders a non-admin cockpit and the RL replay is visible

