---
id: "002"
title: auth-hardening-implementation-plan
stage: plan
date: 2026-02-14
surface: specs/002-auth-hardening/plan.md
model: claude-sonnet-4-5-20250929
feature: 002-auth-hardening
branch: 002-auth-hardening
user: saqib
command: /sp.plan
labels: [auth, plan, jwt, oauth, architecture]
links:
  spec: specs/002-auth-hardening/spec.md
  ticket: ""
  adr: ""
  pr: ""
files:
  - specs/002-auth-hardening/plan.md
  - specs/002-auth-hardening/research.md
  - specs/002-auth-hardening/data-model.md
  - specs/002-auth-hardening/contracts/auth-api.yaml
  - specs/002-auth-hardening/quickstart.md
tests:
  - "N/A - planning phase, no tests yet"
---

## Prompt

/sp.plan (executed on 002-auth-hardening branch with spec.md as input)

## Response snapshot

Generated full implementation plan for auth hardening feature. Created 5 artifacts:

1. **plan.md** — Architecture overview with auth flow diagrams (email/password, token refresh, Google OAuth), security considerations, dependency analysis, risk matrix, and file-level change manifest (3 new backend files, 2 new frontend files, 6 modified files).

2. **research.md** — 7 technology decisions with rationale and alternatives: python-jose for JWT, passlib[bcrypt] for passwords, httpx for OAuth, in-memory access token + httpOnly cookie refresh token strategy, raw asyncpg for DB (consistent with existing code), AuthContext in Docusaurus Root.js for route protection, and parallel API key + JWT migration strategy.

3. **data-model.md** — 3 new PostgreSQL tables (users, oauth_accounts, refresh_tokens) plus chat_history modification. Includes full SQL migration script, entity relationships, indexes, and validation rules.

4. **contracts/auth-api.yaml** — OpenAPI 3.1 spec with 7 endpoints: register, login, refresh, logout, me, google-start, google-callback. Includes request/response schemas, security schemes, and error responses.

5. **quickstart.md** — Setup guide covering environment variables, new dependencies, database migration, and development workflow with curl test commands.

## Outcome

- Impact: Complete implementation plan ready for task generation
- Tests: N/A - planning phase
- Files: plan.md, research.md, data-model.md, contracts/auth-api.yaml, quickstart.md created
- Next prompts: /sp.tasks to generate implementation tasks, /sp.adr jwt-vs-session-auth for architectural decision record
- Reflection: Research subagents failed due to API errors; proceeded with direct knowledge which was sufficient for all technology decisions. Constitution is unfilled — recommend /sp.constitution before further features.

## Evaluation notes (flywheel)

- Failure modes observed: Research subagents (Task tool) returned 400 API errors; recovered by using direct knowledge
- Graders run and results (PASS/FAIL): Manual review — PASS (all plan sections complete, no unresolved NEEDS CLARIFICATION)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.tasks to generate actionable implementation tasks
