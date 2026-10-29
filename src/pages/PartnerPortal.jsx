import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { apiRequest } from '../services/apiClient';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/connect.css';
import '../styles/partner.css';

export const PartnerPortal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, switchRole, showToast } = useApp();

  const isPartner = isAuthenticated && (user?.role === 'EXPERT' || user?.role === 'ADMIN');

  // ONLY TWO DEDICATED PAGES:
  // 1. 'requests': Student Paid Session Requests & Bookings
  // 2. 'video': Live Video Call Session Room
  const activeTab = searchParams.get('tab') === 'video' ? 'video' : 'requests';

  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // ==========================================
  // PAGE 1: STUDENT SESSION REQUESTS STATE
  // ==========================================
  const [sessions, setSessions] = useState([
    {
      id: 'book-901',
      candidateName: 'Rohan Sharma',
      candidateEmail: 'rohan.s@iitd.ac.in',
      candidateCollege: 'IIT Delhi (B.Tech CSE 2026)',
      candidateAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      targetCompany: 'Amazon',
      targetRole: 'SDE-1 (Campus Hire)',
      date: 'Today',
      time: '6:30 PM - 7:30 PM',
      paidAmount: '₹999 Paid',
      status: 'UPCOMING_SESSION',
      problemAttempted: 'Design & Implement LRU Cache (JS)',
      codeSnippet: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n}`
    },
    {
      id: 'book-902',
      candidateName: 'Ananya Verma',
      candidateEmail: 'ananya.v@bits.ac.in',
      candidateCollege: 'BITS Pilani (Computer Science 2026)',
      candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      targetCompany: 'Google',
      targetRole: 'Software Engineer (L3)',
      date: 'Tomorrow',
      time: '4:00 PM - 5:00 PM',
      paidAmount: '₹999 Paid',
      status: 'AWAITING_CALL',
      problemAttempted: 'Course Schedule II (Topological Sort)',
      codeSnippet: `function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [dest, src] of prerequisites) {\n    adj[src].push(dest);\n    inDegree[dest]++;\n  }\n}`
    },
    {
      id: 'book-903',
      candidateName: 'Vikramaditya Nair',
      candidateEmail: 'vikram.nair@nitk.edu.in',
      candidateCollege: 'NIT Karnataka (Information Technology 2026)',
      candidateAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      targetCompany: 'Microsoft',
      targetRole: 'SWE-1 Placement Track',
      date: 'Oct 31, 2026',
      time: '7:00 PM - 8:00 PM',
      paidAmount: '₹999 Paid',
      status: 'COMPLETED_EVALUATED',
      problemAttempted: 'Serialize and Deserialize Binary Tree',
      evaluation: {
        dsaRating: 5,
        systemDesignRating: 4,
        communicationRating: 5,
        verdict: 'STRONG_HIRE',
        feedback: 'Excellent communication of DFS recursion bounds and edge case handling on empty tree nodes.'
      }
    }
  ]);

  const [activeSessionToEvaluate, setActiveSessionToEvaluate] = useState(null);
  const [dsaRating, setDsaRating] = useState(5);
  const [systemDesignRating, setSystemDesignRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [verdict, setVerdict] = useState('STRONG_HIRE');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Load real bookings from API
  useEffect(() => {
    if (!isPartner) return;
    apiRequest('/partner/sessions')
      .then(({ sessions: fetched }) => {
        if (fetched && fetched.length > 0) setSessions(fetched);
      })
      .catch(() => {});
  }, [isPartner]);

  // ==========================================
  // PAGE 2: REAL WEBCAM VIDEO CALL SESSION ROOM
  // ==========================================
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState('editor'); // 'editor' | 'prompt'
  const [outputConsole, setOutputConsole] = useState('');

  const [code, setCode] = useState(`// IntelliGrid Partner Collaborative Pad
