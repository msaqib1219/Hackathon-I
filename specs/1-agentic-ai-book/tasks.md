# Tasks: Agentic AI Book Docusaurus Site

**Branch**: `1-agentic-ai-book` | **Date**: 2026-01-18 | **Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

## Dependencies

User stories independent except foundational setup blocks all.

- Setup → Foundational → US1 → US2 → Polish

## Implementation Strategy

MVP: Complete US1 (basic navigation with intro + sample weeks). Incremental: Add remaining docs, phase overviews, validate principles.

## Phase 1: Setup

- [ ] T001 Initialize Docusaurus project at root: `npx create-docusaurus@latest . classic`
- [ ] T002 Install LaTeX plugins: `npm i remark-math rehype-katex`

## Phase 2: Foundational

- [ ] T003 Update docusaurus.config.js with math plugins: plugins: [require.resolve('remark-math'), require.resolve('rehype-katex')]
- [ ] T004 Create empty docs/ directory structure for all files per FR-002

## Phase 3: User Story 1 - Access and navigate book content [US1]

**Goal**: Basic site navigation works, content loads with principles.

**Independent Test**: Load homepage, click sidebar to intro/week-01, verify why/how structure, no YouTube, LaTeX renders (test page).

- [ ] T005 [US1] Create docs/intro.md with placeholder content following principles
- [ ] T006 [P] [US1] Create docs/week-01-agent-anatomy.md placeholder (why agent anatomy matters first)
- [ ] T007 [P] [US1] Create docs/week-02-structured-prompts.md placeholder
- [ ] T008 [P] [US1] Create remaining week placeholders docs/week-03-*.md to week-12-*.md
- [ ] T009 [US1] Configure sidebars.js with intro + flat weeks list initially

## Phase 4: User Story 2 - Explore phase overviews [US2]

**Goal**: Phased sidebar navigation.

**Independent Test**: Sidebar shows phases (I-IV), expand/click loads summaries/cross-links.

- [ ] T010 [US2] Refactor sidebars.js: Group into phases (Phase I: weeks 1-3, etc.)
- [ ] T011 [US2] Add phase overview content to weekly files (systems thinking cross-refs)

## Phase 5: Polish & Cross-Cutting

- [ ] T012 Enable search in docusaurus.config.js (default preset-classic)
- [ ] T013 Run `npm run docusaurus start` and manual validate SC-001 to SC-005
- [ ] T014 Review all docs for tone/principles compliance (clear, authoritative, precise; no YouTube; LaTeX where math; systems thinking)
