import unittest

from packages.evaluation.metrics import binary_mask_iou, calculate_precision_recall_f1


class PerceptionMetricsTest(unittest.TestCase):
    def test_precision_recall_f1_from_controlled_counts(self) -> None:
        metrics = calculate_precision_recall_f1(
            true_positive=8,
            false_positive=2,
            false_negative=4,
        )

        self.assertEqual(round(metrics["precision"], 4), 0.8)
        self.assertEqual(round(metrics["recall"], 4), 0.6667)
        self.assertEqual(round(metrics["f1"], 4), 0.7273)

    def test_precision_recall_f1_rejects_negative_counts(self) -> None:
        with self.assertRaisesRegex(ValueError, "counts must be non-negative"):
            calculate_precision_recall_f1(
                true_positive=4,
                false_positive=-1,
                false_negative=2,
            )

    def test_binary_mask_iou_from_controlled_masks(self) -> None:
        prediction = [[1, 1, 0], [0, 1, 0]]
        target = [[1, 0, 0], [0, 1, 1]]

        self.assertEqual(binary_mask_iou(prediction, target), 0.5)

    def test_binary_mask_iou_rejects_mismatched_shapes(self) -> None:
        with self.assertRaisesRegex(ValueError, "mask shapes must match"):
            binary_mask_iou([[1, 0], [0, 1]], [[1, 0, 1]])


if __name__ == "__main__":
    unittest.main()

