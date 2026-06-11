import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { createCockpitData } from "./cockpitData";
import { ThreeSimulationViewport } from "./ThreeSimulationViewport";
import { createMockWorkbenchData } from "../../test/workbench-fixtures";

const originalWebGLRenderingContext = window.WebGLRenderingContext;
const originalGetContext = HTMLCanvasElement.prototype.getContext;

describe("ThreeSimulationViewport", () => {
  afterEach(() => {
    Object.defineProperty(window, "WebGLRenderingContext", {
      configurable: true,
      value: originalWebGLRenderingContext
    });
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it("keeps the cockpit visible when WebGL context creation fails", async () => {
    Object.defineProperty(window, "WebGLRenderingContext", {
      configurable: true,
      value: function WebGLRenderingContext() {}
    });
    HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

    render(<ThreeSimulationViewport cockpit={createCockpitData(createMockWorkbenchData())} />);

    expect(screen.getByLabelText("Three.js simulation viewport")).toBeInTheDocument();
    expect(await screen.findByText(/WebGL unavailable/)).toBeInTheDocument();
  });

  it("exposes high-fidelity industrial render layers around the WebGL scene", () => {
    render(<ThreeSimulationViewport cockpit={createCockpitData(createMockWorkbenchData())} />);

    expect(screen.getByText("Physical Scene")).toBeInTheDocument();
    expect(screen.getByText("raycast LiDAR")).toBeInTheDocument();
    expect(screen.getByText("terrain mesh")).toBeInTheDocument();
    expect(screen.getByText("dynamic actors")).toBeInTheDocument();
    expect(screen.getByText("3D Simulation Viewport")).toBeInTheDocument();
    expect(screen.getByText("Follow Robot")).toBeInTheDocument();
    expect(screen.getByText("4 Views")).toBeInTheDocument();
    expect(screen.getByText("Costmap Overlay")).toBeInTheDocument();
    expect(screen.getByText("Route Replay")).toBeInTheDocument();
    expect(screen.getByLabelText("Viewport sensor rail")).toBeInTheDocument();
    expect(screen.getByLabelText("Viewport telemetry strip")).toBeInTheDocument();
    expect(screen.getByText("RGB Camera")).toBeInTheDocument();
    expect(screen.getByText("Depth Range")).toBeInTheDocument();
    expect(screen.getByText("Semantic Mask")).toBeInTheDocument();
    expect(screen.getByText("Ultrasonic")).toBeInTheDocument();
  });
});
