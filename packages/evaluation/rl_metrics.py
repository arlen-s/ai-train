def calculate_coverage_rate(covered_cells: int, coverable_cells: int) -> float:
    if covered_cells < 0:
        raise ValueError("covered_cells must be non-negative")
    if coverable_cells <= 0:
        raise ValueError("coverable_cells must be greater than zero")
    if covered_cells > coverable_cells:
        raise ValueError("covered_cells cannot exceed coverable_cells")
    return covered_cells / coverable_cells


def calculate_repeat_coverage_rate(repeat_steps: int, total_steps: int) -> float:
    if repeat_steps < 0:
        raise ValueError("repeat_steps must be non-negative")
    if total_steps <= 0:
        raise ValueError("total_steps must be greater than zero")
    if repeat_steps > total_steps:
        raise ValueError("repeat_steps cannot exceed total_steps")
    return repeat_steps / total_steps

