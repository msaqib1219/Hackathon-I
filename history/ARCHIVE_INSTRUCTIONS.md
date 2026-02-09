# SpecKit Plus: Reference Manual & Workflows

## 1. PHR (Prompt History Record) Workflow
**Trigger:** Create after implementation, planning, debugging, or multi-step tasks.
**Template Locations:** `.specify/templates/phr-template.prompt.md` or `templates/phr-template.prompt.md`.
**Process:**
1. Detect Stage: (constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general)
2. Generate Slug Title & Resolve ID (incrementing).
3. Routing:
   - Constitution -> `history/prompts/constitution/`
   - Feature -> `history/prompts/<feature-name>/`
   - General -> `history/prompts/general/`
4. Fill all YAML metadata (Model, Branch, Verbatim Prompt, Result, Outcome).
5. Validation: Ensure no `{{PLACEHOLDERS}}` remain and file is readable.

## 2. Architectural Planning Template (for /sp.plan)
When acting as an Architect, address:
1. Scope & Dependencies (In/Out/External).
2. Key Decisions & Rationale (Trade-offs).
3. API Contracts (Inputs, Outputs, Idempotency).
4. NFRs (Performance, Security, SLOs).
5. Data Management (Schema, Migration).
6. Operational Readiness (Observability, Rollback).
7. Risk Analysis (Top 3 risks, blast radius).

## 3. ADR Significance Test
Suggest `/sp.adr` only if:
- Long-term consequences (Framework/Data model).
- Multiple viable options were considered.
- Influences cross-cutting system design.
