import { Bell, CircleHelp, PanelBottomOpen, Settings, UserRound } from "lucide-react";

import type { WorkbenchData } from "../../lib/types";
import { BenchmarkSuite } from "./BenchmarkSuite";
import { createCockpitData } from "./cockpitData";
import { FleetOpsPanel } from "./FleetOpsPanel";
import { PipelineGraph } from "./PipelineGraph";
import { SensorStack } from "./SensorStack";
import { ThreeSimulationViewport } from "./ThreeSimulationViewport";

export function IndustrialCockpit({
  data,
  isWorkbenchOpen,
  onWorkbenchToggle
}: {
  data: WorkbenchData;
  isWorkbenchOpen: boolean;
  onWorkbenchToggle: () => void;
}) {
  const cockpit = createCockpitData(data);

  return (
    <section aria-label="Industrial robotics cockpit" className="industrial-cockpit">
      <header className="industrial-topbar">
        <div className="industrial-brand">
          <span aria-hidden="true" className="brand-orbit" />
          <div>
            <strong>LawnBrain</strong>
            <small>Robotics OS</small>
          </div>
        </div>
        <div className="sim-controls">
          <label><span>Project</span><b>{cockpit.controls.project}</b></label>
          <label><span>Scenario</span><b>{cockpit.controls.scenario}</b></label>
          <label><span>Mode</span><b>{cockpit.controls.mode}</b></label>
          <label><span>Sim Time</span><b>{cockpit.controls.simTime}</b></label>
          <label><span>RTF</span><b>{cockpit.controls.realtimeFactor}</b></label>
          <label><span>Scope</span><b>{cockpit.controls.scope}</b></label>
        </div>
        <div className="operator-tools">
          <button
            aria-label={isWorkbenchOpen ? "收起详细工作台" : "打开详细工作台"}
            className={`cockpit-tool-button workbench-trigger ${isWorkbenchOpen ? "active" : ""}`}
            onClick={onWorkbenchToggle}
            title={isWorkbenchOpen ? "收起详细工作台" : "打开详细工作台"}
            type="button"
          >
            <PanelBottomOpen size={16} />
          </button>
          <Bell size={16} />
          <CircleHelp size={16} />
          <Settings size={16} />
          <UserRound size={18} />
        </div>
      </header>

      <div className="industrial-grid">
        <PipelineGraph />
        <main className="industrial-main">
          <ThreeSimulationViewport cockpit={cockpit} />
          <BenchmarkSuite cockpit={cockpit} />
        </main>
        <aside className="industrial-right">
          <SensorStack cockpit={cockpit} />
          <FleetOpsPanel cockpit={cockpit} />
        </aside>
      </div>
    </section>
  );
}
