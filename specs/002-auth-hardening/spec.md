# Feature Specification: Auth Hardening

**Feature Branch**: `002-auth-hardening`
**Created**: 2026-02-14
**Status**: Draft
**Input**: User description: "Connect AuthModal to real backend authentication API, implement Google OAuth, replace email-only logic with proper JWT token storage, and protect authenticated routes (frontend + backend validation)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email/Password Registration & Login (Priority: P1)

A new visitor arrives at the Agentic AI Book site and wants to create an account to access the study materials and chatbot. They click "Sign Up", fill in their name, email, and password, and receive confirmation that their account was created. They can then sign in with those credentials and are redirected to the documentation.

A returning user opens the site, clicks "Sign In", enters their email and password, and is authenticated. Their session persists across page reloads until they sign out or their session expires.

**Why this priority**: This is the foundational auth flow. Without working registration and login, no other auth feature (OAuth, protected routes) can function. It replaces the current demo-only AuthModal that accepts any credentials.

**Independent Test**: Can be fully tested by registering a new account via the sign-up form, signing out, then signing back in. Delivers real credential-based access control.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they click "Create Account" and submit valid name/email/password, **Then** a new account is created and they see a success confirmation.
2. **Given** a registered user on the sign-in form, **When** they enter correct email and password, **Then** they are authenticated and redirected to `/docs/intro`.
3. **Given** a registered user on the sign-in form, **When** they enter an incorrect password, **Then** they see a generic error message ("Invalid email or password") without revealing which field is wrong.
4. **Given** a visitor on the sign-up form, **When** they submit an email that already exists, **Then** they see a generic error message that does not confirm the email exists in the system.
5. **Given** an authenticated user, **When** they reload the page, **Then** they remain signed in (session persists).
6. **Given** an authenticated user, **When** they click "Sign Out", **Then** their session is terminated and they are returned to the landing page.

---

### User Story 2 - Google OAuth Sign-In (Priority: P2)

A visitor prefers to sign in with their Google account rather than creating a separate set of credentials. They click "Continue with Google" on the AuthModal, complete Google's consent flow, and are authenticated on the site. If it is their first time, an account is automatically created using their Google profile information.

**Why this priority**: Google OAuth provides a frictionless sign-in experience that many users prefer. The UI button already exists but is non-functional. This is the second most valuable flow after basic email/password.

**Independent Test**: Can be tested by clicking "Continue with Google", completing the Google consent screen, and verifying the user is authenticated and their profile info (name, email) is stored.

**Acceptance Scenarios**:

1. **Given** a visitor on the sign-in modal, **When** they click "Continue with Google" and authorize in Google's consent screen, **Then** they are authenticated and redirected to `/docs/intro`.
2. **Given** a first-time Google user, **When** they complete OAuth, **Then** a new account is created with their Google name and email, and they do not need to set a password.
3. **Given** a user who previously registered with email/password using the same email as their Google account, **When** they sign in with Google, **Then** the accounts are linked and they can use either method going forward.
4. **Given** a user in the Google consent screen, **When** they cancel or deny permission, **Then** they are returned to the AuthModal with a message indicating sign-in was cancelled.

---

### User Story 3 - Protected Routes & Content Gating (Priority: P3)

An unauthenticated visitor tries to access the documentation pages (`/docs/*`) or the chatbot. They are redirected to sign in before they can access these resources. After authenticating, they gain access to all protected content.

**Why this priority**: Route protection is the business value of authentication. Without it, auth is purely cosmetic. This story ensures only authenticated users can access premium content and the chatbot.

**Independent Test**: Can be tested by visiting a `/docs/*` URL while not signed in and verifying a redirect to sign-in occurs, then signing in and verifying the content is accessible.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they navigate to any `/docs/*` page, **Then** they are shown the sign-in modal or redirected to sign in.
2. **Given** an unauthenticated visitor, **When** they try to use the chatbot, **Then** the chatbot prompts them to sign in first.
3. **Given** an authenticated user, **When** they navigate to any `/docs/*` page, **Then** the content loads normally.
4. **Given** an authenticated user, **When** they use the chatbot, **Then** their messages are sent to the backend with their authenticated identity (not just an API key).
5. **Given** an authenticated user whose session has expired, **When** they attempt to access a protected page, **Then** the system silently attempts to refresh their session; if refresh fails, they are redirected to sign in.

---

### User Story 4 - Persistent Session with Token Refresh (Priority: P4)

An authenticated user returns to the site after some time. If their session is still valid or can be silently refreshed, they are not forced to sign in again. The system manages access and refresh tokens transparently.

**Why this priority**: Good UX requires sessions that persist reasonably without forcing frequent re-authentication. This story ensures the JWT refresh flow works correctly behind the scenes.

**Independent Test**: Can be tested by signing in, waiting for the access token to expire (or simulating expiration), then navigating to a protected page and verifying the session is silently refreshed.

