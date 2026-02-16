import React from 'react';
import { AuthProvider } from '@site/src/context/AuthContext';
import ProtectedRoute from '@site/src/components/ProtectedRoute';
import Chatbot from '@site/src/components/Chatbot';

export default function Root({children}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
      <Chatbot />
    </AuthProvider>
  );
}
