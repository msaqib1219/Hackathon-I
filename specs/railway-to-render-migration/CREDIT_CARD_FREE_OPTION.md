# ✅ TRULY CREDIT CARD FREE: SnapDeploy + Supabase

**Problem**: Render, Fly.io, and other platforms ask for credit card (even free tier)  
**Solution**: Use **SnapDeploy** (free forever, no CC ever) + **Supabase** (free forever, no CC ever)

---

## Updated Architecture (ZERO CREDIT CARD)

```
Netlify Frontend (unchanged)
         ↓
SnapDeploy FastAPI Backend (free forever, no CC)
         ↓
Supabase PostgreSQL (free 500MB, no CC)
         ↓
Gemini API (unchanged)
Qdrant Cloud (unchanged)
```

---

## Platform Comparison: What Actually Works?

| Platform | Backend | CC Required? | Comments |
|----------|---------|--------------|----------|
| Render | ✅ FastAPI | ⚠️ **YES** | Requires CC even for free tier |
| Fly.io | ✅ FastAPI | ⚠️ **YES** | Free trial only (2 hrs), then requires CC |
| **SnapDeploy** | ✅ FastAPI | ✅ **NO** | Free forever, no time limits |
| **Supabase** | N/A (DB only) | ✅ **NO** | Free 500MB PostgreSQL |

---

## SnapDeploy: The Right Choice

### Why SnapDeploy?
- ✅ **Free forever** — no credit card ever required
- ✅ **No time limits** — doesn't expire after 90 days
- ✅ **Auto-sleep + auto-wake** — pauses when idle, wakes when traffic arrives
- ✅ **Simple deployment** — `snapdeploy deploy` (git auto-detected)
- ✅ **Adequate resources** — 512 MB RAM, 0.25 vCPU (sufficient for FastAPI)
- ✅ **Up to 4 containers** — can scale horizontally if needed

### Limitations
- 10-30 second cold start (when waking from idle)
- 512 MB RAM (tight but works for lightweight FastAPI)
- No built-in database (use Supabase instead)

---

## Quick Setup: SnapDeploy

### 1. Sign Up (No CC)
```bash
# Go to https://snapdeploy.dev
# Sign up with email (NO credit card prompt)
```

### 2. Deploy Backend
```bash
# In your project root
git init && git add . && git commit -m "init"
snapdeploy deploy
# Follow CLI prompts to select repo/branch
```

### 3. Get URL
```
Backend URL: https://your-app.snapdeploy.app
```

### 4. Set Environment Variables
```bash
snapdeploy env set DATABASE_URL="postgresql://..."
snapdeploy env set GEMINI_API_KEY="..."
snapdeploy env set QDRANT_URL="..."
snapdeploy env set QDRANT_API_KEY="..."
snapdeploy env set FRONTEND_URL="https://your-netlify.netlify.app"
```

---

## Backend Configuration for SnapDeploy

Create `Procfile` in project root (if not auto-detected):
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or create `snapdeploy.json` in root:
```json
{
  "runtime": "python:3.11",
  "buildCommand": "pip install -r backend/requirements.txt",
  "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
}
```

---

## Final Architecture (Truly CC-Free)

```
┌─────────────────────────────────────────────────┐
│ Frontend: Netlify                               │
│ (your docusaurus + react app)                   │
│ No CC required ✓                                │
└──────────────────┬──────────────────────────────┘
                   │ CORS
                   ↓
┌─────────────────────────────────────────────────┐
│ Backend: SnapDeploy                             │
│ (FastAPI uvicorn)                               │
│ Free forever, no CC required ✓                  │
│ Auto-sleep/wake, 512 MB RAM                     │
└──────────────────┬──────────────────────────────┘
                   │ SQL
                   ↓
┌─────────────────────────────────────────────────┐
│ Database: Supabase PostgreSQL                   │
│ (500 MB free, no CC required ✓)                 │
│ Standard PostgreSQL, easy to use                │
└─────────────────────────────────────────────────┘
                   │
                   ├──→ Gemini API (unchanged)
                   └──→ Qdrant Cloud (unchanged)
```

---

## Next Steps

1. **Sign up SnapDeploy** → https://snapdeploy.dev (no CC popup!)
2. **Install CLI** → `npm install -g snapdeploy` (or brew/pip)
3. **Deploy** → `snapdeploy deploy` in your repo root
4. **Set env vars** → `snapdeploy env set ...`
5. **Update Netlify** → Point `REACT_APP_API_URL` to SnapDeploy URL
6. **Test** → OAuth2 sign-in → chat → profile

---

## Files to Update

From original plan, keep these as-is:
- `spec.md` ✓
- `plan.md` (update backend provider → SnapDeploy)
- `tasks.md` (update Phase 2 → SnapDeploy instead of Render)
- `DEPLOYMENT_GUIDE.md` (update Step 2 → SnapDeploy)

Database setup (Supabase) remains **EXACTLY THE SAME**.

---

## Why This Works

- **SnapDeploy**: Truly free tier with no time limits, no CC barrier
- **Supabase**: Free PostgreSQL, no CC barrier
- **Netlify**: Free frontend, no CC barrier
- **Total**: 100% free stack, zero credit card friction

---

## Comparison Table

| Need | Service | Free? | CC? | Hours/Month | Storage |
|------|---------|-------|-----|-------------|---------|
| Frontend | Netlify | ✓ | ✗ | Unlimited | 100GB |
| Backend | SnapDeploy | ✓ | ✗ | Unlimited* | 512MB |
| Database | Supabase | ✓ | ✗ | Unlimited | 500MB |
| **Total** | **All Free** | **✓** | **✗** | **Unlimited** | **1GB+** |

*SnapDeploy: auto-sleep when idle (acceptable for MVP)

---

## Ready?

Follow this updated deployment guide next:
1. Create Supabase PostgreSQL (unchanged from before)
2. Deploy to SnapDeploy (instead of Render)
3. Update Netlify env vars
4. Test integration

**No credit card required at any step! 🎉**
