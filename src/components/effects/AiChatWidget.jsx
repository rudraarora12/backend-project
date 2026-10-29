import React, { useState, useRef, useEffect, useCallback } from 'react';
import { apiRequest } from '../../services/apiClient';

// --- Message Bubble ---
function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.85rem',
        gap: '0.5rem',
        alignItems: 'flex-end'
      }}
    >
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: '#050811'
        }}>
          AI
        </div>
      )}
      <div
        style={{
          maxWidth: '85%',
          padding: '0.75rem 1rem',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(108,99,255,0.2))'
            : 'rgba(255,255,255,0.06)',
          border: isUser
            ? '1px solid rgba(0,212,255,0.35)'
            : '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.85rem',
          lineHeight: 1.55,
          color: '#E8F0FE',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// --- Typing indicator ---
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', fontWeight: 700, color: '#050811'
      }}>AI</div>
      <div style={{
        padding: '0.65rem 1rem',
        borderRadius: '18px 18px 18px 4px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', gap: '4px', alignItems: 'center'
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent-cyan)',
            display: 'inline-block',
            animation: `intellibot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  'STAR method for behavioral rounds',
  'How to crack Amazon SDE-1?',
  'Explain Dynamic Programming with example',
  'System Design: Design YouTube',
  'Top 5 DSA topics for Google'
];

function getClientFallback(query) {
  const q = query.toLowerCase();
  if (q.includes('star') || q.includes('behavioral') || q.includes('hr')) {
    return `### ⭐ The STAR Method Framework

1. **S - Situation**: Set the context of the challenge (company, team, project).
2. **T - Task**: What was your specific goal or responsibility?
3. **A - Action**: What specific architectural or coding steps did you take? (Focus on "I did").
4. **R - Result**: Quantifiable outcome (e.g. "Latency dropped by 80%").`;
  }
  return `### 💡 Placement Tip for: "${query}"\n\nFocus on mastering core patterns: Two Pointers, Trees, Graphs, and DP. Always communicate your thought process aloud before writing code!`;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'model',
      text: "👋 Hey! I'm **IntelliBot**, your AI interview prep assistant.\n\nAsk me anything about DSA, System Design, company-specific strategies, LeetCode problems, or campus placement tips!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [aiInfo, setAiInfo] = useState({ enabled: true, hasGeminiKey: false });
  const [hasNew, setHasNew] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Check if AI is configured
  useEffect(() => {
    apiRequest('/ai/status')
      .then((data) => {
        if (data) setAiInfo(data);
      })
      .catch(() => {
        setAiInfo({ enabled: true, hasGeminiKey: false });
      });
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isTyping) return;

    const userMsg = { id: Date.now() + '-u', role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const newUserEntry = { role: 'user', parts: [{ text: userText }] };
    const currentHistory = [...history];

    try {
      abortRef.current = new AbortController();
      const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: { message: userText, history: currentHistory },
        signal: abortRef.current.signal
      });

      const replyText = data?.reply || getClientFallback(userText);
      setMessages((prev) => [...prev, { id: Date.now() + '-ai', role: 'model', text: replyText }]);

      setHistory((prev) => [
        ...prev,
        newUserEntry,
        { role: 'model', parts: [{ text: replyText }] }
      ].slice(-20));

      if (!isOpen) setHasNew(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      const fallbackText = getClientFallback(userText);
      setMessages((prev) => [...prev, { id: Date.now() + '-ai', role: 'model', text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, history, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([{
      id: 'init-reset',
      role: 'model',
      text: "Chat cleared! Ask me anything about interview prep 🚀"
    }]);
    setHistory([]);
  };

  return (
    <>
      <style>{`
        @keyframes intellibot-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes intellibot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(0,212,255,0); }
        }
        @keyframes intellibot-slidein {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="IntelliBot — AI Interview Assistant"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          border: '2px solid rgba(0,212,255,0.6)',
          background: isOpen
            ? 'rgba(5,8,17,0.95)'
            : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(108,99,255,0.2))',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          animation: !isOpen ? 'intellibot-pulse 2.5s ease-in-out infinite' : 'none',
          boxShadow: '0 4px 24px rgba(0,212,255,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.borderColor = '#00D4FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)';
        }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="ib-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#6C63FF" />
              </linearGradient>
            </defs>
            <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.35 1.07 4.47 2.8 6.01L4 22l4.97-2.49C10.27 19.83 11.12 20 12 20c5.52 0 10-3.92 10-8.75S17.52 2 12 2z"
              fill="url(#ib-grad)" opacity="0.9"/>
            <circle cx="8.5" cy="10.5" r="1.2" fill="#050811"/>
            <circle cx="12" cy="10.5" r="1.2" fill="#050811"/>
            <circle cx="15.5" cy="10.5" r="1.2" fill="#050811"/>
          </svg>
        )}
        {hasNew && !isOpen && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: '#FF4D6D', border: '2px solid #050811'
          }} />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2rem',
            zIndex: 9998,
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 10rem)',
            borderRadius: '20px',
            border: '1px solid rgba(0,212,255,0.25)',
            background: 'rgba(7,12,24,0.97)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
            animation: 'intellibot-slidein 0.25s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800, color: '#050811', flexShrink: 0
            }}>AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem', lineHeight: 1 }}>
                IntelliBot
              </div>
              <div style={{ fontSize: '0.72rem', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                {aiInfo.hasGeminiKey ? 'AI Online · Gemini 1.5 Flash' : 'AI Online · IntelliBot Active'}
              </div>
            </div>
            <button
              onClick={handleClear}
              title="Clear chat"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '4px', borderRadius: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,212,255,0.2) transparent'
          }}>
            {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
            {isTyping && <TypingDots />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 1rem 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,212,255,0.3)',
                    background: 'rgba(0,212,255,0.06)',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'flex-end',
            background: 'rgba(0,0,0,0.15)'
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DSA, System Design, companies..."
              rows={1}
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem',
                color: '#E8F0FE',
                fontSize: '0.85rem',
                resize: 'none',
                outline: 'none',
                maxHeight: '120px',
                overflowY: 'auto',
                lineHeight: 1.5,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'border-color 0.2s',
                scrollbarWidth: 'thin'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                borderRadius: '12px',
                border: 'none',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #00D4FF, #6C63FF)'
                  : 'rgba(255,255,255,0.07)',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isTyping) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isTyping ? '#050811' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Footer hint */}
          <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', padding: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            Interview Intelligence AI · Always Active
          </div>
        </div>
      )}
    </>
  );
}
