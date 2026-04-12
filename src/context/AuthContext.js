import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authClient } from '@site/src/lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // No valid session
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Login failed');
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const { data, error } = await authClient.signUp.email({ name, email, password });
    if (error) throw new Error(error.message || 'Registration failed');
    setUser(data.user);
    return data;
  }

  async function logout() {
    try {
      await authClient.signOut();
    } catch {
      // Best-effort
    }
    setUser(null);
    localStorage.setItem('auth_logout', Date.now().toString());
  }

  async function googleLogin() {
    const { error } = await authClient.signIn.social({ provider: 'google' });
    if (error) throw new Error(error.message || 'Google sign-in failed');
  }

  async function updateProfile(fields) {
    const { data, error } = await authClient.updateUser(fields);
    if (error) throw new Error(error.message || 'Profile update failed');
    setUser((prev) => ({ ...prev, ...fields }));
    return data;
  }

  // Cross-tab logout detection
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'auth_logout') {
        setUser(null);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    googleLogin,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
