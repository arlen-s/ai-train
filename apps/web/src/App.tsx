import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Bot,
  Braces,
  CheckCircle2,
  CircleDot,
  Database,
  FileText,
  Flag,
  Gauge,
  GitBranch,
  Layers3,
  Map,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TestTube2
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { IndustrialCockpit } from "./components/industrial/IndustrialCockpit";
import { ReplayMap } from "./components/ReplayMap";
import { exportReportMarkdown, type Fetcher, loadWorkbenchData } from "./lib/api";
import type {
  BadcaseRecord,
  DatasetVersion,
  EvaluationReport,
  ModelVersion,
  PolicyComparison,
  RLEvaluationReport,
  RLPolicyVersion,
  ScenarioCoverage,
  TrainingRun,
  V3BacklogItem,
  WorkbenchData
} from "./lib/types";

interface AppProps {
  initialData?: WorkbenchData;
  fetcher?: Fetcher;
  apiBaseUrl?: string;
}

type TabId = "overview" | "data" | "perception" | "rl" | "evaluation" | "report";

const tabs: Array<{ id: TabId; label: string; icon: typeof Activity }> = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "data", label: "Data/QC", icon: Database },
  { id: "perception", label: "Perception", icon: Target },
  { id: "rl", label: "RL Replay", icon: Route },
  { id: "evaluation", label: "Evaluation/Badcase", icon: TestTube2 },
  { id: "report", label: "Report/V3", icon: FileText }
];

function asPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function asMetric(value: number | undefined, fallback = "-"): string {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }
  return value >= 1 ? String(Math.round(value)) : value.toFixed(2);
}

function coverageTone(level: ScenarioCoverage["coverage_level"]): string {
  if (level === "strong") {
    return "ok";
  }
  if (level === "weak") {
    return "warn";
  }
  return "risk";
}

function riskTone(level: ScenarioCoverage["risk_level"]): string {
  if (level === "low") {
    return "ok";
  }
  if (level === "medium") {
    return "warn";
  }
  return "risk";
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("open") || normalized.includes("review") || normalized.includes("planned")) {
    return "warn";
  }
  if (normalized.includes("high") || normalized.includes("gap") || normalized.includes("fail")) {
    return "risk";
  }
  return "ok";
}

function first<T>(items: T[]): T | undefined {
  return items[0];
}

