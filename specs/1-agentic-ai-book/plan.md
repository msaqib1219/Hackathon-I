# Implementation Plan: Agentic AI Book

**Branch**: `1-agentic-ai-book` | **Date**: 2026-01-18 | **Spec**: [specs/1-agentic-ai-book/spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-agentic-ai-book/spec.md`

## Summary

Build a static documentation site using Docusaurus 3 to host "The Art of the Agent". The site will feature a strict 12-week curriculum structure, organized into 4 phases, and support LaTeX for mathematical content.

## Technical Context

**Language/Version**: Node.js 18+ (Docusaurus requirement)
**Primary Dependencies**: Docusaurus 3 (classic preset), `remark-math`, `rehype-katex`
**Storage**: Static files (Markdown in `docs/`)
**Testing**: Build verification (`npm run build`)
**Target Platform**: Static Website (HTML/CSS/JS)
**Project Type**: Web application (Static Site Generator)
**Performance Goals**: Fast load times, SEO friendly (standard Docusaurus benefits)
**Constraints**: Must strictly follow 12-week structure; No YouTube embeds; LaTeX support required.
**Scale/Scope**: ~15 pages of content.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-First**: N/A (Project is a site, not a library)
- **Review**: Plan uses standard tooling.
- **Simplicity**: Using standard Docusaurus scaffolding + plugins.

## Project Structure

### Documentation (this feature)

```text
specs/1-agentic-ai-book/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Frontmatter schema
├── quickstart.md        # Usage guide
├── contracts/           # URL structure
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
.
├── docusaurus.config.js       # Main configuration (Math plugins here)
├── sidebars.js                # Navigation structure (Phases)
├── package.json               # Dependencies
├── docs/                      # Weekly Content Content
│   ├── intro.md
│   ├── week-01-anatomy.md
│   └── ... (weeks 02-12)
├── src/
│   └── pages/index.js         # Landing page
└── static/                    # Images/assets
```

**Structure Decision**: Standard Docusaurus project root structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| LaTeX Support | Required for math in book | Standard markdown insufficient for formulas |
