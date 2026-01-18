/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phase I: The Engine',
      items: [
        'week-01-agent-anatomy',
        'week-02-structured-prompts',
        'week-03-chain-of-thought',
      ],
    },
    {
      type: 'category',
      label: 'Phase II: The Tools',
      items: [
        'week-04-tool-use',
        'week-05-react-framework',
        'week-06-rag',
      ],
    },
    {
      type: 'category',
      label: 'Phase III: The Architecture',
      items: [
        'week-07-planning-decomposition',
        'week-08-memory-systems',
        'week-09-multi-agent-orchestration',
      ],
    },
    {
      type: 'category',
      label: 'Phase IV: The Deployment',
      items: [
        'week-10-error-handling',
        'week-11-ethics-safety',
        'week-12-capstone-project',
      ],
    },
  ],
};

module.exports = sidebars;
