# Phase 0/1 Product Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the project foundation artifacts required before engineering implementation: PM requirements, requirement decomposition, prototype wireframes, roadmap, and execution handoff rules.

**Architecture:** This phase is documentation-first. Product requirements live under `docs/product`, engineering handoff documents live under `docs/engineering`, and the PM prototype is a static HTML artifact under `docs/product/prototypes` that can be opened locally without a dev server.

**Tech Stack:** Markdown, static HTML, CSS, local file verification with `rg` and shell checks.

---

## File Structure

- Modify: `AGENTS.md`
  - Add references to requirement decomposition, prototype artifact, and roadmap.
- Modify: `docs/product/prd.md`
  - Ensure PM requirements are the source of truth before prototype work.
- Create: `docs/product/requirement-decomposition.md`
  - Break the PM requirements into modules, pages, entities, APIs, acceptance criteria, tests, and V1/V2/V3 classification.
- Create: `docs/product/prototypes/pm-wireframes.html`
  - Provide a complete PM-facing static prototype covering the required V1 screens and V2 reservation points.
- Create: `docs/engineering/implementation-roadmap.md`
  - Define execution phases from product foundation to app skeleton, data pipeline, perception, RL, evaluation, and delivery.
- Create: `docs/engineering/ai-skill-discovery.md`
  - Document preferred use of the Vercel Labs `skills` main repository, the `find-skills` skill, and fallback behavior when it is not installed locally.
- Modify: `docs/engineering/development-workflow.md`
  - Link the new decomposition and roadmap artifacts into the official process.
- Modify: `docs/engineering/delivery-checklist.md`
  - Add checks for requirement decomposition, prototype artifact, and implementation roadmap.

---

### Task 1: Add Requirement Decomposition

**Files:**
- Create: `docs/product/requirement-decomposition.md`

- [ ] **Step 1: Create the requirement decomposition document**

Add a Markdown document with these sections:

```markdown
# Requirement Decomposition

## Purpose

This document decomposes the PM requirements into implementation-ready product, data, model, RL, evaluation, and documentation work.

## Decomposition Rules

Each requirement must include:

- source capability
- target page or module
- user story
- data entities
- API needs
- acceptance criteria
- test plan
- scope classification

## V1 Modules

### RQ-001 Overview Dashboard

Source capability: documentation, cross-team visibility, model evaluation.

Target page: Overview Dashboard.

User story: As a PM or reviewer, I can see whether the project has enough data coverage, model progress, RL progress, and unresolved Badcases.

Data entities:

- DatasetVersion
- TrainingRun
- ModelVersion
- RLPolicyVersion
- EvaluationReport
- Badcase

API needs:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends`

Acceptance criteria:

- Shows dataset coverage summary.
- Shows latest perception model metrics.
- Shows latest RL policy metrics.
- Shows Badcase severity counts.
- Links to weak scenarios, model evaluation, RL evaluation, and Badcase library.

Test plan:

- API test verifies summary response contains dataset, perception, RL, and Badcase sections.
- UI workflow check verifies dashboard links navigate to the correct screens.

Scope: V1.
```

- [ ] **Step 2: Verify the document exists**

Run: `test -f docs/product/requirement-decomposition.md`

Expected: exit code 0.

---

### Task 2: Add PM Static Prototype

**Files:**
- Create: `docs/product/prototypes/pm-wireframes.html`

- [ ] **Step 1: Create the static prototype**

Add a complete static HTML page with:

- left navigation
- top project status bar
- overview dashboard
- scenario matrix preview
- dataset version preview
- annotation/QC preview
- perception training preview
- RL training preview
- evaluation preview
- Badcase library preview
- V2 backlog preview

The page must be self-contained and open directly in a browser.

- [ ] **Step 2: Verify key screens are present**

Run:

```bash
rg -n "Overview|Scenario Matrix|Dataset Versions|Annotation QC|Perception Training|RL Training|Generalization Evaluation|Badcase Library|V2 Backlog" docs/product/prototypes/pm-wireframes.html
```

Expected: all screen labels are found.

---

### Task 3: Add Implementation Roadmap

**Files:**
- Create: `docs/engineering/implementation-roadmap.md`

- [ ] **Step 1: Create the roadmap**

Add a Markdown roadmap with these phases:

1. Product foundation
2. App skeleton and data model
3. Dataset governance
4. Annotation and QC
5. Perception training records and evaluation
6. RL environment and PPO training
7. Generalization evaluation and Badcase loop
8. Report export and delivery package
9. V2 promotion planning

- [ ] **Step 2: Verify roadmap phases**

Run:

```bash
rg -n "Product foundation|App skeleton|Dataset governance|Annotation|Perception|RL environment|Generalization|Report export|V2 promotion" docs/engineering/implementation-roadmap.md
```

Expected: all phase keywords are found.

---

### Task 4: Update Agent And Workflow Entry Points

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/engineering/development-workflow.md`
- Modify: `docs/engineering/delivery-checklist.md`

- [ ] **Step 1: Update `AGENTS.md` reading order**

Add:

```markdown
4. `docs/product/requirement-decomposition.md`
5. `docs/product/prototype-notes.md`
6. `docs/product/v2-backlog.md`
7. `docs/engineering/development-workflow.md`
8. `docs/engineering/implementation-roadmap.md`
9. `docs/engineering/architecture.md`
10. `docs/engineering/testing-strategy.md`
```

- [ ] **Step 2: Update development workflow**

Add `requirement decomposition document` and `implementation roadmap` as named artifacts in the official process.

- [ ] **Step 3: Update delivery checklist**

Add checks for:

- requirement decomposition is current
- static PM prototype exists
- implementation roadmap is current

- [ ] **Step 4: Verify references**

Run:

```bash
rg -n "requirement-decomposition|implementation-roadmap|pm-wireframes" AGENTS.md docs
```

Expected: references exist in the entry point and workflow/delivery documents.

---

### Task 5: Final Documentation Verification

**Files:**
- Verify: `AGENTS.md`
- Verify: `docs/product/*.md`
- Verify: `docs/engineering/*.md`
- Verify: `docs/product/prototypes/pm-wireframes.html`

- [ ] **Step 1: Check for unresolved markers**

Run:

```bash
rg -n "REPLACE_[M]E|FILL_[M]E|UNRESOLVED_[M]ARKER" AGENTS.md docs
```

Expected: no output.

- [ ] **Step 2: List created artifacts**

Run:

```bash
rg --files AGENTS.md docs
```

Expected: includes the new plan, decomposition, prototype, and roadmap files.

- [ ] **Step 3: Confirm static prototype can be opened**

Run:

```bash
test -f docs/product/prototypes/pm-wireframes.html
```

Expected: exit code 0.

---

## Self-Review

Spec coverage:

- PM requirements before prototype: covered by Tasks 1, 2, and 4.
- Requirement decomposition: covered by Task 1.
- PM prototype artifact: covered by Task 2.
- Technical execution roadmap: covered by Task 3.
- AI handoff entry points: covered by Task 4.
- Verification: covered by Task 5.

Unresolved marker scan:

- This plan avoids unresolved marker strings.

Type and naming consistency:

- The requirement decomposition path is `docs/product/requirement-decomposition.md`.
- The prototype path is `docs/product/prototypes/pm-wireframes.html`.
- The roadmap path is `docs/engineering/implementation-roadmap.md`.
