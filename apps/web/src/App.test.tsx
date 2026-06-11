import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import App from "./App";
import { createMockWorkbenchData } from "./test/workbench-fixtures";

describe("LawnBot AI workbench", () => {
  it("renders the cockpit summary from API data", async () => {
    render(<App initialData={createMockWorkbenchData()} />);

    expect(await screen.findByText("LawnBot AI 训练工作台")).toBeInTheDocument();
    expect(screen.getByText("Dataset 覆盖率")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("det-yolo-v2")).toBeInTheDocument();
    expect(screen.getByText("ppo-v2")).toBeInTheDocument();
  });

  it("switches workflow tabs and shows RL replay content", async () => {
    render(<App initialData={createMockWorkbenchData()} />);

    await userEvent.click(screen.getByRole("tab", { name: /RL Replay/ }));

    expect(screen.getByText("Episode Replay")).toBeInTheDocument();
    expect(screen.getByText("episode-v2-dynamic-014")).toBeInTheDocument();
    expect(screen.getByLabelText("RL episode replay map")).toBeInTheDocument();
    expect(screen.getByText("near-miss")).toBeInTheDocument();
  });

  it("loads API data when no initial data is provided", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      const data = createMockWorkbenchData();
      const route = url.replace("http://127.0.0.1:8000", "");
      const responses: Record<string, unknown> = {
        "/api/dashboard/summary": data.dashboard,
        "/api/scenarios/coverage": data.scenarioCoverage,
        "/api/datasets": data.datasets,
        "/api/annotation-tasks": data.annotationTasks,
        "/api/label-schemas/current": data.labelSchema,
        "/api/training-runs": data.trainingRuns,
        "/api/models": data.models,
        "/api/evaluations": data.evaluations,
        "/api/rl/environments": data.rlEnvironments,
        "/api/rl/policies": data.rlPolicies,
        "/api/rl/baselines": data.rlBaselines,
        "/api/rl/episodes/episode-v2-dynamic-014": data.rlEpisode,
        "/api/rl/evaluations": data.rlEvaluations,
        "/api/policy-comparisons": data.policyComparisons,
        "/api/badcases": data.badcases,
        "/api/reports/project-summary": data.report,
        "/api/backlog/v3": data.v3Backlog,
        "/api/backlog/v3/promotion-plan": data.v3PromotionPlan
      };
      return Promise.resolve({ ok: true, json: async () => responses[route] });
    });

    render(<App fetcher={fetchMock} apiBaseUrl="http://127.0.0.1:8000" />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(await screen.findByText("LawnBot AI 训练工作台")).toBeInTheDocument();
    expect(screen.getByText("Badcase 决策")).toBeInTheDocument();
  });
});
