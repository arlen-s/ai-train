import type { CockpitData } from "./cockpitData";

export function SensorDock({ cockpit, embedded = false }: { cockpit: CockpitData; embedded?: boolean }) {
  if (embedded) {
    return (
      <section aria-label="Viewport sensor rail" className="viewport-sensor-rail">
        <article className="industrial-panel sensor-panel">
          <div className="industrial-panel-title">
            <span>LiDAR</span>
            <small>{cockpit.sensors.lidarRayCount * 8}ch</small>
          </div>
          <div aria-label="LiDAR point cloud mini view" className="lidar-mini">
            {Array.from({ length: 48 }, (_, index) => (
              <i key={index} style={{ left: `${(index * 17) % 100}%`, top: `${18 + ((index * 23) % 70)}%` }} />
            ))}
          </div>
        </article>
        <article className="industrial-panel telemetry-panel">
          <div className="industrial-panel-title">
            <span>Telemetry</span>
            <small>IMU / GNSS</small>
          </div>
          <dl>
            <div><dt>x</dt><dd>12.45</dd></div>
            <div><dt>y</dt><dd>-3.21</dd></div>
            <div><dt>yaw</dt><dd>91.7 deg</dd></div>
            <div><dt>speed</dt><dd>{cockpit.robot.speed}</dd></div>
            <div><dt>battery</dt><dd>{cockpit.robot.battery}%</dd></div>
            <div><dt>link</dt><dd>Excellent</dd></div>
          </dl>
        </article>
        <article className="industrial-panel sensor-panel occupancy-panel">
          <div className="industrial-panel-title">
            <span>Occupancy Grid</span>
            <small>local costmap</small>
          </div>
          <div aria-label="Occupancy grid mini view" className="occupancy-mini">
            <span className="occupancy-robot" />
          </div>
        </article>
      </section>
    );
  }

  return (
    <section aria-label="Sensor stack" className="sensor-stack">
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>LiDAR</span>
          <small>{cockpit.sensors.lidarRayCount * 8}ch</small>
        </div>
        <div aria-label="LiDAR point cloud mini view" className="lidar-mini">
          {Array.from({ length: 64 }, (_, index) => (
            <i key={index} style={{ left: `${(index * 17) % 100}%`, top: `${18 + ((index * 23) % 70)}%` }} />
          ))}
        </div>
      </article>
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>Depth</span>
          <small>simulated</small>
        </div>
        <div aria-label="Depth mini view" className="depth-mini" />
      </article>
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>Semantic Segmentation</span>
          <small>lawn / obstacle</small>
        </div>
        <div aria-label="Semantic segmentation mini view" className="segmentation-mini" />
      </article>
      <article className="industrial-panel telemetry-panel">
        <div className="industrial-panel-title">
          <span>Telemetry</span>
          <small>IMU / GNSS</small>
        </div>
        <dl>
          <div><dt>x</dt><dd>12.45</dd></div>
          <div><dt>y</dt><dd>-3.21</dd></div>
          <div><dt>yaw</dt><dd>91.7 deg</dd></div>
          <div><dt>speed</dt><dd>{cockpit.robot.speed}</dd></div>
          <div><dt>battery</dt><dd>{cockpit.robot.battery}%</dd></div>
          <div><dt>connection</dt><dd>Excellent</dd></div>
        </dl>
      </article>
      <article className="industrial-panel sensor-panel occupancy-panel">
        <div className="industrial-panel-title">
          <span>Occupancy Grid</span>
          <small>local costmap</small>
        </div>
        <div aria-label="Occupancy grid mini view" className="occupancy-mini">
          <span className="occupancy-robot" />
        </div>
      </article>
      <article className="industrial-panel sensor-panel">
        <div className="industrial-panel-title">
          <span>GNSS Trajectory</span>
          <small>R-017</small>
        </div>
        <svg aria-label="GNSS trajectory mini view" className="gnss-mini" viewBox="0 0 180 72">
          <polyline className="gnss-planned" points="8,58 28,42 50,48 76,24 104,30 132,14 166,20" />
          <polyline className="gnss-actual" points="10,63 32,48 54,51 78,31 108,36 136,21 168,26" />
          <polyline className="gnss-detected" points="6,18 36,22 64,14 96,28 126,22 170,36" />
        </svg>
      </article>
    </section>
  );
}

export function SensorStack({ cockpit }: { cockpit: CockpitData }) {
  return <SensorDock cockpit={cockpit} />;
}
