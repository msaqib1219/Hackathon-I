# Railway → Render Migration: Step-by-Step Deployment Guide

## Pre-Deployment Checklist
- [ ] You have GitHub repo access (for Render to pull code)
- [ ] You have Netlify dashboard access to update env vars
- [ ] All current credentials documented (GEMINI_API_KEY, QDRANT_URL, etc.)
- [ ] **NO credit card needed** — both Supabase and Render free tiers work without it
- [ ] You have 45-60 minutes uninterrupted time

---

## Step 1: Create Supabase PostgreSQL Database (5 min) — NO CREDIT CARD NEEDED

1. Go to [supabase.com](https://supabase.com) and click **Sign Up** (free tier)
2. Sign up with email or GitHub (no credit card required)
3. Click **New Project**
4. Fill in:
   - **Project Name**: `agentic-ai`
   - **Password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
   - **Plan**: Free
5. Click **Create new project**
6. Wait 1-3 minutes for database to provision
7. Once ready, go to **Project Settings** → **Database**
8. Copy the **Connection String** (URI format, looks like):
   ```
   postgresql://postgres:YourPasswordHere@db.xxxxx.supabase.co:5432/postgres
   ```
   Save this as `DATABASE_URL` for next step

---

## Step 2: Deploy Backend to Render (10 min) — NO CREDIT CARD NEEDED

1. Go to [render.com](https://render.com) and click **Sign Up** (free tier, no CC needed)
2. Sign up with email or GitHub
3. In Render dashboard, click **New** → **Web Service**
4. Click **Connect Repository**
   - Select your GitHub repo
   - Authorize Render if needed (first time only)
5. Fill in:
   - **Name**: `agentic-ai-backend`
   - **Region**: Same region as Supabase (from Step 1)
   - **Branch**: `main`
   - **Runtime**: `Python 3.11`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
6. Click **Create Web Service**
7. Render will auto-deploy from main branch (takes 2-3 min)

---

## Step 3: Configure Environment Variables in Render (10 min)

Once deployment completes (you'll see "Live" status):

1. Click **Environment** tab in the Web Service
2. Add these variables (scroll to "Add Environment Variable"):

   **Non-Secret Variables:**
   ```
   FRONTEND_URL=https://your-netlify-domain.netlify.app
   ALLOWED_ORIGINS=https://your-netlify-domain.netlify.app,http://localhost:3000,http://127.0.0.1:3000
   ```

   **Secret Variables** (mark as "secret" when adding):
   ```
   DATABASE_URL=postgresql://postgres:YourPassword@db.xxxxx.supabase.co:5432/postgres
   GEMINI_API_KEY=<your_existing_key>
   QDRANT_URL=<your_existing_url>
   QDRANT_API_KEY=<your_existing_key>
   JWT_SECRET=<your_existing_secret>
   ```

3. Click **Save** (triggers redeploy with env vars)
4. Wait 1-2 min for redeploy to complete

---

## Step 4: Test Backend Deployment (5 min)

1. In Render dashboard, copy your service URL (e.g., `https://agentic-ai-backend.onrender.com`)
2. Test health endpoint:
   ```bash
   curl https://agentic-ai-backend.onrender.com/api/health
   ```
   Expected response:
   ```json
   {"status": "healthy", "service": "rag-chatbot"}
   ```
3. If 500 error, check logs in Render dashboard → **Logs** tab

---

## Step 5: Update Frontend on Netlify (5 min)

1. Go to [app.netlify.com](https://app.netlify.com) and select your site
2. Click **Site settings** → **Build & deploy** → **Environment**
3. Update or create `REACT_APP_API_URL`:
   - Old value: `https://railway-backend.up.railway.app` (or your old URL)
   - New value: `https://agentic-ai-backend.onrender.com` (from Render)
4. Click **Trigger deploy** → **Deploy site**
5. Wait for Netlify build to complete (2-3 min)

---

## Step 6: Test Full Integration (10 min)

1. Open your Netlify frontend in a browser
2. **Test OAuth2 Sign-In:**
   - Click sign-up/sign-in button
   - Complete OAuth flow (Google, GitHub, etc.)
   - Verify user lands on dashboard
3. **Test Chat:**
   - Type a question about the Agentic AI book
   - Verify response appears within 5 seconds
   - Check browser console for CORS errors
4. **Test Profile:**
   - Navigate to profile page
   - Verify user data displays
   - Fill in questionnaire and save
5. **Check Render Logs:**
   - Go to Render dashboard → Logs
   - Verify no 500 errors, no auth failures

---

## Step 7: Clean Up Old Services (Optional but Recommended)

1. Delete Railway service (if using)
2. Delete Neon database (if using)
3. Document closure date and backup location

---

## Troubleshooting

### "Build failed" in Render
- Check Logs tab for error message
- Common issues:
  - `pip install` failed: verify requirements.txt syntax
  - Python version mismatch: check runtime version

### "502 Bad Gateway" when accessing backend
- Service might still be starting (cold start on free tier)
- Wait 30 seconds and retry
- If persists, check Logs for runtime errors

### "CORS error" in browser console
- Verify `ALLOWED_ORIGINS` in Render env vars includes your Netlify domain
- Verify `FRONTEND_URL` in Render env vars is set
- Redeploy Web Service after changing env vars

### "Database connection refused"
- Verify `DATABASE_URL` is correct (check Supabase dashboard → Settings → Database)
- Verify Supabase project is in "Active" state on dashboard
- Test locally: `psql $DATABASE_URL` (if psql installed)
- If using Supabase: check if project auto-paused (free tier pauses after 7 days inactivity)

### Chat endpoint returns 401 Unauthorized
- Verify `JWT_SECRET` matches what frontend is using
- Check authentication token in browser → DevTools → Network
- Verify better-auth configuration is correct

### "Gemini API error" in logs
- Verify `GEMINI_API_KEY` is set in Render env vars
- Verify key is valid and has quota remaining
- Check Gemini API dashboard for rate limits

---

## Monitoring Checklist (Post-Deployment)

- [ ] Monitor Render logs daily for first week
- [ ] Check DB storage usage (free tier = 500MB limit)
- [ ] Verify no unintended auto-sleeps (free tier sleeps after 15 min inactivity)
- [ ] Keep backup of DATABASE_URL and secrets

---

## Rollback Plan

If something breaks:

1. **Update Netlify env var** back to old API URL
2. **Trigger Netlify redeploy**
3. **Check Render logs** for root cause
4. **Keep old services running** as fallback (if possible) until issue resolved

---

## Success Indicators

✓ Backend is "Live" in Render dashboard  
✓ Health endpoint responds 200 OK  
✓ Frontend can sign in via OAuth2  
✓ Chat endpoint returns bot responses  
✓ No CORS errors in browser console  
✓ Render logs show no 500 errors  

You're done! 🎉
