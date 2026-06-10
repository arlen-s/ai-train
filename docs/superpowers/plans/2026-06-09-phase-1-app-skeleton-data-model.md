# Phase 1 App Skeleton And Data Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first runnable V3-ready V2 application skeleton with a FastAPI metadata API, Pydantic core schemas, seed data matching the Chinese-first V2 training workbench, and smoke tests.

**Architecture:** Keep Phase 1 deliberately small: the backend exposes read-only seeded metadata from focused service modules, and the web shell is a static Chinese-first V2 workbench entry point. Persistence stays in seed data for this phase because SQLAlchemy and PostgreSQL are not installed in the current environment; database-backed repositories are a later phase behind the same schema/service boundary.

**Tech Stack:** Python 3.9, FastAPI, Pydantic v2, standard-library `unittest`, static HTML/CSS for the initial web shell.

---

## File Structure

- Create `apps/api/app/main.py`: FastAPI app factory and routes.
- Create `apps/api/app/schemas/core.py`: Pydantic schemas for V2/V3-ready core entities.
- Create `apps/api/app/services/seed_data.py`: deterministic seed data used by API tests and frontend smoke flows.
- Create `apps/api/app/services/dashboard.py`: dashboard summary assembly.
- Create `apps/api/app/__init__.py`, `apps/api/app/schemas/__init__.py`, `apps/api/app/services/__init__.py`: package markers.
- Create `apps/api/tests/test_api_smoke.py`: API smoke tests using `unittest` and FastAPI `TestClient`.
- Create `apps/web/index.html`: static Chinese-first V2 training workbench shell.
- Create `apps/web/README.md`: web shell purpose and next-step notes.
- Create `apps/api/README.md`: API purpose, run command, and test command.
- Modify `docs/engineering/repository-structure.md`: record Phase 1 skeleton choices.

## Task 1: Backend Smoke Tests

**Files:**
- Create: `apps/api/tests/test_api_smoke.py`

- [ ] **Step 1: Write the failing API tests**

```python
import unittest

from fastapi.testclient import TestClient

from app.main import app


class ApiSmokeTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_health_endpoint_returns_v2_workbench_identity(self) -> None:
        response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(response.json()["target"], "V2")
        self.assertEqual(response.json()["ui_language"], "zh-CN")

    def test_dashboard_summary_contains_closed_loop_sections(self) -> None:
        response = self.client.get("/api/dashboard/summary")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["product_name"], "LawnBot AI 训练工作台")
        self.assertIn("dataset", payload)
        self.assertIn("perception", payload)
        self.assertIn("rl", payload)
        self.assertIn("badcases", payload)
        self.assertIn("v3_backlog", payload)
        self.assertGreaterEqual(payload["dataset"]["coverage_rate"], 0.7)
        self.assertEqual(payload["rl"]["policy_id"], "ppo-v2")

    def test_scenarios_include_v2_sensor_fields_and_dynamic_obstacles(self) -> None:
        response = self.client.get("/api/scenarios")

        self.assertEqual(response.status_code, 200)
        scenarios = response.json()
        self.assertGreaterEqual(len(scenarios), 3)
        dynamic = [item for item in scenarios if item["dynamic_obstacle_pattern"] != "none"]
        self.assertTrue(dynamic)
        self.assertIn("lidar", dynamic[0]["sensor_modalities"])
        self.assertIn("ultrasonic", dynamic[0]["sensor_modalities"])

    def test_v3_backlog_is_separate_from_v2_delivery(self) -> None:
        response = self.client.get("/api/backlog/v3")

        self.assertEqual(response.status_code, 200)
        items = response.json()
        self.assertGreaterEqual(len(items), 4)
        self.assertEqual(items[0]["version_target"], "V3")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

Expected: FAIL or ERROR because `app.main` does not exist yet.

## Task 2: Core Schemas And Seed Data

**Files:**
- Create: `apps/api/app/schemas/core.py`
- Create: `apps/api/app/schemas/__init__.py`
- Create: `apps/api/app/services/seed_data.py`
- Create: `apps/api/app/services/__init__.py`
- Create: `apps/api/app/__init__.py`

- [ ] **Step 1: Implement the schemas**

```python
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class Scenario(BaseModel):
    id: str
    name: str
    grass_type: str
    grass_height: str
    moisture: Literal["dry", "wet", "mixed"]
    terrain: str
    boundary_type: str
    obstacle_types: List[str]
    lighting: str
    weather: str
    season_time: str
    coverage_count: int = Field(ge=0)
    risk_level: Literal["low", "medium", "high"]
    sensor_modalities: List[str]
    dynamic_obstacle_pattern: str
    v3_real_log_reference: Optional[str] = None


