import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const AuthContext = createContext(null);

const API_URL_FALLBACK = '';

export function AuthProvider({ children }) {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig?.customFields?.chatApiUrl || API_URL_FALLBACK;

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshingRef = useRef(false);

  const isAuthenticated = !!user && !!accessToken;

  // Attempt to restore session from refresh token cookie on mount
  // Also handle ?auth=success from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      // Clean up the URL query param
      const url = new URL(window.location);
      url.searchParams.delete('auth');
      window.history.replaceState({}, '', url.pathname + url.hash);
    }
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const res = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access_token);
        // Fetch user profile with the new token
        const meRes = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (meRes.ok) {
          const profile = await meRes.json();
          setUser(profile);
        }
      }
    } catch {
      // No valid session — user is not authenticated
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    setAccessToken(data.access_token);
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    setAccessToken(data.access_token);
    setUser(data.user);
    return data;
  }

  async function logout() {
    try {
      if (accessToken) {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });
      }
    } catch {
      // Best-effort logout
    }
    setUser(null);
    setAccessToken(null);
    // Signal other tabs
    localStorage.setItem('auth_logout', Date.now().toString());
  }

  // Cross-tab logout detection
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'auth_logout') {
        setUser(null);
        setAccessToken(null);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (refreshingRef.current) return null;
    refreshingRef.current = true;
    try {
      const res = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access_token);
        return data.access_token;
      }
      // Refresh failed — session expired
      setUser(null);
      setAccessToken(null);
      return null;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    } finally {
      refreshingRef.current = false;
    }
  }, [apiUrl]);

  const getAccessToken = useCallback(async () => {
    if (accessToken) {
      // Check if token is expired by decoding payload
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now + 30) {
          return accessToken;
        }
      } catch {
        // If decode fails, try refresh
      }
    }
    return await refreshAccessToken();
  }, [accessToken, refreshAccessToken]);

  async function fetchWithAuth(url, options = {}) {
    let token = await getAccessToken();
    if (!token) return null;

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (res.status === 401) {
      // Try one refresh
      token = await refreshAccessToken();
      if (!token) return null;
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }

    return res;
  }

  async function googleLogin() {
    try {
      const res = await fetch(`${apiUrl}/api/auth/google`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.authorization_url;
      } else {
        const err = await res.json().catch(() => ({ detail: 'Google sign-in unavailable' }));
        throw new Error(err.detail || 'Google sign-in failed');
      }
    } catch (e) {
      throw e.message ? e : new Error('Failed to start Google sign-in');
    }
  }

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    googleLogin,
    getAccessToken,
    fetchWithAuth,
    apiUrl,
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
