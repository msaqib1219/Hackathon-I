# Tasks: Auth Hardening

**Input**: Design documents from `/specs/002-auth-hardening/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/auth-api.yaml

**Tests**: Not included (no test framework in codebase; tests not requested in spec).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add new dependencies and configure environment for auth feature

- [x] T001 Add `python-jose[cryptography]`, `passlib[bcrypt]`, `httpx` to `backend/requirements.txt` and install
- [x] T002 [P] Add auth environment variables to `backend/.env.example`: `JWT_SECRET_KEY`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`, `JWT_REFRESH_TOKEN_EXPIRE_DAYS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `FRONTEND_URL`
- [x] T003 [P] Create `src/context/` directory for React auth context

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, Pydantic models, and core JWT/password utilities that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add auth table creation SQL to `backend/database.py` `init_db()` function: create `users`, `oauth_accounts`, `refresh_tokens` tables and add `user_id` column to `chat_history` (per `data-model.md` migration script)
- [x] T005 [P] Create `backend/auth_models.py` with Pydantic models: `RegisterRequest`, `LoginRequest`, `AuthResponse`, `RefreshResponse`, `UserProfile`, `ErrorResponse` (per `contracts/auth-api.yaml` schemas)
- [x] T006 [P] Add user CRUD functions to `backend/database.py`: `create_user(email, name, password_hash)`, `get_user_by_email(email)`, `get_user_by_id(user_id)` using asyncpg
- [x] T007 [P] Add refresh token DB functions to `backend/database.py`: `store_refresh_token(token_hash, user_id, expires_at)`, `get_refresh_token(token_hash)`, `delete_refresh_token(token_hash)`, `delete_user_refresh_tokens(user_id)`, `cleanup_expired_tokens()`
- [x] T008 Add JWT utility functions to `backend/auth.py`: `create_access_token(user_id, email)`, `create_refresh_token()`, `verify_access_token(token)` using python-jose, and `hash_password(password)`, `verify_password(plain, hashed)` using passlib bcrypt CryptContext. Load `JWT_SECRET_KEY`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`, `JWT_REFRESH_TOKEN_EXPIRE_DAYS` from environment
- [x] T009 Add `verify_jwt_token` FastAPI dependency to `backend/auth.py` that extracts and validates the `Authorization: Bearer` header, returning the user payload. Add `verify_auth` dependency that accepts either JWT Bearer token or API key (for migration compatibility)
- [x] T010 Create `backend/auth_routes.py` with an empty FastAPI `APIRouter(prefix="/api/auth", tags=["Authentication"])` and register it in `backend/main.py` via `app.include_router(auth_router)`
- [x] T011 Update CORS in `backend/main.py`: add `allow_credentials=True` (already present) and ensure `FRONTEND_URL` is in `ALLOWED_ORIGINS`

**Checkpoint**: Foundation ready — JWT utilities, DB schema, Pydantic models, and router in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — Email/Password Registration & Login (Priority: P1) MVP

**Goal**: Users can register with name/email/password, sign in, get JWT tokens, sign out. Replaces the demo-only AuthModal.

**Independent Test**: Register via sign-up form → sign out → sign back in → verify redirected to `/docs/intro` → reload page → still signed in → sign out → confirmed returned to landing page.

### Backend (US1)

- [x] T012 [US1] Implement `POST /api/auth/register` in `backend/auth_routes.py`: validate email format and password strength (8+ chars, 1 letter, 1 number), check for existing email (return generic 409 on conflict), hash password with bcrypt, call `create_user()`, generate access + refresh tokens, set refresh token as httpOnly/Secure/SameSite=Lax cookie, return `AuthResponse` with access_token and user profile
- [x] T013 [US1] Implement `POST /api/auth/login` in `backend/auth_routes.py`: find user by email, verify password with bcrypt, generate access + refresh tokens, store refresh token hash in DB, set refresh token cookie, return `AuthResponse`. Return generic "Invalid email or password" on failure
- [x] T014 [US1] Implement `POST /api/auth/logout` in `backend/auth_routes.py`: require JWT auth (`verify_jwt_token`), delete all refresh tokens for user from DB, clear refresh token cookie, return success message
- [x] T015 [US1] Implement `GET /api/auth/me` in `backend/auth_routes.py`: require JWT auth, fetch user from DB by ID from token payload, return `UserProfile` with id, email, name, auth_methods, created_at

