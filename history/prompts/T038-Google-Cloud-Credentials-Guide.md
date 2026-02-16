# PHR: T038 Google Cloud Credentials Implementation Guide
**Feature**: Google Cloud Console OAuth Credentials Setup
**Date**: 2026-02-15
**Session ID**: phr-t038-google-creds-guide

## Context
User has gathered client ID and secrets from Google Cloud Console and needs guidance for T038 implementation in the existing authentication system.

## Surface/Success Criteria
Successfully configure Google Cloud OAuth credentials in the existing authentication system to enable Google sign-in functionality.

## Constraints/Non-Goals
- No architectural changes to existing authentication flow
- Focus on credential configuration, not new feature development
- Preserve existing email/password authentication

## Implementation Guide

### 1. Google Cloud Console Setup Requirements

**Already Complete**:
- Google Cloud Console project created
- OAuth 2.0 credentials (Client ID and Client Secret) obtained
- JSON configuration file downloaded

**Required Configuration**:
```
Redirect URI: http://localhost:8000/api/auth/google/callback
Authorization scopes: email, profile
```

### 2. Environment Configuration

**Create/Edit `/backend/.env`**:
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-json
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-json
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# JWT Configuration (already exists)
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 3. Test the Integration

**Steps to Verify**:
1. Start backend: `cd backend && python -m uvicorn main:app --reload`
2. Start frontend: `npm start`
3. Open browser to `http://localhost:3000`
4. Click Google sign-in button
5. Verify redirects to Google OAuth consent
6. Complete authentication and verify session persistence

### 4. Key Files for T038

**Backend Files**:
- `/backend/auth_routes.py:144-278` - Google OAuth implementation
- `/backend/auth.py` - Core authentication logic
- `/backend/.env` - Environment variables

**Frontend Files**:
- `/src/context/AuthContext.js` - Auth state management
- `/src/components/SignInButton/index.jsx` - Google sign-in button

### 5. Security Considerations

**Production Settings**:
- Set proper redirect URI in production
- Configure CORS origins
- Enable secure cookie settings
- Implement rate limiting (already present)

**Google Console Security**:
- Configure authorized domains
- Set up consent screen
- Enable OAuth 2.0 client ID
- Configure redirect URIs properly

## Risks/Follow-ups

1. **Redirect URI Mismatch**: Ensure Google Console redirect URI exactly matches application URL
2. **CORS Issues**: Verify frontend origin is allowed in CORS configuration
3. **Environment Variables**: Never commit `.env` file to version control

## Verification Checklist

- [ ] Google OAuth credentials configured in `.env`
- [ ] Backend server running on correct port (8000)
- [ ] Frontend server running on correct port (3000)
- [ ] Google Console redirect URI matches exactly
- [ ] OAuth scopes include email and profile
- [ ] Test complete authentication flow
- [ ] Verify session persistence and refresh tokens working