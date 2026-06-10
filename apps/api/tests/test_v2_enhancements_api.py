import unittest

from fastapi.testclient import TestClient

from app.main import app


class V2EnhancementsApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_dataset_drift_report_compares_v1_and_v2(self) -> None:
        response = self.client.get("/api/datasets/drift")

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["id"], "dataset-drift-v1-v2")
        self.assertEqual(report["source_dataset_id"], "dataset-v1")
        self.assertEqual(report["target_dataset_id"], "dataset-v2")
        self.assertGreater(report["drift_score"], 0)
        self.assertIn("scenario-dense-dynamic-pet", report["scenario_deltas"])
        self.assertIn("密集动态障碍", report["recommended_actions"][0])

    def test_model_regression_guardrail_records_promotion_decision(self) -> None:
        response = self.client.get("/api/model-guardrails/regression")

        self.assertEqual(response.status_code, 200)
        guardrails = response.json()
        guardrail = next(item for item in guardrails if item["id"] == "guardrail-det-yolo-v2")
        self.assertEqual(guardrail["candidate_model_id"], "model-det-yolo-v2")
        self.assertEqual(guardrail["baseline_model_id"], "model-det-yolo-v1")
        self.assertEqual(guardrail["promotion_decision"], "needs-review")
        self.assertIn("unseen small-object recall", guardrail["blocked_reasons"][0])

    def test_augmentation_presets_cover_long_tail_conditions(self) -> None:
        response = self.client.get("/api/augmentation-presets")

        self.assertEqual(response.status_code, 200)
        presets = response.json()
        preset_ids = {preset["id"] for preset in presets}
        self.assertIn("aug-shadow-glare", preset_ids)
        self.assertIn("aug-rain-fog-blur", preset_ids)
        self.assertIn("aug-small-object-occlusion", preset_ids)
        small_object = next(preset for preset in presets if preset["id"] == "aug-small-object-occlusion")
        self.assertIn("badcase-small-stone-001", small_object["linked_badcases"])

    def test_rl_episode_clusters_group_repeated_failures(self) -> None:
        response = self.client.get("/api/rl/episode-clusters")

        self.assertEqual(response.status_code, 200)
        clusters = response.json()
        categories = {cluster["failure_category"] for cluster in clusters}
        self.assertIn("rl-stuck", categories)
        self.assertIn("near-miss", categories)
        stuck = next(cluster for cluster in clusters if cluster["failure_category"] == "rl-stuck")
        self.assertGreater(stuck["cluster_size"], 1)
        self.assertIn("episode-v2-dynamic-014", stuck["linked_episodes"])
        self.assertIn("badcase-ppo-stuck-014", stuck["representative_badcases"])


if __name__ == "__main__":
    unittest.main()

