# Migration Plan Revision: Supabase + Render (NO CREDIT CARD)

**Date Updated**: 2026-04-18  
**Reason**: User reported Render PostgreSQL requires credit card → revised to use Supabase (free, no CC)

---

## What Changed

### Original Plan
- Backend: Render Web Service (free)
- Database: Render PostgreSQL (free **but requires CC**)
- Auth: better-auth

### Revised Plan (THIS VERSION)
- Backend: Render Web Service (free, **no CC needed**)
- Database: Supabase PostgreSQL (free, **no CC needed**)
- Auth: better-auth (unchanged)

---

## Updated Architecture
```
Netlify Frontend (unchanged)
         ↓
Render FastAPI Backend (free, no CC)
         ↓
Supabase PostgreSQL (free, no CC, 500MB)
         ↓
Gemini API (unchanged)
Qdrant Cloud (unchanged)
```

---

## Key Benefits of Supabase
- ✅ **FREE tier**: 500MB PostgreSQL database
- ✅ **No credit card required**: Completely free forever
- ✅ **Easy connection**: Standard PostgreSQL URI
- ✅ **Built-in tools**: SQL editor, schema viewer, connection pooling
- ✅ **Auto-pause after 7 days**: Easily reactivated (not permanent)

---

## All Updated Documents
1. **spec.md** — Updated to Supabase
2. **plan.md** — Architecture diagram updated, decision rationale revised
3. **tasks.md** — Step 1 now creates Supabase DB instead of Render DB
4. **DEPLOYMENT_GUIDE.md** — Step 1 walks through Supabase signup (no CC prompts)
5. **QUICK_REFERENCE.md** — Updated timelines and database connection string format
6. **render.yaml** — Comments updated to reference Supabase
7. **PHR (Prompt History Record)** — Full revision notes added

---

## Timeline
- **Phase 1**: Supabase DB setup (1-3 min, no CC needed)
- **Phase 2**: Render Web Service (2-3 min, no CC needed)
- **Phase 3-6**: Same as before
- **Total**: ~1 hour (vs. 1.5 hours, slightly faster)

---

## Supabase Free Tier Limits
| Feature | Limit |
|---------|-------|
| Database Storage | 500 MB |
| Connections | 10 concurrent |
| Auto-pause | After 7 days inactivity |
| Cost | FREE |
| Credit Card | NOT REQUIRED |

---

## Important Notes
1. **No Credit Card**: Both Supabase and Render free tiers work without any payment method
2. **Auto-Pause**: Supabase pauses projects after 7 days — click "Resume" in dashboard or make one API call
3. **Database Connection**: Standard PostgreSQL format (`postgresql://user:password@host:5432/db`)
4. **Render Free Tier**: Still requires signup (no CC), doesn't require CC either

---

## Next Action
Follow **DEPLOYMENT_GUIDE.md** starting with Step 1 (Supabase setup).

---

## Rollback to Previous Plan
If you prefer Render PostgreSQL (requires CC):
1. Change `DATABASE_URL` in Render to Render PostgreSQL connection string
2. Follow original plan instead
3. All other steps remain the same

**But Supabase is simpler — no CC barrier at all!**
