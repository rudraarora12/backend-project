import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllMentors } from '../services/connectService';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import '../styles/expert-chat.css';

const STORAGE_KEY = 'ii_expert_conversations_v1';
const mentors = getAllMentors();

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() || `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isValidMessage(message) {
  return (
    message &&
    typeof message.id === 'string' &&
    typeof message.text === 'string' &&
    message.text.trim() &&
    (message.sender === 'student' || message.sender === 'expert')
  );
}

function uniqueMessages(messages) {
  const ids = new Set();
  return messages.filter((message) => {
    if (!isValidMessage(message) || ids.has(message.id)) return false;
    ids.add(message.id);
    return true;
  });
}

function readConversationState(userName) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.version !== 1 || !parsed.conversations || typeof parsed.conversations !== 'object') {
        throw new Error('Stored conversation data has an unsupported format.');
      }

      const conversations = {};
      for (const expert of mentors) {
        const saved = parsed.conversations[expert.id];
        if (!saved || !Array.isArray(saved.messages)) continue;
        conversations[expert.id] = {
          updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : '',
          messages: uniqueMessages(saved.messages).map((message) => ({
            id: message.id,
            sender: message.sender,
            text: message.text,
            createdAt: typeof message.createdAt === 'string' ? message.createdAt : '',
            timestamp: typeof message.timestamp === 'string' ? message.timestamp : ''
          }))
        };
      }
      return { conversations, error: '', readOnly: false };
    }

    const conversations = {};
    for (const expert of mentors) {
      const legacyKey = `ii_chat_${userName}_${expert.id}`;
      const legacyData = localStorage.getItem(legacyKey);
      if (!legacyData) continue;

      try {
        const legacyMessages = JSON.parse(legacyData);
        if (!Array.isArray(legacyMessages)) continue;

        // Earlier versions generated fake expert replies; retain only messages the student wrote.
        const messages = legacyMessages
          .filter((message) => message?.sender === 'student' && typeof message.text === 'string' && message.text.trim())
          .map((message, index) => ({
            id: typeof message.id === 'string' ? message.id : `legacy-${expert.id}-${index}`,
            sender: 'student',
            text: message.text,
            createdAt: '',
            timestamp: typeof message.timestamp === 'string' ? message.timestamp : ''
          }));

        if (messages.length) conversations[expert.id] = { updatedAt: '', messages };
      } catch (error) {
        console.warn(`Could not migrate conversation history for ${expert.id}:`, error);
      }
    }

    if (Object.keys(conversations).length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, conversations }));
        return { conversations, error: '', readOnly: false };
      } catch (error) {
        console.warn('Could not save migrated conversation history:', error);
        return {
          conversations,
          error: 'Your previous messages were loaded, but this browser could not save the updated conversation format.',
          readOnly: false
        };
      }
    }

    return { conversations, error: '', readOnly: false };
  } catch (error) {
    console.warn('Could not load local expert conversations:', error);
    return {
      conversations: {},
      error: 'Saved conversations could not be read. Sending is disabled to protect the existing data.',
      readOnly: true
    };
  }
}

function Avatar({ expert, size = 'regular' }) {
  return (
    <span className={`chat-avatar chat-avatar-${size}`} aria-hidden="true">
      <span>{expert.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
      <img
        src={expert.avatar}
        alt=""
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    </span>
  );
}

function formatTime(message) {
  if (message.createdAt) {
    const date = new Date(message.createdAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
  }
  return message.timestamp || '';
}

function formatDay(message) {
  if (!message.createdAt) return '';
  const date = new Date(message.createdAt);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatConversationTime(conversation) {
  if (conversation.updatedAt) {
    const date = new Date(conversation.updatedAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
  const latest = conversation.messages[conversation.messages.length - 1];
  return latest ? formatTime(latest) : '';
}

export const ExpertChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, showToast } = useApp();
  const selectedExpertId = searchParams.get('expert');
  const selectedExpert = mentors.find((expert) => expert.id === selectedExpertId) || null;
  const [search, setSearch] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);
  const [draft, setDraft] = useState('');
  const [sendError, setSendError] = useState('');
  const [conversationState, setConversationState] = useState(() => readConversationState(user?.name || 'guest'));
  const messagesViewportRef = useRef(null);
  const activeConversation = selectedExpert ? conversationState.conversations[selectedExpert.id] : null;
  const messages = activeConversation?.messages || [];

  const existingConversations = useMemo(() => {
    return mentors
      .filter((expert) => (conversationState.conversations[expert.id]?.messages.length || 0) > 0)
      .sort((a, b) => {
        const aDate = conversationState.conversations[a.id]?.updatedAt || '';
        const bDate = conversationState.conversations[b.id]?.updatedAt || '';
        return bDate.localeCompare(aDate);
      });
  }, [conversationState.conversations]);

  const visibleExperts = useMemo(() => {
    const source = showDirectory ? mentors : existingConversations;
    const query = search.trim().toLowerCase();
    return source.filter((expert) => (
      !query ||
      expert.name.toLowerCase().includes(query) ||
      expert.company.toLowerCase().includes(query) ||
      expert.role.toLowerCase().includes(query) ||
      expert.topics.some((topic) => topic.toLowerCase().includes(query)) ||
      (!showDirectory && (conversationState.conversations[expert.id]?.messages || [])
        .some((message) => message.text.toLowerCase().includes(query)))
    ));
  }, [conversationState.conversations, existingConversations, search, showDirectory]);

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [selectedExpertId, messages.length]);

  const selectExpert = (expertId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('expert', expertId);
    setSearchParams(nextParams);
    setShowDirectory(false);
    setSearch('');
    setSendError('');
  };

  const returnToConversations = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('expert');
    setSearchParams(nextParams);
  };

  const handleClearHistory = () => {
    if (!selectedExpert || !messages.length) return;
    if (!window.confirm(`Clear the locally stored conversation with ${selectedExpert.name}?`)) return;

    const nextConversations = { ...conversationState.conversations };
    delete nextConversations[selectedExpert.id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, conversations: nextConversations }));
      setConversationState({ conversations: nextConversations, error: '', readOnly: false });
      setSendError('');
      showToast('Local conversation cleared.', 'info');
    } catch (error) {
      console.error('Could not clear expert chat history:', error);
      setSendError('Conversation history could not be cleared from this browser.');
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedExpert || conversationState.readOnly) return;

    const createdAt = new Date().toISOString();
    const message = {
      id: createMessageId(),
      sender: 'student',
      text,
      createdAt,
      timestamp: ''
    };
    const nextConversations = {
      ...conversationState.conversations,
      [selectedExpert.id]: {
        updatedAt: createdAt,
        messages: [...messages, message]
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, conversations: nextConversations }));
      setConversationState({ conversations: nextConversations, error: '', readOnly: false });
      setDraft('');
      setSendError('');
      if (!selectedExpertId) selectExpert(selectedExpert.id);
    } catch (error) {
      console.error('Could not save expert chat message:', error);
      setSendError('Your message was not saved. Check this browser’s available storage, then try again.');
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim() && !conversationState.readOnly) handleSendMessage(event);
    }
  };

  return (
    <section className="expert-chat-page">
      <div className="expert-chat-shell">
        <header className="expert-chat-page-header">
          <div className="expert-chat-heading">
            <nav className="chat-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Expert Chat</span>
            </nav>
            <h1>Expert Chat</h1>
            <p>Get career advice from experienced professionals.</p>
          </div>
          <div className="chat-mode-indicator">
            <span className="chat-mode-dot" />
            <span>Demo mode · Stored locally on this device</span>
          </div>
        </header>

        <div className={`chat-container-card${selectedExpertId ? ' has-active-conversation' : ''}`}>
          <aside className="chat-sidebar" aria-label="Conversations and experts">
            <div className="chat-sidebar-header">
              <div className="chat-sidebar-title-row">
                <div>
                  <h2>{showDirectory ? 'Find an expert' : 'Messages'}</h2>
                  <p>{showDirectory ? 'Choose someone to start a conversation' : `${existingConversations.length} saved conversation${existingConversations.length === 1 ? '' : 's'}`}</p>
                </div>
                <button
                  type="button"
                  className={`chat-directory-toggle${showDirectory ? ' is-active' : ''}`}
                  onClick={() => {
                    setShowDirectory((visible) => !visible);
                    setSearch('');
                  }}
                  aria-label={showDirectory ? 'Show saved conversations' : 'Find an expert'}
                  title={showDirectory ? 'Show saved conversations' : 'Find an expert'}
                >
                  <Icon name={showDirectory ? 'message-square' : 'plus'} size={18} />
                </button>
              </div>
              <label className="chat-search">
                <Icon name="search" size={16} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={showDirectory ? 'Search experts' : 'Search messages'}
                  aria-label={showDirectory ? 'Search experts' : 'Search conversations'}
                />
              </label>
              <button
                type="button"
                className="chat-find-expert-button"
                onClick={() => {
                  setShowDirectory(true);
                  setSearch('');
                }}
              >
                <Icon name="plus" size={15} />
                <span>Find an expert</span>
              </button>
            </div>

            <div className="chat-expert-list">
              {visibleExperts.map((expert) => {
                const conversation = conversationState.conversations[expert.id];
                const lastMessage = conversation?.messages[conversation.messages.length - 1];
                const isSelected = selectedExpertId === expert.id;
                return (
                  <button
                    key={expert.id}
                    type="button"
                    className={`chat-expert-item${isSelected ? ' active' : ''}`}
                    onClick={() => selectExpert(expert.id)}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <Avatar expert={expert} />
                    <span className="chat-expert-copy">
                      <span className="chat-expert-primary">
                        <span className="chat-expert-name">{expert.name}</span>
                        <span className="chat-expert-time">
                          {lastMessage ? formatConversationTime(conversation) : ''}
                        </span>
                      </span>
                      <span className="chat-expert-company">{expert.company} · {expert.role}</span>
                      <span className="chat-expert-preview">
                        {lastMessage
                          ? `${lastMessage.sender === 'student' ? 'You: ' : ''}${lastMessage.text}`
                          : 'Start a conversation'}
                      </span>
                    </span>
                  </button>
                );
              })}

              {visibleExperts.length === 0 && (
                <div className="chat-list-empty">
                  <Icon name={search ? 'search' : 'message-square'} size={22} />
                  <p>
                    {search
                      ? 'No results. Try another name, company, or topic.'
                      : showDirectory
                        ? 'No experts are available right now.'
                        : 'No conversations yet. Find an expert to get started.'}
                  </p>
                  {!search && !showDirectory && (
                    <button
                      type="button"
                      className="chat-text-action"
                      onClick={() => setShowDirectory(true)}
                    >
                      Browse experts
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          <section className="chat-main-area" aria-label="Active conversation">
            {selectedExpert ? (
              <>
                <header className="chat-header">
                  <button
                    type="button"
                    className="chat-back-button"
                    onClick={returnToConversations}
                    aria-label="Back to conversations"
                  >
                    <Icon name="arrow-left" size={18} />
                  </button>
                  <Avatar expert={selectedExpert} size="large" />
                  <div className="chat-header-copy">
                    <h2>{selectedExpert.name}</h2>
                    <p>{selectedExpert.company} · {selectedExpert.role}</p>
                    <div className="chat-topic-list">
                      {selectedExpert.topics.slice(0, 3).map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  </div>
                  <Link
                    className="chat-profile-link"
                    aria-label={`View ${selectedExpert.name}'s profile`}
                    to={`/mock-interviews?tab=mentors&mentor=${encodeURIComponent(selectedExpert.id)}`}
                  >
                    <span>View profile</span>
                    <Icon name="arrow-right" size={15} />
                  </Link>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      className="chat-clear-button"
                      onClick={handleClearHistory}
                      aria-label={`Clear conversation with ${selectedExpert.name}`}
                      title="Clear local conversation"
                    >
                      <Icon name="trash" size={15} />
                      <span>Clear</span>
                    </button>
                  )}
                </header>

                <div className="chat-messages-scroll" ref={messagesViewportRef} aria-live="polite">
                  <div className="chat-demo-notice">
                    <Icon name="lock" size={14} />
                    <span>Demo mode — messages are stored on this device and are not sent to the expert.</span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="chat-empty-thread">
                      <Avatar expert={selectedExpert} size="large" />
                      <h3>No messages yet</h3>
                      <p>Start a conversation about {selectedExpert.company}, interview preparation, or {selectedExpert.topics[0]}.</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const day = formatDay(message);
                      const previousDay = index > 0 ? formatDay(messages[index - 1]) : '';
                      return (
                        <React.Fragment key={message.id}>
                          {day && day !== previousDay && (
                            <div className="chat-day-divider"><span>{day}</span></div>
                          )}
                          <article className={`message-row ${message.sender === 'student' ? 'from-student' : 'from-expert'}`}>
                            <div className={`message-bubble ${message.sender === 'student' ? 'student' : 'expert'}`}>
                              <p>{message.text}</p>
                              <time className="message-timestamp">
                                {formatTime(message)}
                              </time>
                            </div>
                          </article>
                        </React.Fragment>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="chat-composer-box">
                  {(conversationState.error || sendError) && (
                    <p className="chat-storage-error" role="alert">
                      {sendError || conversationState.error}
                    </p>
                  )}
                  <div className="chat-composer-row">
                    <textarea
                      rows={1}
                      className="chat-textarea"
                      placeholder="Write a message…"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                      aria-label={`Message ${selectedExpert.name}`}
                      disabled={conversationState.readOnly}
                    />
                    <button
                      type="submit"
                      className="chat-send-button"
                      disabled={!draft.trim() || conversationState.readOnly}
                      aria-label="Send message"
                    >
                      <Icon name="send" size={17} />
                    </button>
                  </div>
                  <div className="chat-composer-hint">
                    <span>Enter to send · Shift + Enter for a new line</span>
                    <span>Local conversation</span>
                  </div>
                </form>
              </>
            ) : selectedExpertId ? (
              <div className="chat-selection-empty">
                <span className="chat-empty-icon"><Icon name="user" size={24} /></span>
                <h2>Expert not found</h2>
                <p>This expert link may be outdated. Browse the directory to choose an available expert.</p>
                <button
                  type="button"
                  className="chat-primary-action"
                  onClick={() => {
                    returnToConversations();
                    setShowDirectory(true);
                  }}
                >
                  Find an expert
                </button>
              </div>
            ) : (
              <div className="chat-selection-empty">
                <span className="chat-empty-icon"><Icon name="message-square" size={24} /></span>
                <h2>Your conversations</h2>
                <p>Select a saved conversation or find an expert to start a new one.</p>
                <button
                  type="button"
                  className="chat-primary-action"
                  onClick={() => setShowDirectory(true)}
                >
                  Find an expert
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};
