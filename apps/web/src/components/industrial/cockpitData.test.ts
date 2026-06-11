import { describe, expect, it } from "vitest";

import { createCockpitData } from "./cockpitData";
import { createMockWorkbenchData } from "../../test/workbench-fixtures";

describe("createCockpitData", () => {
  it("maps workbench data into cockpit controls, metrics, actors, and issues", () => {
    const data = createCockpitData(createMockWorkbenchData());

    expect(data.controls.project).toBe("Greenfields Campus");
    expect(data.controls.scenario).toContain("dynamic");
    expect(data.robot.id).toBe("R-017");
    expect(data.robot.policyId).toBe("ppo-v2");
    expect(data.scene.path).toHaveLength(6);
    expect(data.scene.dynamicActors).toHaveLength(2);
    expect(data.sensors.lidarRayCount).toBe(8);
    expect(data.scenarioParameters).toHaveLength(9);
    expect(data.scenarioSummary.coverage.value).toBe("82%");
    expect(data.regionalAdaptation).toHaveLength(4);
    expect(data.benchmarkRows).toHaveLength(4);
    expect(data.benchmarks.some((metric) => metric.label === "Coverage Completeness")).toBe(true);
    expect(data.issues[0].severity).toBe("high");
  });
});
