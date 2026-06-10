from typing import List


def calculate_precision_recall_f1(
    true_positive: int,
    false_positive: int,
    false_negative: int,
) -> dict[str, float]:
    counts = [true_positive, false_positive, false_negative]
    if any(count < 0 for count in counts):
        raise ValueError("counts must be non-negative")

    precision_denominator = true_positive + false_positive
    recall_denominator = true_positive + false_negative
    precision = true_positive / precision_denominator if precision_denominator else 0.0
    recall = true_positive / recall_denominator if recall_denominator else 0.0
    f1_denominator = precision + recall
    f1 = 2 * precision * recall / f1_denominator if f1_denominator else 0.0

    return {"precision": precision, "recall": recall, "f1": f1}


def binary_mask_iou(prediction: List[List[int]], target: List[List[int]]) -> float:
    _validate_mask_shape(prediction, target)

    intersection = 0
    union = 0
    for row_index, prediction_row in enumerate(prediction):
        for column_index, prediction_value in enumerate(prediction_row):
            target_value = target[row_index][column_index]
            prediction_foreground = prediction_value == 1
            target_foreground = target_value == 1
            if prediction_foreground and target_foreground:
                intersection += 1
            if prediction_foreground or target_foreground:
                union += 1

    return intersection / union if union else 1.0


def _validate_mask_shape(prediction: List[List[int]], target: List[List[int]]) -> None:
    if len(prediction) != len(target):
        raise ValueError("mask shapes must match")
    for row_index, prediction_row in enumerate(prediction):
        if len(prediction_row) != len(target[row_index]):
            raise ValueError("mask shapes must match")

