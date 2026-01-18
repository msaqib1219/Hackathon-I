# Feature Specification: Agentic AI Book Docusaurus Site

**Feature Branch**: `1-agentic-ai-book`
**Created**: 2026-01-18
**Status**: Revised
**Input**: User description: "Rewrite specification based ONLY on the 12-week breakdown found in readme.md. Define 12 specific markdown files in docs/. Ensure sidebars.js lists these in chronological order. Remove generic Panaversity templates."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Structured 12-Week Learning Journey (Priority: P1)

A learner accesses the site and sees a clear, chronological progression of 12 distinct weeks, organized by the 4 phases defined in the curriculum (The Engine, Interaction, Architecture, Deployment). They can navigate sequentially from "Anatomy of an Agent" to "Building the Capstone".

**Why this priority**: The core value proposition is the structured, curriculum-based learning path.

**Independent Test**: Verify the sidebar matches the 12-week structure exactly and navigation follows the chronological order.

**Acceptance Scenarios**:

1. **Given** the documentation sidebar is open, **When** the user views the navigation, **Then** they see 4 Phases containing exactly the 12 specific weekly modules plus an introduction.
2. **Given** a user is on "Week 1", **When** they click "Next", **Then** they are taken to "Week 2", and so on through Week 12.

---

### User Story 2 - Clean, Focused Content Environment (Priority: P2)

A content author or maintainer looks at the project structure and sees only relevant files for the "Agentic AI" book, with no leftover generic templates or "how to write a book" guides from the scaffolding tool.

**Why this priority**: Reduces confusion and maintains project hygiene.

**Independent Test**: Inspect file structure to confirm absence of generic templates (`intro.md` generic placeholders, `tutorial-basics`, etc.) and presence of specific weekly files.

**Acceptance Scenarios**:

1. **Given** the `docs/` directory, **When** listed, **Then** it contains only the defined weekly files and the book introduction, without generic scaffold scaffold files.
2. **Given** the `blog/` or other Docusaurus default folders, **When** inspected, **Then** they do not contain unrelated template content.

---

### Edge Cases

- **Missing Weekly File**: If a user navigates to a week that hasn't been written yet, they should see a standard "Coming Soon" or placeholder page rather than a 404, or the build should fail (as per FR-002 requiring the file exists).
- **Mobile Navigation**: Sidebar behavior on mobile screens (hamburger menu) must preserve the Phase/Week hierarchy.
- **Deep Linking**: External links to specific weeks (e.g. `/docs/week-05-react`) must work and open the correct sidebar phase.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST be a Docusaurus static site serving the "The Art of the Agent" content.
- **FR-002**: The `docs/` directory MUST contain exactly the following 13 files (naming convention: `week-XX-topic.md`):
  1. `docs/intro.md` (Overview/Book Description)
  2. `docs/week-01-anatomy.md` (The Anatomy of an Agent)
  3. `docs/week-02-language.md` (The Power of Language)
  4. `docs/week-03-reasoning.md` (Reasoning Patterns)
  5. `docs/week-04-tool-use.md` (Tool Use)
  6. `docs/week-05-react.md` (The ReAct Framework)
  7. `docs/week-06-rag.md` (External Knowledge)
  8. `docs/week-07-planning.md` (Planning and Decomposition)
  9. `docs/week-08-memory.md` (Memory Systems)
  10. `docs/week-09-orchestration.md` (Multi-Agent Orchestration)
  11. `docs/week-10-errors.md` (Error Handling)
  12. `docs/week-11-ethics.md` (The Ethics of Autonomy)
  13. `docs/week-12-capstone.md` (Building the Capstone)
- **FR-003**: `sidebars.js` MUST be configured to display these files in chronological order, grouped by the 4 Phases identified in the README:
  - Phase I: The Engine (Weeks 1-3)
  - Phase II: The Tools (Weeks 4-6)
  - Phase III: The Architecture (Weeks 7-9)
  - Phase IV: The Deployment (Weeks 10-12)
- **FR-004**: System MUST NOT contain generic Panaversity templates (e.g., standard generic "intro.md" text, "tutorial-basics", "tutorial-extras"). These must be deleted or overwritten.
- **FR-005**: Content headers and metadata in the markdown files MUST corrispond to the weekly topics defined in the README.

### Key Entities

- **Weekly Module**: A markdown file representing a specific week of the curriculum.
- **Phase**: A logical grouping of 3 weekly modules in the navigation sidebar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: File system check confirms exactly 13 content files in `docs/` matching the specific naming convention.
- **SC-002**: Sidebar navigation renders depth of 2 levels (Phase -> Week) with correct ordering.
- **SC-003**: No file in `docs/` contains the string "Panaversity" or "Tutorial" in its title or content (unless referring to the institution authoritatively).
- **SC-004**: Build command (`npm run build`) completes successfully with the new structure.
