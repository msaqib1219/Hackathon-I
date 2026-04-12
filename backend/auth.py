"""
Authentication module for RAG Chatbot API

Implements:
- better-auth session verification (cookie-based)
- API Key validation (backward compat)
- Rate limiting per session
"""

import os
import secrets
import hashlib
from typing import Optional
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Security, Request, Depends
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv

load_dotenv()

# Security schemes
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


# --- better-auth session verification ---

async def verify_better_auth_session(request: Request) -> Optional[dict]:
    """Read better-auth session cookie and look up session in shared DB.

    better-auth stores sessions in a `session` table with a token column.
    The cookie name is `better-auth.session_token`.
    Returns user dict with questionnaire fields or None.
    """
    import asyncpg

    session_token = request.cookies.get("better-auth.session_token")
    if not session_token:
        return None

    database_url = os.getenv("DATABASE_URL")
    conn = await asyncpg.connect(database_url)
    try:
        row = await conn.fetchrow('''
            SELECT s."userId", s."expiresAt",
                   u.id, u.email, u.name,
                   u."experienceLevel", u."programmingLanguages",
                   u."aiMlFamiliarity", u."hardwareExperience",
                   u."learningGoals", u."questionnaireCompleted"
            FROM session s
            JOIN "user" u ON u.id = s."userId"
            WHERE s.token = $1
        ''', session_token)
    finally:
        await conn.close()

    if not row:
        return None

    # Check expiration
    expires_at = row["expiresAt"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None

    return {
        "sub": str(row["id"]),
        "email": row["email"],
        "name": row["name"],
        "experienceLevel": row["experienceLevel"] or "",
        "programmingLanguages": row["programmingLanguages"] or "",
        "aiMlFamiliarity": row["aiMlFamiliarity"] or "",
        "hardwareExperience": row["hardwareExperience"] or "",
        "learningGoals": row["learningGoals"] or "",
        "questionnaireCompleted": row["questionnaireCompleted"] or False,
    }


async def verify_auth(
    request: Request,
    api_key: Optional[str] = Security(api_key_header),
) -> dict:
    """FastAPI dependency: accepts better-auth session cookie or API key.

    Tries better-auth session first, falls back to API key.
    """
    # Try better-auth session cookie
    session_user = await verify_better_auth_session(request)
    if session_user:
        return session_user

    # Fall back to API key
    if api_key is not None:
        valid_keys = get_valid_api_keys()
        if not valid_keys:
            if os.getenv("AUTH_DEV_MODE", "false").lower() == "true":
                return {"sub": None, "api_key": api_key}
        elif api_key in valid_keys:
            return {"sub": None, "api_key": api_key}

    raise HTTPException(
        status_code=401,
        detail="Not authenticated. Sign in or provide an API key.",
    )


# Load valid API keys from environment
def get_valid_api_keys() -> set:
    keys_str = os.getenv("CHAT_API_KEYS", "")
    if not keys_str:
        return set()
    return set(key.strip() for key in keys_str.split(",") if key.strip())


async def verify_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    if api_key is None:
        raise HTTPException(
            status_code=401,
            detail="Missing API Key. Include 'X-API-Key' header.",
        )
    valid_keys = get_valid_api_keys()
    if not valid_keys:
        if os.getenv("AUTH_DEV_MODE", "false").lower() == "true":
            return api_key
        raise HTTPException(
            status_code=500,
            detail="Server authentication not configured.",
        )
    if api_key not in valid_keys:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key


# Simple in-memory rate limiting
class RateLimiter:
    def __init__(self, requests_per_minute: int = 10, requests_per_hour: int = 100):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self._minute_buckets: dict[str, list[datetime]] = {}
        self._hour_buckets: dict[str, list[datetime]] = {}

    def _clean_old_requests(self, bucket: list[datetime], window: timedelta) -> list[datetime]:
        cutoff = datetime.utcnow() - window
        return [ts for ts in bucket if ts > cutoff]

    def check_rate_limit(self, identifier: str) -> tuple[bool, Optional[str]]:
        now = datetime.utcnow()

        if identifier not in self._minute_buckets:
            self._minute_buckets[identifier] = []
        self._minute_buckets[identifier] = self._clean_old_requests(
            self._minute_buckets[identifier], timedelta(minutes=1)
        )
        if len(self._minute_buckets[identifier]) >= self.requests_per_minute:
            return False, f"Rate limit exceeded: {self.requests_per_minute} requests per minute"

        if identifier not in self._hour_buckets:
            self._hour_buckets[identifier] = []
        self._hour_buckets[identifier] = self._clean_old_requests(
            self._hour_buckets[identifier], timedelta(hours=1)
        )
        if len(self._hour_buckets[identifier]) >= self.requests_per_hour:
            return False, f"Rate limit exceeded: {self.requests_per_hour} requests per hour"

        self._minute_buckets[identifier].append(now)
        self._hour_buckets[identifier].append(now)
        return True, None

    def get_remaining(self, identifier: str) -> dict:
        if identifier not in self._minute_buckets:
            self._minute_buckets[identifier] = []
        if identifier not in self._hour_buckets:
            self._hour_buckets[identifier] = []
        self._minute_buckets[identifier] = self._clean_old_requests(
            self._minute_buckets[identifier], timedelta(minutes=1)
        )
        self._hour_buckets[identifier] = self._clean_old_requests(
            self._hour_buckets[identifier], timedelta(hours=1)
        )
        return {
            "minute_remaining": self.requests_per_minute - len(self._minute_buckets[identifier]),
            "hour_remaining": self.requests_per_hour - len(self._hour_buckets[identifier]),
        }


rate_limiter = RateLimiter(
    requests_per_minute=int(os.getenv("RATE_LIMIT_PER_MINUTE", "10")),
    requests_per_hour=int(os.getenv("RATE_LIMIT_PER_HOUR", "100"))
)


def get_client_identifier(request: Request, session_id: Optional[str] = None) -> str:
    if session_id:
        return f"session:{session_id}"
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"
    return f"ip:{client_ip}"


async def check_rate_limit(request: Request, session_id: Optional[str] = None):
    identifier = get_client_identifier(request, session_id)
    is_allowed, error_message = rate_limiter.check_rate_limit(identifier)
    if not is_allowed:
        remaining = rate_limiter.get_remaining(identifier)
        raise HTTPException(
            status_code=429,
            detail=error_message,
            headers={
                "X-RateLimit-Remaining-Minute": str(remaining["minute_remaining"]),
                "X-RateLimit-Remaining-Hour": str(remaining["hour_remaining"]),
                "Retry-After": "60",
            }
        )
    return identifier
