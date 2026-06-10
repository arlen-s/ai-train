from app.schemas.core import DashboardSummary
from app.services.seed_data import build_dashboard_summary


def get_dashboard_summary() -> DashboardSummary:
    return build_dashboard_summary()