**Acceptance Scenarios**:

1. **Given** an authenticated user whose access token has expired but refresh token is valid, **When** they make a request to a protected resource, **Then** the system silently obtains a new access token and the request succeeds.
2. **Given** an authenticated user whose refresh token has also expired, **When** they make a request, **Then** they are redirected to sign in.
3. **Given** an authenticated user, **When** they sign out, **Then** both their access and refresh tokens are invalidated.

---

### Edge Cases

- What happens when a user submits the sign-up form with a password shorter than 8 characters? They see a validation error before the form is submitted.
- What happens when the backend is unreachable during sign-in? The user sees a "Service unavailable, please try again" error message.
- What happens when Google OAuth returns an error (e.g., account suspended)? The user sees a generic error and is returned to the AuthModal.
- What happens when two browser tabs are open and the user signs out in one? The other tab detects the sign-out on next interaction and redirects to sign-in.
- What happens if a user tries to register with a malformed email? Client-side validation prevents submission; server-side validation rejects it if bypassed.
- What happens if the JWT secret is rotated? All existing tokens become invalid and users must re-authenticate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to register with name, email, and password.
- **FR-002**: System MUST validate that passwords meet minimum strength requirements (at least 8 characters, at least one letter and one number).
- **FR-003**: System MUST authenticate users via email/password and return session tokens.
- **FR-004**: System MUST authenticate users via Google OAuth 2.0 and return session tokens.
- **FR-005**: System MUST issue short-lived access tokens and longer-lived refresh tokens upon successful authentication.
- **FR-006**: System MUST silently refresh expired access tokens using valid refresh tokens without user interaction.
- **FR-007**: System MUST invalidate all tokens for a user when they sign out.
- **FR-008**: System MUST prevent unauthenticated users from accessing protected documentation pages (`/docs/*`).
- **FR-009**: System MUST prevent unauthenticated users from using the chatbot.
- **FR-010**: System MUST store user credentials securely (passwords must never be stored in plaintext).
- **FR-011**: System MUST link Google OAuth accounts with existing email/password accounts that share the same email address.
- **FR-012**: System MUST return generic error messages for authentication failures that do not reveal whether an email exists in the system.
- **FR-013**: System MUST persist authentication state across page reloads within the same browser.
- **FR-014**: System MUST provide a sign-out mechanism that clears all client-side authentication state.
- **FR-015**: System MUST validate all authentication tokens on the backend before granting access to protected API endpoints.

### Key Entities

- **User**: Represents an authenticated person. Key attributes: unique identifier, display name, email address, authentication method(s) used, account creation date.
- **Credential**: Represents a user's authentication secret. Key attributes: hashed password (for email/password users), linked OAuth provider identifier (for OAuth users).
- **Session Token**: Represents an active authentication session. Key attributes: associated user, token type (access or refresh), issuance time, expiration time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration and first sign-in in under 60 seconds.
- **SC-002**: Users can sign in via Google OAuth in under 30 seconds (excluding Google's consent screen time).
- **SC-003**: 100% of unauthenticated requests to protected pages result in a sign-in prompt (no unprotected access).
- **SC-004**: Token refresh succeeds silently in 100% of cases where the refresh token is still valid, with no user-visible interruption.
- **SC-005**: Zero passwords are stored in plaintext or reversible format in the system.
- **SC-006**: Authentication error messages never reveal whether a specific email address exists in the system.
- **SC-007**: Authenticated sessions persist across page reloads without requiring re-authentication.

## Assumptions

- The existing Neon PostgreSQL database will be used to store user accounts (no separate auth service).
- Google OAuth is the only third-party provider for the initial release; other providers (GitHub, etc.) may be added later but are out of scope.
- Access token lifetime will default to 15 minutes; refresh token lifetime will default to 7 days. These are reasonable defaults that balance security and convenience.
- The existing chatbot API key system will be replaced by user-based authentication tokens rather than running both systems in parallel.
- Email verification is out of scope for this iteration. Users can sign in immediately after registration.
- Password reset/recovery flow is out of scope for this iteration but should be designed for in the data model.
- Rate limiting on auth endpoints (login, register) will use the existing rate limiter infrastructure in the backend.

## Scope & Non-Goals

### In Scope

- Backend auth endpoints (register, login, refresh, logout, Google OAuth callback)
- JWT-based session management (access + refresh tokens)
- Frontend auth context/provider wrapping the app
- AuthModal connected to real backend endpoints
- Google OAuth integration
- Protected routes for `/docs/*` pages
- Chatbot authentication using user tokens instead of static API keys
- User table in Neon PostgreSQL

### Out of Scope

- Email verification flow
- Password reset/forgot password flow
- Role-based access control (admin vs. regular user)
- Multi-factor authentication
- Other OAuth providers (GitHub, Facebook, etc.)
- Account settings/profile page
- Account deletion
