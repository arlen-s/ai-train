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
      <table className="benchmark-table">
        <thead>
          <tr><th>Metric</th><th>Ours</th><th>Baseline</th><th>Improvement</th></tr>
        </thead>
        <tbody>
          <tr><td>Coverage Rate</td><td>82%</td><td>74%</td><td>+8%</td></tr>
          <tr><td>Collision Rate</td><td>0.012</td><td>0.045</td><td>+73%</td></tr>
          <tr><td>Safety Score</td><td>92</td><td>84</td><td>+8</td></tr>
        </tbody>
      </table>
    </section>
  );
}
