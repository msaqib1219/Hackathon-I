import React from 'react';
import styles from './styles.module.css';

const modules = [
  {
    week: '01-03',
    title: 'Foundations',
    topics: ['Anatomy of an Agent', 'Language & Prompting', 'Reasoning Patterns'],
    color: '#25c2a0',
  },
  {
    week: '04-06',
    title: 'Core Capabilities',
    topics: ['Tool Use & Function Calling', 'ReAct Pattern', 'RAG Systems'],
    color: '#3578e5',
  },
  {
    week: '07-09',
    title: 'Advanced Systems',
    topics: ['Planning & Decomposition', 'Memory Systems', 'Multi-Agent Orchestration'],
    color: '#9b59b6',
  },
  {
    week: '10-12',
    title: 'Production',
    topics: ['Error Handling', 'Ethics & Safety', 'Capstone Project'],
    color: '#e74c3c',
  },
];

export default function WhatsInside() {
  return (
    <section className={styles.whatsInside}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What's Inside</h2>
        <p className={styles.sectionSubtitle}>
          A 12-week journey from understanding LLMs to building production-ready AI agents
        </p>
        <div className={styles.moduleGrid}>
          {modules.map((module, idx) => (
            <div key={idx} className={styles.moduleCard}>
              <div className={styles.moduleHeader} style={{ borderColor: module.color }}>
                <span className={styles.weekBadge} style={{ background: module.color }}>
                  Week {module.week}
                </span>
                <h3 className={styles.moduleTitle}>{module.title}</h3>
              </div>
              <ul className={styles.topicList}>
                {module.topics.map((topic, i) => (
                  <li key={i} className={styles.topicItem}>
                    <span className={styles.checkmark} style={{ color: module.color }}>✓</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
