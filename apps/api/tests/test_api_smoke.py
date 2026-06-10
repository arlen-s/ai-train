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
