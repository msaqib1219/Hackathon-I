import React, { useState } from 'react';
import { useAuth } from '@site/src/context/AuthContext';
import AuthModal from './AuthModal';

const PROTECTED_PATTERNS = ['/docs'];

function isProtectedPath(pathname) {
  return PROTECTED_PATTERNS.some((pattern) => pathname.startsWith(pattern));
}

export default function ProtectedRoute({ children }) {
  const [showModal, setShowModal] = useState(true);
  let isAuthenticated = false;
  let isLoading = false;

  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
  } catch (e) {
    console.warn('Auth context error:', e.message);
  }

  // Only gate on client side
  if (typeof window === 'undefined') {
    return children;
  }

  const pathname = window.location.pathname;

  if (!isProtectedPath(pathname)) {
    return children;
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.1rem',
        color: 'var(--ifm-color-emphasis-600)',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <h2>Sign in required</h2>
          <p>Please sign in to access this content.</p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialMode="signin"
        />
      </>
    );
  }

  return children;
}
