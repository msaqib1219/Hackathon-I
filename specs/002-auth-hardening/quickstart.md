# Quickstart: Auth Hardening

**Feature**: 002-auth-hardening
**Date**: 2026-02-14

---

## Prerequisites

1. **Existing setup working**: Backend (FastAPI) and Frontend (Docusaurus) both running
2. **Neon PostgreSQL**: Connection string in `backend/.env` as `DATABASE_URL`
3. **Google OAuth credentials**: Client ID + Client Secret from Google Cloud Console
4. **JWT secret**: Generated via `openssl rand -hex 64`

## Environment Variables (add to `backend/.env`)

```env
# === Auth Hardening (new) ===

# JWT Configuration
JWT_SECRET_KEY=<your-64-byte-hex-secret>
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Frontend URL (for OAuth redirect after callback)
FRONTEND_URL=http://localhost:3000
```

## New Python Dependencies

```bash
cd backend
pip install python-jose[cryptography] passlib[bcrypt] httpx
```

Add to `requirements.txt`:
```
python-jose[cryptography]
passlib[bcrypt]
httpx
```

## Database Migration

Run the migration to create auth tables (connect to your Neon DB):

```bash
# Option 1: Via psql
psql "$DATABASE_URL" -f specs/002-auth-hardening/contracts/migration_001.sql

# Option 2: Auto-run on startup (will be added to database.py init_db())
# The init_db() function will be updated to create these tables
```

## Development Workflow

### 1. Start Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend
```bash
npm start
# Docusaurus dev server on http://localhost:3000
```

### 3. Test Auth Flow
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testPass123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testPass123"}'

# Use access token
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### 4. Test Google OAuth
1. Navigate to `http://localhost:3000`
2. Click "Sign In" → "Continue with Google"
3. Complete Google consent flow
4. Verify redirect back to site with authenticated state

## File Structure (new/modified files)

```
backend/
├── auth.py              # MODIFIED: Add JWT + OAuth alongside existing API key auth
├── auth_routes.py       # NEW: Auth endpoint handlers (register, login, refresh, logout, OAuth)
├── auth_models.py       # NEW: Pydantic models for auth requests/responses
├── database.py          # MODIFIED: Add user/token DB operations + migration
├── main.py              # MODIFIED: Register auth routes, update CORS
├── requirements.txt     # MODIFIED: Add new dependencies

src/
├── context/
│   └── AuthContext.js   # NEW: React auth state management
├── components/
│   ├── AuthModal/
│   │   └── index.jsx    # MODIFIED: Connect to real backend API
│   ├── SignInButton/
│   │   └── index.jsx    # MODIFIED: Use AuthContext instead of localStorage
│   ├── Chatbot.jsx      # MODIFIED: Use JWT token from AuthContext
│   └── ProtectedRoute.js # NEW: Auth gate for protected paths
├── theme/
│   └── Root.js          # MODIFIED: Wrap with AuthProvider
```

## Key Decisions Summary

| Decision | Choice | Reference |
|----------|--------|-----------|
| JWT library | python-jose[cryptography] | research.md R1 |
| Token storage | Access in memory, Refresh in httpOnly cookie | research.md R2 |
| Password hashing | passlib[bcrypt] | research.md R3 |
| OAuth library | httpx (manual flow) | research.md R4 |
| DB approach | Raw asyncpg SQL (consistent with existing) | research.md R5 |
| Route protection | Client-side via AuthContext + Root.js | research.md R6 |
| Migration | Parallel API key + JWT, then remove API key | research.md R7 |
