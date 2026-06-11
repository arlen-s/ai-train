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
});
