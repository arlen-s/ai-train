import unittest

from packages.evaluation.rl_metrics import calculate_coverage_rate, calculate_repeat_coverage_rate


class RLMetricsTest(unittest.TestCase):
    def test_coverage_rate_from_controlled_counts(self) -> None:
        self.assertEqual(calculate_coverage_rate(covered_cells=82, coverable_cells=100), 0.82)

    def test_repeat_coverage_rate_from_controlled_counts(self) -> None:
        self.assertEqual(calculate_repeat_coverage_rate(repeat_steps=11, total_steps=100), 0.11)

    def test_coverage_rate_rejects_invalid_counts(self) -> None:
        with self.assertRaisesRegex(ValueError, "covered_cells must be non-negative"):
            calculate_coverage_rate(covered_cells=-1, coverable_cells=100)
        with self.assertRaisesRegex(ValueError, "coverable_cells must be greater than zero"):
            calculate_coverage_rate(covered_cells=1, coverable_cells=0)

    def test_repeat_coverage_rate_rejects_invalid_counts(self) -> None:
        with self.assertRaisesRegex(ValueError, "repeat_steps must be non-negative"):
            calculate_repeat_coverage_rate(repeat_steps=-1, total_steps=100)
        with self.assertRaisesRegex(ValueError, "total_steps must be greater than zero"):
            calculate_repeat_coverage_rate(repeat_steps=1, total_steps=0)


if __name__ == "__main__":
    unittest.main()

