# PHR: Implement better-auth with Signup Questionnaire

- **Date:** 2026-03-02
- **Surface:** Full-stack auth migration (auth-server, frontend, backend)
- **Success Criteria:** Replace custom JWT auth with better-auth library for 50 bonus points; add signup questionnaire for content personalization.

## Changes Made

### Phase 1: Auth Server (`auth-server/`)
- Created Express server mounting better-auth at `/auth`
- PostgreSQL adapter using shared `DATABASE_URL`
- Google OAuth + email/password providers
- Additional user fields: experienceLevel, programmingLanguages, aiMlFamiliarity, hardwareExperience, learningGoals, questionnaireCompleted

### Phase 2: Netlify Proxy
- Added `/auth/*` proxy redirect to auth-server on Railway

### Phase 3: Frontend
- Installed `better-auth` npm package
- Created `src/lib/auth-client.js` with better-auth React client
- Rewrote `AuthContext.js` to use better-auth signIn/signUp/signOut/getSession
- Rewrote `AuthModal` with post-signup questionnaire step
- Updated `Chatbot.jsx` to use cookie-based fetch (no more fetchWithAuth/Bearer tokens)
- ProtectedRoute, SignInButton, Root.js unchanged (use same useAuth hook)

### Phase 4: Backend
- Rewrote `auth.py`: session validation via better-auth session cookie + shared DB lookup
- Deleted `auth_routes.py` (all auth handled by better-auth server)
- Simplified `database.py` (removed user CRUD, refresh token, OAuth functions)
- Simplified `auth_models.py` (only ErrorResponse remains)
- Added `GET/POST /api/user/profile` endpoints in `main.py`
- Added content personalization in chat endpoint using user questionnaire data

### Phase 5: Tests
- Updated auth-flow tests for cookie-based sessions

## Risks
1. Cookie proxying: Netlify must forward Set-Cookie headers correctly
2. Existing users must re-register (schema change)
3. Two Railway services needed (auth-server + backend)

## Follow-ups
- [ ] Run `npx @better-auth/cli generate` for DB migration
- [ ] Deploy auth-server to Railway
- [ ] Update Railway URL in netlify.toml
