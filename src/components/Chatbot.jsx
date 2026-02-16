import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@site/src/context/AuthContext';
import './Chatbot.css';

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

export default function Chatbot() {
  const { isAuthenticated, isLoading: authLoading, fetchWithAuth, apiUrl } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! I can answer questions about the Agentic AI Book. Ask me anything!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let storedSession = localStorage.getItem('chat_session_id');
    if (!storedSession) {
      storedSession = generateSessionId();
      localStorage.setItem('chat_session_id', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetchWithAuth(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
        }),
      });

      if (!response || !response.ok) {
        if (response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
        throw new Error('Failed to get a response');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        content: data.response,
        sources: data.sources,
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: error.message || 'Sorry, I encountered an error. Please try again later.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show chatbot while auth is loading
  if (authLoading) return null;

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="chatbot-container">
        {!isOpen && (
          <button className="chatbot-toggle" onClick={() => setIsOpen(true)} aria-label="Open Chat">
            💬
          </button>
        )}
        {isOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <span>AI Book Agent</span>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="chatbot-messages" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                Please sign in to use the chatbot.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)} aria-label="Open Chat">
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Book Agent</span>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div>{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    Sources: {msg.sources.join(', ')}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="typing-indicator">Agent is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              autoFocus
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
