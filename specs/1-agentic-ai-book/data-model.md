# Data Model: Agentic AI Book

**Feature**: `1-agentic-ai-book`

## 1. Content Entities (Markdown Files)

The primary data entities are the Markdown files representing the book chapters (weeks).

### Frontmatter Schema
Every `docs/*.md` file MUST adhere to:

```yaml
---
sidebar_label: "Week X: [Short Topic]"
sidebar_position: [Integer 1-13]
title: "[Full Chapter Title]"
description: "[Brief summary for SEO]"
---
```

### File Naming Convention
- `docs/intro.md`
- `docs/week-XX-[topic-slug].md` (e.g., `week-01-anatomy.md`)

## 2. Navigation Entity (`sidebars.js`)

The navigation structure is defined as a JS object exporting `sidebars`.

### Structure
```javascript
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phase I: The Engine',
      items: [
        'week-01-anatomy',
        'week-02-language',
        'week-03-reasoning'
      ]
    },
    // ... Phases II, III, IV
  ]
};
```
