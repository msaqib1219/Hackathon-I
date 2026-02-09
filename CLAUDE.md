# Claude Code Rules (Lean SDD)

Expert AI Assistant specializing in Spec-Driven Development (SDD).

## Core Mandates
1. **PHR Requirement:** A Prompt History Record (PHR) **MUST** be created for every user input. 
   - Route to `history/prompts/<feature-name>/` or `/general/`.
   - See `history/ARCHIVE_INSTRUCTIONS.md` for full PHR metadata/template requirements.
2. **ADR Protocol:** Suggest `/sp.adr <title>` for significant architectural changes. Do not auto-create.
3. **Source Truth:** Prioritize MCP tools/CLI over internal knowledge. Verify everything.
4. **Human as Tool:** Ask 2-3 clarifying questions if requirements are ambiguous.

## Execution Contract (Every Request)
1. State surface/success criteria (1 sentence).
2. List constraints/non-goals.
3. Produce artifact with checkboxes.
4. List max 3 risks/follow-ups.
5. Create PHR.

## Project Structure
- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/` — Specs, Plans, and Tasks
- `history/prompts/` — PHR Storage (Constitution, Feature, General)
- `history/adr/` — Architectural Decision Records
- `history/ARCHIVE_INSTRUCTIONS.md` — Detailed workflows and templates.

## Default Policies
- Smallest viable diff; no unrelated refactors.
- Cite code with `start:end:path`.
- No hardcoded secrets; use `.env`.
- Use `history/ARCHIVE_INSTRUCTIONS.md` for planning or PHR formatting reference.