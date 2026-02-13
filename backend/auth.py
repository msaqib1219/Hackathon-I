"""
Authentication module for RAG Chatbot API

Implements:
- API Key validation
- Rate limiting per session
- Security utilities
"""

import os
import secrets
import hashlib
from typing import Optional
from datetime import datetime, timedelta
from fastapi import HTTPException, Security, Request, Depends
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv

load_dotenv()

# API Key configuration
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Load valid API keys from environment (comma-separated for multiple keys)
# Format in .env: CHAT_API_KEYS=key1,key2,key3
def get_valid_api_keys() -> set:
    """Load valid API keys from environment variable."""
    keys_str = os.getenv("CHAT_API_KEYS", "")
    if not keys_str:
        return set()
    return set(key.strip() for key in keys_str.split(",") if key.strip())


def generate_api_key() -> str:
    """Generate a secure random API key."""
    return secrets.token_urlsafe(32)


def hash_api_key(key: str) -> str:
    """Hash an API key for secure storage comparison."""
    return hashlib.sha256(key.encode()).hexdigest()


async def verify_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    """
    Verify the API key from request header.

    Raises HTTPException 401 if invalid or missing.
    Returns the validated API key.
    """
    if api_key is None:
        raise HTTPException(
            status_code=401,
            detail="Missing API Key. Include 'X-API-Key' header.",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    valid_keys = get_valid_api_keys()

    # If no keys configured, allow development mode with warning
    if not valid_keys:
        # Check for development mode flag
        if os.getenv("AUTH_DEV_MODE", "false").lower() == "true":
            return api_key  # Accept any key in dev mode
        raise HTTPException(
            status_code=500,
            detail="Server authentication not configured. Set CHAT_API_KEYS in .env",
        )

    if api_key not in valid_keys:
        raise HTTPException(
            status_code=401,
            detail="Invalid API Key",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    return api_key


# Simple in-memory rate limiting (for production, use Redis)
class RateLimiter:
    """
    Simple in-memory rate limiter.

    For production with multiple workers, use Redis-based rate limiting.
    """

    def __init__(self, requests_per_minute: int = 10, requests_per_hour: int = 100):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self._minute_buckets: dict[str, list[datetime]] = {}
        self._hour_buckets: dict[str, list[datetime]] = {}

    def _clean_old_requests(self, bucket: list[datetime], window: timedelta) -> list[datetime]:
        """Remove requests older than the window."""
        cutoff = datetime.utcnow() - window
        return [ts for ts in bucket if ts > cutoff]

    def check_rate_limit(self, identifier: str) -> tuple[bool, Optional[str]]:
        """
        Check if the identifier (session_id or IP) is within rate limits.

        Returns (is_allowed, error_message)
        """
        now = datetime.utcnow()

        # Clean and check minute bucket
        if identifier not in self._minute_buckets:
            self._minute_buckets[identifier] = []
        self._minute_buckets[identifier] = self._clean_old_requests(
            self._minute_buckets[identifier],
            timedelta(minutes=1)
        )

        if len(self._minute_buckets[identifier]) >= self.requests_per_minute:
            return False, f"Rate limit exceeded: {self.requests_per_minute} requests per minute"

        # Clean and check hour bucket
        if identifier not in self._hour_buckets:
            self._hour_buckets[identifier] = []
        self._hour_buckets[identifier] = self._clean_old_requests(
            self._hour_buckets[identifier],
            timedelta(hours=1)
        )

        if len(self._hour_buckets[identifier]) >= self.requests_per_hour:
            return False, f"Rate limit exceeded: {self.requests_per_hour} requests per hour"

        # Record this request
        self._minute_buckets[identifier].append(now)
        self._hour_buckets[identifier].append(now)

        return True, None

    def get_remaining(self, identifier: str) -> dict:
        """Get remaining requests for an identifier."""
        if identifier not in self._minute_buckets:
            self._minute_buckets[identifier] = []
        if identifier not in self._hour_buckets:
            self._hour_buckets[identifier] = []

        self._minute_buckets[identifier] = self._clean_old_requests(
            self._minute_buckets[identifier],
            timedelta(minutes=1)
        )
        self._hour_buckets[identifier] = self._clean_old_requests(
            self._hour_buckets[identifier],
            timedelta(hours=1)
        )

        return {
            "minute_remaining": self.requests_per_minute - len(self._minute_buckets[identifier]),
            "hour_remaining": self.requests_per_hour - len(self._hour_buckets[identifier]),
        }


# Global rate limiter instance
# Configurable via environment variables
rate_limiter = RateLimiter(
    requests_per_minute=int(os.getenv("RATE_LIMIT_PER_MINUTE", "10")),
    requests_per_hour=int(os.getenv("RATE_LIMIT_PER_HOUR", "100"))
)


def get_client_identifier(request: Request, session_id: Optional[str] = None) -> str:
    """
    Get a unique identifier for rate limiting.

    Uses session_id if available, falls back to IP address.
    """
    if session_id:
        return f"session:{session_id}"

    # Get client IP (handle proxies)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    return f"ip:{client_ip}"


async def check_rate_limit(request: Request, session_id: Optional[str] = None):
    """
    Rate limit check dependency.

    Raises HTTPException 429 if rate limited.
    """
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
