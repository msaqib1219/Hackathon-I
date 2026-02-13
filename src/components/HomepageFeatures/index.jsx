import React from 'react';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Foundation',
    icon: '🧠',
    description: 'Master the core logic of Agentic workflows. Learn how LLMs perceive, reason, and act autonomously.',
  },
  {
    title: 'Tooling',
    icon: '🛠️',
    description: 'Hands-on with LangChain, CrewAI, and AutoGPT. Build real agents with industry-standard frameworks.',
  },
  {
    title: 'Deployment',
    icon: '🚀',
    description: 'Move from local scripts to production-ready systems. Deploy, scale, and monitor your AI agents.',
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={styles.feature}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Why This Book?</h2>
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
