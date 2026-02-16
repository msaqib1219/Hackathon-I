"""Authentication endpoint handlers."""

import os
import secrets
from urllib.parse import urlencode, quote
from fastapi import APIRouter, HTTPException, Response, Request, Depends, Cookie
from fastapi.responses import RedirectResponse
from typing import Optional
import httpx

from datetime import datetime, timezone
from auth_models import RegisterRequest, LoginRequest, AuthResponse, RefreshResponse, UserProfile
from auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, hash_refresh_token,
    verify_jwt_token, check_rate_limit,
)
from database import (
    create_user, get_user_by_email, get_user_by_id,
    store_refresh_token, get_refresh_token, delete_refresh_token,
    delete_user_refresh_tokens, get_user_oauth_methods,
    create_oauth_account, get_oauth_account, cleanup_expired_tokens,
)

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
IS_PRODUCTION = os.getenv("AUTH_DEV_MODE", "false").lower() != "true"


def _set_refresh_cookie(response: Response, token: str):
    """Set the refresh token as an httpOnly cookie."""
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        max_age=60 * 60 * 24 * int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7")),
        path="/api/auth",
    )


def _clear_refresh_cookie(response: Response):
    """Clear the refresh token cookie."""
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        path="/api/auth",
    )


async def _build_user_profile(user: dict) -> UserProfile:
    """Build a UserProfile from a DB user row."""
    user_id = str(user["id"])
    auth_methods = []
    if user.get("password_hash"):
        auth_methods.append("email")
    oauth_methods = await get_user_oauth_methods(user_id)
    auth_methods.extend(oauth_methods)
    return UserProfile(
        id=user_id,
        email=user["email"],
        name=user["name"],
        auth_methods=auth_methods,
        created_at=user.get("created_at"),
    )


async def _issue_tokens(user: dict, response: Response) -> AuthResponse:
    """Generate access + refresh tokens and set cookie."""
    user_id = str(user["id"])
    access_token = create_access_token(user_id, user["email"])
    refresh_token_str, expires_at = create_refresh_token()
    token_hash = hash_refresh_token(refresh_token_str)
    await store_refresh_token(token_hash, user_id, expires_at)
    _set_refresh_cookie(response, refresh_token_str)
    profile = await _build_user_profile(user)
    return AuthResponse(access_token=access_token, user=profile)


# --- T012: POST /api/auth/register ---

@auth_router.post("/register", response_model=AuthResponse, status_code=201)
async def register(req: RegisterRequest, request: Request, response: Response):
    """Register a new user with email and password."""
    await check_rate_limit(request)
    # Check if email already exists
    existing = await get_user_by_email(req.email)
    if existing:
        # Generic message — don't reveal the email exists
        raise HTTPException(status_code=409, detail="Registration failed. Please try again or sign in.")

    hashed = hash_password(req.password)
    user = await create_user(email=req.email, name=req.name, password_hash=hashed)
    return await _issue_tokens(user, response)


# --- T013: POST /api/auth/login ---

@auth_router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, request: Request, response: Response):
    """Authenticate with email and password."""
    await check_rate_limit(request)
    user = await get_user_by_email(req.email)
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return await _issue_tokens(user, response)


# --- T014: POST /api/auth/logout ---

@auth_router.post("/logout")
async def logout(response: Response, token_payload: dict = Depends(verify_jwt_token)):
    """Sign out — invalidate all refresh tokens and clear cookie."""
    user_id = token_payload.get("sub")
    if user_id:
        await delete_user_refresh_tokens(user_id)
    _clear_refresh_cookie(response)
    return {"message": "Logged out successfully"}


# --- T015: GET /api/auth/me ---

@auth_router.get("/me", response_model=UserProfile)
async def get_me(token_payload: dict = Depends(verify_jwt_token)):
    """Get current authenticated user profile."""
    user_id = token_payload.get("sub")
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await _build_user_profile(user)


# --- T021: GET /api/auth/google ---

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