class DatasetSummary(BaseModel):
    version_id: str
    coverage_rate: float = Field(ge=0, le=1)
    sample_count: int = Field(ge=0)
    weak_scenarios: List[str]
    qc_status: str


class PerceptionSummary(BaseModel):
    model_id: str
    task: str
    map_score: float = Field(alias="mAP", ge=0, le=1)
    recall: float = Field(ge=0, le=1)
    onnx_status: str
    latency_ms: int = Field(ge=0)


class RLSummary(BaseModel):
    policy_id: str
    algorithm: str
    unseen_success_rate: float = Field(ge=0, le=1)
    coverage_rate: float = Field(ge=0, le=1)
    dynamic_obstacle_response_ms: int = Field(ge=0)
    curriculum_stage: str


class BadcaseSummary(BaseModel):
    open_count: int = Field(ge=0)
    high_severity_count: int = Field(ge=0)
    recommendation_count: int = Field(ge=0)
    top_root_causes: List[str]


class V3BacklogItem(BaseModel):
    id: str
    priority: Literal["P0", "P1", "P2"]
    title: str
    module: str
    expected_value: str
    dependency: str
    version_target: Literal["V3"]
    status: str


class DashboardSummary(BaseModel):
    product_name: str
    target_version: Literal["V2"]
    architecture_mode: str
    ui_language: Literal["zh-CN"]
    dataset: DatasetSummary
    perception: PerceptionSummary
    rl: RLSummary
    badcases: BadcaseSummary
    v3_backlog: List[V3BacklogItem]
    workflow: List[str]
    source_versions: Dict[str, str]
```

- [ ] **Step 2: Implement deterministic seed data**

```python
from app.schemas.core import (
    BadcaseSummary,
    DashboardSummary,
    DatasetSummary,
    PerceptionSummary,
    RLSummary,
    Scenario,
    V3BacklogItem,
)


SCENARIOS = [
    Scenario(
        id="scenario-dry-flat-clear",
        name="干燥短草、平地、清晰边界",
        grass_type="bermuda",
        grass_height="short",
        moisture="dry",
        terrain="flat",
        boundary_type="clear",
        obstacle_types=["tree"],
        lighting="normal",
        weather="sunny",
        season_time="summer-morning",
        coverage_count=410,
        risk_level="low",
        sensor_modalities=["camera", "lidar", "ultrasonic"],
        dynamic_obstacle_pattern="none",
    ),
    Scenario(
        id="scenario-wet-slope-shadow",
        name="湿高草、坡地、阴影",
        grass_type="mixed",
        grass_height="tall",
        moisture="wet",
        terrain="slope",
        boundary_type="soft-shadow",
        obstacle_types=["stone", "fence"],
        lighting="shadow",
        weather="after-rain",
        season_time="spring-evening",
        coverage_count=68,
        risk_level="medium",
        sensor_modalities=["camera", "imu", "gnss"],
        dynamic_obstacle_pattern="none",
    ),
    Scenario(
        id="scenario-dense-dynamic-pet",
        name="密集障碍物、动态宠物、不规则边界",
        grass_type="mixed",
        grass_height="medium",
        moisture="mixed",
        terrain="irregular-slope",
        boundary_type="irregular",
        obstacle_types=["person", "pet", "stone", "tree", "fence"],
        lighting="glare-and-shadow",
        weather="sunny",
        season_time="autumn-afternoon",
        coverage_count=22,
        risk_level="high",
        sensor_modalities=["camera", "lidar", "ultrasonic", "trajectory"],
        dynamic_obstacle_pattern="person-pet-crossing",
    ),
]


