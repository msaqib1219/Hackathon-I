# Implementation Plan: Agentic AI Book Docusaurus Site

**Branch**: `1-agentic-ai-book` | **Date**: 2026-01-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/1-agentic-ai-book/spec.md`

## Summary

Primary requirement: Create Docusaurus static site with 13 docs pages (intro + 12 weeks from Readme.md curriculum), phased sidebar navigation, enforcing content principles (Why before How, no YouTube, LaTeX math, systems thinking). Technical approach: Standard Docusaurus v3 classic template, MDX for content, built-in search/sidebar.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+), React 18
**Primary Dependencies**: Docusaurus v3 (@docusaurus/core, @docusaurus/preset-classic)
**Storage**: N/A (static site, Markdown files)
**Testing**: Manual content validation, Docusaurus build checks, accessibility lint (no automated unit tests needed for docs)
**Target Platform**: Static hosting (Vercel/Netlify/GitHub Pages), modern browsers
**Project Type**: Static documentation site
**Performance Goals**: Instant page loads (<2s), full-text search <1s
**Constraints**: No external video embeds, LaTeX via remark-math/rehype-katex
**Scale/Scope**: 13 pages, ~50KB total content

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution template unfilled - no violations. Principles N/A. Proceed.

## Project Structure

### Documentation (this feature)

```
specs/1-agentic-ai-book/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # N/A - no research needed
├── data-model.md        # N/A - no data entities
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A - no APIs
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```
docs/
├── intro.md
├── week-01-agent-anatomy.md
├── week-02-structured-prompts.md
├── week-03-chain-of-thought.md
├── week-04-tool-use.md
├── week-05-react-framework.md
├── week-06-rag.md
├── week-07-planning-decomposition.md
├── week-08-memory-systems.md
├── week-09-multi-agent-orchestration.md
├── week-10-error-handling.md
├── week-11-ethics-safety.md
└── week-12-capstone-project.md

sidebars.js
docusaurus.config.js
package.json
```

**Structure Decision**: Root-level Docusaurus project with docs/ for content, sidebars.js for phased navigation.

## Complexity Tracking

N/A - Simple static site, no violations.

## Phase 0: Research

No NEEDS CLARIFICATION - spec clear. Docusaurus standard patterns apply.

## Phase 1: Design & Contracts

**data-model.md**: N/A

**contracts/**: N/A

**quickstart.md**:

# Quickstart: Agentic AI Book Site

1. `npx create-docusaurus@latest . classic`
2. `npm i remark-math rehype-katex`
3. Update `docusaurus.config.js`: plugins: [require.resolve('remark-math'), require.resolve('rehype-katex')]
4. Create docs/ files per spec FR-002
5. Configure sidebars.js per FR-003
6. `npm run docusaurus start`
7. Build: `npm run build`

## Next: /sp.tasks
