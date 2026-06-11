import type { WorkbenchData } from "../../lib/types";

export interface CockpitMetric {
  label: string;
  value: string;
  delta: string;
  tone: "ok" | "warn" | "risk" | "neutral";
}

export interface CockpitParameter {
  label: string;
  value: string;
  detail?: string;
  tone?: "ok" | "warn" | "risk" | "neutral";
}

export interface CockpitData {
  controls: {
    project: string;
    scenario: string;
    mode: string;
    simTime: string;
    realtimeFactor: string;
    scope: string;
  };
  robot: {
    id: string;
    policyId: string;
    modelId: string;
    battery: number;
    speed: string;
    status: string;
  };
  scene: {
    mapWidth: number;
    mapHeight: number;
    path: number[][];
    dynamicActors: Array<{ actor_id: string; actor_type: string; trajectory: number[][] }>;
    events: string[];
  };
  sensors: {
    lidarRayCount: number;
    ultrasonic: number[];
    modalities: string[];
  };
  scenarioParameters: CockpitParameter[];
  scenarioSummary: {
    coverage: CockpitMetric;
    traversability: CockpitMetric;
    difficulty: CockpitMetric;
  };
  benchmarks: CockpitMetric[];
  benchmarkRows: Array<{
    robotId: string;
    distanceKm: string;
    coverage: string;
    collisionRate: string;
    stuckRate: string;
    avgResponse: string;
    safetyScore: string;
    uptime: string;
  }>;
  fleet: Array<{ id: string; status: string; health: number; battery: number; ota: string }>;
  regionalAdaptation: Array<{ region: string; score: number }>;
  issues: Array<{ id: string; category: string; severity: string; owner: string; status: string }>;
}

function percent(value: number | undefined): string {
  return `${Math.round((value ?? 0) * 100)}%`;
}

function fixed(value: number | undefined, digits = 2): string {
  return (value ?? 0).toFixed(digits);
}

export function createCockpitData(data: WorkbenchData): CockpitData {
  const frame = data.rlEpisode.frames[data.rlEpisode.frames.length - 1];
  const rlEvaluation = data.rlEvaluations[0];
  const comparison = data.policyComparisons[0];
  const ppoEntry = comparison?.entries.find((entry) => entry.policy_or_baseline_id === data.dashboard.rl.policy_id);
  const baselineEntry = comparison?.entries.find((entry) => entry.policy_or_baseline_id === "rule-coverage-planner");
  const improvement =
    ppoEntry && baselineEntry
      ? `+${Math.round(((ppoEntry.metrics.coverage_rate ?? 0) - (baselineEntry.metrics.coverage_rate ?? 0)) * 100)}%`
      : "+0%";

  return {
    controls: {
      project: "Greenfields Campus",
      scenario: data.rlEpisode.scenario_id,
      mode: "Simulation",
      simTime: "02:14:36",
      realtimeFactor: "1.00x",
      scope: `${data.dashboard.target_version} / ${data.dashboard.architecture_mode}`
    },
    robot: {
      id: "R-017",
      policyId: data.dashboard.rl.policy_id,
      modelId: data.dashboard.perception.model_id,
      battery: 78,
      speed: "0.82 m/s",
      status: "Active"
    },
    scene: {
      mapWidth: data.rlEpisode.map.width,
      mapHeight: data.rlEpisode.map.height,
      path: data.rlEpisode.path,
      dynamicActors: data.rlEpisode.dynamic_actors,
      events: [...new Set([...data.rlEpisode.event_markers, ...data.rlEpisode.frames.map((item) => item.event)])]
    },
    sensors: {
      lidarRayCount: frame?.lidar.length ?? 0,
      ultrasonic: frame?.ultrasonic ?? [],
      modalities: data.rlEnvironments[0]?.sensor_modalities ?? []
    },
    scenarioParameters: [
      { label: "Season", value: "Summer", tone: "ok" },
      { label: "Weather", value: "Light Rain", detail: "wet grass", tone: "warn" },
      { label: "Terrain", value: "Mixed", detail: "flat + slope" },
      { label: "Grass Type", value: "Bermuda" },
      { label: "Grass Height", value: "6.2 cm", detail: "2.0-12.0" },
      { label: "Slope Range", value: "0-28 deg", detail: "max 45" },
      { label: "Obstacle Density", value: "Medium" },
      { label: "Boundary Complexity", value: "High", tone: "warn" },
      { label: "Domain Randomization", value: "78%", detail: "seed 482734", tone: "ok" }
    ],
    scenarioSummary: {
      coverage: { label: "Coverage est.", value: percent(data.dashboard.rl.coverage_rate), delta: "+4.2%", tone: "ok" },
      traversability: { label: "Traversability", value: "81%", delta: "+1.8%", tone: "ok" },
      difficulty: { label: "Difficulty Score", value: "0.71", delta: "+0.09", tone: "warn" }
    },
    benchmarks: [
      { label: "Coverage Completeness", value: percent(data.dashboard.rl.coverage_rate), delta: improvement, tone: "ok" },
      {
        label: "Obstacle Response",
        value: `${fixed((data.dashboard.rl.dynamic_obstacle_response_ms ?? 0) / 1000, 2)}s`,
        delta: "-0.08s",
        tone: "ok"
      },
      { label: "Collision Rate", value: fixed(rlEvaluation?.metrics.collision_rate ?? 0.012, 3), delta: "-0.006", tone: "ok" },
      { label: "Stuck Rate", value: "0.38/hr", delta: "-0.15", tone: "warn" },
      { label: "Safety Score", value: "92", delta: "+3", tone: "ok" },
      { label: "Sim-to-Real Gap", value: "9.4%", delta: "V3", tone: "neutral" }
    ],
    benchmarkRows: [
      { robotId: "R-017", distanceKm: "23.6", coverage: "76.8%", collisionRate: "0.012", stuckRate: "0.38", avgResponse: "0.42", safetyScore: "92", uptime: "98.1%" },
      { robotId: "R-015", distanceKm: "21.1", coverage: "74.2%", collisionRate: "0.018", stuckRate: "0.45", avgResponse: "0.47", safetyScore: "90", uptime: "97.3%" },
      { robotId: "R-003", distanceKm: "20.4", coverage: "72.9%", collisionRate: "0.015", stuckRate: "0.40", avgResponse: "0.43", safetyScore: "91", uptime: "97.8%" },
      { robotId: "R-014", distanceKm: "19.7", coverage: "71.3%", collisionRate: "0.021", stuckRate: "0.52", avgResponse: "0.51", safetyScore: "88", uptime: "96.5%" }
    ],
    fleet: [
      { id: "R-017", status: "Active", health: 92, battery: 78, ota: "Rolling Out" },
      { id: "R-015", status: "Active", health: 89, battery: 64, ota: "Up to date" },
      { id: "R-003", status: "Idle", health: 95, battery: 95, ota: "Up to date" },
      { id: "R-008", status: "Maintenance", health: 61, battery: 22, ota: "Failed" }
    ],
    regionalAdaptation: [
      { region: "North America", score: 94 },
      { region: "Europe", score: 89 },
      { region: "Japan", score: 91 },
      { region: "Southeast Asia", score: 83 }
    ],
    issues: data.badcases.map((badcase) => ({
      id: badcase.id,
      category: badcase.category,
      severity: badcase.severity,
      owner: badcase.owner,
      status: badcase.status
    }))
  };
}
