import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IndustrialCockpit } from "./IndustrialCockpit";
import { createMockWorkbenchData } from "../../test/workbench-fixtures";

describe("IndustrialCockpit", () => {
  it("renders an industrial robotics cockpit around a real 3D viewport", () => {
    render(<IndustrialCockpit data={createMockWorkbenchData()} isWorkbenchOpen={false} onWorkbenchToggle={() => undefined} />);

    expect(screen.getByText("LawnBrain")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "打开详细工作台" })).toBeInTheDocument();
    expect(screen.getByLabelText("One-screen cockpit frame")).toBeInTheDocument();
    expect(screen.getByText("V2 Simulation Pipeline")).toBeInTheDocument();
    expect(screen.getByText("ROS 2 reserved for V3")).toBeInTheDocument();
    expect(screen.getByText("Scenario Generalization")).toBeInTheDocument();
    expect(screen.getByLabelText("Three.js simulation viewport")).toBeInTheDocument();
    expect(screen.getByLabelText("Viewport sensor rail")).toBeInTheDocument();
    expect(screen.getByLabelText("Viewport telemetry strip")).toBeInTheDocument();
    expect(screen.getByText("Scenario Summary")).toBeInTheDocument();
    expect(screen.getByText("Fleet & Deployment")).toBeInTheDocument();
    expect(screen.getByText("Regional Adaptation")).toBeInTheDocument();
    expect(screen.getByText("Evaluation & Benchmark Suite")).toBeInTheDocument();
    expect(screen.getByText("Robot Benchmark Table")).toBeInTheDocument();
    expect(screen.getByText("Issue Queue")).toBeInTheDocument();
  });
});
