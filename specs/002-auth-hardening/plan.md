# Implementation Plan: Auth Hardening

**Branch**: `002-auth-hardening` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-auth-hardening/spec.md`

## Summary

Replace the demo-only AuthModal with real backend authentication. Implement email/password registration and login with JWT tokens, Google OAuth sign-in, and client-side route protection for `/docs/*` pages. The backend (FastAPI) gets new auth endpoints with JWT issuance, bcrypt password hashing, and refresh token rotation stored in the existing Neon PostgreSQL database. The frontend (Docusaurus/React) gets an AuthContext provider, real API calls from the AuthModal, and protected route gating.

## Technical Context

**Language/Version**: Python 3.13 (backend), JavaScript/React 18 (frontend)
**Primary Dependencies**:
- Backend: FastAPI, uvicorn, asyncpg, python-jose[cryptography], passlib[bcrypt], httpx
- Frontend: Docusaurus 3.9.x, React 18, @docusaurus/core
**Storage**: Neon PostgreSQL (existing instance — `chat_history` table; adding `users`, `oauth_accounts`, `refresh_tokens`)
**Testing**: Manual testing (no test framework in codebase currently)
**Target Platform**: Web — Linux server (backend), static site + SPA (frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Auth endpoints < 500ms response time; token refresh < 200ms
**Constraints**: No ORM (raw asyncpg — consistent with existing code); Docusaurus static site limits server-side auth
**Scale/Scope**: Small user base (educational platform); single-server deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is unfilled (all placeholders). No gates to violate. Proceeding.

**Post-Phase 1 re-check**: No constitution principles defined — no violations possible. Recommend running `/sp.constitution` to establish project principles before further features.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-hardening/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Database schema
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   └── auth-api.yaml    # Phase 1: OpenAPI contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── main.py              # MODIFY: Register auth router, update CORS
├── auth.py              # MODIFY: Add JWT verification alongside API key
├── auth_routes.py       # NEW: All auth endpoint handlers
├── auth_models.py       # NEW: Pydantic request/response models
├── database.py          # MODIFY: Add user/token CRUD + migration SQL
├── requirements.txt     # MODIFY: Add 3 new dependencies
└── .env                 # MODIFY: Add JWT + OAuth env vars (user action)

src/
├── context/
│   └── AuthContext.js   # NEW: React context for auth state
├── components/
│   ├── AuthModal/
│   │   └── index.jsx    # MODIFY: Connect to real backend API
│   ├── SignInButton/
│   │   └── index.jsx    # MODIFY: Use AuthContext hook
│   ├── Chatbot.jsx      # MODIFY: Use JWT from AuthContext
│   └── ProtectedRoute.js # NEW: Auth gate component
└── theme/
    └── Root.js          # MODIFY: Wrap with AuthProvider
```

**Structure Decision**: Web application structure (backend/ + src/) — matches existing repository layout. No new top-level directories except `src/context/` for React context.

## Complexity Tracking

> No constitution violations to justify.

## Architecture Overview

### Auth Flow Diagrams

**Email/Password Login:**
```
Browser                    FastAPI Backend              PostgreSQL
  |                            |                           |
  |-- POST /api/auth/login --> |                           |
  |   {email, password}        |-- SELECT user by email -->|
  |                            |<-- user row --------------|
  |                            |-- verify bcrypt hash      |
  |                            |-- generate access JWT     |
  |                            |-- generate refresh token  |
  |                            |-- INSERT refresh_tokens ->|
  |<-- 200 {access_token} ----|                           |
  |<-- Set-Cookie: refresh ----|                           |
  |                            |                           |
  |-- GET /api/auth/me ------->|                           |
  |   Authorization: Bearer    |-- decode JWT, verify ---->|
  |<-- 200 {user profile} ----|                           |
```

**Token Refresh (on page reload or 401):**
```
Browser                    FastAPI Backend              PostgreSQL
  |                            |                           |
  |-- POST /api/auth/refresh ->|                           |
  |   Cookie: refresh_token    |-- hash token              |
  |                            |-- SELECT by token_hash -->|
  |                            |<-- token row + user ------|
  |                            |-- DELETE old token ------->|
  |                            |-- INSERT new token ------->|
  |                            |-- generate new access JWT |
  |<-- 200 {access_token} ----|                           |
  |<-- Set-Cookie: new_refresh |                           |
```

**Google OAuth:**
```
Browser              FastAPI Backend         Google APIs         PostgreSQL
  |                       |                      |                   |
  |-- GET /auth/google -->|                      |                   |
  |<-- {auth_url} --------|                      |                   |
  |-- redirect to Google ----------------------->|                   |
  |<-- redirect to callback with code ----------|                   |
  |-- GET /auth/google/callback?code=... ------->|                   |
  |                       |-- POST token ------->|                   |
  |                       |<-- {access_token} ---|                   |
  |                       |-- GET userinfo ----->|                   |
  |                       |<-- {email, name} ----|                   |
  |                       |-- find/create user ------------------>|
  |                       |-- link oauth_account ----------------->|
  |                       |-- generate JWTs                        |
  |<-- 302 redirect + Set-Cookie: refresh -------|                   |
```

### Security Considerations

1. **Passwords**: bcrypt with work factor 12; never stored or logged in plaintext
2. **Tokens**: Access token is short-lived (15min), stored only in JS memory (not localStorage)
3. **Refresh token**: httpOnly + Secure + SameSite=Lax cookie; hashed in DB (SHA-256)
4. **CSRF**: SameSite=Lax cookie prevents CSRF for state-changing requests
5. **Timing attacks**: Use constant-time comparison for token hash lookups
6. **Information disclosure**: Generic error messages for login/register failures
7. **OAuth state**: CSRF `state` parameter in Google OAuth flow
8. **CORS**: Already configured; will add credentials support

### Dependencies & Integration Points

| Dependency | Type | Impact |
|------------|------|--------|
| Neon PostgreSQL | Existing | New tables added; existing `chat_history` gets `user_id` column |
| FastAPI | Existing | New router registered; existing routes unchanged |
| Docusaurus | Existing | Root.js modified; SignInButton, AuthModal, Chatbot modified |
| Google OAuth | External | Requires Google Cloud Console setup (user action) |
| python-jose | New | JWT encode/decode |
| passlib | New | Password hashing |
| httpx | New | Async HTTP client for Google OAuth token exchange |

### Risk Analysis

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Google OAuth credentials not set up correctly | Medium | Blocks P2 story | P1 (email/password) works independently; OAuth is additive |
| 2 | Neon DB connection pool exhaustion (new tables + queries) | Low | Service degradation | Use connection pooling (asyncpg pool); auth queries are lightweight |
| 3 | Frontend auth state desyncs across tabs | Low | UX confusion | Refresh on focus; localStorage event for cross-tab logout signal |

### Operational Readiness

- **Rollback**: Each implementation task is independently deployable. Revert = switch backend dependency to `verify_api_key` only
- **Monitoring**: Auth failures logged at WARNING level; success at INFO
- **Expired token cleanup**: Periodic DELETE of expired refresh tokens (can be cron or on-request cleanup)
