# Research: Auth Hardening

**Date**: 2026-02-14
**Feature**: 002-auth-hardening
**Purpose**: Resolve all technology choices and unknowns before implementation planning

---

## R1: JWT Library for Python/FastAPI

**Decision**: `python-jose[cryptography]`

**Rationale**:
- FastAPI's official documentation and tutorials use `python-jose[cryptography]`
- Supports JWS, JWE, JWK, and JWT standards
- The `cryptography` backend provides robust, well-maintained cryptographic primitives
- Widely adopted in FastAPI production applications

**Alternatives considered**:
- `PyJWT`: Simpler API but less feature-rich. Would work but lacks JWE support if needed later
- `authlib`: Full-featured but heavier — includes OAuth client/server, overkill when we only need JWT encoding/decoding

---

## R2: Token Strategy

**Decision**: Access token (15min) + Refresh token (7 days) with httpOnly cookie for refresh token

**Rationale**:

| Aspect | Choice | Why |
|--------|--------|-----|
| Access token storage | In-memory (JS variable) via React context | Not persisted to disk; cleared on tab close. XSS cannot steal it from localStorage |
| Refresh token storage | httpOnly, Secure, SameSite=Lax cookie | Cannot be read by JavaScript; immune to XSS; sent automatically on refresh requests |
| Access token lifetime | 15 minutes | Short enough to limit damage if leaked; long enough to avoid constant refresh |
| Refresh token lifetime | 7 days | Balances UX (don't force weekly re-login) with security |
| Refresh token rotation | Yes — issue new refresh token on each refresh | Limits window of stolen refresh token usability |
| Token blacklisting | Database table (`refresh_tokens`) | Needed for logout invalidation; in-memory won't survive server restarts |

**Flow**:
1. Login → Backend returns access token in JSON body + sets refresh token as httpOnly cookie
2. Frontend stores access token in React state (AuthContext)
3. API requests include `Authorization: Bearer <access_token>` header
4. On 401 → Frontend calls `/api/auth/refresh` (cookie sent automatically) → gets new access token
5. On page reload → Frontend calls `/api/auth/refresh` to restore session (since access token is in-memory only)
6. Logout → Backend clears cookie + deletes refresh token from DB

---

## R3: Password Hashing

**Decision**: `passlib[bcrypt]`

**Rationale**:
- Industry standard for FastAPI applications
- `passlib` provides a clean `CryptContext` API with automatic hash migration support
- bcrypt is battle-tested, GPU-resistant, and has tunable work factor
- FastAPI's security tutorial uses this exact combination

**Alternatives considered**:
- `bcrypt` directly: Works but no hash migration, less ergonomic API
- `argon2-cffi`: Technically superior (Argon2id won the Password Hashing Competition) but less ecosystem support in FastAPI; can be adopted later as a drop-in via passlib's CryptContext

**Configuration**: bcrypt with default rounds (12), using `passlib.context.CryptContext(schemes=["bcrypt"], deprecated="auto")`

---

## R4: Google OAuth Implementation

**Decision**: `httpx` for manual OAuth 2.0 Authorization Code flow

**Rationale**:
- The Google OAuth flow is straightforward (redirect → callback → token exchange → userinfo)
- Only 3-4 HTTP calls needed; no library abstraction justified
- `httpx` is already async-native and fits FastAPI's async model
- Avoids adding a heavy dependency (`authlib` is 15+ modules) for a single OAuth provider
- Full control over the flow makes debugging and customization easier

**Alternatives considered**:
- `authlib`: Full OAuth client library. Overkill for single-provider; adds complexity
- `fastapi-sso`: Convenience wrapper but less maintained; hides flow details

**Flow**:
1. Frontend calls `GET /api/auth/google` → Backend returns Google's authorization URL
2. User authorizes on Google → Redirected to `GET /api/auth/google/callback?code=...`
3. Backend exchanges code for tokens via `httpx.AsyncClient.post()` to Google's token endpoint
4. Backend fetches user info from Google's userinfo endpoint
5. Backend creates/links user account → issues JWT tokens (same as email/password login)
6. Backend redirects to frontend with tokens set (cookie + redirect URL with success indicator)

---

## R5: Database Schema Design

**Decision**: Separate `users` and `oauth_accounts` tables with raw asyncpg SQL

**Rationale**:
- Existing codebase uses raw asyncpg (no ORM) for `chat_history` table — stay consistent
- Separate `oauth_accounts` table allows multiple OAuth providers per user in the future
- `refresh_tokens` table for token blacklisting/rotation tracking
- UUID primary keys for users (more secure than sequential integers in URLs/tokens)

**Alternatives considered**:
- Single `users` table with nullable `google_id` column: Simpler but doesn't scale to multiple providers
- SQLAlchemy ORM: Would require significant refactoring of existing database.py; not worth it for 3-4 tables

**Tables**:
1. `users` — Core user record (id, email, name, password_hash, created_at, updated_at)
2. `oauth_accounts` — OAuth provider links (user_id FK, provider, provider_user_id, email)
3. `refresh_tokens` — Active refresh tokens (token_hash, user_id FK, expires_at, created_at)

---

## R6: Docusaurus Route Protection

**Decision**: Client-side auth gate via swizzled `Root.js` + AuthContext provider

**Rationale**:
- Docusaurus generates static HTML — there is no server-side middleware for route protection
- The project already uses `src/theme/Root.js` to wrap the app (currently wraps with Chatbot)
- Adding an `AuthProvider` in Root.js gives every component access to auth state
- Route protection works by checking auth state in a wrapper component and showing AuthModal for `/docs/*` paths
- The existing `SignInButton` navbar item can consume AuthContext instead of reading localStorage directly

**Implementation approach**:
1. Create `src/context/AuthContext.js` — React context with `user`, `login()`, `logout()`, `isAuthenticated`, `isLoading`
2. Modify `src/theme/Root.js` — Wrap children with `<AuthProvider>`
3. Create `src/components/ProtectedRoute.js` — Checks auth state, shows AuthModal or redirects for protected paths
4. Swizzle or wrap the Layout to include ProtectedRoute logic for `/docs/*` paths
5. Update `SignInButton` to use `useAuth()` hook instead of localStorage
6. Update `Chatbot.jsx` to get access token from AuthContext instead of static API key

**Token handling on frontend**:
- On app mount: `AuthProvider` calls `POST /api/auth/refresh` (httpOnly cookie sent automatically)
- If refresh succeeds: Store access token in state, set `isAuthenticated = true`
- If refresh fails (no cookie or expired): Set `isAuthenticated = false`, show login UI on protected routes
- On login: Store access token in state from response body
- On logout: Call `POST /api/auth/logout`, clear state

---

## R7: Migration Strategy — API Key to JWT

**Decision**: Parallel support during transition, then remove API key auth

**Rationale**:
- The chatbot currently uses `X-API-Key` header for authentication
- During development, both auth methods should work to avoid breaking the chatbot
- After JWT auth is fully working, remove API key support from chat endpoint
- Keep API key support for potential future machine-to-machine integrations (separate concern)

**Migration steps**:
1. Add JWT auth endpoints (new routes, no breaking changes)
2. Add `verify_jwt_token` dependency alongside existing `verify_api_key`
3. Create `verify_auth` that accepts either JWT or API key
4. Update `/api/chat` to use `verify_auth`
5. Update frontend to send JWT instead of API key
6. Remove API key fallback from chat endpoint (or keep for M2M)
