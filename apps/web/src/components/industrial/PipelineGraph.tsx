import { BrainCircuit, Cpu, Map, Network, Radar, Route, Satellite, Workflow } from "lucide-react";

const nodes = [
  { label: "Sensor Replay", detail: "Sim LiDAR · 100 Hz", icon: Radar },
  { label: "Perception Model", detail: "YOLO/Seg · 18.4 ms", icon: BrainCircuit },
  { label: "Sensor Overlay", detail: "V2 modalities · 9.7 ms", icon: Network },
  { label: "Costmap", detail: "Visible + Inflation · 4.2 ms", icon: Map },
  { label: "Planner", detail: "Rule baseline · 14.8 ms", icon: Route },
  { label: "RL Policy", detail: "Terrain Adaptation · 7.3 ms", icon: Cpu },
  { label: "Controller", detail: "Trajectory Tracking · 3.2 ms", icon: Workflow },
  { label: "Simulator Bridge", detail: "V2 Grid Adapter · 2.8 ms", icon: Satellite }
];

export function PipelineGraph() {
  return (
    <aside aria-label="V2 simulation pipeline" className="industrial-panel pipeline-panel">
      <div className="industrial-panel-title">
        <span>V2 Simulation Pipeline</span>
        <small>ROS 2 reserved for V3</small>
      </div>
      <div className="pipeline-nodes">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <article className="pipeline-node" key={node.label}>
              <Icon size={15} />
              <div>
                <strong>{node.label}</strong>
                <span>{node.detail}</span>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
