import { RotateCcw, SlidersHorizontal } from "lucide-react";

import type { CockpitData } from "./cockpitData";

export function ScenarioGeneralization({ cockpit }: { cockpit: CockpitData }) {
  return (
    <section className="industrial-panel scenario-generalization">
      <div className="industrial-panel-title">
        <span>Scenario Generalization</span>
        <small>seeded simulation controls</small>
      </div>
      <div className="scenario-control-grid">
        {cockpit.scenarioParameters.map((parameter) => (
          <label className={`scenario-control ${parameter.tone ?? "neutral"}`} key={parameter.label}>
            <span>{parameter.label}</span>
            <strong>{parameter.value}</strong>
            {parameter.detail ? <small>{parameter.detail}</small> : null}
          </label>
        ))}
        <button className="randomize-button" type="button">
          <RotateCcw size={14} />
          Randomize
        </button>
        <button className="randomize-button compact" type="button">
          <SlidersHorizontal size={14} />
        </button>
      </div>
    </section>
  );
}
