import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { apiRequest } from '../services/apiClient';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/partner.css';

export const PartnerPortal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, login, showToast } = useApp();

  const isPartner = isAuthenticated && (user?.role === 'EXPERT' || user?.role === 'ADMIN');

  // ONLY TWO DEDICATED PAGES/TABS: 'sessions' (Student Session Requests) OR 'publish' (Share Experience)
  const activeTab = searchParams.get('tab') === 'publish' ? 'publish' : 'sessions';

  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // Partner data & student sessions state
  const [loading, setLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionToEvaluate, setActiveSessionToEvaluate] = useState(null);

  // Evaluation Form state
  const [dsaRating, setDsaRating] = useState(5);
  const [systemDesignRating, setSystemDesignRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [verdict, setVerdict] = useState('STRONG_HIRE');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Publish Experience Form state
  const [pubCompany, setPubCompany] = useState('Amazon');
  const [pubRole, setPubRole] = useState('SDE-1 (Campus Placement)');
  const [pubYear, setPubYear] = useState(2026);
  const [pubChannel, setPubChannel] = useState('On-Campus');
  const [pubResult, setPubResult] = useState('Selected');
  const [pubDifficulty, setPubDifficulty] = useState(4);
  const [pubComp, setPubComp] = useState('₹32 LPA CTC');
  const [pubAdvice, setPubAdvice] = useState('');
  const [submittingPub, setSubmittingPub] = useState(false);

  // Load partner data & student session requests
  const loadPartnerData = useCallback(async () => {
    if (!isPartner) return;
    setLoading(true);
    try {
      const [{ partner, metrics }, { sessions: fetchedSessions }] = await Promise.all([
        apiRequest('/partner/stats').catch(() => ({
          partner: {
            name: user.name || 'Arjun Mehta',
            companyName: 'Amazon',
            roleTitle: 'Senior Software Engineer & Bar Raiser'
          },
          metrics: { totalMentees: 24, mockSessionsCount: 38 }
        })),
        apiRequest('/partner/sessions').catch(() => ({ sessions: [] }))
      ]);

      setPartnerData({ partner, metrics });
      setSessions(fetchedSessions || []);
    } finally {
      setLoading(false);
    }
  }, [isPartner, user.name]);

  useEffect(() => {
    if (isPartner) {
      loadPartnerData();
    }
  }, [isPartner, loadPartnerData]);

  // Handle Demo Partner instant login
  const handleDemoPartnerLogin = async () => {
    try {
      const { user: partnerUser } = await apiRequest('/auth/demo-partner', { method: 'POST' });
      login(partnerUser);
      showToast('Logged in as Verified Partner (Arjun Mehta - Amazon)!', 'success');
      navigate('/partner?tab=sessions');
    } catch (error) {
      showToast(error.message || 'Unable to log in as partner.', 'error');
    }
  };

  // Handle Evaluation Submit
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
          feedback: feedbackNotes || 'Solid algorithmic breakdown and concise reasoning under time pressure.'
        }
      });

      // Update local state
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionToEvaluate.id
            ? {
                ...s,
                status: 'COMPLETED_EVALUATED',
                evaluation: {
                  dsaRating,
                  systemDesignRating,
                  communicationRating,
                  verdict,
                  feedback: feedbackNotes
                }
              }
            : s
        )
      );

      showToast(`Evaluation for ${activeSessionToEvaluate.candidateName} recorded and sent to student!`, 'success');
      setActiveSessionToEvaluate(null);
      setFeedbackNotes('');
    } catch (err) {
      showToast(err.message || 'Failed to record session evaluation.', 'error');
    } finally {
      setSubmittingEval(false);
    }
  };

  // Handle Verified Experience Publication
  const handlePublishExperience = async (e) => {
    e.preventDefault();
    if (submittingPub) return;
    if (!pubAdvice || pubAdvice.length < 20) {
      showToast('Please provide detailed interview debrief notes (min 20 characters).', 'warning');
      return;
    }

    setSubmittingPub(true);
    try {
      await apiRequest('/partner/experience', {
        method: 'POST',
        body: {
          companyName: pubCompany,
          role: pubRole,
          year: Number(pubYear),
          channel: pubChannel,
          result: pubResult,
          difficulty: Number(pubDifficulty),
          compensation: pubComp,
          prepAdvice: pubAdvice
        }
      });

      showToast(`Verified ${pubCompany} interview debrief published immediately!`, 'success');
      setPubAdvice('');
      handleTabChange('sessions');
    } catch (err) {
      showToast(err.message || 'Failed to publish partner experience.', 'error');
    } finally {
      setSubmittingPub(false);
    }
  };

  // ==========================================
  // VIEW A: ACCESS RESTRICTED GATE (FOR STUDENTS / GUESTS)
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
              This portal is exclusively accessible to verified <strong>Industry Partners & Placement Mentors</strong>.
              Students do not have permission to access student booking requests, candidate evaluation pads, or debrief tools.
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
                onClick={() => navigate('/login?role=partner')}
                className="btn btn-primary btn-md"
              >
                <Icon name="users" size={16} />
                <span>Sign in as Partner</span>
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.85rem' }}>
                Want to test the Partner view right away?
              </span>
              <button
                type="button"
                onClick={handleDemoPartnerLogin}
                className="btn btn-purple btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Icon name="sparkles" size={14} color="#A78BFA" />
                <span>One-Click Fast Demo Partner Login (Arjun Mehta - Amazon)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW B: AUTHENTICATED PARTNER PHASE (EXACTLY 2 PAGES)
  // ==========================================
  const partner = partnerData?.partner || {};
  const pendingRequestsCount = sessions.filter((s) => s.status === 'PENDING_EVALUATION').length;

  return (
    <div className="partner-container">
      <div className="container">
        {/* Top Header: Partner Identity & The TWO Available Pages */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem 2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            border: '1px solid rgba(108, 99, 255, 0.3)',
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
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-purple)',
                boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {user.name}
                </h1>
                <span className="partner-badge-verified">
                  <Icon name="check" size={11} />
                  <span>VERIFIED PARTNER</span>
                </span>
                <span className="badge badge-cyan">{partner.companyName || 'Amazon'}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {partner.roleTitle || 'Senior Software Engineer & Bar Raiser'} • Exclusive Partner Portal
              </div>
            </div>
          </div>

          {/* TWO PRIMARY TABS TOGGLE */}
          <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(0, 0, 0, 0.4)', padding: '0.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => handleTabChange('sessions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'sessions' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                background: activeTab === 'sessions' ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                color: activeTab === 'sessions' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'sessions' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none'
              }}
            >
              <Icon name="video" size={16} />
              <span>Student Session Requests</span>
              <span
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: pendingRequestsCount > 0 ? 'var(--status-crimson)' : 'rgba(0, 212, 255, 0.2)',
                  color: '#FFFFFF'
                }}
              >
                {sessions.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('publish')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: activeTab === 'publish' ? '1px solid var(--accent-purple)' : '1px solid transparent',
                background: activeTab === 'publish' ? 'rgba(108, 99, 255, 0.25)' : 'transparent',
                color: activeTab === 'publish' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'publish' ? '0 0 15px rgba(108, 99, 255, 0.3)' : 'none'
              }}
            >
              <Icon name="plus" size={16} />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            PAGE 1: STUDENT SESSION REQUESTS & EVALUATION DESK
           ======================================================== */}
        {activeTab === 'sessions' && (
          <ScrollReveal direction="up">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Incoming Student Mock Session Requests
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Students request 1-on-1 rounds and submit code solutions for your partner evaluation.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="glass-panel"
                    style={{
                      padding: '1.75rem',
                      borderRadius: 'var(--radius-xl)',
                      border: session.status === 'PENDING_EVALUATION' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)'
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
                        </div>
                      </div>

                      <div>
                        {session.status === 'PENDING_EVALUATION' ? (
                          <span style={{ padding: '0.35rem 0.85rem', background: 'rgba(255, 184, 0, 0.15)', border: '1px solid rgba(255, 184, 0, 0.35)', color: '#FBBF24', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                            Awaiting Evaluation
                          </span>
                        ) : (
                          <span className="partner-badge-verified">
                            <Icon name="check" size={11} />
                            <span>Evaluation Sent ({session.evaluation?.verdict || 'HIRE'})</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {session.problemAttempted && (
                      <div style={{ background: '#040711', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                          PROBLEM ATTEMPTED: {session.problemAttempted}
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
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{session.evaluation.feedback}"
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => navigate('/mock-interviews?tab=room')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Icon name="video" size={14} />
                        <span>Launch Simulation Room</span>
                      </button>

                      {session.status === 'PENDING_EVALUATION' && (
                        <button
                          onClick={() => {
                            setActiveSessionToEvaluate(session);
                            setFeedbackNotes('');
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Icon name="edit" size={14} />
                          <span>Evaluate Candidate & Submit Scorecard</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Scorecard Modal */}
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
                      <label className="input-label">Bar Raiser Hiring Recommendation</label>
                      <select
                        className="search-input"
                        value={verdict}
                        onChange={(e) => setVerdict(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="STRONG_HIRE">Strong Hire (Top 5% Candidate)</option>
                        <option value="HIRE">Hire (Clear Bar Raiser Pass)</option>
                        <option value="LEAN_HIRE">Lean Hire (Borderline - Needs Prep on Edge Cases)</option>
                        <option value="NO_HIRE">No Hire (Does not meet engineering bar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="input-label">Detailed Partner Feedback & Action Plan</label>
                      <textarea
                        rows={3}
                        className="textarea-input"
                        placeholder="Provide actionable feedback on algorithmic optimization, code cleanliness, and vocal clarity..."
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
                        <span>{submittingEval ? 'Saving Scorecard...' : 'Submit Official Scorecard'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            PAGE 2: SHARE INTERVIEW EXPERIENCE & DEBRIEFS
           ======================================================== */}
        {activeTab === 'publish' && (
          <ScrollReveal direction="up">
            <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="partner-badge-verified" style={{ marginBottom: '0.75rem' }}>
                  <Icon name="shield" size={12} />
                  <span>PARTNER INTERVIEW EXPERIENCE PUBLISHER</span>
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  Share Your Verified Interview Experience
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Share your real technical rounds, problem patterns, and Bar Raiser expectations. As a verified Partner, your experience is published immediately to the platform with an official Partner Verified seal.
                </p>
              </div>

              <form onSubmit={handlePublishExperience} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label className="input-label">Company Name</label>
                    <input
                      type="text"
                      className="search-input"
                      value={pubCompany}
                      onChange={(e) => setPubCompany(e.target.value)}
                      placeholder="e.g. Amazon, Google, Microsoft"
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label">Target Role</label>
                    <input
                      type="text"
                      className="search-input"
                      value={pubRole}
                      onChange={(e) => setPubRole(e.target.value)}
                      placeholder="e.g. SDE-1 (Campus Hire)"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label className="input-label">Year of Placement</label>
                    <input
                      type="number"
                      className="search-input"
                      value={pubYear}
                      onChange={(e) => setPubYear(e.target.value)}
                      min={2020}
                      max={2027}
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label">Hiring Channel</label>
                    <select
                      className="search-input"
                      value={pubChannel}
                      onChange={(e) => setPubChannel(e.target.value)}
                    >
                      <option value="On-Campus">On-Campus Drive</option>
                      <option value="Off-Campus">Off-Campus Drive</option>
                      <option value="Referral">Employee Referral</option>
                      <option value="Career Portal">Career Portal</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Compensation CTC</label>
                    <input
                      type="text"
                      className="search-input"
                      value={pubComp}
                      onChange={(e) => setPubComp(e.target.value)}
                      placeholder="e.g. ₹32 LPA CTC"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Detailed Round-by-Round Breakdown & Questions Asked</label>
                  <textarea
                    rows={7}
                    className="textarea-input"
                    placeholder="Document each round in detail:
• Round 1: OA (Hackerrank / Codility) - 2 questions on Trees & Dynamic Programming.
• Round 2: Problem Solving - LRU Cache, Binary Tree boundary traversal.
• Round 3: Low-Level System Design & Modularity.
• Round 4: Bar Raiser & Amazon Leadership Principles (Customer Obsession & Bias for Action)."
                    value={pubAdvice}
                    onChange={(e) => setPubAdvice(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="submit"
                    disabled={submittingPub}
                    className="btn btn-primary btn-lg"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Icon name="check" size={18} />
                    <span>{submittingPub ? 'Publishing Debrief...' : 'Publish Experience to Live Feed'}</span>
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
