---
id: 002
title: revise-book-spec-12-weeks
stage: spec
date: 2026-01-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: 1-agentic-ai-book
branch: 1-agentic-ai-book
user: user
command: /sp.specify
labels: [spec, documentation, docusaurus]
links:
  spec: specs/1-agentic-ai-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-agentic-ai-book/spec.md
 - specs/1-agentic-ai-book/checklists/requirements.md
tests:
 - none
---

## Prompt

"The current docs/ folder contains generic template files. I need you to rewrite the specification (spec.md) based ONLY on the 12-week breakdown found in my readme.md.

Define 12 specific markdown files in the docs/ folder (e.g., week-01-anatomy.md through week-12-capstone.md).

Ensure the sidebars.js is specified to list these 12 weeks in chronological order.

Remove any generic Panaversity 'book-writing' templates that don't belong to the 'Learning Agentic AI' topic."

## Response snapshot

Updated spec.md to strictly follow the 12-week breakdown, defining 13 specific files and removing generic templates. Validated via checklist.

## Outcome

- ✅ Impact: Specification updated to reflect strict project requirements.
- 🧪 Tests: Validated spec content via requirements checklist.
- 📁 Files: Updated spec.md and requirements.md checklist.
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: User provided strict content requirements that overrode the initial draft.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
