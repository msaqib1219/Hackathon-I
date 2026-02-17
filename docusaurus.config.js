/** @type {import('@docusaurus/types').Config} */
module.exports = async function createConfig() {
  const remarkMath = (await import('remark-math')).default;
  const rehypeKatex = (await import('rehype-katex')).default;

  return {
    title: 'Learning Agentic AI from Zero to Hero',
    tagline: 'The Art of the Agent',
    url: 'https://agenticaifromzerotohero.vercel.app',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/favicon.ico',
    organizationName: 'pi-aic',
    projectName: '1-agentic-ai-book',

    // Custom fields for chatbot API
    // API key must be set via environment variable - never hardcode secrets
    customFields: {
      chatApiKey: process.env.CHAT_API_KEY || '',
      chatApiUrl: process.env.CHAT_API_URL || 'http://localhost:8000',
    },

    // Markdown configuration
    markdown: {
      hooks: {
        onBrokenMarkdownLinks: 'warn',
      },
    },

    // LaTeX Math Stylesheet
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
        type: 'text/css',
        integrity: 'sha384-odtC+0UGzzFL/6QkHlJt8K8fpk0+7MY2e9NC0xlupkac90s3TDBdrh9cI1q7F6L5',
        crossorigin: 'anonymous',
      },
    ],

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
          blog: false,
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: 'Agentic AI Book',
          items: [
            {
              type: 'doc',
              docId: 'intro',
              position: 'left',
              label: 'Read the Book',
            },
            {
              type: 'custom-signInButton',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          copyright: `Copyright © ${new Date().getFullYear()} Agentic AI Book. Built with Docusaurus.`,
        },
      }),
  };
};
