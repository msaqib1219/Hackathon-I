# Railway → Render + Supabase: Quick Reference Card

## Before You Start
- [ ] Supabase account created (free tier, NO credit card needed)
- [ ] Render account created (free tier, NO credit card needed)
- [ ] GitHub repo access
- [ ] Netlify dashboard access
- [ ] Current env vars documented

---

## Critical URLs
| Service | URL |
|---------|-----|
| Supabase Dashboard | https://app.supabase.com |
| Render Dashboard | https://dashboard.render.com |
| Netlify Dashboard | https://app.netlify.com |
| This Project Specs | `/specs/railway-to-render-migration/` |

---

## Supabase + Render Setup Timeline
```
Step 1: Create Supabase DB (1-3 min wait, FREE, no CC)
   ↓
Step 2: Deploy to Render (2-3 min wait, FREE, no CC)
   ↓
Step 3: Configure Env Vars (1-2 min wait)
   ↓
Step 4: Test Health (1 min)
   ↓
Step 5: Update Netlify (2-3 min wait)
   ↓
Step 6: Test Integration (5 min)
───────────────────────────────────
Total: ~15 min hands-on + ~10 min waits
NO CREDIT CARD REQUIRED!
```

---

## Key Credentials to Gather
```
GEMINI_API_KEY=<from your current setup>
QDRANT_URL=<from your current setup>
QDRANT_API_KEY=<from your current setup>
JWT_SECRET=<from better-auth config>
FRONTEND_URL=<your netlify domain>
```

---

## Render Build Command
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Health Check
```bash
curl https://<service>.onrender.com/api/health
# Expected: {"status": "healthy", "service": "rag-chatbot"}
```

---

## CORS Allowed Origins
```
https://your-netlify-domain.netlify.app
http://localhost:3000
http://127.0.0.1:3000
```

---

## If Deploy Fails
1. Check Render Logs tab
2. Common issues:
   - `pip install` error → check requirements.txt
   - Python version → verify 3.11
   - Env var missing → verify all vars set
3. Redeploy from Render dashboard

---

## If Chat/Auth Fails
1. Check browser DevTools console for errors
2. Check Render logs for 500 errors
3. Verify:
   - `JWT_SECRET` matches between services
   - `DATABASE_URL` is correct
   - `FRONTEND_URL` is set correctly
   - `ALLOWED_ORIGINS` includes your frontend

---

## Database Connection String Format (Supabase)
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```
- Find in Supabase dashboard → Project Settings → Database → Connection String

---

## Render Service URL
```
https://agentic-ai-backend.onrender.com
```
- Find in Render Web Service dashboard → Copy the URL

---

## Useful Commands (Local Testing)
```bash
# Test DB connection
psql "postgresql://user:password@host:5432/db" -c "SELECT 1"

# Check Python version
python --version

# Install backend deps locally
pip install -r backend/requirements.txt

# Run backend locally (for testing before Render)
cd backend && uvicorn main:app --reload
```

---

## Monitoring Post-Migration
- Daily: Check Render logs for errors
- Weekly: Check Supabase DB storage usage (free tier = 500MB limit)
- Monthly: Review Render activity hours
- **IMPORTANT**: Supabase free projects auto-pause after 7 days of inactivity (reactivated with one API call)

---

## Emergency Rollback
1. Update Netlify `REACT_APP_API_URL` → old Railway URL
2. Trigger Netlify redeploy
3. Investigate Render logs

---

## Docs
- Full spec: `spec.md`
- Architecture plan: `plan.md`
- Tasks: `tasks.md`
- Deployment guide: `DEPLOYMENT_GUIDE.md`
- This reference: `QUICK_REFERENCE.md`
