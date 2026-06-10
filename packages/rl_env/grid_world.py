from dataclasses import dataclass, field
from typing import Dict, List, Optional, Sequence, Set, Tuple

Position = Tuple[int, int]


@dataclass(frozen=True)
class GridWorldConfig:
    width: int
    height: int
    start: Position = (1, 1)
    heading: str = "east"
    obstacles: Sequence[Position] = field(default_factory=tuple)
    forbidden_zones: Sequence[Position] = field(default_factory=tuple)
    target_coverage_rate: float = 0.8
    max_steps: int = 120
    lidar_ray_count: int = 8
    ultrasonic_count: int = 4


def create_default_training_map() -> GridWorldConfig:
    return GridWorldConfig(
        width=8,
        height=6,
        start=(1, 1),
        heading="east",
        obstacles=((4, 1), (5, 3), (2, 4)),
        forbidden_zones=((6, 4),),
        target_coverage_rate=0.82,
        max_steps=160,
    )


class MowingGridEnvironment:
    _HEADINGS = ("north", "east", "south", "west")
    _DELTAS: Dict[str, Position] = {
        "north": (0, -1),
        "east": (1, 0),
        "south": (0, 1),
        "west": (-1, 0),
    }
    _LIDAR_DIRECTIONS: Sequence[Position] = (
        (1, 0),
        (1, 1),
        (0, 1),
        (-1, 1),
        (-1, 0),
        (-1, -1),
        (0, -1),
        (1, -1),
    )
    _ULTRASONIC_DIRECTIONS: Sequence[Position] = ((0, -1), (1, 0), (0, 1), (-1, 0))

    def __init__(self, config: Optional[GridWorldConfig] = None) -> None:
        self.config = config or create_default_training_map()
        self.obstacles = set(self.config.obstacles)
        self.forbidden_zones = set(self.config.forbidden_zones)
        self.coverable_cells = self._build_coverable_cells()
        self.position = self.config.start
        self.heading = self.config.heading
        self.covered: Set[Position] = set()
        self.step_count = 0

    def reset(self, seed: Optional[int] = None) -> dict:
        self.position = self.config.start
        self.heading = self.config.heading
        self.covered = {self.position}
        self.step_count = 0
        return self._observation()

    def step(self, action: str) -> tuple[dict, float, bool, bool, dict]:
        if action not in {"forward", "turn_left", "turn_right", "slow_stop"}:
            raise ValueError(f"Unsupported action: {action}")

        self.step_count += 1
        reward = -0.01
        event = "step"
        terminated = False
        truncated = False

        if action == "turn_left":
            self.heading = self._turn(-1)
            event = "turn-left"
        elif action == "turn_right":
            self.heading = self._turn(1)
            event = "turn-right"
        elif action == "slow_stop":
            reward = -0.2
            event = "repeat-coverage"
        else:
            next_position = self._next_position()
            if self._is_out_of_bounds(next_position):
                reward = -6.0
                terminated = True
                event = "boundary-violation"
            elif next_position in self.obstacles:
                reward = -6.0
                terminated = True
                event = "collision"
            elif next_position in self.forbidden_zones:
                self.position = next_position
                reward = -7.0
                terminated = True
                event = "forbidden-zone"
            else:
                self.position = next_position
                if self.position in self.covered:
                    reward = -0.2
                    event = "repeat-coverage"
                else:
                    self.covered.add(self.position)
                    reward = 1.0
                    event = "new-coverage"

        if not terminated and self.coverage_rate >= self.config.target_coverage_rate:
            reward += 8.0
            terminated = True
            event = "coverage-complete"

        if not terminated and self.step_count >= self.config.max_steps:
            truncated = True
            event = "max-steps"

        info = {
            "event": event,
            "coverage_rate": self.coverage_rate,
            "step_count": self.step_count,
        }
        return self._observation(), reward, terminated, truncated, info

    @property
    def coverage_rate(self) -> float:
        if not self.coverable_cells:
            return 0.0
        return len(self.covered.intersection(self.coverable_cells)) / len(self.coverable_cells)

    def _turn(self, offset: int) -> str:
        index = self._HEADINGS.index(self.heading)
        return self._HEADINGS[(index + offset) % len(self._HEADINGS)]

    def _next_position(self) -> Position:
        delta_x, delta_y = self._DELTAS[self.heading]
        return self.position[0] + delta_x, self.position[1] + delta_y

    def _observation(self) -> dict:
        return {
            "robot": {"position": self.position, "heading": self.heading},
            "coverage_rate": self.coverage_rate,
            "remaining_coverage": max(0.0, 1.0 - self.coverage_rate),
            "covered_cells": sorted(self.covered),
            "obstacles": sorted(self.obstacles),
            "forbidden_zones": sorted(self.forbidden_zones),
            "lidar": self._ray_distances(self._LIDAR_DIRECTIONS, self.config.lidar_ray_count),
            "ultrasonic": self._ray_distances(self._ULTRASONIC_DIRECTIONS, self.config.ultrasonic_count),
        }

    def _ray_distances(self, directions: Sequence[Position], expected_count: int) -> List[int]:
        distances = [self._distance_to_blocker(direction) for direction in directions[:expected_count]]
        while len(distances) < expected_count:
            distances.append(0)
        return distances

    def _distance_to_blocker(self, direction: Position) -> int:
        current = self.position
        distance = 0
        while True:
            current = current[0] + direction[0], current[1] + direction[1]
            distance += 1
            if self._is_out_of_bounds(current) or current in self.obstacles or current in self.forbidden_zones:
                return distance

    def _is_out_of_bounds(self, position: Position) -> bool:
        return position[0] < 0 or position[0] >= self.config.width or position[1] < 0 or position[1] >= self.config.height

    def _build_coverable_cells(self) -> Set[Position]:
        cells: Set[Position] = set()
        # V2 uses a compact mowing-lane abstraction: interior rows are coverable,
        # while x=0 remains the docking/boundary strip.
        for x in range(1, self.config.width):
            for y in range(1, self.config.height - 1):
                position = (x, y)
                if position not in self.obstacles and position not in self.forbidden_zones:
                    cells.add(position)
        return cells

