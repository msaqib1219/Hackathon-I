# Site Structure Contract

**Feature**: `1-agentic-ai-book`

## URL Schema

The system guarantees the following URL routes will be available:

| Route | Content |
|-------|---------|
| `/` | Landing Page (Standard Docusaurus landing or redirect to docs) |
| `/docs/intro` | Book Description / Introduction |
| `/docs/week-01-anatomy` | Week 1 Content |
| `/docs/week-02-language` | Week 2 Content |
| `/docs/week-03-reasoning` | Week 3 Content |
| `/docs/week-04-tool-use` | Week 4 Content |
| `/docs/week-05-react` | Week 5 Content |
| `/docs/week-06-rag` | Week 6 Content |
| `/docs/week-07-planning` | Week 7 Content |
| `/docs/week-08-memory` | Week 8 Content |
| `/docs/week-09-orchestration` | Week 9 Content |
| `/docs/week-10-errors` | Week 10 Content |
| `/docs/week-11-ethics` | Week 11 Content |
| `/docs/week-12-capstone` | Week 12 Content |

## Navigation Contract

The sidebar MUST be present on all `/docs/*` pages and MUST follow the hierarchy:
1. Introduction
2. Phase I (Category) -> Weeks 1-3
3. Phase II (Category) -> Weeks 4-6
4. Phase III (Category) -> Weeks 7-9
5. Phase IV (Category) -> Weeks 10-12
