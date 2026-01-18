# Quickstart: Agentic AI Book Docusaurus Site

## Setup

1. Ensure Node.js 20+: `node --version`
2. Initialize Docusaurus: `npx create-docusaurus@latest . classic`
3. Install math support: `npm i remark-math rehype-katex`
4. Update `docusaurus.config.js` plugins:
   ```
   plugins: [
     require.resolve('remark-math'),
     require.resolve('rehype-katex'),
   ],
   ```
5. Create docs files: intro.md + week-01-agent-anatomy.md to week-12-capstone-project.md
6. Configure sidebars.js with phases
7. Dev server: `npm run docusaurus start`
8. Build: `npm run build`
9. Deploy: `npm run deploy` (GitHub Pages)

## Validation

- Build succeeds (SC-001)
- Sidebar phases/13 pages (SC-002)
- Search works (SC-004)
- No YouTube, LaTeX renders
