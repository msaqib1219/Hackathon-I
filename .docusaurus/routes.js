import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'dd0'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '6b5'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '07a'),
            routes: [
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-01-anatomy',
                component: ComponentCreator('/docs/week-01-anatomy', '21b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-02-language',
                component: ComponentCreator('/docs/week-02-language', '3c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-03-reasoning',
                component: ComponentCreator('/docs/week-03-reasoning', '563'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-04-tool-use',
                component: ComponentCreator('/docs/week-04-tool-use', 'f83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-05-react',
                component: ComponentCreator('/docs/week-05-react', '4db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-06-rag',
                component: ComponentCreator('/docs/week-06-rag', '972'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-07-planning',
                component: ComponentCreator('/docs/week-07-planning', 'ec0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-08-memory',
                component: ComponentCreator('/docs/week-08-memory', 'f2b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-09-orchestration',
                component: ComponentCreator('/docs/week-09-orchestration', '2be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-10-errors',
                component: ComponentCreator('/docs/week-10-errors', 'ef5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-11-ethics',
                component: ComponentCreator('/docs/week-11-ethics', 'dc4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/week-12-capstone',
                component: ComponentCreator('/docs/week-12-capstone', '129'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
