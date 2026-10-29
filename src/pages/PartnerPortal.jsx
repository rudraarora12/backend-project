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

  // Active tab in partner portal
  const activeTab = searchParams.get('tab') || 'overview'; // 'overview' | 'sessions' | 'publish' | 'contributions'

  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // Partner data states
  const [loading, setLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionToEvaluate, setActiveSessionToEvaluate] = useState(null);

  // Settings states
  const [isAvailable, setIsAvailable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(999);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Evaluation Form state
  const [dsaRating, setDsaRating] = useState(5);
  const [systemDesignRating, setSystemDesignRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [verdict, setVerdict] = useState('STRONG_HIRE');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Publish Form state
  const [pubCompany, setPubCompany] = useState('Amazon');
  const [pubRole, setPubRole] = useState('SDE-1 (Campus Placement)');
  const [pubYear, setPubYear] = useState(2026);
  const [pubChannel, setPubChannel] = useState('On-Campus');
  const [pubResult, setPubResult] = useState('Selected');
  const [pubDifficulty, setPubDifficulty] = useState(4);
  const [pubComp, setPubComp] = useState('₹32 LPA CTC');
  const [pubAdvice, setPubAdvice] = useState('');
  const [submittingPub, setSubmittingPub] = useState(false);

  // Load partner stats & sessions
  const loadPartnerStats = useCallback(async () => {
    if (!isPartner) return;
    setLoading(true);
    try {
      const { partner, metrics } = await apiRequest('/partner/stats');
      setPartnerData({ partner, metrics });
      if (partner?.hourlyRate) setHourlyRate(partner.hourlyRate);
      setIsAvailable(partner?.availabilityStatus === 'AVAILABLE');
    } catch (err) {
      console.warn('Using baseline partner metrics:', err.message);
      // Fallback partner dataset
      setPartnerData({
        partner: {
          name: user.name || 'Arjun Mehta',
          companyName: 'Amazon',
          roleTitle: 'Senior Software Engineer & Bar Raiser',
          hourlyRate: 999,
          availabilityStatus: 'AVAILABLE',
          topics: ['Amazon SDE Rounds', 'Distributed Systems', 'STAR Behavioral', 'Live Coding Practice']
        },
        metrics: {
          totalMentees: 24,
          mockSessionsCount: 38,
          verifiedExperiencesCount: 6,
          averageRating: 4.94,
          totalEarnings: 37962
        }
      });
    } finally {
      setLoading(false);
    }
  }, [isPartner, user.name]);

  const loadPartnerSessions = useCallback(async () => {
    if (!isPartner) return;
    try {
      const { sessions: fetchedSessions } = await apiRequest('/partner/sessions');
      setSessions(fetchedSessions || []);
    } catch {
      // Handled gracefully with fallback data in backend/partner.js
    }
  }, [isPartner]);

  useEffect(() => {
    if (isPartner) {
      loadPartnerStats();
      loadPartnerSessions();
    }
  }, [isPartner, loadPartnerStats, loadPartnerSessions]);

  // Handle Demo Partner instant login
  const handleDemoPartnerLogin = async () => {
    try {
      const { user: partnerUser } = await apiRequest('/auth/demo-partner', { method: 'POST' });
      login(partnerUser);
      showToast('Logged in as Verified Partner (Arjun Mehta - Amazon)!', 'success');
      navigate('/partner');
    } catch (error) {
      showToast(error.message || 'Unable to log in as partner.', 'error');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await apiRequest('/partner/settings', {
        method: 'PATCH',
        body: {
          hourlyRate: Number(hourlyRate),
          availabilityStatus: isAvailable ? 'AVAILABLE' : 'AWAY'
        }
      });
      showToast('Partner settings & hourly rate saved!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update partner settings.', 'error');
    } finally {
      setIsSavingSettings(false);
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

      showToast(`Evaluation for ${activeSessionToEvaluate.candidateName} submitted successfully!`, 'success');
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
      handleTabChange('overview');
      loadPartnerStats();
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
              <span>PARTNER PHASE ACCESS RESTRICTED</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Partner & Mentor Phase Only
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              This portal is exclusively accessible to verified <strong>Industry Partners, Mentors, and Placement Contributors</strong>.
              Students do not have permission to access candidate evaluation pads, grading scorecards, or partner honorarium settings.
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
                Want to test the Partner Phase right away?
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
  // VIEW B: AUTHENTICATED PARTNER PHASE
  // ==========================================
  const partner = partnerData?.partner || {};
  const metrics = partnerData?.metrics || {};

  return (
    <div className="partner-container">
      <div className="container">
        {/* Top Header Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-purple)',
                boxShadow: '0 0 25px rgba(108, 99, 255, 0.4)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {user.name}
                </h1>
                <span className="partner-badge-verified">
                  <Icon name="check" size={12} />
                  <span>VERIFIED PARTNER</span>
                </span>
                <span className="badge badge-cyan">{partner.companyName || 'Amazon'}</span>
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {partner.roleTitle || 'Senior Software Engineer & Bar Raiser'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                <span style={{ color: isAvailable ? 'var(--status-emerald)' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isAvailable ? 'var(--status-emerald)' : '#F59E0B' }} />
                  <strong>{isAvailable ? 'Accepting Candidate Mocks' : 'Status: On Break'}</strong>
                </span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span style={{ color: 'var(--accent-cyan)' }}>
                  Rate: <strong>₹{hourlyRate} / mock session</strong>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleTabChange('publish')}
              className="btn btn-primary btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon name="plus" size={16} />
              <span>Post Verified Debrief</span>
            </button>
            <button
              onClick={() => handleTabChange('sessions')}
              className="btn btn-purple btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon name="edit" size={16} />
              <span>Candidate Desk ({sessions.filter((s) => s.status === 'PENDING_EVALUATION').length})</span>
            </button>
          </div>
        </div>

        {/* Four Partner Metrics Cards */}
        <div className="partner-metrics-grid">
          <div className="partner-metric-card">
            <div className="partner-metric-icon" style={{ background: 'rgba(0, 212, 255, 0.15)', color: 'var(--accent-cyan)' }}>
              <Icon name="users" size={20} />
            </div>
            <div className="partner-metric-value">{metrics.totalMentees || 24}</div>
            <div className="partner-metric-label">Mentees Mentored</div>
          </div>

          <div className="partner-metric-card">
            <div className="partner-metric-icon" style={{ background: 'rgba(108, 99, 255, 0.15)', color: 'var(--accent-purple)' }}>
              <Icon name="video" size={20} />
            </div>
            <div className="partner-metric-value">{metrics.mockSessionsCount || 38}</div>
            <div className="partner-metric-label">Mock Sessions Completed</div>
          </div>

          <div className="partner-metric-card">
            <div className="partner-metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-emerald)' }}>
              <Icon name="file-text" size={20} />
            </div>
            <div className="partner-metric-value">{metrics.verifiedExperiencesCount || 6}</div>
            <div className="partner-metric-label">Verified Debriefs Published</div>
          </div>

          <div className="partner-metric-card">
            <div className="partner-metric-icon" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700' }}>
              <Icon name="star" size={20} />
            </div>
            <div className="partner-metric-value">
              {metrics.averageRating || 4.94} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
            </div>
            <div className="partner-metric-label">Mentee Feedback Rating</div>
          </div>
        </div>

        {/* Partner Navigation Tabs */}
        <div className="partner-tabs-nav">
          <button
            className={`partner-tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <Icon name="grid" size={16} />
            <span>Partner Command Desk</span>
          </button>

          <button
            className={`partner-tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => handleTabChange('sessions')}
          >
            <Icon name="video" size={16} />
            <span>Candidate Evaluation Desk</span>
            <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(0, 212, 255, 0.2)', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              {sessions.length}
            </span>
          </button>

          <button
            className={`partner-tab-button ${activeTab === 'publish' ? 'active' : ''}`}
            onClick={() => handleTabChange('publish')}
          >
            <Icon name="plus" size={16} />
            <span>Publish Verified Debrief</span>
          </button>

          <button
            className={`partner-tab-button ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => handleTabChange('contributions')}
          >
            <Icon name="bookmark" size={16} />
            <span>My Verified Intel</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: COMMAND DESK & SETTINGS
           ======================================================== */}
        {activeTab === 'overview' && (
          <ScrollReveal direction="up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              {/* Left: Availability & Pricing Controls */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon name="settings" size={18} color="var(--accent-cyan)" />
                  <span>Availability & Fee Configuration</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Status Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>Accepting Mock Bookings</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Students can discover and book 1-on-1 rounds with you.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className="btn btn-sm"
                      style={{
                        background: isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 77, 109, 0.2)',
                        color: isAvailable ? 'var(--status-emerald)' : 'var(--status-crimson)',
                        borderColor: isAvailable ? 'var(--status-emerald)' : 'var(--status-crimson)'
                      }}
                    >
                      {isAvailable ? '🟢 Online' : '⏸ Paused'}
                    </button>
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="input-label">Mock Interview Session Rate (INR)</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>₹</span>
                      <input
                        type="number"
                        className="search-input"
                        style={{ maxWidth: '180px' }}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        min={0}
                        max={10000}
                        step={100}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 60 min session</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="btn btn-primary btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>

              {/* Right: Partner Honorarium & Topics */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon name="sparkles" size={18} color="var(--accent-purple)" />
                  <span>Partner Honorarium & Topics</span>
                </h3>

                <div style={{ background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Accrued Mentorship Honorarium
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                    ₹{(metrics.totalEarnings || 37962).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Processed automatically to your registered payout account at end of month.
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                    Your Verified Evaluation Topics
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(partner.topics || ['Amazon SDE Rounds', 'Distributed Systems', 'STAR Behavioral', 'Live Coding Practice']).map((t, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(0, 212, 255, 0.08)',
                          border: '1px solid rgba(0, 212, 255, 0.25)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          color: 'var(--accent-cyan)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 2: CANDIDATE EVALUATION DESK
           ======================================================== */}
        {activeTab === 'sessions' && (
          <ScrollReveal direction="up">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Candidate Mock Interview Submissions
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Review code, assess algorithmic depth, and submit official verified debrief scorecards for student mentees.
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
                            {session.candidateCollege} • Target: <strong>{session.targetRole}</strong>
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
                            <span>Evaluation Recorded ({session.evaluation?.verdict || 'HIRE'})</span>
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
            TAB 3: PUBLISH VERIFIED COMPANY DEBRIEF
           ======================================================== */}
        {activeTab === 'publish' && (
          <ScrollReveal direction="up">
            <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="partner-badge-verified" style={{ marginBottom: '0.75rem' }}>
                  <Icon name="shield" size={12} />
                  <span>EXCLUSIVE PARTNER PUBLISHING PRIVILEGE</span>
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  Publish Verified Company Interview Debrief
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  As an accredited Industry Partner, your contributed round structures and interview questions bypass the student moderation queue and are published immediately with an official Partner Verified seal.
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
                  <label className="input-label">Detailed Round-by-Round Breakdown & Bar Raiser Intel</label>
                  <textarea
                    rows={6}
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
                    <span>{submittingPub ? 'Publishing Intel...' : 'Publish Verified Debrief to Live Feed'}</span>
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 4: MY VERIFIED CONTRIBUTIONS
           ======================================================== */}
        {activeTab === 'contributions' && (
          <ScrollReveal direction="up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        Amazon SDE-1 Comprehensive On-Campus Loop Breakdown
                      </h4>
                      <span className="partner-badge-verified">Verified Partner Intel</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Published by {user.name} • 2026 Campus Placement Cycle • ₹32 LPA CTC
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <span>👁 1,420 views</span>
                    <span>👍 189 helpful votes</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Focus on Amazon's 16 Leadership Principles in depth. Every technical answer must be backed by concrete metrics and trade-off analysis. Make sure to vocalize edge cases on LRU cache eviction and cycle detection in directed graphs.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        Google Software Engineer (L3) Algorithmic Bar Standards
                      </h4>
                      <span className="partner-badge-verified">Verified Partner Intel</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Published by {user.name} • Google SWE 2026 • ₹42 LPA CTC
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <span>👁 980 views</span>
                    <span>👍 142 helpful votes</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Google interviewers strictly expect clean, modular code on first attempt without syntax errors. Practice writing algorithms on blank pads without IDE auto-completion.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
