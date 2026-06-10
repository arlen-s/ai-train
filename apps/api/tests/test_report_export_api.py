import unittest

from fastapi.testclient import TestClient

from app.main import app


class ReportExportApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_project_summary_contains_delivery_sections_and_source_versions(self) -> None:
        response = self.client.get("/api/reports/project-summary")

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["id"], "project-summary-v2")
        self.assertEqual(report["format"], "structured")
        required_sections = {
            "JD Mapping",
            "Data Coverage",
            "Annotation QC",
            "Perception Results",
            "RL Generalization",
            "Badcase Loop",
            "Limitations",
            "V3 Plan",
        }
        self.assertTrue(required_sections.issubset(set(report["sections"].keys())))
        self.assertEqual(report["source_versions"]["dataset"], "dataset-v2")
        self.assertEqual(report["source_versions"]["policy"], "ppo-v2")
        self.assertEqual(report["source_versions"]["evaluation"], "eval-unseen-014")
        self.assertIn("python3 -m unittest", report["verification_commands"][0])

    def test_markdown_export_contains_portfolio_headings(self) -> None:
        response = self.client.post("/api/reports/export", json={"format": "markdown"})

        self.assertEqual(response.status_code, 200)
        export = response.json()
        self.assertEqual(export["id"], "report-export-v2-markdown")
        self.assertEqual(export["format"], "markdown")
        self.assertEqual(export["artifact_path"], "artifacts/reports/lawnbot-v2-project-summary.md")
        content = export["content"]
        self.assertIn("# LawnBot AI V2 Project Summary", content)
        self.assertIn("## JD Mapping", content)
        self.assertIn("## Data Coverage", content)
        self.assertIn("## Perception Results", content)
        self.assertIn("## RL Generalization", content)
        self.assertIn("## Badcase Loop", content)
        self.assertIn("## V3 Plan", content)

    def test_export_rejects_unsupported_format(self) -> None:
        response = self.client.post("/api/reports/export", json={"format": "pdf"})

        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()