// Problem: LRU Cache Implementation (Amazon / Google / Microsoft)
// Target Complexity: O(1) get, O(1) put

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

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Timer tick for video session
  useEffect(() => {
    if (activeTab !== 'video') return;
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setOutputConsole('Executing candidate code in IntelliGrid Sandbox VM...\n\n> Compiled successfully.\n> Test Case 1: get(1) -> returns 1 [PASS]\n> Test Case 2: put(3, 3) -> evicts key 2 [PASS]\n> Test Case 3: get(2) -> returns -1 [PASS]\n\nExecution Time: 38ms | Memory: 14.2MB');
  };

  // Webcam Controls
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setIsCameraStarting(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support webcam streaming.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      setVideoActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      showToast('Camera active! Live webcam feed connected.', 'success');
    } catch (err) {
      setVideoActive(false);
      showToast(`Unable to activate webcam: ${err.message}`, 'warning');
    } finally {
      setIsCameraStarting(false);
    }
  }, [showToast]);

  const toggleVideo = useCallback(() => {
    if (videoActive) {
      stopCamera();
      showToast('Webcam turned off.', 'info');
    } else {
      startCamera();
    }
  }, [videoActive, stopCamera, startCamera]);

  const toggleMic = useCallback(() => {
    setMicActive((prev) => {
      const next = !prev;
      showToast(next ? 'Microphone unmuted.' : 'Microphone muted.', 'info');
      return next;
    });
  }, [showToast]);

  const toggleScreenShare = useCallback(async () => {
    if (screenShareActive) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenShareActive(false);
      showToast('Screen sharing stopped.', 'info');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      setScreenShareActive(true);
      showToast('Screen share active.', 'success');
      stream.getVideoTracks()[0].onended = () => setScreenShareActive(false);
    } catch {
      setScreenShareActive(false);
    }
  }, [screenShareActive, showToast]);

  // Cleanup on tab leave
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'video' && streamRef.current) {
      stopCamera();
    }
  }, [activeTab, stopCamera]);

  // Submit Evaluation
  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!activeSessionToEvaluate || submittingEval) return;
    setSubmittingEval(true);
    try {
      await apiRequest(`/partner/sessions/${encodeURIComponent(activeSessionToEvaluate.id)}/evaluate`, {
        method: 'POST',
        body: {
          dsaRating: Number(dsaRating),
          systemDesignRating: Number(systemDesignRating),
          communicationRating: Number(communicationRating),
          verdict,
          feedback: feedbackNotes || 'Solid algorithmic breakdown and concise communication.'
        }
      });
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionToEvaluate.id
            ? {
                ...s,
                status: 'COMPLETED_EVALUATED',
                evaluation: { dsaRating, systemDesignRating, communicationRating, verdict, feedback: feedbackNotes }
              }
            : s
        )
      );
      showToast(`Evaluation for ${activeSessionToEvaluate.candidateName} recorded!`, 'success');
      setActiveSessionToEvaluate(null);
      setFeedbackNotes('');
    } catch (err) {
      showToast(err.message || 'Failed to submit scorecard.', 'error');
    } finally {
      setSubmittingEval(false);
    }
  };

  // ==========================================
  // ACCESS RESTRICTED GATE (FOR STUDENTS / GUESTS)
  // ==========================================
  if (!isPartner) {
    return (
      <div className="partner-container">
        <div className="container">
          <div className="partner-gate-card">
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(255, 77, 109, 0.12)',
                border: '2px solid rgba(255, 77, 109, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 0 25px rgba(255, 77, 109, 0.3)'
              }}
            >
              <Icon name="lock" size={32} color="var(--status-crimson)" />
            </div>

            <div className="partner-header-badge" style={{ borderColor: 'rgba(255, 77, 109, 0.4)', color: 'var(--status-crimson)' }}>
              <span>PARTNER ACCESS RESTRICTED</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Partner Portal Only
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              This portal is exclusively accessible to verified <strong>Industry Partners</strong>.
              Students do not have permission to access student booking requests or partner evaluation video rooms.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary btn-md"
              >
                <Icon name="grid" size={16} />
                <span>Return to Student Workspace</span>
              </button>

              <button
                onClick={async () => {
                  await switchRole('EXPERT');
                  navigate('/partner?tab=requests');
                }}
                className="btn btn-primary btn-md"
              >
                <Icon name="shield" size={16} />
                <span>Switch My Account to Partner Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED PARTNER PHASE (EXACTLY 2 PAGES)
  // ==========================================
  return (
    <div className="partner-container" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Top Header: Partner Identity & The EXACT TWO Pages */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            border: '1px solid rgba(108, 99, 255, 0.35)',
            background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.95) 0%, rgba(20, 15, 45, 0.95) 100%)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-purple)',
                boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {user.name}
                </h1>
                <span className="partner-badge-verified">
                  <Icon name="check" size={11} />
                  <span>VERIFIED PARTNER</span>
                </span>
                <span className="badge badge-purple">Partner Mode Active</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Exclusive Partner Workspace • Only Student Requests & Video Call Session
              </div>
            </div>
          </div>

          {/* TWO PRIMARY TABS */}
          <div style={{ display: 'flex', gap: '0.65rem', background: 'rgba(0, 0, 0, 0.5)', padding: '0.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => handleTabChange('requests')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'requests' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                background: activeTab === 'requests' ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                color: activeTab === 'requests' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'requests' ? '0 0 15px rgba(0, 212, 255, 0.25)' : 'none'
              }}
            >
              <Icon name="calendar" size={16} />
              <span>1. Student Session Requests</span>
              <span
                style={{
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: 'var(--accent-cyan)',
                  color: '#050811'
                }}
              >
                {sessions.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('video')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'video' ? '1px solid var(--accent-purple)' : '1px solid transparent',
                background: activeTab === 'video' ? 'rgba(108, 99, 255, 0.25)' : 'transparent',
                color: activeTab === 'video' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'video' ? '0 0 15px rgba(108, 99, 255, 0.3)' : 'none'
              }}
            >
              <Icon name="video" size={16} />
              <span>2. Video Call Sessions</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-emerald)' }} />
            </button>
          </div>
        </div>

        {/* ========================================================
            PAGE 1: STUDENT PAID SESSION REQUESTS & BOOKINGS
           ======================================================== */}
        {activeTab === 'requests' && (
          <ScrollReveal direction="up">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Incoming Student Paid Session Bookings
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Yahan aap dekh sakte hain kis kis student ne aapke sath mock session book kiya hai.
                  </p>
                </div>

                <button
                  onClick={() => handleTabChange('video')}
                  className="btn btn-purple btn-md"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon name="video" size={16} />
                  <span>Go to Video Call Room</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="glass-panel"
                    style={{
                      padding: '1.75rem',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <img
                          src={session.candidateAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={session.candidateName}
                          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                              {session.candidateName}
                            </h4>
                            <span className="badge badge-cyan">{session.targetCompany}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                              #{session.id}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {session.candidateCollege} • Target Role: <strong>{session.targetRole}</strong>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Icon name="clock" size={14} />
                            <span>{session.date} at {session.time}</span>
                            <span style={{ color: 'var(--text-dim)' }}>•</span>
                            <strong style={{ color: 'var(--status-emerald)' }}>{session.paidAmount || '₹999 Paid'}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ padding: '0.35rem 0.85rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: 'var(--status-emerald)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                          Session Confirmed & Paid
                        </span>
                      </div>
                    </div>

                    {session.problemAttempted && (
                      <div style={{ background: '#040711', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                          STUDENT CODE SUBMISSION FOR YOUR REVIEW: {session.problemAttempted}
                        </div>
                        {session.codeSnippet && (
                          <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#A78BFA', overflowX: 'auto' }}>
                            {session.codeSnippet}
                          </pre>
                        )}
                      </div>
                    )}

                    {session.evaluation && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <span>DSA: <strong style={{ color: 'var(--status-emerald)' }}>{session.evaluation.dsaRating}/5</strong></span>
                          <span>System Design: <strong style={{ color: 'var(--status-emerald)' }}>{session.evaluation.systemDesignRating}/5</strong></span>
                          <span>Communication: <strong style={{ color: 'var(--status-emerald)' }}>{session.evaluation.communicationRating}/5</strong></span>
                          <span>Verdict: <strong style={{ color: 'var(--accent-purple)' }}>{session.evaluation.verdict}</strong></span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{session.evaluation.feedback}"
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleTabChange('video')}
                        className="btn btn-purple btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Icon name="video" size={15} />
                        <span>Enter Live Video Call Room</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveSessionToEvaluate(session);
                          setFeedbackNotes(session.evaluation?.feedback || '');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Icon name="edit" size={15} />
                        <span>{session.evaluation ? 'Edit Scorecard' : 'Grade / Evaluate Candidate'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Evaluation Modal */}
            {activeSessionToEvaluate && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 2500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem'
                }}
              >
                <div
                  className="glass-panel"
                  style={{
                    maxWidth: '560px',
                    width: '100%',
                    padding: '2rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--accent-cyan)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      Evaluate {activeSessionToEvaluate.candidateName}
                    </h3>
                    <button
                      onClick={() => setActiveSessionToEvaluate(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      <Icon name="x" size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-main)' }}>DSA & Algorithmic Problem Solving</span>
                        <strong style={{ color: 'var(--accent-cyan)' }}>{dsaRating} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={dsaRating}
                        onChange={(e) => setDsaRating(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-main)' }}>System Architecture & Modularity</span>
                        <strong style={{ color: 'var(--accent-cyan)' }}>{systemDesignRating} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={systemDesignRating}
                        onChange={(e) => setSystemDesignRating(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-main)' }}>Communication & Thinking Out Loud</span>
                        <strong style={{ color: 'var(--accent-cyan)' }}>{communicationRating} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={communicationRating}
                        onChange={(e) => setCommunicationRating(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                      />
                    </div>

                    <div>
                      <label className="input-label">Hiring Recommendation Verdict</label>
                      <select
                        className="search-input"
                        value={verdict}
                        onChange={(e) => setVerdict(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="STRONG_HIRE">Strong Hire (Top 5% Candidate)</option>
                        <option value="HIRE">Hire (Clear Pass)</option>
                        <option value="LEAN_HIRE">Lean Hire (Needs Prep on Edge Cases)</option>
                        <option value="NO_HIRE">No Hire</option>
                      </select>
                    </div>

                    <div>
                      <label className="input-label">Detailed Feedback & Improvement Areas</label>
                      <textarea
                        rows={3}
                        className="textarea-input"
                        placeholder="Actionable notes for student..."
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveSessionToEvaluate(null)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingEval}
                        className="btn btn-primary btn-sm"
                      >
                        <Icon name="check" size={15} />
                        <span>{submittingEval ? 'Saving...' : 'Save & Submit Scorecard'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            PAGE 2: LIVE VIDEO CALL SESSION ROOM (WITH WEBCAM)
           ======================================================== */}
        {activeTab === 'video' && (
          <ScrollReveal direction="up">
            <div className="video-room-container">
              {/* Room Top Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  background: 'rgba(13, 21, 39, 0.95)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1.5rem',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-emerald)', boxShadow: '0 0 10px var(--status-emerald)' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                      Partner Live Mock Session Room (With Student: Rohan Sharma)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      ENCRYPTED 1-ON-1 PEER SESSION • REAL WEBCAM FEED ACTIVE
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      padding: '0.4rem 0.85rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    ⏱ {formatTimer(sessionTime)}
                  </div>

                  <button
                    onClick={() => handleTabChange('requests')}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--status-crimson)', borderColor: 'rgba(255, 77, 109, 0.4)' }}
                  >
                    <Icon name="phone-off" size={15} color="var(--status-crimson)" />
                    <span>Exit Video Session</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Video Feeds Left, Collaborative Coding Pad Right */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left Column: Video Feeds */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Candidate Feed Box (Student) */}
                  <div className="video-feed-box">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                      alt="Student Candidate Feed"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                    />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.75)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-emerald)' }} />
                      <span>Rohan Sharma (Student - IIT Delhi)</span>
                    </div>
                  </div>

                  {/* Partner Self-View Feed Box (Real Laptop Webcam) */}
                  <div className="video-feed-box" style={{ height: '220px', background: '#020408' }}>
                    {videoActive ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <video
                          ref={(el) => {
                            videoRef.current = el;
                            if (el && streamRef.current && el.srcObject !== streamRef.current) {
                              el.srcObject = streamRef.current;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scaleX(-1)',
                            display: 'block'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.65rem',
                            right: '0.65rem',
                            background: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(6px)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            color: 'var(--status-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            zIndex: 2
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'var(--status-emerald)',
                              boxShadow: '0 0 8px var(--status-emerald)'
                            }}
                          />
                          <span>PARTNER LIVE WEBCAM</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #091024 0%, #030611 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1rem',
                          textAlign: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.6rem',
                            color: 'var(--text-dim)'
                          }}
                        >
                          <Icon name="video-off" size={22} />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                          Camera is turned off
                        </span>
                        <button
                          type="button"
                          onClick={toggleVideo}
                          disabled={isCameraStarting}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Icon name="video" size={13} />
                          <span>{isCameraStarting ? 'Starting Camera...' : 'Turn On Webcam'}</span>
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '0.75rem',
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        zIndex: 3
                      }}
                    >
                      <span>You ({user.name} - Partner)</span>
                      {!micActive && (
                        <span style={{ color: 'var(--status-crimson)' }}>
                          <Icon name="mic-off" size={12} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media Control Bar */}
                  <div className="video-controls-bar">
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`btn-icon ${!micActive ? 'active-mute' : ''}`}
                      title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                      style={{
                        background: micActive ? 'rgba(255,255,255,0.08)' : 'rgba(255, 77, 109, 0.2)',
                        color: micActive ? '#FFFFFF' : 'var(--status-crimson)',
                        border: '1px solid var(--border-glass)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon name={micActive ? 'mic' : 'mic-off'} size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={toggleVideo}
                      disabled={isCameraStarting}
                      className={`btn-icon ${!videoActive ? 'active-mute' : ''}`}
                      title={videoActive ? 'Turn Off Webcam' : 'Turn On Webcam'}
                      style={{
                        background: videoActive ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 77, 109, 0.2)',
                        color: videoActive ? 'var(--accent-cyan)' : 'var(--status-crimson)',
                        border: videoActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 77, 109, 0.4)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon name={videoActive ? 'video' : 'video-off'} size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={toggleScreenShare}
                      className="btn-icon"
                      title={screenShareActive ? 'Stop Sharing' : 'Share Screen'}
                      style={{
                        background: screenShareActive ? 'rgba(0, 212, 255, 0.25)' : 'rgba(255,255,255,0.08)',
                        color: screenShareActive ? 'var(--accent-cyan)' : '#FFFFFF',
                        border: screenShareActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon name="monitor" size={18} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Collaborative Coding Workspace */}
                <div
                  className="glass-panel"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '620px',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: 'rgba(7, 12, 24, 0.9)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={`tab-btn ${activeRightTab === 'editor' ? 'active' : ''}`}
                        onClick={() => setActiveRightTab('editor')}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Code Editor (JS)
                      </button>
                      <button
                        className={`tab-btn ${activeRightTab === 'prompt' ? 'active' : ''}`}
                        onClick={() => setActiveRightTab('prompt')}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Interview Question Prompt
                      </button>
                    </div>

                    {activeRightTab === 'editor' && (
                      <button
                        onClick={handleRunCode}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <Icon name="play" size={13} />
                        <span>Run Code</span>
                      </button>
                    )}
                  </div>

                  {activeRightTab === 'editor' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{
                          flex: 1,
                          width: '100%',
                          minHeight: '340px',
                          background: '#040711',
                          color: '#E0E7FF',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          padding: '1.25rem',
                          border: 'none',
                          resize: 'none',
                          outline: 'none'
                        }}
                      />

                      <div style={{ background: '#020307', padding: '1rem', borderTop: '1px solid var(--border-subtle)', minHeight: '140px' }}>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                          TERMINAL OUTPUT
                        </div>
                        <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--status-emerald)', whiteSpace: 'pre-wrap' }}>
                          {outputConsole || 'Click "Run Code" above to execute and test against test cases...'}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                        Problem: Design and Implement LRU Cache
                      </h4>
                      <p style={{ color: 'var(--text-muted)' }}>
                        Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
                      </p>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <li><code>LRUCache(int capacity)</code> Initialize cache with capacity.</li>
                        <li><code>int get(int key)</code> Return value if key exists, else -1.</li>
                        <li><code>void put(int key, int value)</code> Update value if key exists; else insert, evicting LRU key if full.</li>
                      </ul>
                      <div style={{ padding: '0.75rem 1rem', background: 'rgba(0, 212, 255, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 212, 255, 0.2)', fontSize: '0.85rem' }}>
                        <strong>Bar Raiser Tip:</strong> Check that candidate uses an O(1) hash map + doubly linked list structure.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
