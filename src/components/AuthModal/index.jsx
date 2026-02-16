import React, { useState, useEffect } from 'react';
import { useAuth } from '@site/src/context/AuthContext';
import styles from './styles.module.css';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const { login, register, googleLogin } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (!/[a-zA-Z]/.test(formData.password)) {
      setError('Password must contain at least one letter.');
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number.');
      return false;
    }
    if (mode === 'signup' && !formData.name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        await login(formData.email, formData.password);
        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          window.location.href = '/docs/intro';
        }, 1000);
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess('Account created! Redirecting...');
        setTimeout(() => {
          onClose();
          window.location.href = '/docs/intro';
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await googleLogin();
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to continue your learning journey'
              : 'Join thousands learning Agentic AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.socialButton} onClick={handleGoogleLogin}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className={styles.switchText}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={toggleMode} className={styles.switchButton}>
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
