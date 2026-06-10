import unittest

from fastapi.testclient import TestClient

from app.main import app


class V3PlanningApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_v3_promotion_plan_keeps_industrial_track_separate(self) -> None:
        response = self.client.get("/api/backlog/v3/promotion-plan")

        self.assertEqual(response.status_code, 200)
        plan = response.json()
        self.assertEqual(plan["id"], "v3-promotion-plan")
        self.assertEqual(plan["v2_scope_lock"], "closed")
        self.assertIn("ROS 2 / Gazebo or Isaac Sim", plan["candidate_promotions"])
        self.assertIn("real sensor logs", plan["candidate_promotions"])
        self.assertIn("V2 remains metadata/simulation only", plan["scope_guardrails"][0])

    def test_create_v3_backlog_item_appends_record(self) -> None:
        response = self.client.post(
            "/api/backlog/v3",
            json={
                "id": "V3-099",
                "priority": "P1",
                "title": "Fleet log replay service",
                "module": "fleet-data",
                "expected_value": "支持海外场景 fleet feedback 和远程回放",
                "dependency": "fleet upload pipeline",
                "version_target": "V3",
                "status": "planned",
            },
        )

        self.assertEqual(response.status_code, 200)
        item = response.json()
        self.assertEqual(item["id"], "V3-099")
        self.assertEqual(item["version_target"], "V3")

        list_response = self.client.get("/api/backlog/v3")
        self.assertIn("V3-099", {entry["id"] for entry in list_response.json()})

    def test_create_v3_backlog_rejects_non_v3_target(self) -> None:
        response = self.client.post(
            "/api/backlog/v3",
            json={
                "id": "V2-BAD",
                "priority": "P1",
                "title": "Wrong target",
                "module": "scope",
                "expected_value": "should fail",
                "dependency": "none",
                "version_target": "V2",
                "status": "planned",
            },
        )

        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()

