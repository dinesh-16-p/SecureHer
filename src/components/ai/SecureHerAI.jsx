import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Shield, Heart, Bot } from 'lucide-react';
import { queryAI } from '../../services/ai/aiService';
import { useHealth } from '../../context/HealthContext';

const SecureHerAI = () => {
  const { cycleSummary } = useHealth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your **SecureHer Assistant**. Ask me anything about safety procedures, cycle tracking, or emergency guidance.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await queryAI(queryText, {
        currentDay: cycleSummary?.currentDay,
        phase: cycleSummary?.phase
      });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'AI assistance is temporarily unavailable. Please try again later.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How do I use Emergency SOS?',
    'Explain my current cycle phase',
    'How is evidence stored locally?',
    'What helplines can I call?'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          zIndex: 999,
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 20px rgba(91, 33, 79, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease'
        }}
        title="Ask SecureHer AI"
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat Drawer Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '9.5rem',
            right: '1.5rem',
            width: '360px',
            maxWidth: 'calc(100vw - 3rem)',
            height: '480px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(91, 33, 79, 0.2)',
            border: '1px solid rgba(246, 221, 229, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>SecureHer AI</div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8 }}>Safety & Wellness Guide</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#FFF9FB' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: m.sender === 'user' ? 'var(--color-primary)' : '#FFFFFF',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--color-primary)',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(246, 221, 229, 0.8)',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                SecureHer AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(246, 221, 229, 0.6)', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.725rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(199, 91, 122, 0.3)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(246, 221, 229, 0.6)', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(246, 221, 229, 0.9)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--color-secondary)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SecureHerAI;
