import React, { useState } from 'react';
import { useAuth } from '@site/src/context/AuthContext';
import AuthModal from '../AuthModal';
import styles from './styles.module.css';

export default function SignInButton() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    // ProtectedRoute will redirect to / if we're on a protected page,
    // otherwise navigate home explicitly
    if (!window.location.pathname.startsWith('/docs')) {
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.userMenu}>
        <span className={styles.userEmail}>{user.name || user.email.split('@')[0]}</span>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.signInButton}
        data-testid="navbar-signin-btn"
      >
        Sign In
      </button>
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode="signin"
      />
    </>
  );
}
