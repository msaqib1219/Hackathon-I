import { createAuthClient } from "better-auth/react";

// Get the base URL dynamically
const getAuthBaseURL = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000'; // SSR fallback - backend
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // For development, point to backend on port 8000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:8000`;
  }

  // For production, use same origin (proxied through netlify.toml)
  return `${protocol}//${hostname}`;
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: 'include', // Include cookies in requests
  }
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
