import unittest

from fastapi.testclient import TestClient

from app.main import app


class GovernanceApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_scenario_coverage_marks_weak_dynamic_obstacle_group(self) -> None:
        response = self.client.get("/api/scenarios/coverage")

        self.assertEqual(response.status_code, 200)
        coverage = response.json()
        weak_items = [item for item in coverage if item["coverage_level"] == "gap"]
        self.assertTrue(weak_items)
        self.assertEqual(weak_items[0]["scenario_id"], "scenario-dense-dynamic-pet")
        self.assertIn("补充动态障碍仿真", weak_items[0]["recommended_action"])

    def test_dataset_list_contains_immutable_v2_metadata(self) -> None:
        response = self.client.get("/api/datasets")

        self.assertEqual(response.status_code, 200)
        datasets = response.json()
        self.assertGreaterEqual(len(datasets), 2)
        dataset_v2 = next(item for item in datasets if item["id"] == "dataset-v2")
        self.assertTrue(dataset_v2["immutable_after_training"])
        self.assertIn("camera", dataset_v2["sensor_modalities"])
        self.assertIn("lidar", dataset_v2["sensor_modalities"])

    def test_dataset_detail_links_training_evaluation_and_badcases(self) -> None:
        response = self.client.get("/api/datasets/dataset-v2")

        self.assertEqual(response.status_code, 200)
        dataset = response.json()
        self.assertEqual(dataset["id"], "dataset-v2")
        self.assertIn("det-yolo-v2", dataset["linked_training_runs"])
        self.assertIn("eval-unseen-014", dataset["linked_evaluation_reports"])
        self.assertIn("badcase-shadow-boundary-001", dataset["linked_badcases"])

    def test_dataset_coverage_exposes_v3_real_log_reservation(self) -> None:
        response = self.client.get("/api/datasets/dataset-v2/coverage")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["dataset_id"], "dataset-v2")
        self.assertIn("scenario-dense-dynamic-pet", payload["coverage_by_scenario"])
        self.assertIn("rosbag", payload["v3_reserved_sources"])
        self.assertIn("MCAP", payload["v3_reserved_sources"])

    def test_unknown_dataset_returns_404(self) -> None:
        response = self.client.get("/api/datasets/missing-dataset")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Dataset version not found")


if __name__ == "__main__":
    unittest.main()
