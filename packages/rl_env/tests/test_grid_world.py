import unittest

from packages.rl_env.grid_world import GridWorldConfig, MowingGridEnvironment


class MowingGridEnvironmentTest(unittest.TestCase):
    def test_reset_returns_deterministic_observation(self) -> None:
        config = GridWorldConfig(width=5, height=5, start=(1, 1), heading="east")
        first = MowingGridEnvironment(config).reset(seed=7)
        second = MowingGridEnvironment(config).reset(seed=7)

        self.assertEqual(first["robot"]["position"], second["robot"]["position"])
        self.assertEqual(first["robot"]["heading"], "east")
        self.assertEqual(first["remaining_coverage"], second["remaining_coverage"])
        self.assertEqual(len(first["lidar"]), 8)
        self.assertEqual(len(first["ultrasonic"]), 4)

    def test_forward_step_covers_new_grass_and_rewards_progress(self) -> None:
        env = MowingGridEnvironment(GridWorldConfig(width=5, height=5, start=(1, 1), heading="east"))
        env.reset(seed=1)

        observation, reward, terminated, truncated, info = env.step("forward")

        self.assertEqual(observation["robot"]["position"], (2, 1))
        self.assertGreater(reward, 0)
        self.assertFalse(terminated)
        self.assertFalse(truncated)
        self.assertEqual(info["event"], "new-coverage")

    def test_repeated_coverage_is_penalized(self) -> None:
        env = MowingGridEnvironment(GridWorldConfig(width=5, height=5, start=(1, 1), heading="east"))
        env.reset(seed=1)
        env.step("forward")

        _, reward, terminated, _, info = env.step("slow_stop")

        self.assertLess(reward, 0)
        self.assertFalse(terminated)
        self.assertEqual(info["event"], "repeat-coverage")

    def test_obstacle_collision_terminates_with_penalty(self) -> None:
        env = MowingGridEnvironment(
            GridWorldConfig(width=5, height=5, start=(1, 1), heading="east", obstacles=((2, 1),))
        )
        env.reset(seed=1)

        _, reward, terminated, truncated, info = env.step("forward")

        self.assertTrue(terminated)
        self.assertFalse(truncated)
        self.assertLessEqual(reward, -5)
        self.assertEqual(info["event"], "collision")

    def test_boundary_violation_terminates_with_penalty(self) -> None:
        env = MowingGridEnvironment(GridWorldConfig(width=3, height=3, start=(2, 1), heading="east"))
        env.reset(seed=1)

        _, reward, terminated, _, info = env.step("forward")

        self.assertTrue(terminated)
        self.assertLessEqual(reward, -5)
        self.assertEqual(info["event"], "boundary-violation")

    def test_target_coverage_terminates_successfully(self) -> None:
        env = MowingGridEnvironment(
            GridWorldConfig(width=3, height=3, start=(1, 1), heading="east", target_coverage_rate=1.0)
        )
        env.reset(seed=1)

        _, reward, terminated, _, info = env.step("forward")

        self.assertTrue(terminated)
        self.assertGreater(reward, 5)
        self.assertEqual(info["event"], "coverage-complete")

    def test_sensor_observations_have_stable_lengths(self) -> None:
        env = MowingGridEnvironment(
            GridWorldConfig(width=6, height=6, start=(2, 2), heading="north", obstacles=((2, 0), (4, 2)))
        )

        observation = env.reset(seed=3)

        self.assertEqual(len(observation["lidar"]), 8)
        self.assertEqual(len(observation["ultrasonic"]), 4)
        self.assertTrue(all(distance >= 0 for distance in observation["lidar"]))
        self.assertTrue(all(distance >= 0 for distance in observation["ultrasonic"]))


if __name__ == "__main__":
    unittest.main()

