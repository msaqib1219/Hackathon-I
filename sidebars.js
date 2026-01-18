/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phase I: The Engine',
      items: [
        'week-01-anatomy',
        'week-02-language',
        'week-03-reasoning',
      ],
    },
    {
      type: 'category',
      label: 'Phase II: The Tools',
      items: [
        'week-04-tool-use',
        'week-05-react',
        'week-06-rag',
      ],
    },
    {
      type: 'category',
      label: 'Phase III: The Architecture',
      items: [
        'week-07-planning',
        'week-08-memory',
        'week-09-orchestration',
      ],
    },
    {
      type: 'category',
      label: 'Phase IV: The Deployment',
      items: [
        'week-10-errors',
        'week-11-ethics',
        'week-12-capstone',
      ],
    },
  ],
};

module.exports = sidebars;
