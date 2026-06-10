import unittest

from fastapi.testclient import TestClient

from app.main import app


class RLWorkflowApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_rl_environments_expose_sensor_aware_v2_records(self) -> None:
        response = self.client.get("/api/rl/environments")

        self.assertEqual(response.status_code, 200)
        environments = response.json()
        self.assertGreaterEqual(len(environments), 1)
        environment = environments[0]
        self.assertEqual(environment["id"], "rl-env-v2-grid")
        self.assertIn("LiDAR", environment["sensor_modalities"])
        self.assertIn("ultrasonic", environment["sensor_modalities"])
        self.assertIn("dynamic people/pet actors", environment["scenario_features"])

    def test_rl_environment_detail_exposes_spaces_rewards_and_adapter(self) -> None:
        response = self.client.get("/api/rl/environments/rl-env-v2-grid")

        self.assertEqual(response.status_code, 200)
        environment = response.json()
        self.assertEqual(environment["map_generator"], "grid-irregular-lawn-v2")
        self.assertIn("forward", environment["action_space"]["actions"])
        self.assertIn("simulated_lidar", environment["observation_space"])
        self.assertLess(environment["reward_config"]["collision"], 0)
        self.assertIn("target_coverage", environment["termination_rules"])
        self.assertEqual(environment["simulator_adapter"], "SimulatorAdapter:v2-grid")

    def test_rl_policies_expose_ppo_curriculum_domain_randomization_and_metrics(self) -> None:
        response = self.client.get("/api/rl/policies")

        self.assertEqual(response.status_code, 200)
        policies = response.json()
        policy = next(item for item in policies if item["id"] == "ppo-v2")
        self.assertEqual(policy["algorithm"], "PPO")
        self.assertEqual(policy["environment_version_id"], "rl-env-v2-grid")
        self.assertGreater(policy["training_config"]["learning_rate"], 0)
        self.assertEqual(policy["curriculum_stage"], "curriculum-stage-3")
        self.assertIn("lighting", policy["domain_randomization"])
        self.assertGreater(policy["metrics"]["coverage_rate"], 0.8)
        self.assertTrue(policy["artifact_path"].endswith("policy.zip"))

    def test_rl_baselines_include_random_and_rule_based_planners(self) -> None:
        response = self.client.get("/api/rl/baselines")

        self.assertEqual(response.status_code, 200)
        baselines = response.json()
        baseline_ids = {baseline["id"] for baseline in baselines}
        self.assertIn("random-policy", baseline_ids)
        self.assertIn("rule-coverage-planner", baseline_ids)

    def test_episode_replay_exposes_path_dynamic_actors_sensors_and_timeline(self) -> None:
        response = self.client.get("/api/rl/episodes/episode-v2-dynamic-014")

        self.assertEqual(response.status_code, 200)
        episode = response.json()
        self.assertEqual(episode["id"], "episode-v2-dynamic-014")
        self.assertEqual(episode["policy_version_id"], "ppo-v2")
        self.assertTrue(episode["three_d_ready"])
        self.assertGreater(len(episode["path"]), 2)
        self.assertGreater(len(episode["dynamic_actors"]), 0)
        self.assertGreater(len(episode["frames"]), 0)
        self.assertIn("pet", episode["dynamic_actors"][0]["actor_type"])
        self.assertIn("lidar", episode["frames"][0])
        self.assertIn("ultrasonic", episode["frames"][0])
        self.assertIn("near-miss", episode["event_markers"])

    def test_unknown_episode_returns_404(self) -> None:
        response = self.client.get("/api/rl/episodes/missing-episode")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "RL episode not found")


if __name__ == "__main__":
    unittest.main()

