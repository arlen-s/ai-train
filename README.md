# LawnBot AI Closed-Loop System

面向智能割草机器人场景的 V3-ready V2 AI/DataOps 闭环训练系统。项目覆盖从场景数据规划、Dataset 治理、标注 QC、感知模型训练记录、RL 覆盖路径训练、泛化评估、Badcase 分析到 V3 工业化升级规划的完整产品与工程链路。

## 30 秒项目描述

这个项目它把割草机器人岗位能力拆成可执行模块：先定义草地、地形、边界、天气、动态障碍等场景矩阵，再管理 Dataset、标注质量、感知训练记录和 RL Policy；随后用模拟 LiDAR/Ultrasonic、动态人/宠物障碍和多场景评估发现失败案例，并把 Badcase 转成下一轮数据、标注、模型、RL 或 V3 升级动作。

当前交付目标是 **V2**：完成可复现的 AI/DataOps 闭环和真实 Three.js 仿真驾驶舱。**V3** 保留 ROS 2 / Gazebo / Isaac Sim、真实传感器日志、边缘部署和实机测试等工业化扩展点。

## 项目亮点

- **机器人 AI 训练工作台**：首屏是工业 cockpit，不是通用后台管理页。
- **真实 Three.js 渲染界面**：中间视口使用 WebGL 几何、灯光、材质、阴影、路径、传感器射线和动态 actor，不使用参考图贴图。
- **完整 V2 闭环**：Scenario -> Dataset -> Annotation/QC -> Perception -> RL -> Evaluation -> Badcase -> Iteration。
- **数据治理和版本意识**：Dataset、Model、Policy、Evaluation、Badcase 都有版本或来源记录。
- **RL 泛化评估**：覆盖训练/验证/未见场景、动态障碍、碰撞、重复覆盖、边界违规、路径效率等指标。
- **V3-ready 边界清晰**：保留 `SimulatorAdapter`、`SensorFrame`、真实日志和 ROS/Isaac/Gazebo 接口方向，但不把 V3 能力误标为 V2 已实现。

## 核心功能

| 模块 | V2 能力 |
|---|---|
| Scenario Matrix | 规划草型、草高、湿度、地形、边界、障碍、光照、天气、季节等场景维度 |
| Dataset Governance | 管理 Dataset version、样本量、场景分布、QC 状态和已知限制 |
| Annotation/QC | 定义检测/分割标签体系，记录缺标、错标、边界差、遮挡、小目标、模糊等问题 |
| Perception | 记录障碍检测、草地/边界/禁区分割训练 run、模型版本、mAP、IoU、ONNX 和 latency 元数据 |
| RL Training | 记录 2D mowing environment、PPO policy、reward config、curriculum、domain randomization |
| Simulation Replay | 展示割草路径、覆盖区域、动态人/宠物、LiDAR、Ultrasonic、GNSS-like 轨迹和局部 costmap |
| Generalization Evaluation | 对比 rule-based planner、random baseline、PPO policy 的覆盖率、碰撞率、stuck、unseen success |
| Badcase Loop | 分类失败根因，并生成数据采集、重标注、增强、重训、reward 调整或 V3 backlog 动作 |
| Report/V3 Planning | 导出项目报告，维护 V3 工业升级 backlog |

## 技术栈

```text
Frontend:
  Vite + React + TypeScript + Three.js + Recharts + Vitest

Backend:
  FastAPI + Pydantic + deterministic seed data + unittest

Core packages:
  packages/data_pipeline
  packages/perception
  packages/rl_env
  packages/evaluation

Docs:
  PRD, requirement decomposition, architecture, testing strategy,
  RL/model/evaluation docs, implementation plans, delivery checklist
```

## 架构分层

```text
Product/UI
  -> React workbench, industrial cockpit, workflow tabs, report views

Backend/API
  -> project metadata, scenarios, datasets, annotation tasks,
     training runs, model versions, RL policies, evaluations, Badcases

Data Pipeline
  -> ingest, cleaning, scenario classification, annotation validation

Perception
  -> detection / segmentation training records and metric helpers

RL Environment
  -> 2D lawn map, reward, simulated sensors, dynamic obstacles, baselines

Evaluation
  -> metrics, policy comparison, Badcase generation, report assembly
```

## 本地运行

### 1. 启动 API

```bash
PYTHONPATH=apps/api uvicorn app.main:app --reload
```

### 2. 启动 Web

```bash
cd apps/web
npm install
npm run dev -- --host 127.0.0.1 --port 5175
```

访问：

```text
http://127.0.0.1:5175/
```

### 3. 打开详细工作台

首屏默认展示工业 cockpit。右上角工作台按钮可以展开详细 React workflow，包括 Dataset/QC、Perception、RL Replay、Evaluation/Badcase、Report/V3 等页面。

## 验证命令

```bash
PYTHONPATH=apps/api python3 -m unittest apps.api.tests.test_api_smoke -v
cd apps/web && npm test -- --run
cd apps/web && npm run build
```

前端 build 可能出现 Vite chunk size warning，主要来自 Three.js / chart 依赖；这不代表构建失败。

## V2 / V3 范围边界

### V2 已覆盖或以元数据方式表达

- AI/DataOps cockpit 和工作流页面
- Scenario matrix、Dataset version、Annotation/QC、Training run、Model version、RL policy、Evaluation report、Badcase
- 模拟 LiDAR、Ultrasonic、GNSS-like trajectory、dynamic people/pet obstacles
- PPO / planner baseline / generalization evaluation / Badcase recommendation
- ONNX export metadata 和 inference latency benchmark records
- Three.js 3D-ready replay visualization

### V3 保留方向

- ROS 2 / Gazebo / Isaac Sim
- 真实 LiDAR / RTK / GNSS / IMU 日志
- multi-sensor fusion
- edge deployment / TensorRT / quantization
- real robot 或小车测试
- fleet log ingestion

V3 项目前置为 backlog 和接口边界，不在当前 V2 中声明为已实现。

## 关键文档

- [AGENTS.md](AGENTS.md)
- [PRD](docs/product/prd.md)
- [Requirement Decomposition](docs/product/requirement-decomposition.md)
- [Prototype Notes](docs/product/prototype-notes.md)
- [Architecture](docs/engineering/architecture.md)
- [Repository Structure](docs/engineering/repository-structure.md)
- [Testing Strategy](docs/engineering/testing-strategy.md)
- [RL Agent Training](docs/engineering/rl-agent-training.md)
- [Evaluation And Badcase](docs/engineering/evaluation-and-badcase.md)
- [Delivery Checklist](docs/engineering/delivery-checklist.md)

## 设计主线

1. 我把智能割草机器人岗位要求拆成数据、模型、RL、评估和 Badcase 闭环。
2. 我先定义场景矩阵和 Dataset 治理规则，保证训练数据和评估条件可追溯。
3. 我设计标注体系和 QC 类目，让检测/分割问题可以转成可执行的数据动作。
4. 我用感知训练记录、ONNX/latency 元数据和模型评估指标表达模型迭代能力。
5. 我实现 2D mowing RL 环境和 PPO policy 元数据，并用 rule-based baseline 做对比。
6. 我把 LiDAR、Ultrasonic、动态障碍和 Three.js replay 放进 cockpit，展示机器人行为和失败上下文。
7. 我用 Badcase root cause 和 recommendation 把失败转回数据、标注、模型、reward 或 V3 backlog。
8. 我明确 V2/V3 边界，说明哪些是当前可运行原型，哪些是下一阶段工业化升级。
