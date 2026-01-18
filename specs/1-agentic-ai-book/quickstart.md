# Quickstart: Agentic AI Book

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```
   (Note: `remark-math` and `rehype-katex` are required alongside standard Docusaurus deps)

2. **Start Development Server**
   ```bash
   npm run start
   ```
   Access the site at `http://localhost:3000`.

3. **Build Static Site**
   ```bash
   npm run build
   ```
   Output will be in `build/` directory.

## Contributing Content

1. Edit files in `docs/`.
2. Ensure you follow the frontmatter schema defined in `specs/1-agentic-ai-book/data-model.md`.
3. If adding math, use standard LaTeX block syntax: `$$ E = mc^2 $$`.