@auth_router.get("/google")
async def google_oauth_start(response: Response):
    """Start Google OAuth flow — return authorization URL."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")

    state = secrets.token_urlsafe(32)
    # Store state in a cookie for CSRF validation
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        max_age=600,  # 10 minutes
        path="/api/auth",
    )

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }
    authorization_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return {"authorization_url": authorization_url}


# --- T022: GET /api/auth/google/callback ---

@auth_router.get("/google/callback")
async def google_oauth_callback(
    request: Request,
    response: Response,
    code: str = "",
    state: str = "",
    error: str = "",
):
    """Handle Google OAuth callback — exchange code for tokens, create/link user."""
    if error:
        return RedirectResponse(url=f"{FRONTEND_URL}/?auth=error&reason={quote(error)}")

    # Validate CSRF state
    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        return RedirectResponse(url=f"{FRONTEND_URL}/?auth=error&reason=invalid_state")

    # Clear state cookie
    response.delete_cookie(key="oauth_state", path="/api/auth")

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        })

        if token_res.status_code != 200:
            return RedirectResponse(url=f"{FRONTEND_URL}/?auth=error&reason=token_exchange_failed")

        tokens = token_res.json()

        # Fetch user info
        userinfo_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )

        if userinfo_res.status_code != 200:
            return RedirectResponse(url=f"{FRONTEND_URL}/?auth=error&reason=userinfo_failed")

        google_user = userinfo_res.json()

    google_id = google_user.get("id")
    google_email = google_user.get("email", "")
    google_name = google_user.get("name", google_email.split("@")[0])

    # Check if this Google account is already linked
    existing_oauth = await get_oauth_account("google", google_id)

    if existing_oauth:
        # Existing linked account — sign in
        user = await get_user_by_id(str(existing_oauth["user_id"]))
    else:
        # Check if a user with this email exists (link accounts)
        user = await get_user_by_email(google_email)
        if user:
            # Link Google to existing account
            await create_oauth_account(str(user["id"]), "google", google_id, google_email)
        else:
            # Create new user
            user = await create_user(email=google_email, name=google_name, password_hash=None)
            await create_oauth_account(str(user["id"]), "google", google_id, google_email)

    if not user:
        return RedirectResponse(url=f"{FRONTEND_URL}/?auth=error&reason=user_creation_failed")

    # Issue JWT tokens
    user_id = str(user["id"])
    access_token = create_access_token(user_id, user["email"])
    refresh_token_str, expires_at = create_refresh_token()
    token_hash = hash_refresh_token(refresh_token_str)
    await store_refresh_token(token_hash, user_id, expires_at)

    # Build redirect response with refresh cookie
    redirect = RedirectResponse(url=f"{FRONTEND_URL}/docs/intro?auth=success", status_code=302)
    redirect.set_cookie(
        key="refresh_token",
        value=refresh_token_str,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        max_age=60 * 60 * 24 * int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7")),
        path="/api/auth",
    )
    # Clear state cookie on redirect response too
    redirect.delete_cookie(key="oauth_state", path="/api/auth")
    return redirect


# --- T030: POST /api/auth/refresh ---

@auth_router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(
    request: Request,
    response: Response,
    refresh_token: Optional[str] = Cookie(None),
):
    """Rotate refresh token and issue a new access token."""
    # Opportunistically clean up expired tokens (T035)
    try:
        await cleanup_expired_tokens()
    except Exception:
        pass  # Non-critical — don't fail the request

    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    token_hash = hash_refresh_token(refresh_token)
    stored = await get_refresh_token(token_hash)

    if not stored:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check expiration
    if stored["expires_at"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        await delete_refresh_token(token_hash)
        _clear_refresh_cookie(response)
        raise HTTPException(status_code=401, detail="Refresh token expired")

    # Check user is still active
    if not stored.get("is_active", True):
        await delete_refresh_token(token_hash)
        _clear_refresh_cookie(response)
        raise HTTPException(status_code=401, detail="Account inactive")

    # Rotate: delete old token, issue new pair
    await delete_refresh_token(token_hash)

    user_id = str(stored["user_id"])
    email = stored["email"]

    access_token = create_access_token(user_id, email)
    new_refresh_str, new_expires = create_refresh_token()
    new_hash = hash_refresh_token(new_refresh_str)
    await store_refresh_token(new_hash, user_id, new_expires)
    _set_refresh_cookie(response, new_refresh_str)

    return RefreshResponse(access_token=access_token)
