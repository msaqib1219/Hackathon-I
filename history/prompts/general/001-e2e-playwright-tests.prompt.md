---
id: "001"
title: e2e-playwright-tests
stage: green
date: 2026-02-22
surface: tests/
model: claude-sonnet-4-6
feature: e2e-testing
branch: main
user: saqib
command: manual
labels: [testing, e2e, playwright, docs, auth, chatbot]
links:
  spec: ""
  ticket: ""
  adr: ""
  pr: ""
files:
  - playwright.config.js
  - tests/homepage.spec.js
  - tests/auth-gate.spec.js
  - tests/auth-flow.spec.js
  - tests/docs-pages.spec.js
  - tests/chatbot.spec.js
  - package.json
tests:
  - "tests/homepage.spec.js — 8 tests (homepage, navbar, footer, navigation)"
  - "tests/auth-gate.spec.js — 21 tests (13 route gates, modal, validation, UI)"
  - "tests/auth-flow.spec.js — 4 tests (login, session persist, logout, navbar state)"
  - "tests/docs-pages.spec.js — 15 tests (13 page loads, sidebar, KaTeX)"
  - "tests/chatbot.spec.js — 7 tests (toggle, window, input, greeting, close)"
---

## Prompt

Implement E2E tests with Playwright for the Agentic AI Book Docusaurus site deployed on Netlify. Cover homepage, auth gate, auth flow, all 13 doc pages, and chatbot widget.

## Result

Created 6 files (1 config + 5 test specs) and modified package.json. Total: 55 test cases across 5 test suites.

### Key decisions:
- **No data-testid attributes** exist in the codebase; tests use text selectors, CSS classes, and ARIA roles
- **AuthModal auto-opens** on protected routes (`showModal` starts `true`), so auth-gate tests work with the auto-opened modal rather than clicking to open
- **Native vs custom validation**: Email/password tests use values that bypass native HTML5 validation but fail the custom `validateForm()` regex (e.g., `test@example` lacks dot, `dispatchEvent` bypasses `minLength`)
- **Auth-dependent tests** skip gracefully when `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` env vars are missing
- **Chatbot uses plain CSS classes** (not CSS modules), so `.chatbot-toggle`, `.chatbot-window` selectors work directly

## Outcome

- Homepage: 8/8 passing
- Auth gate: 21/21 passing (confirmed on focused run; bulk runs hit Netlify rate limits)
- Auth flow, docs pages, chatbot: require test credentials to run (skip otherwise)