V3_BACKLOG = [
    V3BacklogItem(
        id="V3-001",
        priority="P0",
        title="ROS 2 / Gazebo 或 Isaac Sim 接入",
        module="仿真系统",
        expected_value="接近真实机器人开发流程",
        dependency="SimulatorAdapter",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-002",
        priority="P0",
        title="真实 LiDAR / RTK / GNSS / IMU 日志接入",
        module="数据管线",
        expected_value="覆盖真实多传感器数据要求",
        dependency="SensorFrame",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-003",
        priority="P1",
        title="多传感器融合 baseline",
        module="感知融合",
        expected_value="从视觉扩展到多源感知",
        dependency="real sensor logs",
        version_target="V3",
        status="planned",
    ),
    V3BacklogItem(
        id="V3-004",
        priority="P1",
        title="TensorRT / 量化边缘部署",
        module="部署评估",
        expected_value="评估延迟、功耗和内存约束",
        dependency="ONNX export records",
        version_target="V3",
        status="planned",
    ),
]


def build_dashboard_summary() -> DashboardSummary:
    return DashboardSummary(
        product_name="LawnBot AI 训练工作台",
        target_version="V2",
        architecture_mode="V3-ready",
        ui_language="zh-CN",
        dataset=DatasetSummary(
            version_id="dataset-v2",
            coverage_rate=0.72,
            sample_count=3180,
            weak_scenarios=["雨天", "强眩光", "窄边界", "密集动态障碍"],
            qc_status="QC 通过，12 条待复核",
        ),
        perception=PerceptionSummary(
            model_id="det-yolo-v2",
            task="obstacle-detection",
            mAP=0.81,
            recall=0.78,
            onnx_status="ready",
            latency_ms=38,
        ),
        rl=RLSummary(
            policy_id="ppo-v2",
            algorithm="PPO",
            unseen_success_rate=0.68,
            coverage_rate=0.82,
            dynamic_obstacle_response_ms=900,
            curriculum_stage="curriculum-stage-3",
        ),
        badcases=BadcaseSummary(
            open_count=37,
            high_severity_count=11,
            recommendation_count=24,
            top_root_causes=["reward 对局部循环惩罚不足", "动态障碍样本不足", "阴影边界标注不稳定"],
        ),
        v3_backlog=V3_BACKLOG,
        workflow=["场景", "Dataset/QC", "感知训练", "RL 仿真", "泛化评估", "Badcase 决策"],
        source_versions={
            "dataset": "dataset-v2",
            "model": "det-yolo-v2",
            "policy": "ppo-v2",
            "evaluation": "eval-unseen-014",
        },
    )
```

- [ ] **Step 3: Run tests**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

Expected: still FAIL or ERROR because API routes do not exist yet.

## Task 3: FastAPI App And Routes

**Files:**
- Create: `apps/api/app/main.py`
- Create: `apps/api/app/services/dashboard.py`

- [ ] **Step 1: Implement dashboard service**

```python
from app.schemas.core import DashboardSummary
from app.services.seed_data import build_dashboard_summary


def get_dashboard_summary() -> DashboardSummary:
    return build_dashboard_summary()
```

- [ ] **Step 2: Implement FastAPI routes**

```python
from fastapi import FastAPI

from app.schemas.core import DashboardSummary, Scenario, V3BacklogItem
from app.services.dashboard import get_dashboard_summary
from app.services.seed_data import SCENARIOS, V3_BACKLOG

app = FastAPI(
    title="LawnBot AI V2 Workbench API",
    version="0.1.0",
    description="V3-ready V2 metadata API for the LawnBot AI training workbench.",
)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "target": "V2",
        "architecture_mode": "V3-ready",
        "ui_language": "zh-CN",
    }


