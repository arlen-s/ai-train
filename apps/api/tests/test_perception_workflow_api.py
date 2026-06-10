import unittest

from fastapi.testclient import TestClient

from app.main import app


class PerceptionWorkflowApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_training_runs_include_detection_and_segmentation_for_dataset_v2(self) -> None:
        response = self.client.get("/api/training-runs")

        self.assertEqual(response.status_code, 200)
        runs = response.json()
        self.assertGreaterEqual(len(runs), 2)
        dataset_v2_runs = [run for run in runs if run["dataset_version_id"] == "dataset-v2"]
        tasks = {run["task"] for run in dataset_v2_runs}
        self.assertIn("obstacle-detection", tasks)
        self.assertIn("boundary-segmentation", tasks)

    def test_training_run_detail_exposes_metrics_artifacts_and_links(self) -> None:
        response = self.client.get("/api/training-runs/det-yolo-v2")

        self.assertEqual(response.status_code, 200)
        run = response.json()
        self.assertEqual(run["id"], "det-yolo-v2")
        self.assertEqual(run["dataset_version_id"], "dataset-v2")
        self.assertEqual(run["task"], "obstacle-detection")
        self.assertEqual(run["status"], "completed")
        self.assertEqual(run["linked_model_version_id"], "model-det-yolo-v2")
        self.assertEqual(run["onnx_export_status"], "ready")
        self.assertLessEqual(run["latency_ms"], 40)
        self.assertGreater(run["hyperparameters"]["learning_rate"], 0)
        self.assertGreater(run["final_metrics"]["mAP"], 0.8)
        self.assertIn("eval-perception-v2", run["linked_evaluation_reports"])
        self.assertIn("badcase-small-stone-001", run["linked_badcases"])

    def test_model_versions_include_promotion_and_evaluation_links(self) -> None:
        response = self.client.get("/api/models")

        self.assertEqual(response.status_code, 200)
        models = response.json()
        model = next(item for item in models if item["id"] == "model-det-yolo-v2")
        self.assertEqual(model["training_run_id"], "det-yolo-v2")
        self.assertEqual(model["promotion_status"], "candidate")
        self.assertIn("eval-perception-v2", model["linked_evaluation_reports"])
        self.assertIn("badcase-small-stone-001", model["linked_badcases"])

    def test_evaluation_detail_exposes_scenario_breakdown_and_badcases(self) -> None:
        response = self.client.get("/api/evaluations/eval-perception-v2")

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["id"], "eval-perception-v2")
        self.assertEqual(report["target_type"], "perception-model")
        self.assertEqual(report["target_version_id"], "model-det-yolo-v2")
        self.assertGreater(report["metrics"]["mAP"], 0.8)
        self.assertIn("badcase-small-stone-001", report["linked_badcases"])
        dense_dynamic = [
            item
            for item in report["scenario_breakdown"]
            if item["scenario_id"] == "scenario-dense-dynamic-pet"
        ]
        self.assertTrue(dense_dynamic)
        self.assertEqual(dense_dynamic[0]["split"], "unseen")
        self.assertIn("small-object recall weak", dense_dynamic[0]["weak_signals"])

    def test_create_perception_badcase_maps_root_cause_to_recommendation(self) -> None:
        response = self.client.post(
            "/api/badcases",
            json={
                "source_type": "perception",
                "source_version_id": "model-det-yolo-v2",
                "category": "perception-false-negative",
                "severity": "high",
                "scenario_tags": ["small-object", "shadow", "unseen"],
                "root_cause": "class imbalance",
                "evidence_reference": "artifacts/evaluations/eval-perception-v2/small-stone-fn-009.png",
                "owner": "algorithm-engineer",
                "linked_evaluation_report_id": "eval-perception-v2",
            },
        )

        self.assertEqual(response.status_code, 200)
        badcase = response.json()
        self.assertTrue(badcase["id"].startswith("badcase-perception-"))
        self.assertEqual(badcase["status"], "open")
        self.assertEqual(badcase["source_version_id"], "model-det-yolo-v2")
        self.assertIn("rebalance dataset", badcase["recommended_action"])

    def test_badcase_list_contains_seeded_perception_failures(self) -> None:
        response = self.client.get("/api/badcases")

        self.assertEqual(response.status_code, 200)
        badcases = response.json()
        categories = {item["category"] for item in badcases}
        self.assertIn("perception-false-negative", categories)
        self.assertIn("boundary-segmentation-error", categories)

    def test_unknown_training_run_returns_404(self) -> None:
        response = self.client.get("/api/training-runs/missing-run")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Training run not found")

    def test_badcase_creation_rejects_unknown_source_version(self) -> None:
        response = self.client.post(
            "/api/badcases",
            json={
                "source_type": "perception",
                "source_version_id": "missing-model",
                "category": "perception-false-positive",
                "severity": "medium",
                "scenario_tags": ["glare"],
                "root_cause": "model false positive",
                "evidence_reference": "artifacts/evaluations/eval-perception-v2/glare-fp-001.png",
                "owner": "algorithm-engineer",
                "linked_evaluation_report_id": "eval-perception-v2",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Unknown perception source version: missing-model")


if __name__ == "__main__":
    unittest.main()