function MetricTile({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral"
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
  tone?: "neutral" | "ok" | "warn" | "risk";
}) {
  return (
    <div className={`metric-tile metric-${tone}`}>
      <div className="metric-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div>
        <p className="metric-label">{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function VersionStack({
  datasetId,
  modelId,
  policyId
}: {
  datasetId: string;
  modelId: string;
  policyId: string;
}) {
  return (
    <div className="version-stack" aria-label="Current closed-loop versions">
      <div>
        <span>Dataset</span>
        <strong>{datasetId}</strong>
      </div>
      <div>
        <span>Model</span>
        <strong>{modelId}</strong>
      </div>
      <div>
        <span>Policy</span>
        <strong>{policyId}</strong>
      </div>
    </div>
  );
}

function OverviewPanel({ data }: { data: WorkbenchData }) {
  const weakScenarioRows = data.scenarioCoverage.map((scenario) => ({
    name: scenario.scenario_name.slice(0, 9),
    samples: scenario.sample_count,
    required: scenario.required_min_count
  }));
  const policy = first(data.rlPolicies);
  const model = first(data.models);

  return (
    <div className="panel-grid overview-grid">
      <section className="surface cockpit-main">
        <SectionTitle eyebrow="V2 AI/DataOps Cockpit" title="闭环训练态势" />
        <div className="metric-grid">
          <MetricTile
            detail={`${data.dashboard.dataset.sample_count.toLocaleString()} samples / ${data.dashboard.dataset.qc_status}`}
            icon={Database}
            label="Dataset 覆盖率"
            tone="warn"
            value={asPercent(data.dashboard.dataset.coverage_rate)}
          />
          <MetricTile
            detail={`Recall ${asPercent(data.dashboard.perception.recall)} / ${data.dashboard.perception.latency_ms}ms`}
            icon={Target}
            label="感知 mAP"
            tone="ok"
            value={asPercent(data.dashboard.perception.mAP)}
          />
          <MetricTile
            detail={`${data.dashboard.rl.algorithm} / ${data.dashboard.rl.curriculum_stage}`}
            icon={Bot}
            label="RL unseen success"
            tone="warn"
            value={asPercent(data.dashboard.rl.unseen_success_rate)}
          />
          <MetricTile
            detail={`${data.dashboard.badcases.recommendation_count} 条推荐动作`}
            icon={AlertTriangle}
            label="高风险 Badcase"
            tone="risk"
            value={String(data.dashboard.badcases.high_severity_count)}
          />
        </div>
        <div className="chart-band">
          <div className="chart-panel">
            <h3>场景覆盖缺口</h3>
            <BarChart data={weakScenarioRows} height={178} width={360}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="required" fill="#d7ded5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="samples" fill="#377d71" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
          <div className="decision-panel">
            <h3>Badcase 决策</h3>
            <p>{data.dashboard.badcases.top_root_causes.join(" / ")}</p>
            <div className="decision-list">
              {data.badcases.slice(0, 3).map((badcase) => (
                <span key={badcase.id}>
                  {badcase.category} {"->"} {badcase.recommended_action}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <aside className="surface signal-rail">
        <SectionTitle eyebrow="Source Versions" title="当前闭环版本" />
        <VersionStack
          datasetId={data.dashboard.dataset.version_id}
          modelId={data.dashboard.perception.model_id}
          policyId={data.dashboard.rl.policy_id}
        />
        <div className="pipeline-rail">
          {data.dashboard.workflow.map((step, index) => (
            <div className="pipeline-step" key={step}>
              <span>{index + 1}</span>
              <p>{index + 1}. {step}</p>
            </div>
          ))}
        </div>
        <div className="side-note">
          <ShieldCheck size={18} />
          <p>V2 范围锁定：仿真 + 元数据闭环，接口保留 V3 real logs / 3D simulator 升级位。</p>
        </div>
      </aside>
      <section className="surface compact-list">
        <SectionTitle eyebrow="Model Candidate" title="感知模型候选" />
        {model ? <ModelSummary model={model} /> : <EmptyState text="暂无模型版本" />}
      </section>
      <section className="surface compact-list">
        <SectionTitle eyebrow="Policy Candidate" title="RL 策略候选" />
        {policy ? <PolicySummary policy={policy} /> : <EmptyState text="暂无策略版本" />}
      </section>
    </div>
  );
}

function DataPanel({ data }: { data: WorkbenchData }) {
  const dataset = first(data.datasets);
  const scenarioRows = data.scenarioCoverage.map((scenario) => ({
    name: scenario.scenario_id.replace("scenario-", ""),
    coverage: scenario.sample_count,
    required: scenario.required_min_count
  }));

  return (
    <div className="panel-grid two-columns">
      <section className="surface">
        <SectionTitle eyebrow="Dataset Governance" title="场景采集与覆盖矩阵" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>场景</th>
                <th>样本</th>
                <th>覆盖</th>
                <th>风险</th>
                <th>动作</th>
              </tr>
            </thead>
            <tbody>
              {data.scenarioCoverage.map((scenario) => (
                <tr key={scenario.scenario_id}>
                  <td>{scenario.scenario_name}</td>
                  <td>
                    {scenario.sample_count}/{scenario.required_min_count}
                  </td>
                  <td>
                    <span className={`pill ${coverageTone(scenario.coverage_level)}`}>{scenario.coverage_level}</span>
                  </td>
                  <td>
                    <span className={`pill ${riskTone(scenario.risk_level)}`}>{scenario.risk_level}</span>
                  </td>
                  <td>{scenario.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BarChart data={scenarioRows} height={190} width={620}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="required" fill="#e0e5df" radius={[4, 4, 0, 0]} />
          <Bar dataKey="coverage" fill="#3572a5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </section>
      <section className="surface">
        <SectionTitle eyebrow="Annotation QC" title="标注规范与质检队列" />
        {dataset ? <DatasetCard dataset={dataset} /> : <EmptyState text="暂无 Dataset" />}
        <div className="schema-strip">
          <div>
            <span>Detection</span>
            <p>{data.labelSchema.detection_classes.map((item) => item.display_name).join(" / ")}</p>
          </div>
          <div>
            <span>Segmentation</span>
            <p>{data.labelSchema.segmentation_classes.map((item) => item.display_name).join(" / ")}</p>
          </div>
          <div>
            <span>Tools</span>
            <p>{data.labelSchema.allowed_tools.join(" / ")}</p>
          </div>
        </div>
        <div className="task-list">
          {data.annotationTasks.map((task) => (
            <article className="task-item" key={task.id}>
              <div>
                <strong>{task.id}</strong>
                <span>{task.tool} / {task.task_type}</span>
              </div>
              <p>{task.reviewer_notes}</p>
              <span className={`pill ${statusTone(task.qc_status)}`}>
                {task.qc_status} · {task.issue_count} issues
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PerceptionPanel({ data }: { data: WorkbenchData }) {
  const run = first(data.trainingRuns);
  const evaluation = first(data.evaluations);
  const metricRows = data.trainingRuns.map((item) => ({
    id: item.id,
    mAP: item.final_metrics.mAP,
    recall: item.final_metrics.recall,
    precision: item.final_metrics.precision
  }));

  return (
    <div className="panel-grid two-columns">
      <section className="surface">
        <SectionTitle eyebrow="Training Run" title="感知模型训练与导出" />
        {run ? <TrainingRunCard run={run} /> : <EmptyState text="暂无训练任务" />}
        <LineChart data={metricRows} height={210} width={620}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="id" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line dataKey="mAP" stroke="#2f6f64" strokeWidth={3} type="monotone" />
          <Line dataKey="recall" stroke="#c77635" strokeWidth={3} type="monotone" />
          <Line dataKey="precision" stroke="#376fa5" strokeWidth={3} type="monotone" />
        </LineChart>
      </section>
      <section className="surface">
        <SectionTitle eyebrow="Evaluation" title="弱场景评估切片" />
        {evaluation ? <EvaluationCard evaluation={evaluation} /> : <EmptyState text="暂无评估报告" />}
        <div className="badcase-stack">
          {data.models.map((model) => (
            <ModelSummary key={model.id} model={model} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RLPanel({ data }: { data: WorkbenchData }) {
  const policy = first(data.rlPolicies);
  const evaluation = first(data.rlEvaluations);
  const comparison = first(data.policyComparisons);
  const splitRows =
    evaluation?.split_metrics.map((split) => ({
      split: split.split,
      success_rate: split.metrics.success_rate ?? 0,
      scenarios: split.scenario_count
    })) ?? [];

  return (
    <div className="panel-grid rl-grid">
      <section className="surface replay-section">
        <SectionTitle eyebrow="Episode Replay" title={data.rlEpisode.id} />
        <ReplayMap episode={data.rlEpisode} />
      </section>
      <aside className="surface rl-side">
        <SectionTitle eyebrow="Policy Runtime" title="PPO 泛化状态" />
        {policy ? <PolicySummary policy={policy} /> : <EmptyState text="暂无策略版本" />}
        {evaluation ? <RLEvaluationCard evaluation={evaluation} /> : null}
        <AreaChart data={splitRows} height={180} width={310}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="split" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area dataKey="success_rate" fill="#a9d6ca" stroke="#2f6f64" strokeWidth={3} />
        </AreaChart>
        {comparison ? <PolicyComparisonCard comparison={comparison} /> : null}
      </aside>
    </div>
  );
}

function EvaluationPanel({ data }: { data: WorkbenchData }) {
  return (
    <div className="panel-grid two-columns">
      <section className="surface">
        <SectionTitle eyebrow="Generalization" title="跨场景评估与 Guardrail" />
        <div className="badcase-stack">
          {data.rlEvaluations.map((evaluation) => (
            <RLEvaluationCard evaluation={evaluation} key={evaluation.id} />
          ))}
          {data.evaluations.map((evaluation) => (
            <EvaluationCard evaluation={evaluation} key={evaluation.id} />
          ))}
        </div>
      </section>
      <section className="surface">
        <SectionTitle eyebrow="Badcase Loop" title="问题定位与数据回补" />
        <div className="badcase-stack">
          {data.badcases.map((badcase) => (
            <BadcaseCard badcase={badcase} key={badcase.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportPanel({ data, fetcher, apiBaseUrl }: { data: WorkbenchData; fetcher?: Fetcher; apiBaseUrl?: string }) {
  const [exportState, setExportState] = useState<"idle" | "running" | "ready" | "failed">("idle");
  const [artifactPath, setArtifactPath] = useState("");

  async function handleExport() {
    setExportState("running");
    try {
      const result = await exportReportMarkdown(fetcher, apiBaseUrl);
      setArtifactPath(result.artifact_path);
      setExportState("ready");
    } catch {
      setExportState("failed");
    }
  }

  return (
    <div className="panel-grid two-columns">
      <section className="surface">
        <SectionTitle
          action={
            <button className="icon-button" onClick={handleExport} type="button">
              <ArrowDownToLine size={16} />
              导出 Markdown
            </button>
          }
          eyebrow="Delivery"
          title={data.report.title}
        />
        <div className="report-sections">
          {Object.entries(data.report.sections).map(([title, content]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{content}</p>
            </article>
          ))}
        </div>
        <div className={`export-state ${exportState}`}>
          {exportState === "idle" ? "报告源版本已就绪" : null}
          {exportState === "running" ? "正在请求导出接口..." : null}
          {exportState === "ready" ? `已生成：${artifactPath}` : null}
          {exportState === "failed" ? "导出失败，请检查 API 服务" : null}
        </div>
      </section>
      <section className="surface">
        <SectionTitle eyebrow="V3 Planning" title="下版本升级入口" />
        <div className="guardrail-box">
          <Flag size={19} />
          <p>{data.v3PromotionPlan.scope_guardrails.join(" / ")}</p>
        </div>
        <div className="backlog-list">
          {data.v3Backlog.map((item) => (
            <BacklogItem item={item} key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: DatasetVersion }) {
  return (
    <article className="summary-card">
      <div>
        <strong>{dataset.name}</strong>
        <span>{dataset.source}</span>
      </div>
      <div className="summary-grid">
        <span>{dataset.sample_count.toLocaleString()} samples</span>
        <span>Quality {asPercent(dataset.quality_score)}</span>
        <span>{dataset.sensor_modalities.join(" / ")}</span>
      </div>
      <p>{dataset.known_limitations.join(" / ")}</p>
    </article>
  );
}

function TrainingRunCard({ run }: { run: TrainingRun }) {
  return (
    <article className="summary-card">
      <div>
        <strong>{run.id}</strong>
        <span>{run.model_family} / {run.task}</span>
      </div>
      <div className="summary-grid">
        <span>mAP {asMetric(run.final_metrics.mAP)}</span>
        <span>Recall {asMetric(run.final_metrics.recall)}</span>
        <span>ONNX {run.onnx_export_status}</span>
        <span>{run.latency_ms}ms</span>
      </div>
      <p>{run.artifact_path}</p>
    </article>
  );
}

function ModelSummary({ model }: { model: ModelVersion }) {
  return (
    <article className="summary-card dense">
      <div>
        <strong>{model.id}</strong>
        <span>{model.model_family}</span>
      </div>
      <div className="summary-grid">
        <span>mAP {asMetric(model.metrics.mAP)}</span>
        <span>Recall {asMetric(model.metrics.recall)}</span>
        <span>Latency {asMetric(model.metrics.latency_ms)}ms</span>
      </div>
      <span className={`pill ${statusTone(model.promotion_status)}`}>{model.promotion_status}</span>
    </article>
  );
}

function PolicySummary({ policy }: { policy: RLPolicyVersion }) {
  return (
    <article className="summary-card dense">
      <div>
        <strong>Policy {policy.id}</strong>
        <span>{policy.algorithm} / {policy.curriculum_stage}</span>
      </div>
      <div className="summary-grid">
        <span>Coverage {asPercent(policy.metrics.coverage_rate ?? 0)}</span>
        <span>Unseen {asPercent(policy.metrics.unseen_success_rate ?? 0)}</span>
        <span>{policy.domain_randomization.join(" / ")}</span>
      </div>
      <p>{policy.artifact_path}</p>
    </article>
  );
}

function EvaluationCard({ evaluation }: { evaluation: EvaluationReport }) {
  return (
    <article className="summary-card dense">
      <div>
        <strong>{evaluation.id}</strong>
        <span>{evaluation.target_type} / {evaluation.task}</span>
      </div>
      <div className="summary-grid">
        {Object.entries(evaluation.metrics).map(([key, value]) => (
          <span key={key}>{key} {asMetric(value)}</span>
        ))}
      </div>
      <p>{evaluation.recommendations.join(" / ")}</p>
    </article>
  );
}

function RLEvaluationCard({ evaluation }: { evaluation: RLEvaluationReport }) {
  return (
    <article className="summary-card dense">
      <div>
        <strong>{evaluation.id}</strong>
        <span>{evaluation.policy_version_id}</span>
      </div>
      <div className="summary-grid">
        <span>Coverage {asPercent(evaluation.metrics.coverage_rate ?? 0)}</span>
        <span>Success {asPercent(evaluation.metrics.success_rate ?? 0)}</span>
        <span>Response {asMetric(evaluation.metrics.dynamic_obstacle_response_ms)}ms</span>
      </div>
      <p>{evaluation.recommendations.join(" / ")}</p>
    </article>
  );
}

function PolicyComparisonCard({ comparison }: { comparison: PolicyComparison }) {
  return (
    <article className="summary-card dense">
      <div>
        <strong>{comparison.id}</strong>
        <span>推荐策略：{comparison.recommended_policy_id}</span>
      </div>
      <div className="comparison-row">
        {comparison.entries.map((entry) => (
          <span key={entry.policy_or_baseline_id}>
            {entry.kind}: {asPercent(entry.metrics.coverage_rate ?? 0)}
          </span>
        ))}
      </div>
      <p>{comparison.guardrail_notes.join(" / ")}</p>
    </article>
  );
}

function BadcaseCard({ badcase }: { badcase: BadcaseRecord }) {
  return (
    <article className="badcase-card">
      <div>
        <strong>{badcase.id}</strong>
        <span className={`pill ${statusTone(badcase.severity)}`}>{badcase.severity}</span>
      </div>
      <p>{badcase.root_cause}</p>
      <div className="summary-grid">
        <span>{badcase.category}</span>
        <span>{badcase.scenario_tags.join(" / ")}</span>
        <span>{badcase.owner}</span>
      </div>
      <footer>{badcase.recommended_action}</footer>
    </article>
  );
}

function BacklogItem({ item }: { item: V3BacklogItem }) {
  return (
    <article className="backlog-item">
      <div>
        <strong>{item.id}</strong>
        <span className="pill warn">{item.priority}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.expected_value}</p>
      <small>{item.module} · depends on {item.dependency}</small>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <CircleDot size={18} />
      <span>{text}</span>
    </div>
  );
}

export default function App({ initialData, fetcher, apiBaseUrl }: AppProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [data, setData] = useState<WorkbenchData | undefined>(initialData);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">(initialData ? "ready" : "idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoadState("ready");
      return;
    }

    let active = true;
    setLoadState("loading");
    loadWorkbenchData(fetcher, apiBaseUrl)
      .then((result) => {
        if (!active) {
          return;
        }
        setData(result);
        setLoadState("ready");
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }
        setErrorMessage(error.message);
        setLoadState("error");
      });

    return () => {
      active = false;
    };
  }, [apiBaseUrl, fetcher, initialData]);

  const activePanel = useMemo(() => {
    if (!data) {
      return null;
    }
    if (activeTab === "data") {
      return <DataPanel data={data} />;
    }
    if (activeTab === "perception") {
      return <PerceptionPanel data={data} />;
    }
    if (activeTab === "rl") {
      return <RLPanel data={data} />;
    }
    if (activeTab === "evaluation") {
      return <EvaluationPanel data={data} />;
    }
    if (activeTab === "report") {
      return <ReportPanel apiBaseUrl={apiBaseUrl} data={data} fetcher={fetcher} />;
    }
    return <OverviewPanel data={data} />;
  }, [activeTab, apiBaseUrl, data, fetcher]);

  if (loadState === "loading" || loadState === "idle") {
    return (
      <main className="app-shell centered-shell">
        <div className="loading-box">
          <Radar className="spin" size={24} />
          <span>正在加载 LawnBot AI 训练工作台...</span>
        </div>
      </main>
    );
  }

  if (loadState === "error" || !data) {
    return (
      <main className="app-shell centered-shell">
        <div className="error-box">
          <AlertTriangle size={24} />
          <strong>API 数据加载失败</strong>
          <p>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <IndustrialCockpit
        data={data}
        isWorkbenchOpen={isWorkbenchOpen}
        onWorkbenchToggle={() => setIsWorkbenchOpen((current) => !current)}
      />

      {isWorkbenchOpen ? (
        <section aria-label="Detailed workbench" className="detailed-workbench">
          <header className="topbar legacy-topbar">
            <div className="brand-block">
              <div className="brand-mark" aria-hidden="true">
                <Bot size={25} />
              </div>
              <div>
                <p>V2 Robotics AI Workbench</p>
                <h1>{data.dashboard.product_name}</h1>
              </div>
            </div>
            <div className="topbar-actions">
              <span className="status-chip">
                <CheckCircle2 size={16} />
                {data.dashboard.architecture_mode}
              </span>
              <span className="status-chip muted">
                <Braces size={16} />
                zh-CN / English tags
              </span>
            </div>
          </header>

          <section className="mission-strip">
            <div>
              <Sparkles size={18} />
              <span>真实场景采集</span>
            </div>
            <div>
              <Layers3 size={18} />
              <span>Dataset/QC</span>
            </div>
            <div>
              <Target size={18} />
              <span>感知训练</span>
            </div>
            <div>
              <Route size={18} />
              <span>RL agent 泛化</span>
            </div>
            <div>
              <GitBranch size={18} />
              <span>Badcase 闭环</span>
            </div>
            <div>
              <Map size={18} />
              <span>V3-ready 3D</span>
            </div>
          </section>

          <nav aria-label="Workbench workflow" className="tabbar" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  aria-controls={`panel-${tab.id}`}
                  aria-selected={selected}
                  className={selected ? "active" : ""}
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <section
            aria-labelledby={`tab-${activeTab}`}
            className="workspace"
            id={`panel-${activeTab}`}
            role="tabpanel"
          >
            {activePanel}
          </section>
        </section>
      ) : null}
    </main>
  );
}
