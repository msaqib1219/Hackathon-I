import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/context/AuthContext';

export default function Goodbye() {
  const { logout } = useAuth();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    logout();

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const timer = setTimeout(() => {
      window.location.assign(window.location.origin + '/');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Layout title="See You Soon!" noFooter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}>
        <div style={{ fontSize: '4rem' }}>👋</div>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>See you soon!</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '480px', color: 'var(--ifm-color-emphasis-700)', margin: 0 }}>
          Thanks for learning with us. You're on your way to mastering Agentic AI —
          keep building, keep experimenting, and come back anytime.
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-500)', margin: 0 }}>
          Redirecting to homepage in <strong>{countdown}</strong>…
        </p>
        <a
          href="/"
          style={{
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            backgroundColor: 'var(--ifm-color-primary)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Go now
        </a>
      </div>
    </Layout>
  );
}