### Frontend (US1)

- [x] T016 [US1] Create `src/context/AuthContext.js`: React context with `AuthProvider` component providing `user`, `accessToken`, `isAuthenticated`, `isLoading`, `login(email, password)`, `register(name, email, password)`, `logout()`, and `getAccessToken()` (returns current token or refreshes if expired). On mount, call `POST /api/auth/refresh` to restore session from httpOnly cookie
- [x] T017 [US1] Modify `src/theme/Root.js`: wrap children with `<AuthProvider>` from `AuthContext.js` (above the existing Chatbot wrapper)
- [x] T018 [US1] Modify `src/components/AuthModal/index.jsx`: replace simulated `setTimeout` login with real API calls — call `AuthContext.login()` for sign-in, `AuthContext.register()` for sign-up. Show backend error messages. On success, call `onClose()` and redirect to `/docs/intro`. Remove the `WARNING: DEMO` comment
- [x] T019 [US1] Modify `src/components/SignInButton/index.jsx`: replace `localStorage.getItem('user_email')` with `useAuth()` hook from AuthContext. Show user name from `user.name` instead of email prefix. Call `AuthContext.logout()` on sign-out instead of `localStorage.removeItem`

**Checkpoint**: Email/password auth fully functional end-to-end. Users can register, sign in, persist sessions, and sign out.

---

## Phase 4: User Story 2 — Google OAuth Sign-In (Priority: P2)

**Goal**: Users can click "Continue with Google" to authenticate via Google OAuth 2.0. First-time users get auto-created accounts. Existing email users get accounts linked.

**Independent Test**: Click "Continue with Google" → complete Google consent → verify redirected to `/docs/intro` with authenticated state → verify user profile shows Google name/email.

### Backend (US2)

- [x] T020 [US2] Add OAuth account DB functions to `backend/database.py`: `create_oauth_account(user_id, provider, provider_user_id, provider_email)`, `get_oauth_account(provider, provider_user_id)`, `get_user_oauth_methods(user_id)` using asyncpg
- [x] T021 [US2] Implement `GET /api/auth/google` in `backend/auth_routes.py`: build Google authorization URL with `client_id`, `redirect_uri`, `scope=openid email profile`, `response_type=code`, and a random `state` parameter stored in a temporary cookie for CSRF protection. Return `{"authorization_url": "..."}`
- [x] T022 [US2] Implement `GET /api/auth/google/callback` in `backend/auth_routes.py`: validate `state` parameter against cookie, exchange `code` for tokens via `httpx.AsyncClient.post()` to `https://oauth2.googleapis.com/token`, fetch user info from `https://www.googleapis.com/oauth2/v2/userinfo`, find or create user (link accounts if same email exists), generate JWT tokens, set refresh cookie, redirect to `FRONTEND_URL/docs/intro?auth=success`

### Frontend (US2)

- [x] T023 [US2] Add `googleLogin()` method to `src/context/AuthContext.js`: call `GET /api/auth/google` to get authorization URL, then `window.location.href = authorization_url` to redirect to Google
- [x] T024 [US2] Modify `src/components/AuthModal/index.jsx`: add `onClick` handler to the "Continue with Google" button (currently non-functional SVG) that calls `AuthContext.googleLogin()`. Handle the `?auth=success` query parameter on page load in AuthContext to trigger a refresh and restore auth state after OAuth redirect
- [x] T025 [US2] Update `GET /api/auth/me` response in `backend/auth_routes.py` to include `auth_methods` list by querying `oauth_accounts` table — return `["email"]`, `["google"]`, or `["email", "google"]` based on whether user has a password_hash and/or oauth_accounts entries

