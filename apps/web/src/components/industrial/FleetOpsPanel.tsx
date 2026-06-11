import type { CockpitData } from "./cockpitData";

export function FleetOpsPanel({ cockpit }: { cockpit: CockpitData }) {
  return (
    <aside className="fleet-stack">
      <section className="industrial-panel">
        <div className="industrial-panel-title">
          <span>Fleet & Deployment</span>
          <small>Health 91</small>
        </div>
        <div className="fleet-list">
          {cockpit.fleet.map((robot) => (
            <article className={`fleet-card ${robot.status.toLowerCase()}`} key={robot.id}>
              <div className="robot-thumb" aria-hidden="true">
                <i />
              </div>
              <div className="fleet-card-body">
                <strong>{robot.id}</strong>
                <span>{robot.status}</span>
                <div><b style={{ width: `${robot.health}%` }} /></div>
                <small>Health {robot.health}% · Battery {robot.battery}%</small>
              </div>
              <div className="fleet-card-meta">
                <span>OTA</span>
                <strong>{robot.ota}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="industrial-panel">
        <div className="industrial-panel-title">
          <span>Issue Queue</span>
          <small>{cockpit.issues.length}</small>
        </div>
        <div className="issue-list">
          {cockpit.issues.slice(0, 5).map((issue) => (
            <article key={issue.id}>
              <span className={`issue-dot ${issue.severity}`} />
              <strong>{issue.category}</strong>
              <small>{issue.owner} · {issue.status}</small>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
