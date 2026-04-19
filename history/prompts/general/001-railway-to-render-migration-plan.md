---
id: 001
feature: railway-to-render-migration
stage: plan
title: Plan Railway → Render Migration
model: claude-haiku-4-5-20251001
timestamp: 2026-04-18T00:00:00Z
branch: main
---

## Prompt
User requested migration plan from Railway (trial ended) to Render free tier:
- Frontend: Netlify (no changes)
- Backend: Render FastAPI (new, free tier, no CC needed)
- Database: Supabase PostgreSQL 500MB free (new, no CC needed)
- Auth: OAuth2 via better-auth (unchanged logic, new DB)

**IMPORTANT UPDATE**: User noted that Render PostgreSQL requires credit card. Revised plan to use Supabase (completely free, no CC required) instead.

---

## Summary of Work
Created comprehensive SDD-compliant migration plan with:

1. **Specification** (spec.md)
   - Success criteria: Backend on Render, OAuth2 working, zero downtime
   - Constraints: 500MB DB, 100 monthly hours, no persistent disk
   - In/out of scope clearly defined

2. **Architecture Plan** (plan.md)
   - 5-phase deployment (Render setup → Backend → Data → Frontend → Cleanup)
   - Key decisions with trade-offs (why Render free, why not other providers)
   - Environment variables checklist
   - Risk mitigation (cold starts, DB quota, credentials)

3. **Executable Tasks** (tasks.md)
   - 15 subtasks across 5 phases
   - Clear acceptance criteria for each task
   - Dependencies mapped
   - Effort estimates: ~1.5 hours total
   - Troubleshooting quick links

4. **Deployment Guide** (DEPLOYMENT_GUIDE.md)
   - Step-by-step runbook (7 steps, 30-60 min)
   - Copy-paste instructions for Render dashboard
   - Testing checklist for OAuth2 + chat endpoints
   - Rollback procedure

5. **Supporting Artifacts**
   - `backend/render.yaml` — Config template for Render
   - `migration_context.md` — Memory record of architecture

---

## Key Decisions (Revised)
1. **Database**: Supabase PostgreSQL (not Render) → FREE, no credit card required, 500MB sufficient
2. **Deployment**: Web Service on Render (not self-hosted) → HTTPS included, auto-scaling ready, FREE, no CC
3. **Secrets**: Render dashboard env vars (not .env in git) → secure, no credential leaks
4. **Integration**: Supabase + Render combo → both free, no friction with credit card requirements
5. **Testing**: Integration tests at the end (sign-in → chat → profile)

---

## Constraints Acknowledged
- **Render**: Free tier auto-sleep after 15 min inactivity (acceptable for MVP)
- **Render**: Limited to 100 monthly active hours (sufficient for low-traffic MVP)
- **Supabase**: 500MB DB limit (requires monitoring for chat history growth)
- **Supabase**: Free projects auto-pause after 7 days inactivity (easily reactivated)
- **CRITICAL**: No credit card required for either service ✓

---

## Success Criteria
- [ ] Backend "Live" on Render
- [ ] Health endpoint responds 200
- [ ] OAuth2 sign-in flow works end-to-end
- [ ] Chat endpoint returns responses
- [ ] No CORS errors in browser
- [ ] Render logs show no 500 errors

---

## Risks & Mitigations (Updated)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Render cold starts (auto-sleep) | 3-5 sec latency spike | Acceptable for MVP; upgrade later |
| Supabase auto-pause (7 days) | Service unavailable | Easy reactivation with one API call |
| DB fills up (500MB limit) | Service stops | Monitor monthly; archive old history |
| Credentials exposed | Security breach | Rotate secrets post-migration |

---

## Next Steps (User Action Required)
1. Create free Supabase account (no CC needed) → PostgreSQL database
2. Create free Render account (no CC needed) → Web Service
3. Deploy FastAPI backend via Git connection
4. Configure environment variables in Render
5. Update Netlify env vars with new backend URL
6. Run integration tests (OAuth2 → chat → profile)

---

## Outcome
**REVISED**: Created a complete, executable migration plan from Railway to **Render + Supabase** free tier (no credit card required).

Plan is SDD-compliant (spec → plan → tasks → deployment guide) with:
- **Clear acceptance criteria** for each phase
- **NO credit card friction** (both Supabase & Render free tiers work)
- **Rollback procedure** for safety
- **Monitoring checklist** for post-deployment

User can now follow the **DEPLOYMENT_GUIDE.md** to complete migration in **~1 hour** with minimal downtime.

**All artifacts updated to reflect Supabase + Render combo (no CC required).**