**Checkpoint**: Google OAuth fully functional. Users can sign in with Google, accounts auto-link with matching emails.

---

## Phase 5: User Story 3 — Protected Routes & Content Gating (Priority: P3)

**Goal**: Unauthenticated users cannot access `/docs/*` pages or the chatbot. They are shown the sign-in modal. Authenticated users access content normally.

**Independent Test**: Open `/docs/intro` while not signed in → verify AuthModal appears → sign in → verify docs load → open chatbot → verify messages send with JWT.

### Frontend (US3)

- [x] T026 [US3] Create `src/components/ProtectedRoute.js`: component that checks `useAuth().isAuthenticated`. If loading, show a spinner. If not authenticated, render `<AuthModal isOpen={true} />`. If authenticated, render `children`. Check current path against protected patterns (`/docs/*`)
- [x] T027 [US3] Modify `src/theme/Root.js`: wrap the children with `<ProtectedRoute>` (inside `<AuthProvider>`). ProtectedRoute reads `window.location.pathname` to determine if current page needs auth gating
- [x] T028 [US3] Modify `src/components/Chatbot.jsx`: replace `X-API-Key` header with `Authorization: Bearer <token>` from `useAuth().getAccessToken()`. If user is not authenticated, show a "Sign in to use the chatbot" message instead of the chat input. On 401 response, trigger re-authentication via AuthContext

### Backend (US3)

- [x] T029 [US3] Update `POST /api/chat` in `backend/main.py`: change dependency from `verify_api_key` to `verify_auth` (accepts either JWT or API key for backward compatibility). Pass `user_id` from JWT payload to `add_message()` to populate the new `user_id` column in `chat_history`

**Checkpoint**: Protected routes working. Unauthenticated users see sign-in modal on `/docs/*` pages. Chatbot uses JWT auth.

---

## Phase 6: User Story 4 — Persistent Session with Token Refresh (Priority: P4)

**Goal**: Sessions persist silently across page reloads and access token expiration. Refresh token rotation ensures security.

**Independent Test**: Sign in → close tab → reopen site → verify still authenticated without re-login. Wait 15+ minutes (or simulate) → make request → verify silent refresh occurs.

### Backend (US4)

- [x] T030 [US4] Implement `POST /api/auth/refresh` in `backend/auth_routes.py`: read `refresh_token` from httpOnly cookie, hash it, look up in `refresh_tokens` DB table, verify not expired, delete old token (rotation), generate new access + refresh tokens, store new refresh token hash, set new refresh cookie, return `RefreshResponse` with new access_token. Return 401 if cookie missing, token not found, or expired

### Frontend (US4)

- [x] T031 [US4] Add token refresh logic to `src/context/AuthContext.js`: on mount, call `POST /api/auth/refresh` (cookie sent automatically) to restore session. Add `refreshAccessToken()` internal method. In `getAccessToken()`, check if access token is expired (decode JWT exp claim) and call refresh if needed before returning token
- [x] T032 [US4] Add 401 interceptor logic to API calls in `src/context/AuthContext.js`: export a `fetchWithAuth(url, options)` helper that automatically adds `Authorization: Bearer` header, catches 401 responses, attempts one refresh, and retries the request. If refresh fails, call `logout()`. Update Chatbot.jsx to use `fetchWithAuth` instead of raw `fetch`

**Checkpoint**: Full session lifecycle working — login, persist, refresh, logout. All 4 user stories functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, security hardening, and cleanup across all user stories

