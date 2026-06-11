import type { RLEpisodeReplay } from "../lib/types";

interface ReplayMapProps {
  episode: RLEpisodeReplay;
}

const SVG_WIDTH = 760;
const SVG_HEIGHT = 420;
const MAP_MARGIN = 42;

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function pointToSvg(point: number[], mapWidth: number, mapHeight: number): [number, number] {
  const usableWidth = SVG_WIDTH - MAP_MARGIN * 2;
  const usableHeight = SVG_HEIGHT - MAP_MARGIN * 2;
  const x = MAP_MARGIN + (point[0] / Math.max(mapWidth, 1)) * usableWidth;
  const y = MAP_MARGIN + (point[1] / Math.max(mapHeight, 1)) * usableHeight;
  return [x, y];
}

function lidarRay(robot: [number, number], index: number, total: number, distance: number): string {
  const angle = (-130 + (260 / Math.max(total - 1, 1)) * index) * (Math.PI / 180);
  const length = 18 + distance * 15;
  const x2 = robot[0] + Math.cos(angle) * length;
  const y2 = robot[1] + Math.sin(angle) * length;
  return `${robot[0]},${robot[1]} ${x2},${y2}`;
}

export function ReplayMap({ episode }: ReplayMapProps) {
  const lastFrame = episode.frames[episode.frames.length - 1];
  const robotPoint = lastFrame?.robot_position ?? episode.path[episode.path.length - 1] ?? [0, 0];
  const robotSvg = pointToSvg(robotPoint, episode.map.width, episode.map.height);
  const pathPoints = episode.path
    .map((point) => pointToSvg(point, episode.map.width, episode.map.height).join(","))
    .join(" ");
  const events = unique([...episode.event_markers, ...episode.frames.map((frame) => frame.event)]);
  const lidar = lastFrame?.lidar ?? [];

  return (
    <div className="replay-map-shell">
      <svg
        aria-label="RL episode replay map"
        className="replay-map"
        role="img"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      >
        <rect className="replay-lawn" x="24" y="24" width="712" height="372" rx="8" />
        <g className="replay-grid">
          {Array.from({ length: episode.map.width + 1 }, (_, index) => {
            const x = MAP_MARGIN + ((SVG_WIDTH - MAP_MARGIN * 2) / episode.map.width) * index;
            return <line key={`v-${index}`} x1={x} x2={x} y1={MAP_MARGIN} y2={SVG_HEIGHT - MAP_MARGIN} />;
          })}
          {Array.from({ length: episode.map.height + 1 }, (_, index) => {
            const y = MAP_MARGIN + ((SVG_HEIGHT - MAP_MARGIN * 2) / episode.map.height) * index;
            return <line key={`h-${index}`} x1={MAP_MARGIN} x2={SVG_WIDTH - MAP_MARGIN} y1={y} y2={y} />;
          })}
        </g>
        <rect className="replay-forbidden" x="568" y="83" width="90" height="72" rx="6" />
        <rect className="replay-obstacle" x="130" y="270" width="46" height="34" rx="8" />
        <rect className="replay-obstacle" x="478" y="226" width="58" height="42" rx="8" />
        <polyline className="replay-path-shadow" points={pathPoints} />
        <polyline className="replay-path" points={pathPoints} />
        {episode.path.map((point, index) => {
          const [cx, cy] = pointToSvg(point, episode.map.width, episode.map.height);
          return <circle className="replay-path-node" key={`${point.join("-")}-${index}`} cx={cx} cy={cy} r="5" />;
        })}
        <g className="replay-lidar">
          {lidar.map((distance, index) => (
            <polyline key={`ray-${index}`} points={lidarRay(robotSvg, index, lidar.length, distance)} />
          ))}
        </g>
        {episode.dynamic_actors.map((actor, actorIndex) => {
          const actorPath = actor.trajectory
            .map((point) => pointToSvg(point, episode.map.width, episode.map.height).join(","))
            .join(" ");
          const [cx, cy] = pointToSvg(
            actor.trajectory[actor.trajectory.length - 1],
            episode.map.width,
            episode.map.height
          );
          return (
            <g className={`replay-actor replay-actor-${actorIndex}`} key={actor.actor_id}>
              <polyline points={actorPath} />
              <circle cx={cx} cy={cy} r="13" />
              <text x={cx + 18} y={cy + 5}>
                {actor.actor_type}
              </text>
            </g>
          );
        })}
        <g className="replay-robot">
          <circle cx={robotSvg[0]} cy={robotSvg[1]} r="17" />
          <path d={`M ${robotSvg[0] - 8} ${robotSvg[1] + 7} L ${robotSvg[0]} ${robotSvg[1] - 10} L ${robotSvg[0] + 8} ${robotSvg[1] + 7} Z`} />
        </g>
        <g className="replay-event">
          <circle cx={robotSvg[0] + 34} cy={robotSvg[1] - 24} r="8" />
          <text x={robotSvg[0] + 48} y={robotSvg[1] - 19}>
            event {lastFrame?.event ?? "none"}
          </text>
        </g>
      </svg>
      <div className="replay-map-meta">
        <span>Map {episode.map.width}x{episode.map.height}</span>
        <span>LiDAR rays: {lidar.length}</span>
        <span>Ultrasonic: {(lastFrame?.ultrasonic ?? []).join(" / ")}</span>
        <span>Actors: {episode.dynamic_actors.length}</span>
      </div>
      <div className="event-row" aria-label="Replay event markers">
        {events.map((event) => (
          <span className="event-chip" key={event}>
            {event}
          </span>
        ))}
      </div>
    </div>
  );
}
