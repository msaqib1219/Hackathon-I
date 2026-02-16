---
id: "003"
title: auth-hardening-task-generation
stage: tasks
date: 2026-02-14
surface: specs/002-auth-hardening/tasks.md
model: claude-sonnet-4-5-20250929
feature: 002-auth-hardening
branch: 002-auth-hardening
user: saqib
command: /sp.tasks
labels: [auth, tasks, implementation, jwt, oauth]
links:
  spec: specs/002-auth-hardening/spec.md
  ticket: ""
  adr: ""
  pr: ""
files:
  - specs/002-auth-hardening/tasks.md
tests:
  - "N/A - task generation phase, no tests"
---

## Prompt

/sp.tasks (executed on 002-auth-hardening branch with all design docs as input)

## Response snapshot

Generated `tasks.md` with **38 tasks** organized across **7 phases** mapped to 4 user stories:

- **Phase 1: Setup** (3 tasks) — Dependencies, env vars, directory structure
- **Phase 2: Foundational** (8 tasks) — DB schema, Pydantic models, JWT utilities, router setup
- **Phase 3: US1 Email/Password** (8 tasks) — Register, login, logout, me endpoints + AuthContext, AuthModal, SignInButton rewiring
- **Phase 4: US2 Google OAuth** (6 tasks) — OAuth DB functions, Google auth/callback endpoints, frontend Google button
- **Phase 5: US3 Protected Routes** (4 tasks) — ProtectedRoute component, Root.js gating, Chatbot JWT migration
- **Phase 6: US4 Token Refresh** (3 tasks) — Refresh endpoint, token lifecycle, 401 interceptor
- **Phase 7: Polish** (6 tasks) — Form validation, rate limiting, cleanup, env docs

MVP scope is 19 tasks (Setup + Foundational + US1). Each phase has checkpoints for independent validation.

## Outcome

- Impact: Complete actionable task list ready for /sp.implement execution
- Tests: N/A - no tests requested in spec
- Files: tasks.md created
- Next prompts: /sp.implement to execute tasks, /sp.analyze to cross-check artifacts first
- Reflection: Mapped all endpoints from contracts/auth-api.yaml to user stories. Kept US3/US4 dependent on US1's AuthContext since route protection requires auth state to exist. Parallel opportunities identified within each phase.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Format validation PASS (all 38 tasks have checkbox, ID, file paths; story labels on US tasks only)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.analyze for cross-artifact consistency check
