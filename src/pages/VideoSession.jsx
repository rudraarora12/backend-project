import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { completeSessionReview } from '../services/connectService';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import '../styles/connect.css';

export const VideoSession = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const [activeRightTab, setActiveRightTab] = useState('editor'); // 'editor' | 'prompt'
  const [code, setCode] = useState(`// IntelliGrid Collaborative Coding Pad
// Problem: LRU Cache Implementation (Amazon / Google / Microsoft)
// Complexity Target: O(1) get, O(1) put

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }
}
`);
  const [outputConsole, setOutputConsole] = useState('');
  const [showDebriefModal, setShowDebriefModal] = useState(false);

  // Debrief ratings
  const [dsaRating, setDsaRating] = useState(4);
  const [codeQualityRating, setCodeQualityRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [debriefNotes, setDebriefNotes] = useState('Excellent algorithmic explanation. Very strong edge case handling on cache size evictions.');

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setOutputConsole('Executing test harness...\n✓ Test Case 1: Cache capacity initialized (2)\n✓ Test Case 2: put(1, 1), put(2, 2) passed\n✓ Test Case 3: get(1) returns 1\n✓ Test Case 4: put(3, 3) evicts key 2 successfully\n✓ Test Case 5: get(2) returns -1 as expected\nAll 5 automated tests PASSED in 14ms.');
    showToast('Code execution completed successfully!', 'success');
  };

  const handleEndSession = () => {
    setShowDebriefModal(true);
  };

  const handleSubmitDebrief = (e) => {
    e.preventDefault();
    completeSessionReview('II-AX2938', {
      dsaRating,
      codeQualityRating,
      communicationRating,
      notes: debriefNotes,
      durationMinutes: Math.ceil(sessionTime / 60)
    });

    showToast('Interview debrief saved to your mock records!', 'success');
    setShowDebriefModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="video-room-container">
      <div className="container" style={{ maxWidth: '1440px' }}>
        {/* Top Room Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-emerald)',
                boxShadow: '0 0 10px var(--status-emerald)'
              }}
            />
            <div>
              <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>
                Simulated Mock Room #II-AX2938
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                Amazon SDE-1 Technical Round Loop
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 212, 255, 0.1)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}
            >
              <Icon name="clock" size={14} />
              <span>{formatTimer(sessionTime)}</span>
            </div>

            <button
              onClick={handleEndSession}
              className="btn btn-sm"
              style={{
                background: 'var(--status-rose)',
                color: '#FFFFFF',
                fontWeight: 700
              }}
            >
              End Call & Debrief
            </button>
          </div>
        </div>

        {/* Video & Code Workspace Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '1.25rem',
            alignItems: 'stretch'
          }}
        >
          {/* Left Column: Video Feeds + Controls */}
          <div>
            <div className="video-grid">
              {/* Senior Mentor Video Box */}
              <div className="video-feed-box">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Mentor Video Feed"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(5, 8, 17, 0.85)',
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem'
                  }}
                >
                  <span style={{ color: 'var(--status-emerald)' }}>●</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Arjun Mehta (Interviewer - Amazon)</span>
                </div>
              </div>

              {/* Candidate (You) Video Box */}
              <div className="video-feed-box">
                {videoActive ? (
                  screenShareActive ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#070C18',
                        padding: '1.5rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--accent-cyan)'
                      }}
                    >
                      <div>[SCREEN SHARE BROADCAST ACTIVE]</div>
                      <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Streaming: VS Code - lru_cache_solution.js
                      </div>
                      <div style={{ color: 'var(--status-emerald)', marginTop: '0.5rem' }}>
                        Display FPS: 60 | Latency: 12ms
                      </div>
                    </div>
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80"
                      alt="Your Video Feed"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    <Icon name="video-off" size={40} style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '0.85rem' }}>Camera Paused</div>
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(5, 8, 17, 0.85)',
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem'
                  }}
                >
                  <span style={{ color: micActive ? 'var(--status-emerald)' : 'var(--status-rose)' }}>●</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>You (Candidate)</span>
                </div>
              </div>
            </div>

            {/* AV Controls Bar */}
            <div className="video-controls-bar">
              {/* Mic toggle */}
              <button
                onClick={() => {
                  setMicActive(!micActive);
                  showToast(micActive ? 'Microphone muted' : 'Microphone unmuted', 'info');
                }}
                className="btn-icon"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: micActive ? 'rgba(255, 255, 255, 0.08)' : 'var(--status-rose)',
                  color: micActive ? '#FFFFFF' : '#FFFFFF',
                  border: '1px solid var(--border-glass)'
                }}
                title={micActive ? 'Mute Mic' : 'Unmute Mic'}
              >
                <Icon name={micActive ? 'mic' : 'mic-off'} size={18} />
              </button>

              {/* Video toggle */}
              <button
                onClick={() => {
                  setVideoActive(!videoActive);
                  showToast(videoActive ? 'Camera turned off' : 'Camera turned on', 'info');
                }}
                className="btn-icon"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: videoActive ? 'rgba(255, 255, 255, 0.08)' : 'var(--status-rose)',
                  color: '#FFFFFF',
                  border: '1px solid var(--border-glass)'
                }}
                title={videoActive ? 'Disable Video' : 'Enable Video'}
              >
                <Icon name={videoActive ? 'video' : 'video-off'} size={18} />
              </button>

              {/* Screen Share toggle */}
              <button
                onClick={() => {
                  setScreenShareActive(!screenShareActive);
                  showToast(screenShareActive ? 'Stopped screen sharing' : 'Sharing simulated screen', 'info');
                }}
                className="btn-icon"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: screenShareActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
                  color: screenShareActive ? '#050811' : '#FFFFFF',
                  border: '1px solid var(--border-glass)'
                }}
                title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
              >
                <Icon name="screen" size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Code Editor & Question Prompts */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '480px'
            }}
          >
            {/* Tab switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div className="filter-tabs">
                <button
                  className={`tab-btn ${activeRightTab === 'editor' ? 'active' : ''}`}
                  onClick={() => setActiveRightTab('editor')}
                >
                  Collaborative Code Pad
                </button>
                <button
                  className={`tab-btn ${activeRightTab === 'prompt' ? 'active' : ''}`}
                  onClick={() => setActiveRightTab('prompt')}
                >
                  Problem Statement
                </button>
              </div>

              {activeRightTab === 'editor' && (
                <button
                  onClick={handleRunCode}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Icon name="play" size={13} />
                  <span>Run Tests</span>
                </button>
              )}
            </div>

            {/* Tab 1: Code Pad */}
            {activeRightTab === 'editor' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    flex: 1,
                    minHeight: '260px',
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 8, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#00D4FF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    padding: '1rem',
                    lineHeight: 1.5,
                    resize: 'none'
                  }}
                  spellCheck="false"
                />

                {/* Console Output */}
                {outputConsole && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(5, 8, 17, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--status-emerald)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {outputConsole}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Problem Statement */}
            {activeRightTab === 'prompt' && (
              <div style={{ flex: 1, color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    LRU Cache (Least Recently Used)
                  </h4>
                  <Badge variant="medium" size="sm">Medium</Badge>
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
                </p>

                <div style={{ background: 'rgba(7, 12, 24, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <strong>Constraints & Function Specs:</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    <li>int get(int key): Return value if key exists, otherwise -1.</li>
                    <li>void put(int key, int value): Update or insert value. When capacity exceeded, evict the least recently used key.</li>
                    <li>Time Complexity: Must run in O(1) average time complexity for both methods.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debrief & Evaluation Modal */}
        {showDebriefModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(5, 8, 17, 0.9)',
              backdropFilter: 'blur(16px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--accent-cyan)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 212, 255, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--accent-cyan-dim)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon name="award" size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Interview Debrief & Evaluation Card
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Evaluator: Arjun Mehta (Amazon SDE-1)
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitDebrief}>
                {/* DSA score */}
                <div className="form-group">
                  <div className="form-label">
                    <span>DSA & Problem Solving Efficiency</span>
                    <span className="font-mono text-cyan">{dsaRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dsaRating}
                    onChange={(e) => setDsaRating(Number(e.target.value))}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Code Quality */}
                <div className="form-group">
                  <div className="form-label">
                    <span>Code Modularity & Edge Case Handling</span>
                    <span className="font-mono text-cyan">{codeQualityRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={codeQualityRating}
                    onChange={(e) => setCodeQualityRating(Number(e.target.value))}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Communication */}
                <div className="form-group">
                  <div className="form-label">
                    <span>STAR Behavioral & Articulation</span>
                    <span className="font-mono text-cyan">{communicationRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={communicationRating}
                    onChange={(e) => setCommunicationRating(Number(e.target.value))}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Tactical Feedback Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={debriefNotes}
                    onChange={(e) => setDebriefNotes(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowDebriefModal(false)}
                  >
                    Resume Room
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                  >
                    Submit Debrief & Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
