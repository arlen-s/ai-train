from typing import Optional

from app.schemas.core import PlannerBaseline, RLEnvironmentVersion, RLEpisodeReplay, RLPolicyVersion
from app.services.seed_data import RL_BASELINES, RL_ENVIRONMENTS, RL_EPISODES, RL_POLICIES


def list_rl_environments() -> list[RLEnvironmentVersion]:
    return RL_ENVIRONMENTS


def get_rl_environment_or_none(environment_id: str) -> Optional[RLEnvironmentVersion]:
    return next((environment for environment in RL_ENVIRONMENTS if environment.id == environment_id), None)


def list_rl_policies() -> list[RLPolicyVersion]:
    return RL_POLICIES


def get_rl_policy_or_none(policy_id: str) -> Optional[RLPolicyVersion]:
    return next((policy for policy in RL_POLICIES if policy.id == policy_id), None)


def list_rl_baselines() -> list[PlannerBaseline]:
    return RL_BASELINES


def get_rl_episode_or_none(episode_id: str) -> Optional[RLEpisodeReplay]:
    return next((episode for episode in RL_EPISODES if episode.id == episode_id), None)

