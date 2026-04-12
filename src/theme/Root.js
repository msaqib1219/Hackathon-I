import React from 'react';
import { AuthProvider } from '@site/src/context/AuthContext';
import ProtectedRoute from '@site/src/components/ProtectedRoute';
import Chatbot from '@site/src/components/Chatbot';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Root({children}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
        <Chatbot />
      </AuthProvider>
    </ErrorBoundary>
  );
}
