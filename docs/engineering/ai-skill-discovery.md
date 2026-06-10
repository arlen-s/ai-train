# AI Skill Discovery

## Purpose

This project should be developed by AI agents that first discover the right skills, tools, and project documents before writing code.

`find-skills` refers to a skill in the Vercel Labs skills repository.

Primary repository:

- `https://github.com/vercel-labs/skills/tree/main`

Specific skill file:

- `https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md`

It is an installable skill that uses the Skills CLI to search for and add relevant skills.

Installation status on 2026-06-09: `find-skills` was installed to `/Users/mac/.codex/skills/find-skills`.

Restart Codex after installation so the new skill is picked up in future sessions.

## Discovery Gate

Before implementation, an AI agent must check:

1. Applicable project instructions in `AGENTS.md`.
2. Relevant product and engineering documents under `docs/`.
3. Whether the `find-skills` skill is available in the current session. If it was installed after the session started, restart Codex before relying on automatic skill activation.
4. Available local skills from the active agent environment.
5. Available tool discovery mechanisms such as `tool_search` when tools are not listed upfront.
6. Domain-specific skills when the task involves GitHub, Figma, spreadsheets, presentations, documents, Lark, OpenAI docs, debugging, TDD, planning, or verification.

## Preferred `find-skills` Flow

When the Skills CLI is available, use `find` to search interactively or by keyword:

```bash
npx skills find
npx skills find "<task description>"
```

Use the result to identify candidate skills. Before recommending or installing a skill, inspect its README or `SKILL.md` and verify that it is relevant, maintained enough for the task, and does not conflict with this project's workflow.

## Skills CLI Usage

The Vercel Labs skills repository documents these primary commands.

Install a skill repository:

```bash
npx skills add vercel-labs/skills
```

List available skills in a repository without installing:

```bash
npx skills add vercel-labs/skills --list
```

Install a specific skill:

```bash
npx skills add vercel-labs/skills --skill find-skills
```

Install to Codex:

```bash
npx skills add vercel-labs/skills --skill find-skills --agent codex
```

Install globally:

```bash
npx skills add vercel-labs/skills --skill find-skills --agent codex --global
```

Use a skill without installing:

```bash
npx skills use vercel-labs/skills --skill find-skills
```

List installed skills:

```bash
npx skills list
```

Update installed skills:

```bash
npx skills update
```

Remove installed skills:

```bash
npx skills remove find-skills
```

Project-local installation is the default. For Codex, the documented project path is `.agents/skills/` and the global path is `~/.codex/skills/`.

## Install Approval

Installing a skill may require network access and writes files into the project or global skill directory. Ask for user approval before running `npx skills add`.

If the user approves adding `find-skills`, use:

```bash
npx skills add vercel-labs/skills --skill find-skills
```

For project-local installation targeting Codex, use:

```bash
npx skills add vercel-labs/skills --skill find-skills --agent codex
```

## Required Questions

For every task, the agent should answer these before implementation:

- Which project requirement does this task support?
- Which documents must be read first?
- Which skill or tool applies?
- Is there a domain-specific workflow that should override generic development?
- Are there unavailable tools that require a documented fallback?

## Fallback When `find-skills` Is Unavailable In The Current Session

If a future instruction asks to use `find-skills` and the skill is installed on disk but not available in the active session:

1. Use the active environment's skill list if provided.
2. Use `tool_search` for deferred tool discovery if available.
3. Use `rg` to search project docs for existing workflow rules.
4. Record that `find-skills` is installed but the active session may need a restart to load it.
5. Continue with the closest available discovery mechanism.

## Task Routing Examples

| Task Type | Required Discovery |
|---|---|
| New feature or behavior | brainstorming, writing-plans, executing-plans or implementation workflow |
| Bug or failing test | systematic-debugging |
| Feature or bugfix implementation | test-driven-development when practical |
| Before claiming completion | verification-before-completion |
| GitHub PR, issue, CI, or publish work | GitHub plugin skills |
| Figma or prototype generation | Figma plugin skills |
| Spreadsheet artifacts | Spreadsheets plugin skills |
| Documents or Word artifacts | Documents plugin skills |
| OpenAI API or model questions | openai-docs |

## Documentation Rule

When a skill/tool changes the development process, update:

- `AGENTS.md`
- `docs/engineering/development-workflow.md`
- `docs/engineering/testing-strategy.md` if verification changes
- `docs/engineering/delivery-checklist.md` if delivery expectations change
