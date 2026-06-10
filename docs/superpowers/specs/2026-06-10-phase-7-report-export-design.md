# Phase 7 Report Export Design

Date: 2026-06-10

## Objective

Implement the V2 report export slice so the project can produce a portfolio-ready summary of the full AI/DataOps and robotics training loop. The report must connect the JD mapping, scenario and Dataset governance, annotation/QC, perception results, RL training, generalization evaluation, Badcases, limitations, and V3 plan.

## Scope

In scope:

- structured project summary report API
- Markdown export API
- source version tracking in the report
- verification command list in the report
- Chinese-first UI section for report export

Out of scope:

- PDF rendering
- Word/Google Docs export
- uploading reports to cloud storage
- long-form generated narrative beyond deterministic portfolio content

## Architecture

`apps/api/app/services/reports.py` assembles deterministic report content from existing seed records and service outputs. It does not run training or evaluation jobs. The API returns both structured sections and Markdown export content so future UI/report generators can reuse the same source.

## API Contract

- `GET /api/reports/project-summary`
- `POST /api/reports/export`

The export endpoint accepts `{ "format": "markdown" }` and returns an artifact path plus Markdown content.

## Testing

API tests verify:

- project summary contains required portfolio sections
- source versions include Dataset, perception model, RL policy, and evaluation ids
- Markdown export contains JD mapping, data coverage, perception, RL, Badcase, limitations, and V3 plan headings
- unsupported export formats are rejected by schema validation

## Product Impact

This phase makes the project explainable as a complete portfolio artifact instead of a collection of APIs. It supports the job requirement for documentation standards, training logs, evaluation reports, version records, and cross-functional handoff.

