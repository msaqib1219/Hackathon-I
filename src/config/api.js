/**
 * API Configuration for RAG Chatbot
 *
 * This file centralizes API configuration.
 * The API key should be injected at build time for security.
 *
 * Options for injecting the API key:
 * 1. Environment variable: Set REACT_APP_CHAT_API_KEY before build
 * 2. Window global: Set window.__CHAT_API_KEY__ in index.html (for dynamic injection)
 * 3. Docusaurus customFields in docusaurus.config.js
 */

// API endpoint configuration
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  chatEndpoint: '/api/chat',
  healthEndpoint: '/api/health',
};

// Get API key from various sources
export function getApiKey() {
  // Check window global first (allows runtime injection)
  if (typeof window !== 'undefined' && window.__CHAT_API_KEY__) {
    return window.__CHAT_API_KEY__;
  }

  // Check environment variable
  if (process.env.REACT_APP_CHAT_API_KEY) {
    return process.env.REACT_APP_CHAT_API_KEY;
  }

  // Check Docusaurus site config (if available)
  if (typeof window !== 'undefined' && window.docusaurusConfig?.customFields?.chatApiKey) {
    return window.docusaurusConfig.customFields.chatApiKey;
  }

  return '';
}

// Build full API URL
export function getApiUrl(endpoint) {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}
