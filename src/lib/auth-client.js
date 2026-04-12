import { createAuthClient } from "better-auth/react";

// Get the base URL dynamically
const getAuthBaseURL = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3001'; // SSR fallback - auth-server
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // For development, point to auth-server on port 3001
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:3001`;
  }

  // For production, use same origin
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
