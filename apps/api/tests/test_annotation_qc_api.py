import unittest

from fastapi.testclient import TestClient

from app.main import app


class AnnotationQCApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_current_label_schema_exposes_required_taxonomy_and_tools(self) -> None:
        response = self.client.get("/api/label-schemas/current")

        self.assertEqual(response.status_code, 200)
        schema = response.json()
        self.assertEqual(schema["id"], "label-schema-v2")
        self.assertIn("LabelImg", schema["allowed_tools"])
        self.assertIn("LabelMe", schema["allowed_tools"])
        self.assertIn("CVAT", schema["allowed_tools"])
        detection_names = [item["name"] for item in schema["detection_classes"]]
        segmentation_names = [item["name"] for item in schema["segmentation_classes"]]
        point_cloud_names = [item["name"] for item in schema["point_cloud_classes"]]
        self.assertIn("person", detection_names)
        self.assertIn("pet", detection_names)
        self.assertIn("forbidden-zone", segmentation_names)
        self.assertIn("obstacle-point-cluster", point_cloud_names)
        self.assertIn("missing-label", schema["qc_issue_categories"])

    def test_annotation_tasks_return_dataset_v2_work_items(self) -> None:
        response = self.client.get("/api/annotation-tasks")

        self.assertEqual(response.status_code, 200)
        tasks = response.json()
        self.assertGreaterEqual(len(tasks), 2)
        dataset_v2_tasks = [task for task in tasks if task["dataset_version_id"] == "dataset-v2"]
        self.assertTrue(dataset_v2_tasks)
        self.assertIn("badcase-shadow-boundary-001", dataset_v2_tasks[0]["linked_badcases"])

    def test_annotation_task_detail_exposes_qc_state_and_badcases(self) -> None:
        response = self.client.get("/api/annotation-tasks/ann-boundary-009")

        self.assertEqual(response.status_code, 200)
        task = response.json()
        self.assertEqual(task["id"], "ann-boundary-009")
        self.assertEqual(task["task_type"], "segmentation")
        self.assertEqual(task["qc_status"], "review")
        self.assertIn("poor-boundary", task["qc_issue_categories"])
        self.assertIn("badcase-shadow-boundary-001", task["linked_badcases"])

    def test_qc_update_changes_status_and_reviewer_notes(self) -> None:
        response = self.client.patch(
            "/api/annotation-tasks/ann-boundary-009/qc",
            json={
                "qc_status": "passed",
                "qc_issue_categories": ["poor-boundary", "occlusion"],
                "reviewer": "qa-reviewer",
                "reviewer_notes": "边界 mask 已复核，保留 occlusion 标记用于 Badcase 回归。",
            },
        )

        self.assertEqual(response.status_code, 200)
        task = response.json()
        self.assertEqual(task["qc_status"], "passed")
        self.assertEqual(task["reviewer"], "qa-reviewer")
        self.assertIn("occlusion", task["qc_issue_categories"])
        self.assertIn("Badcase 回归", task["reviewer_notes"])

    def test_qc_update_rejects_invalid_issue_category(self) -> None:
        response = self.client.patch(
            "/api/annotation-tasks/ann-boundary-009/qc",
            json={
                "qc_status": "failed",
                "qc_issue_categories": ["not-a-real-category"],
                "reviewer": "qa-reviewer",
                "reviewer_notes": "invalid category should fail",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Invalid QC issue category: not-a-real-category")


if __name__ == "__main__":
    unittest.main()
