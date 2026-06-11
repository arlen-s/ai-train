import type { ReportExportResult, WorkbenchData } from "./types";

export type Fetcher = (input: string, init?: RequestInit) => Promise<{
  ok: boolean;
  status?: number;
  statusText?: string;
  json: () => Promise<unknown>;
}>;

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchJson<T>(
  path: string,
  fetcher: Fetcher = fetch as unknown as Fetcher,
  apiBaseUrl = DEFAULT_API_BASE_URL
): Promise<T> {
  const url = `${apiBaseUrl}${path}`;
  const response = await fetcher(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status ?? "unknown"} ${response.statusText ?? "Unknown Error"}`);
  }
  return response.json() as Promise<T>;
}

export async function loadWorkbenchData(
  fetcher: Fetcher = fetch as unknown as Fetcher,
  apiBaseUrl = DEFAULT_API_BASE_URL
): Promise<WorkbenchData> {
  const [
    dashboard,
    scenarioCoverage,
    datasets,
    annotationTasks,
    labelSchema,
    trainingRuns,
    models,
    evaluations,
    rlEnvironments,
    rlPolicies,
    rlBaselines,
    rlEpisode,
    rlEvaluations,
    policyComparisons,
    badcases,
    report,
    v3Backlog,
    v3PromotionPlan
  ] = await Promise.all([
    fetchJson<WorkbenchData["dashboard"]>("/api/dashboard/summary", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["scenarioCoverage"]>("/api/scenarios/coverage", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["datasets"]>("/api/datasets", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["annotationTasks"]>("/api/annotation-tasks", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["labelSchema"]>("/api/label-schemas/current", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["trainingRuns"]>("/api/training-runs", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["models"]>("/api/models", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["evaluations"]>("/api/evaluations", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["rlEnvironments"]>("/api/rl/environments", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["rlPolicies"]>("/api/rl/policies", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["rlBaselines"]>("/api/rl/baselines", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["rlEpisode"]>("/api/rl/episodes/episode-v2-dynamic-014", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["rlEvaluations"]>("/api/rl/evaluations", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["policyComparisons"]>("/api/policy-comparisons", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["badcases"]>("/api/badcases", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["report"]>("/api/reports/project-summary", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["v3Backlog"]>("/api/backlog/v3", fetcher, apiBaseUrl),
    fetchJson<WorkbenchData["v3PromotionPlan"]>("/api/backlog/v3/promotion-plan", fetcher, apiBaseUrl)
  ]);

  return {
    dashboard,
    scenarioCoverage,
    datasets,
    annotationTasks,
    labelSchema,
    trainingRuns,
    models,
    evaluations,
    rlEnvironments,
    rlPolicies,
    rlBaselines,
    rlEpisode,
    rlEvaluations,
    policyComparisons,
    badcases,
    report,
    v3Backlog,
    v3PromotionPlan
  };
}

export async function exportReportMarkdown(
  fetcher: Fetcher = fetch as unknown as Fetcher,
  apiBaseUrl = DEFAULT_API_BASE_URL
): Promise<ReportExportResult> {
  const response = await fetcher(`${apiBaseUrl}/api/reports/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format: "markdown" })
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status ?? "unknown"} ${response.statusText ?? "Unknown Error"}`);
  }
  return response.json() as Promise<ReportExportResult>;
}
