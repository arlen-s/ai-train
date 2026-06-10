# Development Workflow

## End-To-End Flow

Use this process for the whole project:

```text
JD analysis
-> project objective
-> AI skill/tool discovery
-> PM project requirements document
-> PM prototype
-> requirement decomposition
-> technical selection
-> architecture design
-> implementation roadmap
-> project skeleton
-> vertical module development
-> automated testing
-> model/RL training
-> evaluation and Badcase loop
-> documentation and reports
-> V2 delivery
-> V3 backlog update
```

## Phase 1: JD Capability Mapping

Output:

- capability matrix
- feature mapping
- success criteria

The project must explicitly cover:

- scenario data planning
- data cleaning and versioning
- annotation taxonomy and QC
- perception training
- RL path planning agent
- model and policy evaluation
- Badcase iteration
- documentation and collaboration

## Phase 2: AI Skill And Tool Discovery

Output:

- applicable project documents
- applicable local skills
- applicable external tools
- unavailable tools and fallback plan

Prefer `find-skills` when the Vercel Labs skill or Skills CLI is available. The current environment does not have a local `skills` command installed, so use `docs/engineering/ai-skill-discovery.md` for fallback behavior.

This phase must happen before implementation planning and before writing code.

## Phase 3: PM Project Requirements Document

Output:

- target users
- user problems
- product goal
- core user flows
- V2 functional requirements
- non-functional requirements
- out-of-scope boundaries
- V3 reservation points

The PM requirements document must be written before prototype design. It is the source of truth for PM screens and user flows.

The current PM requirements document is `docs/product/prd.md`.

## Phase 4: PM Prototype

Output:

- page list
- user flows
- dashboard layout
- V2/V3 entry points

PM prototype must be derived from the PM requirements document and must be completed before feature development.

The current static PM prototype artifact is `docs/product/prototypes/pm-wireframes.html`.

## Phase 5: Requirement Decomposition

Each requirement must define:

- user problem
- target page or module
- data entities
- API surface
- expected behavior
- acceptance criteria
- test plan
- V2/V3 classification

The current requirement decomposition document is `docs/product/requirement-decomposition.md`.

## Phase 6: Architecture And Skeleton

Set up:

- repository structure
- API framework
- data model
- configuration files
- test framework
- sample data
- training/evaluation output directories
- documentation structure

Before skeleton work starts, read `docs/engineering/implementation-roadmap.md`.

The recommended code layout is defined in `docs/engineering/repository-structure.md`.

## Phase 7: Vertical Slice Development

Prefer vertical slices over isolated UI-only or backend-only work.

Recommended order:

1. scenario matrix
2. dataset version records
3. annotation/QC records
4. perception training records
5. perception evaluation and Badcases
6. 2D simulation environment
7. RL training records
8. generalization evaluation
9. report export
10. V3 backlog view
11. simulated sensor and dynamic obstacle slice
12. ONNX/latency and Badcase recommendation slice

## Phase 8: Training And Evaluation Loop

Perception loop:

```text
dataset v1 -> train baseline -> evaluate -> classify Badcases -> fix data/labels/augmentation -> dataset v2 -> retrain -> compare
```

RL loop:

```text
environment v1 -> train PPO baseline -> evaluate train/validation/unseen scenarios -> classify failures -> adjust reward/scenario generator -> retrain -> compare
```

## Phase 9: Delivery

Delivery package must include:

- running app
- AI skill discovery notes
- PM requirements document
- PM prototype notes
- requirement decomposition
- implementation roadmap
- PRD
- architecture document
- data pipeline document
- annotation and QC rules
- model training document
- RL training document
- evaluation report
- Badcase report
- V3 backlog
- resume-ready project summary
