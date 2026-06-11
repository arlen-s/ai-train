import type { CockpitData, CockpitMetric } from "./cockpitData";

function Sparkline({ tone }: { tone: CockpitMetric["tone"] }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 26">
      <polyline
        className={tone}
        points="0,21 12,17 24,18 36,10 48,13 60,9 72,12 84,7 100,3"
      />
    </svg>
  );
}

export function ScenarioSummary({ cockpit }: { cockpit: CockpitData }) {
  const metrics = [cockpit.scenarioSummary.coverage, cockpit.scenarioSummary.traversability, cockpit.scenarioSummary.difficulty];

  return (
    <>
      <section className="industrial-panel scenario-summary-panel">
        <div className="industrial-panel-title">
          <span>Scenario Summary</span>
          <small>{cockpit.controls.scenario}</small>
        </div>
        <div className="scenario-summary-grid">
          {metrics.map((metric) => (
            <article className={`scenario-summary-card ${metric.tone}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
              <Sparkline tone={metric.tone} />
            </article>
          ))}
        </div>
      </section>
      <section className="industrial-panel regional-panel">
        <div className="industrial-panel-title">
          <span>Regional Adaptation</span>
          <small>overseas scene pack</small>
        </div>
        <div className="regional-list">
          {cockpit.regionalAdaptation.map((item) => (
            <article key={item.region}>
              <span>{item.region}</span>
              <strong>{item.score}%</strong>
              <div><b style={{ width: `${item.score}%` }} /></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
