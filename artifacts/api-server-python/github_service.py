"""
GitHub Activity Service
Fetches and caches public GitHub events for the portfolio.
"""

import time
import httpx
from datetime import datetime, timezone

GITHUB_USERNAME = "yaswanthsailalam"
GITHUB_API_URL = f"https://api.github.com/users/{GITHUB_USERNAME}/events/public"

# In-memory cache (15-minute TTL)
_cache = {"data": None, "expires_at": 0}
CACHE_TTL = 900  # 15 minutes


def _parse_event(event: dict) -> dict | None:
    """Convert a raw GitHub event into a clean, frontend-friendly object."""
    event_type = event.get("type", "")
    repo_name = event.get("repo", {}).get("name", "")
    created_at = event.get("created_at", "")
    payload = event.get("payload", {})

    if event_type == "PushEvent":
        commits = payload.get("commits", [])
        commit_count = len(commits)
        branch = (payload.get("ref", "refs/heads/main") or "").replace("refs/heads/", "")
        message = commits[-1].get("message", "") if commits else ""
        return {
            "type": "push",
            "repo": repo_name,
            "branch": branch,
            "commits": commit_count,
            "message": message[:120],
            "created_at": created_at,
        }

    elif event_type == "CreateEvent":
        ref_type = payload.get("ref_type", "")
        ref = payload.get("ref", "")
        if ref_type == "repository":
            return {
                "type": "create_repo",
                "repo": repo_name,
                "created_at": created_at,
            }
        elif ref_type == "branch":
            return {
                "type": "create_branch",
                "repo": repo_name,
                "branch": ref,
                "created_at": created_at,
            }

    elif event_type == "PullRequestEvent":
        action = payload.get("action", "")
        pr = payload.get("pull_request", {})
        title = pr.get("title", "")
        return {
            "type": "pull_request",
            "repo": repo_name,
            "action": action,
            "title": title[:120],
            "created_at": created_at,
        }

    elif event_type == "WatchEvent":
        return {
            "type": "star",
            "repo": repo_name,
            "created_at": created_at,
        }

    elif event_type == "ForkEvent":
        return {
            "type": "fork",
            "repo": repo_name,
            "created_at": created_at,
        }

    elif event_type == "IssuesEvent":
        action = payload.get("action", "")
        issue = payload.get("issue", {})
        title = issue.get("title", "")
        return {
            "type": "issue",
            "repo": repo_name,
            "action": action,
            "title": title[:120],
            "created_at": created_at,
        }

    return None


async def fetch_github_activity(limit: int = 15) -> list[dict]:
    """Fetch recent GitHub activity, using cache if fresh."""
    now = time.time()

    if _cache["data"] is not None and now < _cache["expires_at"]:
        return _cache["data"][:limit]

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                GITHUB_API_URL,
                headers={
                    "Accept": "application/vnd.github+json",
                    "User-Agent": "InsightFlow-Portfolio",
                },
                params={"per_page": 30},
                timeout=10.0,
            )

            if resp.status_code != 200:
                print(f"GitHub API error: {resp.status_code} - {resp.text[:200]}")
                # Return stale cache if available
                if _cache["data"] is not None:
                    return _cache["data"][:limit]
                return []

            raw_events = resp.json()
            parsed = []
            for ev in raw_events:
                result = _parse_event(ev)
                if result:
                    parsed.append(result)

            _cache["data"] = parsed
            _cache["expires_at"] = now + CACHE_TTL

            return parsed[:limit]

    except Exception as e:
        print(f"GitHub fetch error: {e}")
        if _cache["data"] is not None:
            return _cache["data"][:limit]
        return []
