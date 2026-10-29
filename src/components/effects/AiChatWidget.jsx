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
        marginBottom: '1rem',
        gap: '0.65rem',
        alignItems: 'flex-start'
      }}
    >
      {!isUser && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 800, color: '#050811',
          marginTop: '2px',
          boxShadow: '0 0 12px rgba(0,212,255,0.4)'
        }}>
          AI
        </div>
      )}
      <div
        style={{
          maxWidth: isUser ? '82%' : '90%',
          padding: '0.85rem 1.2rem',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          background: isUser
            ? 'linear-gradient(135deg, rgba(0,212,255,0.28), rgba(108,99,255,0.22))'
            : 'rgba(255,255,255,0.06)',
          border: isUser
            ? '1px solid rgba(0,212,255,0.4)'
            : '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          color: '#E8F0FE',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          boxShadow: isUser ? '0 4px 20px rgba(0,212,255,0.15)' : 'none'
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 800, color: '#050811'
      }}>AI</div>
      <div style={{
        padding: '0.75rem 1.25rem',
        borderRadius: '20px 20px 20px 4px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', gap: '5px', alignItems: 'center'
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: '7px', height: '7px', borderRadius: '50%',
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
  const raw = query.trim();
  const q = raw.toLowerCase();

  if (/^(hi|hello|hey|hey\s+chat|hi\s+bot|sup|howdy|good\s+morning|yo)[\s!.,?]*$/i.test(q)) {
    return `Hey there! 👋 I'm **IntelliBot**, your AI interview prep assistant.

How can I help you today? You can ask me:
- 🏢 **Company Prep**: *"How does the Amazon SDE loop work?"*
- ⭐ **Behavioral**: *"Explain the STAR method"*
- 💡 **DSA & Core CS**: *"Dynamic Programming patterns"* or *"System Design"*
- 🌐 **Website Help**: *"How to book a mock interview?"* or *"Where is my dashboard?"*`;
  }

  if (/^(thanks|thank you|thx|awesome|cool|great|ok|okay)[\s!.,?]*$/i.test(q)) {
    return `You're very welcome! 😊 Feel free to ask anytime if you want to practice problems or prepare for an interview. Best of luck! 🚀`;
  }

  if (q.includes('how to use') || q.includes('about website') || q.includes('what is this website') || q.includes('how does this work')) {
    return `### 🌐 Interview Intelligence Quick Guide

1. **Company Prep**: Check 650+ tech companies, interview loop formats, and verified student logs.
2. **Mock Interviews**: Book 1-on-1 mock calls with verified peer mentors.
3. **Target Dashboard**: Track your consistency heatmap and milestones in real-time MongoDB!
4. **Share Experience**: Click **+ Share Experience** in the navbar to log your recruitment rounds.`;
  }

  if (q.includes('star') || q.includes('behavioral') || q.includes('hr')) {
    return `### ⭐ The STAR Method Framework

1. **S - Situation (15%)**: Set the context of the challenge (project, team, deadline).
2. **T - Task (15%)**: What was your specific goal or responsibility?
3. **A - Action (50%)**: What specific architectural or coding steps did **you** take?
4. **R - Result (20%)**: Quantifiable outcome (e.g. "Latency dropped by 80%").`;
  }

  return `### 💡 Placement Tip for: "${raw}"\n\nFocus on mastering core patterns: Two Pointers, Trees, Graphs, and DP. Always communicate your thought process aloud before writing code!`;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.45); }
          50% { box-shadow: 0 0 0 12px rgba(0,212,255,0); }
        }
        @keyframes intellibot-slidein {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 768px) {
          .intellibot-window {
            width: calc(100vw - 1.5rem) !important;
            height: calc(100vh - 6rem) !important;
            right: 0.75rem !important;
            bottom: 4.5rem !important;
          }
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
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          border: '2px solid rgba(0,212,255,0.65)',
          background: isOpen
            ? 'rgba(5,8,17,0.95)'
            : 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(108,99,255,0.25))',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          animation: !isOpen ? 'intellibot-pulse 2.5s ease-in-out infinite' : 'none',
          boxShadow: '0 4px 28px rgba(0,212,255,0.35)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.borderColor = '#00D4FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.65)';
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="ib-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#6C63FF" />
              </linearGradient>
            </defs>
            <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.35 1.07 4.47 2.8 6.01L4 22l4.97-2.49C10.27 19.83 11.12 20 12 20c5.52 0 10-3.92 10-8.75S17.52 2 12 2z"
              fill="url(#ib-grad)" opacity="0.95"/>
            <circle cx="8.5" cy="10.5" r="1.3" fill="#050811"/>
            <circle cx="12" cy="10.5" r="1.3" fill="#050811"/>
            <circle cx="15.5" cy="10.5" r="1.3" fill="#050811"/>
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

      {/* Spacious Half-Screen Chat Window */}
      {isOpen && (
        <div
          className="intellibot-window"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '2rem',
            zIndex: 9998,
            width: isExpanded ? 'clamp(580px, 64vw, 960px)' : 'clamp(480px, 48vw, 760px)',
            maxWidth: 'calc(100vw - 2.5rem)',
            height: isExpanded ? '84vh' : '75vh',
            maxHeight: 'calc(100vh - 6.5rem)',
            borderRadius: '24px',
            border: '1px solid rgba(0,212,255,0.3)',
            background: 'rgba(7,12,24,0.98)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,212,255,0.15)',
            animation: 'intellibot-slidein 0.25s ease-out',
            transition: 'width 0.25s ease, height 0.25s ease'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'rgba(0,0,0,0.25)'
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D4FF, #6C63FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 800, color: '#050811', flexShrink: 0,
              boxShadow: '0 0 14px rgba(0,212,255,0.45)'
            }}>AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem', lineHeight: 1.1 }}>
                IntelliBot
              </div>
              <div style={{ fontSize: '0.75rem', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                {aiInfo.hasGeminiKey ? 'AI Online · Gemini 1.5 Flash' : 'AI Online · IntelliBot Active'}
              </div>
            </div>

            {/* Expand / Minimize Window Button */}
            <button
              onClick={() => setIsExpanded((v) => !v)}
              title={isExpanded ? 'Standard Half-Screen' : 'Expand Wider'}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                color: 'var(--text-dim)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              {isExpanded ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                  <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              )}
            </button>

            {/* Clear Chat Button */}
            <button
              onClick={handleClear}
              title="Clear conversation"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                color: 'var(--text-dim)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,212,255,0.2) transparent'
          }}>
            {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
            {isTyping && <TypingDots />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 1.5rem 0.65rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,212,255,0.35)',
                    background: 'rgba(0,212,255,0.08)',
                    color: 'var(--accent-cyan)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DSA algorithms, STAR method, System Design, or company loops..."
              rows={1}
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                color: '#E8F0FE',
                fontSize: '0.92rem',
                resize: 'none',
                outline: 'none',
                maxHeight: '140px',
                overflowY: 'auto',
                lineHeight: 1.55,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'border-color 0.2s',
                scrollbarWidth: 'thin'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              style={{
                width: '46px',
                height: '46px',
                flexShrink: 0,
                borderRadius: '14px',
                border: 'none',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #00D4FF, #6C63FF)'
                  : 'rgba(255,255,255,0.08)',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: input.trim() && !isTyping ? '0 0 16px rgba(0,212,255,0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isTyping) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isTyping ? '#050811' : 'rgba(255,255,255,0.35)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Footer hint */}
          <div style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', padding: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            Interview Intelligence AI · Always Active & Fast
          </div>
        </div>
      )}
    </>
  );
}
