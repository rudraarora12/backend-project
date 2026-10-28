import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllMentors } from '../services/connectService';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/expert-chat.css';

export const ExpertChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, showToast } = useApp();
  const mentors = getAllMentors();

  const mentorQueryParam = searchParams.get('expert');

  // Selected Expert
  const [selectedExpert, setSelectedExpert] = useState(() => {
    if (mentorQueryParam) {
      const match = mentors.find((m) => m.id === mentorQueryParam);
      if (match) return match;
    }
    return mentors[0] || null;
  });

  const [expertSearch, setExpertSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const companies = ['All', 'Amazon', 'Google', 'Microsoft', 'Goldman Sachs', 'Uber'];

  // Storage key per expert & user
  const chatStorageKey = `ii_chat_${user?.name || 'guest'}_${selectedExpert?.id || 'default'}`;

  // Initial welcome message for each mentor based on their domain
  const getDefaultMessages = (mentor) => {
    if (!mentor) return [];
    return [
      {
        id: 'msg-init-1',
        sender: 'expert',
        text: `Hey there! I'm ${mentor.name}, placed at ${mentor.company} as a ${mentor.role}. Feel free to ask me anything about our campus OA rounds, technical interview bar, or preparation strategy!`,
        timestamp: '10:00 AM'
      },
      {
        id: 'msg-init-2',
        sender: 'expert',
        text: `Top topics I focus on: ${mentor.topics.join(', ')}. What company are you actively preparing for?`,
        timestamp: '10:01 AM'
      }
    ];
  };

  // Load messages from localStorage or initialize
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(chatStorageKey);
      if (stored) return JSON.parse(stored);
      return getDefaultMessages(selectedExpert);
    } catch {
      return getDefaultMessages(selectedExpert);
    }
  });

  // When switching selected expert, reload conversation
  useEffect(() => {
    if (!selectedExpert) return;
    try {
      const stored = localStorage.getItem(chatStorageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const initial = getDefaultMessages(selectedExpert);
        setMessages(initial);
        localStorage.setItem(chatStorageKey, JSON.stringify(initial));
      }
    } catch {
      setMessages(getDefaultMessages(selectedExpert));
    }
  }, [selectedExpert?.id, chatStorageKey]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filtered experts in sidebar
  const filteredExperts = useMemo(() => {
    return mentors.filter((m) => {
      const matchesCompany = companyFilter === 'All' || m.company.toLowerCase() === companyFilter.toLowerCase();
      const term = expertSearch.toLowerCase();
      const matchesSearch =
        m.name.toLowerCase().includes(term) ||
        m.company.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        m.topics.some((t) => t.toLowerCase().includes(term));

      return matchesCompany && matchesSearch;
    });
  }, [mentors, companyFilter, expertSearch]);

  const handleSelectExpert = (exp) => {
    setSelectedExpert(exp);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('expert', exp.id);
    setSearchParams(newParams);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: trimmed,
      timestamp: timeString
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInputMessage('');
    localStorage.setItem(chatStorageKey, JSON.stringify(updated));

    // Simulated helpful contextual response from mentor (demo mode)
    setIsSending(true);
    setTimeout(() => {
      let replyText = `Thanks for asking! For ${selectedExpert.company}, the key is to clearly communicate your thought process and edge cases before coding. Review our frequent patterns under Company Prep!`;

      if (trimmed.toLowerCase().includes('amazon') || trimmed.toLowerCase().includes('lp') || trimmed.toLowerCase().includes('leadership')) {
        replyText = `For Amazon, remember that 50% of the interview score is Leadership Principles. Structure every story using STAR: Situation, Task, Action, Result. Quantify your achievements!`;
      } else if (trimmed.toLowerCase().includes('google') || trimmed.toLowerCase().includes('dsa') || trimmed.toLowerCase().includes('graph')) {
        replyText = `At Google, interviewers test code correctness and proof of optimal complexity. Always verify your solution with a sample input trace before saying you're done!`;
      } else if (trimmed.toLowerCase().includes('resume') || trimmed.toLowerCase().includes('project')) {
        replyText = `Keep your resume to 1 page. Lead bullet points with strong action verbs (Architected, Engineered, Optimized) and include real metrics like 'Reduced latency by 35%'.`;
      }

      const mentorReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'expert',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updated, mentorReply];
      setMessages(finalMessages);
      localStorage.setItem(chatStorageKey, JSON.stringify(finalMessages));
      setIsSending(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(`Clear chat conversation with ${selectedExpert?.name}?`)) {
      const reset = getDefaultMessages(selectedExpert);
      setMessages(reset);
      localStorage.setItem(chatStorageKey, JSON.stringify(reset));
      showToast('Conversation reset to initial state.', 'info');
    }
  };

  return (
    <div className="expert-chat-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '1.75rem' }}>
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Direct Text Advisory</span>
          </div>
          <h1 className="page-title">
            1-on-1 Expert Advisory Chat
          </h1>
          <p className="page-subtitle">
            Connect directly with verified campus placed seniors and alumni to ask rapid questions regarding online assessments, resume reviews, and company-specific interview standards.
          </p>
        </div>

        {/* Local Demo Disclaimer */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(0, 212, 255, 0.06)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Icon name="shield" size={16} color="var(--accent-cyan)" />
            <span>
              <strong>Local Conversation Mode (Offline Storage):</strong> Conversations are saved locally to your device workspace.
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            CLIENT-PERSISTENT
          </span>
        </div>

        {/* Chat Application Card */}
        <ScrollReveal direction="up">
          <div className="chat-container-card">
            {/* Left Sidebar: Expert Discovery */}
            <div className="chat-sidebar">
              <div className="chat-sidebar-header">
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <Icon name="search" size={15} />
                  </div>
                  <input
                    type="text"
                    className="search-input"
                    style={{ paddingLeft: '2.4rem', width: '100%', fontSize: '0.85rem' }}
                    placeholder="Search mentor or company..."
                    value={expertSearch}
                    onChange={(e) => setExpertSearch(e.target.value)}
                  />
                </div>

                {/* Company Filter Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {companies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCompanyFilter(c)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid',
                        borderColor: companyFilter === c ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                        background: companyFilter === c ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
                        color: companyFilter === c ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expert List */}
              <div className="chat-expert-list">
                {filteredExperts.map((expert) => {
                  const isSelected = selectedExpert?.id === expert.id;
                  return (
                    <button
                      key={expert.id}
                      onClick={() => handleSelectExpert(expert)}
                      className={`chat-expert-item ${isSelected ? 'active' : ''}`}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '1px',
                            right: '1px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'var(--status-emerald)',
                            border: '2px solid #050811'
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {expert.name}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                            {expert.company}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {expert.role}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredExperts.length === 0 && (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    No experts found matching query.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Active Chat View */}
            {selectedExpert ? (
              <div className="chat-main-area">
                {/* Header */}
                <div className="chat-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={selectedExpert.avatar}
                        alt={selectedExpert.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-glass)' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--status-emerald)',
                          border: '2px solid #050811'
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                          {selectedExpert.name}
                        </h3>
                        <Badge variant="cyan" size="sm">
                          {selectedExpert.company}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {selectedExpert.role} • Placed {selectedExpert.interviewYear}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={handleClearHistory}
                      className="btn btn-secondary btn-sm"
                      title="Clear chat history"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Icon name="trash" size={13} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Messages Scroll Area */}
                <div className="chat-messages-scroll">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${msg.sender}`}
                    >
                      <div>{msg.text}</div>
                      <div className="message-timestamp">
                        {msg.timestamp}
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="message-bubble expert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {selectedExpert.name} is typing...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Composer Form */}
                <form onSubmit={handleSendMessage} className="chat-composer-box">
                  <textarea
                    rows={1}
                    className="chat-textarea"
                    placeholder={`Message ${selectedExpert.name}... (Press Enter to send, Shift+Enter for new line)`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="btn btn-primary btn-md"
                    style={{
                      height: '44px',
                      padding: '0 1.25rem',
                      opacity: !inputMessage.trim() ? 0.5 : 1
                    }}
                  >
                    <Icon name="send" size={16} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Select an expert to begin conversation.
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
