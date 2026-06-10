import unittest

from fastapi.testclient import TestClient

from app.main import app


class GeneralizationBadcaseApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_rl_evaluations_include_train_validation_and_unseen_splits(self) -> None:
        response = self.client.get("/api/rl/evaluations")

        self.assertEqual(response.status_code, 200)
        reports = response.json()
        report = next(item for item in reports if item["id"] == "eval-unseen-014")
        splits = {item["split"] for item in report["split_metrics"]}
        self.assertEqual(splits, {"train", "validation", "unseen"})
        self.assertEqual(report["policy_version_id"], "ppo-v2")

    def test_rl_evaluation_detail_exposes_generalization_metrics(self) -> None:
        response = self.client.get("/api/rl/evaluations/eval-unseen-014")

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["id"], "eval-unseen-014")
        self.assertEqual(report["policy_version_id"], "ppo-v2")
        self.assertGreaterEqual(report["metrics"]["coverage_rate"], 0.8)
        self.assertIn("dynamic_obstacle_response_ms", report["metrics"])
        unseen = next(item for item in report["split_metrics"] if item["split"] == "unseen")
        self.assertLess(unseen["metrics"]["success_rate"], 0.75)
        self.assertIn("narrow-passage", unseen["weak_scenario_tags"])

    def test_policy_comparison_contains_random_rule_based_and_ppo(self) -> None:
        response = self.client.get("/api/policy-comparisons")

        self.assertEqual(response.status_code, 200)
        comparisons = response.json()
        comparison = next(item for item in comparisons if item["id"] == "policy-comparison-v2")
        compared_ids = {item["policy_or_baseline_id"] for item in comparison["entries"]}
        self.assertIn("random-policy", compared_ids)
        self.assertIn("rule-coverage-planner", compared_ids)
        self.assertIn("ppo-v2", compared_ids)
        self.assertIn("ppo-v2", comparison["recommended_policy_id"])

    def test_badcase_filter_returns_rl_narrow_passage_failure(self) -> None:
        response = self.client.get(
            "/api/badcases",
            params={"source_type": "rl", "severity": "high", "scenario_tag": "narrow-passage"},
        )

        self.assertEqual(response.status_code, 200)
        badcases = response.json()
        self.assertEqual([item["id"] for item in badcases], ["badcase-ppo-stuck-014"])

    def test_badcase_detail_exposes_root_cause_and_recommendation(self) -> None:
        response = self.client.get("/api/badcases/badcase-ppo-stuck-014")

        self.assertEqual(response.status_code, 200)
        badcase = response.json()
        self.assertEqual(badcase["source_type"], "rl")
        self.assertEqual(badcase["root_cause"], "reward misspecification")
        self.assertIn("reward config", badcase["recommended_action"])

    def test_badcase_status_update(self) -> None:
        response = self.client.patch(
            "/api/badcases/badcase-ppo-stuck-014",
            json={"status": "in-progress", "owner": "rl-engineer"},
        )

        self.assertEqual(response.status_code, 200)
        badcase = response.json()
        self.assertEqual(badcase["status"], "in-progress")
        self.assertEqual(badcase["owner"], "rl-engineer")

    def test_recommendation_escalates_simulator_limitation_to_v3(self) -> None:
        response = self.client.post("/api/badcases/badcase-sim-gap-001/recommendation")

        self.assertEqual(response.status_code, 200)
        recommendation = response.json()
        self.assertTrue(recommendation["create_v3_backlog_item"])
        self.assertEqual(recommendation["target_module"], "simulation")
        self.assertIn("ROS 2", recommendation["recommended_action"])


if __name__ == "__main__":
    unittest.main()

