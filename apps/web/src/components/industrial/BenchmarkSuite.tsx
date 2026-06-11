import type { CockpitData } from "./cockpitData";

export function BenchmarkSuite({ cockpit }: { cockpit: CockpitData }) {
  return (
    <section className="industrial-panel benchmark-suite">
      <div className="industrial-panel-title">
        <span>Evaluation & Benchmark Suite</span>
        <small>Ours v2.3.1 vs baseline</small>
      </div>
      <div className="benchmark-metrics">
        {cockpit.benchmarks.map((metric) => (
          <article className={`benchmark-card ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.delta}</small>
            <svg aria-hidden="true" viewBox="0 0 100 24">
              <polyline points="0,18 12,14 24,17 36,9 48,12 60,8 72,10 84,5 100,7" />
            </svg>
          </article>
        ))}
      </div>
      <div className="benchmark-analysis-grid">
        <article className="industrial-subpanel trend-panel">
          <h3>Metric Trends</h3>
          <svg aria-label="Metric trend chart" viewBox="0 0 360 112">
            <polyline className="trend coverage" points="0,48 45,43 90,44 135,39 180,36 225,33 270,31 315,27 360,25" />
            <polyline className="trend collision" points="0,73 45,70 90,68 135,66 180,61 225,59 270,56 315,51 360,49" />
            <polyline className="trend stuck" points="0,88 45,86 90,85 135,82 180,80 225,78 270,76 315,73 360,72" />
          </svg>
        </article>
        <article className="industrial-subpanel failure-panel">
          <h3>Failure Case Distribution</h3>
          <div className="failure-ring">
            <strong>Total<br />87</strong>
          </div>
          <ul>
            <li><span className="stuck" /> Stuck 39%</li>
            <li><span className="boundary" /> Boundary 23%</li>
            <li><span className="missed" /> Missed Obstacle 17%</li>
          </ul>
        </article>
        <article className="industrial-subpanel terrain-panel">
          <h3>Terrain Performance</h3>
          <div className="mini-bars">
            {["Flat", "Slope", "Wet", "Dense"].map((label, index) => (
              <span key={label}>
                <b style={{ height: `${78 - index * 11}%` }} />
                <em>{label}</em>
              </span>
            ))}
          </div>
        </article>
      </div>
      <table className="benchmark-table">
        <caption>Robot Benchmark Table</caption>
        <thead>
          <tr><th>Robot ID</th><th>Distance</th><th>Coverage</th><th>Collision</th><th>Stuck</th><th>Avg Resp.</th><th>Safety</th><th>Uptime</th></tr>
        </thead>
        <tbody>
          {cockpit.benchmarkRows.map((row) => (
            <tr key={row.robotId}>
              <td>{row.robotId}</td>
              <td>{row.distanceKm} km</td>
              <td>{row.coverage}</td>
              <td>{row.collisionRate}</td>
              <td>{row.stuckRate}</td>
              <td>{row.avgResponse}s</td>
              <td>{row.safetyScore}</td>
              <td>{row.uptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