- [x] T033 [P] Add client-side form validation to `src/components/AuthModal/index.jsx`: email format check, password length (8+), password must contain letter + number. Show inline validation errors before form submission
- [x] T034 [P] Add rate limiting to auth endpoints in `backend/auth_routes.py`: apply existing `check_rate_limit` to `/api/auth/login` and `/api/auth/register` to prevent brute-force attacks
- [x] T035 [P] Add expired token cleanup to `backend/database.py`: implement `cleanup_expired_tokens()` that DELETEs tokens where `expires_at < NOW()`. Call it periodically in `init_db()` or on each refresh request
- [x] T036 [P] Update `backend/.env.example` with complete documentation of all new environment variables and example values
- [x] T037 Remove the orphaned `src/config/api.js` file (not imported by any component) or integrate it with AuthContext
- [ ] T038 Run `quickstart.md` validation: verify the curl commands work, confirm frontend and backend start correctly with new auth flow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 (Phase 3): No dependencies on other stories — **this is the MVP**
  - US2 (Phase 4): No dependency on US1 (independently testable), but benefits from AuthContext created in US1
  - US3 (Phase 5): Depends on US1 (needs AuthContext and login flow to gate content)
  - US4 (Phase 6): Depends on US1 (needs JWT token flow); enhances US3 silently
- **Polish (Phase 7)**: Can start after US1 is complete; applies across all stories

### Within Each User Story

- Backend endpoints before frontend integration (backend provides the API)
- AuthContext changes before component updates (components consume the context)
- Core flow before edge cases

### Parallel Opportunities

**Phase 1**: T001 sequential, T002 + T003 parallel
**Phase 2**: T005 + T006 + T007 parallel (independent files), then T008 + T009 (depend on models), then T010 + T011 parallel
**Phase 3 (US1)**: T012 + T013 parallel (independent endpoints), T014 + T015 parallel, then T016 → T017 → T018 + T019 parallel
**Phase 4 (US2)**: T020 → T021 + T022 parallel (independent endpoints), T023 → T024 + T025 parallel
**Phase 7**: All Polish tasks (T033-T038) are parallel

---

## Parallel Example: User Story 1

```bash
# Step 1: Backend endpoints (parallel)
Task: "Implement POST /api/auth/register in backend/auth_routes.py"  # T012
Task: "Implement POST /api/auth/login in backend/auth_routes.py"     # T013

# Step 2: More backend endpoints (parallel, after T012/T013)
Task: "Implement POST /api/auth/logout in backend/auth_routes.py"    # T014
Task: "Implement GET /api/auth/me in backend/auth_routes.py"         # T015

# Step 3: Frontend context (sequential)
Task: "Create src/context/AuthContext.js"                            # T016
Task: "Modify src/theme/Root.js to wrap with AuthProvider"           # T017

# Step 4: Frontend components (parallel, after T016/T017)
Task: "Modify AuthModal to use real API calls"                       # T018
Task: "Modify SignInButton to use AuthContext"                       # T019
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (8 tasks) — **CRITICAL, blocks everything**
3. Complete Phase 3: User Story 1 (8 tasks)
4. **STOP and VALIDATE**: Register → Sign in → Reload → Still signed in → Sign out
5. Deploy/demo if ready — **19 tasks total for MVP**

### Incremental Delivery

1. Setup + Foundational → Foundation ready (11 tasks)
2. Add User Story 1 → Test → Deploy/Demo (**MVP! 19 tasks**)
3. Add User Story 2 → Test Google OAuth → Deploy/Demo (25 tasks)
4. Add User Story 3 → Test protected routes → Deploy/Demo (29 tasks)
5. Add User Story 4 → Test session persistence → Deploy/Demo (32 tasks)
6. Polish → Final release (38 tasks)

### Task Summary

| Phase | Story | Task Count | Cumulative |
|-------|-------|-----------|------------|
| Phase 1: Setup | — | 3 | 3 |
| Phase 2: Foundational | — | 8 | 11 |
| Phase 3: US1 Email/Password | P1 | 8 | 19 |
| Phase 4: US2 Google OAuth | P2 | 6 | 25 |
| Phase 5: US3 Protected Routes | P3 | 4 | 29 |
| Phase 6: US4 Token Refresh | P4 | 3 | 32 |
| Phase 7: Polish | — | 6 | 38 |
| **Total** | | **38** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable (except US3/US4 which build on US1's AuthContext)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The existing API key auth continues to work until T029 adds the `verify_auth` dual-mode dependency
