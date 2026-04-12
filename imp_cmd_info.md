# Project commands
* npm start for project initiation webpage

* uvicorn main:app --reload --port 8000 for backend starting 

## Project History 

15 feb 2026: database connection is failing.









Feb 24, 2026:

How to Run Tests Yourself (No Claude Needed)

  One-liner

  cd "/home/saqib/Projects/PIAIC/Hackathon I"
  TEST_USER_EMAIL="test321@example.com" TEST_USER_PASSWORD="test321321" \
    npx playwright test tests/auth-flow.spec.js --reporter=list

  With visual browser (see what Playwright sees)

  TEST_USER_EMAIL="test321@example.com" TEST_USER_PASSWORD="test321321" \
    npx playwright test tests/auth-flow.spec.js --headed

  View HTML report after a run

  npx playwright show-report

  Run a single test by name

  TEST_USER_EMAIL="test321@example.com" TEST_USER_PASSWORD="test321321" \
    npx playwright test tests/auth-flow.spec.js --grep "login with existing"

  ---
  Do You Need a Subagent?

  Not really — Playwright tests are just a terminal command. A subagent would be overkill.
  