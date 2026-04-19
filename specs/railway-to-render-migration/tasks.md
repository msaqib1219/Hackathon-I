# Railway → Render Migration Tasks

## Phase 1: Supabase PostgreSQL Setup (No Credit Card Needed)

### Task 1.1: Create Supabase PostgreSQL Database
- [ ] Sign up at supabase.com (free tier, no credit card required)
- [ ] Create new project
- [ ] Wait for database provisioning (1-3 min)
- [ ] Go to Project Settings → Database
- [ ] Copy database connection string (format: `postgresql://postgres:password@host:5432/postgres`)
- [ ] Note connection string securely (will use in Render)

**Acceptance Criteria:**
- Supabase project is in "Active" state on dashboard
- Connection string is accessible and shows correct host/port
- Can view database in Supabase dashboard (Schema tab)

---

### Task 1.2: Prepare Backend Environment Variables
- [ ] Gather all required env vars:
  - `DATABASE_URL` (from Supabase connection string above)
  - `GEMINI_API_KEY` (existing from current setup)
  - `QDRANT_URL` (existing from current setup)
  - `QDRANT_API_KEY` (existing from current setup)
  - `FRONTEND_URL` (Netlify domain, e.g., `https://yoursite.netlify.app`)
  - `ALLOWED_ORIGINS` (CORS: Netlify domain + localhost for dev)
  - `JWT_SECRET` (from better-auth setup, or generate new)
- [ ] Create `.env.supabase-render` file locally (DO NOT commit)
- [ ] Verify all vars are non-empty and formatted correctly

**Acceptance Criteria:**
- All 7 environment variables documented
- `DATABASE_URL` format verified: `postgresql://user:password@host:5432/postgres`
- No hardcoded secrets in git
- Each var has a source documented

---

## Phase 2: Render Backend Deployment (No Credit Card Needed)

### Task 2.1: Create Web Service on Render
- [ ] Sign up at render.com (free tier signup, no credit card required at signup)
- [ ] Go to Render dashboard → New → Web Service
- [ ] Connect GitHub repo (authorize if needed)
- [ ] Select main branch
- [ ] Set name: `agentic-ai-backend`
- [ ] Set region: Same as preferred location (affects latency)
- [ ] Set runtime: Python
- [ ] Set build command: `pip install -r backend/requirements.txt`
- [ ] Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Leave plan on FREE
- [ ] Click "Create Web Service"

**Acceptance Criteria:**
- Web Service shows "Live" status on dashboard
- Build logs show successful pip install
- Service has a .onrender.com domain assigned (e.g., `https://agentic-ai-backend.onrender.com`)
- No errors in build or startup logs

---

### Task 2.2: Configure Environment Variables in Render
- [ ] In Render dashboard, go to Web Service → Environment
- [ ] Add each var from Task 1.2:
  - `DATABASE_URL` = (Supabase PostgreSQL connection string from Task 1.1)
  - `GEMINI_API_KEY` = (mark as Secret)
  - `QDRANT_URL` = (mark as Secret)
  - `QDRANT_API_KEY` = (mark as Secret)
  - `FRONTEND_URL` = (Netlify domain, e.g., `https://your-site.netlify.app`)
  - `ALLOWED_ORIGINS` = (CSV list: `https://your-site.netlify.app,http://localhost:3000`)
  - `JWT_SECRET` = (mark as Secret)
- [ ] Click "Save" (triggers automatic redeploy)
- [ ] Monitor logs for successful restart

**Acceptance Criteria:**
- All 7 env vars appear in Render dashboard
- Secrets are marked as secret type
- Redeploy completes within 2-3 minutes
- Logs show service started successfully

---

### Task 2.3: Verify Backend Deployment
- [ ] Get Render service URL from dashboard
- [ ] Test health endpoint: `curl https://<service>.onrender.com/api/health`
- [ ] Verify response: `{"status": "healthy", "service": "rag-chatbot"}`
- [ ] Check Render logs for errors

**Acceptance Criteria:**
- Health check returns 200 OK
- Response matches expected format
- No error logs in Render dashboard

---

## Phase 3: Database Migration (Supabase)

### Task 3.1: Create Schema on Supabase PostgreSQL
- [ ] Open Supabase dashboard → SQL Editor
- [ ] Run `init_db()` SQL from `backend/database.py` (identify the schema creation code)
  ```python
  # From database.py, find the init_db() async function
  # Copy the SQL statements it executes
  ```
- [ ] Paste and run in Supabase SQL Editor
- [ ] Verify tables created: Go to Supabase Dashboard → Schema → Tables
- [ ] Confirm `user` and `message_history` (or equivalent) tables are created

**Acceptance Criteria:**
- All expected tables exist in Supabase DB
- Schema matches `backend/database.py` definitions
- Can view table structure in Supabase dashboard

---

