import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReplayMap } from "./ReplayMap";
import { createMockWorkbenchData } from "../test/workbench-fixtures";

describe("ReplayMap", () => {
  it("renders path, dynamic actors, sensor rays, and event markers", () => {
    render(<ReplayMap episode={createMockWorkbenchData().rlEpisode} />);

    expect(screen.getByLabelText("RL episode replay map")).toBeInTheDocument();
    expect(screen.getByText("pet")).toBeInTheDocument();
    expect(screen.getByText("person")).toBeInTheDocument();
    expect(screen.getByText("near-miss")).toBeInTheDocument();
    expect(screen.getByText("LiDAR rays: 8")).toBeInTheDocument();
  });
});
