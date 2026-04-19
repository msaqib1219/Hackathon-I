# Railway → Render Migration Plan

## Architecture Overview
```
Netlify Frontend (unchanged)
         ↓ (CORS to new backend)
   Render FastAPI Backend (free, no CC needed)
         ↓ (SQL queries)
   Supabase PostgreSQL (500MB free, no CC needed)
         ↓ (embeddings)
   Gemini API (unchanged)
         ↓ (vector search)
   Qdrant Cloud (unchanged)
```

## Key Decisions
1. **Database**: Use Supabase PostgreSQL (free 500MB, no credit card required)
   - Rationale: Free tier without credit card, 500MB sufficient for chat history + user data
   - Trade-off: Projects auto-pause after 7 days of inactivity (easily reactivated with ping)
   - Alternative avoided: Render PostgreSQL (requires credit card)

2. **Deployment**: Web Service on Render (free tier, no credit card needed)
   - Rationale: Auto-deploys from git, HTTPS included, built-in scaling
   - Trade-off: Auto-sleep after 15 min of inactivity (acceptable for MVP)

3. **Environment Variables**: Use Render dashboard + Netlify for frontend
   - Rationale: Centralized secrets management, no .env in git
   - Trade-off: Manual setup (one-time cost)

## Implementation Phases

### Phase 1: Render Setup (Prerequisites)
1. Create Render account (free tier)
2. Create PostgreSQL database
3. Note database connection string
4. Update database.py with new connection string

### Phase 2: Backend Deployment
1. Connect git repo to Render
2. Create Web Service
3. Set environment variables (GEMINI_API_KEY, QDRANT_URL, DATABASE_URL, etc.)
4. Deploy main branch
5. Test health endpoint

### Phase 3: Data Migration
1. Export data from Railway/Neon (if any existing records)
2. Import to Render PostgreSQL
3. Verify data integrity

### Phase 4: Frontend Integration
1. Update Netlify env vars (REACT_APP_API_URL to new Render backend)
2. Redeploy frontend from git
3. Test OAuth2 flow
4. Test chat endpoints

### Phase 5: Cleanup
1. Rotate all credentials (if exposed in old Railway config)
2. Update DNS/CNAME if custom domain used
3. Monitor Render logs for errors
4. Set up monitoring alerts (optional)

## Deployment Configuration Files

### backend/render.yaml (to be created)
```yaml
# Render configuration for automated deployment
services:
  - type: web
    name: agentic-ai-backend
    plan: free
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        value: # Set in Render dashboard (from Supabase)
      - key: GEMINI_API_KEY
        value: # Set in Render dashboard (secret)
      - key: QDRANT_URL
        value: # Set in Render dashboard (secret)
      - key: QDRANT_API_KEY
        value: # Set in Render dashboard (secret)
      - key: FRONTEND_URL
        value: # Netlify frontend URL
      - key: ALLOWED_ORIGINS
        value: # CORS origins
```

## Environment Variables Checklist
- [ ] DATABASE_URL (Supabase PostgreSQL connection string)
- [ ] GEMINI_API_KEY
- [ ] QDRANT_URL
- [ ] QDRANT_API_KEY
- [ ] FRONTEND_URL (update to Netlify domain)
- [ ] ALLOWED_ORIGINS (include Netlify domain)
- [ ] JWT_SECRET (better-auth)
- [ ] JWT_EXPIRATION (if applicable)

## Testing Checklist
- [ ] Health endpoint: `GET /api/health` → 200 OK
- [ ] Rate limit endpoint: `GET /api/rate-limit-status` (with API key)
- [ ] User profile: `GET /api/user/profile` (authenticated)
- [ ] Chat endpoint: `POST /api/chat` (authenticated, with history)
- [ ] CORS headers correct for Netlify frontend
- [ ] OAuth2 redirect URIs updated in any OAuth provider settings

## Risks & Mitigations
1. **Risk**: Render free tier auto-sleep causes cold starts (15 min inactivity)
   - **Mitigation**: Acceptable for MVP; cold start ~3-5 sec when resumed
   
2. **Risk**: Supabase projects auto-pause after 7 days of inactivity
   - **Mitigation**: Easy reactivation with one API ping; add periodic health check if critical
   
3. **Risk**: 500MB DB fills up quickly with embeddings
   - **Mitigation**: Monitor usage monthly; archive old chat history if needed
   
4. **Risk**: Lost credentials if misconfigured
   - **Mitigation**: Rotate all secrets post-migration; document access patterns

## Rollback Plan
If Render deployment fails:
1. Keep Railway/Neon running as fallback (if possible)
2. Update Netlify env var back to old API_URL
3. Redeploy frontend
4. Investigate Render logs for root cause

## Success Metrics
- [ ] Backend responds to health check within 500ms
- [ ] User can sign in via OAuth2
- [ ] Chat endpoint returns responses < 5 seconds
- [ ] No CORS errors in frontend console
- [ ] Render logs show no auth/DB errors