### Task 3.2: Migrate Data (If Any)
- [ ] Export from old database:
  ```bash
  pg_dump <old_railway_db_url> > backup.sql
  ```
- [ ] Import to Render:
  ```bash
  psql <render_db_url> < backup.sql
  ```
- [ ] Verify record counts match
- [ ] Spot-check 5 records for data integrity

**Acceptance Criteria:**
- Data migrated without errors
- Record counts in old DB = new DB (at least for critical tables)
- Sample records verified for correctness

---

## Phase 4: Frontend Integration

### Task 4.1: Update Netlify Environment Variables
- [ ] Go to Netlify dashboard → Site settings → Build & deploy → Environment
- [ ] Update or create `REACT_APP_API_URL`:
  - Old: `https://railway-backend.up.railway.app` (or similar)
  - New: `https://<service>.onrender.com` (from Render dashboard)
- [ ] Trigger redeploy from Netlify

**Acceptance Criteria:**
- Netlify shows successful rebuild
- Built site includes new API URL

---

### Task 4.2: Test OAuth2 & Chat Flow
- [ ] Open Netlify frontend in browser
- [ ] Test sign-in flow (OAuth2 provider, e.g., Google)
- [ ] Verify user profile loads correctly
- [ ] Submit a chat message and verify response
- [ ] Check browser DevTools → Network for CORS errors

**Acceptance Criteria:**
- OAuth2 redirect completes without errors
- User profile returns user data
- Chat endpoint responds with bot reply
- No CORS errors in console

---

### Task 4.3: Test Rate Limiting & Auth Endpoints
- [ ] Get API key from better-auth or frontend local storage (if applicable)
- [ ] Test: `curl -H "X-API-Key: <key>" https://<service>.onrender.com/api/rate-limit-status`
- [ ] Test: `curl -H "Authorization: Bearer <token>" https://<service>.onrender.com/api/user/profile`
- [ ] Verify responses

**Acceptance Criteria:**
- Rate limit endpoint returns remaining requests
- Profile endpoint returns user data
- Auth errors handled gracefully (401, 403 as needed)

---

## Phase 5: Cleanup & Monitoring

### Task 5.1: Rotate Credentials (Post-Migration)
- [ ] Generate new JWT_SECRET (if exposed in old config)
- [ ] Regenerate Gemini API key (if exposed)
- [ ] Regenerate Qdrant API key (if exposed)
- [ ] Update Render env vars with new secrets
- [ ] Invalidate old Railway-stored secrets

**Acceptance Criteria:**
- New secrets deployed to Render
- Old secrets no longer in use
- Frontend still works with new auth tokens

---

### Task 5.2: Decommission Old Railway Service
- [ ] Verify Render is running 24+ hours without issues
- [ ] Delete Railway deployment
- [ ] Delete Neon database (if using Railway/Neon combo)
- [ ] Document old service retirement date

**Acceptance Criteria:**
- Old services deleted from dashboards
- No traffic routed to old backend
- Backup of database kept (if needed)

---

### Task 5.3: Set Up Monitoring
- [ ] Enable Render email alerts for build failures
- [ ] (Optional) Set up log aggregation (e.g., send logs to uptime service)
- [ ] Document Render dashboard access

**Acceptance Criteria:**
- Alerts configured in Render
- Team can access logs
- Monitoring runbook created

---

## Dependencies & Sequencing
```
Task 1.1 ──→ Task 2.1 ──→ Task 2.2 ──→ Task 2.3 ──→ Task 3.1
Task 1.2 ──↗                                            ↓
                                                    Task 3.2
                                                        ↓
Task 4.1 ──→ Task 4.2 ──→ Task 4.3 ←──────────────────↓
```

**Critical Path:**
1. Task 1.1 (DB setup)
2. Task 1.2 (env vars)
3. Task 2.1 (web service)
4. Task 2.2 (env config)
5. Task 2.3 (verify deployment)
6. Task 4.1 (update frontend)
7. Task 4.2 (test integration)

**Post-Critical Path** (can be done later):
- Task 3.2 (data migration, if historical data needed)
- Task 5.x (cleanup)

---

## Effort Estimates
- **Phase 1**: 10 min (Supabase signup + DB creation, faster provisioning)
- **Phase 2**: 20 min (Render signup + Web Service + env vars)
- **Phase 3**: 10-15 min (SQL schema creation in Supabase)
- **Phase 4**: 15 min (update Netlify, test flows)
- **Phase 5**: 20 min (cleanup, monitoring)

**Total**: ~1 hour-1.5 hours (mostly hands-on, interactive, no credit card friction)

---

## Troubleshooting Quick Links
- Render logs: `https://dashboard.render.com` → Web Service → Logs
- CORS errors: Check `ALLOWED_ORIGINS` env var in Render
- Auth failures: Verify `JWT_SECRET` matches frontend expectations
- DB connection: Test with `psql $DATABASE_URL` command
