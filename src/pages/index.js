import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import HomepageFeatures from '../components/HomepageFeatures';
import WhatsInside from '../components/WhatsInside';
import AuthModal from '../components/AuthModal';
import styles from './index.module.css';

function HeroSection({ onSignIn, onSignUp }) {
  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Master the Future of Autonomy
          </h1>
          <p className={styles.heroSubtitle}>
            Build Production-Ready AI Agents from Scratch
          </p>
          <p className={styles.heroDescription}>
            Go from <strong>Zero to Hero</strong> in LLM orchestration. Learn to design, build,
            and deploy intelligent agents that can reason, plan, and act autonomously.
          </p>
          <div className={styles.heroCta}>
            <Link to="/docs/intro" className={styles.primaryButton}>
              Start Reading for Free
            </Link>
            <button onClick={onSignUp} className={styles.secondaryButton}>
              Create Account
            </button>
          </div>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>12 Weeks</span>
            <span className={styles.metaDot}></span>
            <span className={styles.metaItem}>Hands-on Projects</span>
            <span className={styles.metaDot}></span>
            <span className={styles.metaItem}>Free Access</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.codePreview}>
            <div className={styles.codeHeader}>
              <span className={styles.dot} style={{ background: '#ff5f56' }}></span>
              <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
              <span className={styles.dot} style={{ background: '#27ca40' }}></span>
              <span className={styles.codeTitle}>agent.py</span>
            </div>
            <pre className={styles.codeContent}>
{`class AgenticAI:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = tools
        self.memory = []

    async def run(self, goal):
        while not self.goal_achieved:
            # Observe -> Think -> Act
            context = self.observe()
            plan = await self.reason(context)
            result = await self.act(plan)
            self.memory.append(result)

        return self.synthesize()`}
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What Readers Say</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "Finally, a comprehensive guide that takes you from understanding LLMs to building
              real-world agents. The RAG and multi-agent sections are gold."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>AK</div>
              <div>
                <strong>Ahmed Khan</strong>
                <span>ML Engineer</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "The hands-on approach is perfect. Each chapter builds on the last, and by week 12
              you've built something production-worthy."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>SR</div>
              <div>
                <strong>Sara Rahman</strong>
                <span>AI Researcher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onSignUp }) {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>Ready to Build Intelligent Agents?</h2>
        <p className={styles.ctaText}>
          Join the community of developers mastering the art of agentic AI.
          Start your journey today.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/docs/intro" className={styles.primaryButton}>
            Start Learning Now
          </Link>
          <button onClick={onSignUp} className={styles.outlineButton}>
            Sign Up for Updates
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });

  const openSignIn = () => setAuthModal({ isOpen: true, mode: 'signin' });
  const openSignUp = () => setAuthModal({ isOpen: true, mode: 'signup' });
  const closeModal = () => setAuthModal({ ...authModal, isOpen: false });

  return (
    <Layout
      title="Agentic AI: From Zero to Hero"
      description="Learn to build production-ready AI agents. A comprehensive 12-week guide covering LLM orchestration, RAG systems, multi-agent frameworks, and deployment."
    >
      <HeroSection onSignIn={openSignIn} onSignUp={openSignUp} />
      <main>
        <HomepageFeatures />
        <WhatsInside />
        <Testimonials />
        <CTASection onSignUp={openSignUp} />
      </main>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeModal}
        initialMode={authModal.mode}
      />
    </Layout>
  );
}