@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary() -> DashboardSummary:
    return get_dashboard_summary()


@app.get("/api/scenarios", response_model=list[Scenario])
def list_scenarios() -> list[Scenario]:
    return SCENARIOS


@app.get("/api/backlog/v3", response_model=list[V3BacklogItem])
def list_v3_backlog() -> list[V3BacklogItem]:
    return V3_BACKLOG
```

- [ ] **Step 3: Run tests to verify they pass**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

Expected: PASS with 4 tests.

## Task 4: Static Web Workbench Shell

**Files:**
- Create: `apps/web/index.html`
- Create: `apps/web/README.md`

- [ ] **Step 1: Create the static Chinese-first web shell**

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LawnBot AI 训练工作台</title>
</head>
<body>
  <main>
    <h1>LawnBot AI 训练工作台</h1>
    <p>V2 当前交付：数据闭环、感知训练、RL agent、模拟传感器、动态障碍和 Badcase 决策。</p>
    <section aria-label="核心指标">
      <h2>核心指标</h2>
      <ul>
        <li>Dataset 覆盖率：72%</li>
        <li>det-yolo-v2 mAP：0.81</li>
        <li>ppo-v2 未见场景成功率：68%</li>
        <li>未关闭 Badcase：37</li>
      </ul>
    </section>
  </main>
</body>
</html>
```

- [ ] **Step 2: Create the web README**

```markdown
# LawnBot AI Web Shell

This is the Phase 1 static web shell for the Chinese-first V2 training workbench.

Open `apps/web/index.html` directly in a browser for now. A Next.js app can replace this shell in a later phase after the API metadata model is stable.
```

- [ ] **Step 3: Verify required Chinese labels are present**

Run:

```bash
rg -n "训练工作台|Dataset 覆盖率|ppo-v2|Badcase" apps/web/index.html
```

Expected: all four labels are found.

## Task 5: Documentation And Verification

**Files:**
- Create: `apps/api/README.md`
- Modify: `docs/engineering/repository-structure.md`

- [ ] **Step 1: Create API README**

```markdown
# LawnBot AI API

Phase 1 provides a FastAPI metadata shell for the V3-ready V2 training workbench.

Run the API:

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

Run tests:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
```

Current scope:

- health endpoint
- dashboard summary
- scenario seed records
- V3 backlog seed records
```

- [ ] **Step 2: Update repository structure document**

Add this section to `docs/engineering/repository-structure.md`:

```markdown
## Phase 1 Implementation Note

The current Phase 1 skeleton uses FastAPI, Pydantic schemas, deterministic seed data, and standard-library `unittest` smoke tests. The environment does not currently include SQLAlchemy or pytest, so database persistence and pytest migration are deferred until dependency setup.

The static web shell at `apps/web/index.html` is intentionally lightweight. It preserves the Chinese-first V2 training workbench direction while the backend metadata model stabilizes.
```

- [ ] **Step 3: Run final verification**

Run:

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
rg -n "训练工作台|V3-ready|V3 Backlog|zh-CN" AGENTS.md docs/product/prd.md docs/product/prototype-notes.md docs/product/prototypes/pm-wireframes.html apps/web/index.html
```

Expected: tests pass; `rg` finds the V2/V3-ready and Chinese-first terms.

- [ ] **Step 4: Git step**

Run:

```bash
git status --short
```

Expected in the current workspace: `fatal: not a git repository`. Record that commits are skipped because this directory is not a git repository.

## Self-Review

- Spec coverage: Phase 1 covers app skeleton, API shell, core metadata schemas, seed data, smoke tests, Chinese-first UI direction, and V3-ready V2 scope. It intentionally does not implement real DB persistence, RL training, perception training, or Next.js because those belong to later phases after the skeleton is stable.
- Placeholder scan: no placeholders are present.
- Type consistency: route names, schema names, and seed-data fields match across tests and implementation tasks.
