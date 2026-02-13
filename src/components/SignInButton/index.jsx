import React, { useState, useEffect } from 'react';
import AuthModal from '../AuthModal';
import styles from './styles.module.css';

export default function SignInButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('user_email');
    if (email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  if (isLoggedIn) {
    return (
      <div className={styles.userMenu}>
        <span className={styles.userEmail}>{userEmail.split('@')[0]}</span>
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
