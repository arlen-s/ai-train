import type { CockpitData } from "./cockpitData";

export function SensorStack({ cockpit }: { cockpit: CockpitData }) {
  return (
    <section className="sensor-stack">
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
    </section>
  );
}
