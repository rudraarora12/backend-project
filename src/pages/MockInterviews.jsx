import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllMentors } from '../services/connectService';
import { apiRequest } from '../services/apiClient';
import { InterviewerCard } from '../components/connect/InterviewerCard';
import { BookingModal } from '../components/connect/BookingModal';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { useApp } from '../context/AppContext';
import '../styles/connect.css';

export const MockInterviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useApp();

  const currentTab = searchParams.get('tab') || 'mentors'; // 'mentors' | 'bookings' | 'room'
  const mentorIdParam = searchParams.get('mentor');

  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    if (newTab !== 'mentors') newParams.delete('mentor');
    setSearchParams(newParams);
  };

  // ==========================================
  // TAB 1: MENTOR DIRECTORY & PROFILES
  // ==========================================
  const [mentors, setMentors] = useState(getAllMentors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [activeMentorToBook, setActiveMentorToBook] = useState(null);
  const [detailedMentor, setDetailedMentor] = useState(null);

  const companies = ['All', 'Amazon', 'Google', 'Microsoft', 'Goldman Sachs', 'Uber', 'D. E. Shaw'];

  useEffect(() => {
    let active = true;
    apiRequest('/experts')
      .then(({ experts }) => {
        if (!active) return;
        setMentors(experts.map((expert) => ({
          id: expert.id,
          name: expert.name,
          company: expert.companyName,
          companySlug: expert.companySlug,
          role: expert.roleTitle,
          avatar: expert.avatar,
          bio: expert.biography,
          topics: expert.topics,
          hourlyRate: expert.price,
          currency: expert.currency,
          interviewResult: 'Verified expert',
          rating: null,
          reviewCount: expert.reviewCount,
          isDemo: false
        })));
      })
      .catch((error) => {
        if (active) showToast(`Live expert directory unavailable: ${error.message}`, 'warning');
      });
    return () => { active = false; };
  }, [showToast]);

  // Check if mentor parameter in URL
  useEffect(() => {
    if (mentorIdParam) {
      const m = mentors.find((mentor) => String(mentor.id) === String(mentorIdParam));
      if (m) setDetailedMentor(m);
      else setDetailedMentor(null);
    } else {
      setDetailedMentor(null);
    }
  }, [mentorIdParam, mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      const matchesCompany = selectedCompany === 'All' || m.company.toLowerCase() === selectedCompany.toLowerCase();
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        m.name.toLowerCase().includes(term) ||
        m.company.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        m.topics.some((t) => t.toLowerCase().includes(term));

      return matchesCompany && matchesSearch;
    });
  }, [mentors, selectedCompany, searchQuery]);

  // ==========================================
  // TAB 2: MY BOOKINGS STATE
  // ==========================================
  const [bookings, setBookings] = useState([]);
  const refreshBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setBookings([]);
      return;
    }
    try {
      const { bookings: records } = await apiRequest('/bookings');
      setBookings(records.map((booking) => {
        const startsAt = new Date(booking.startsAt);
        const endsAt = new Date(booking.endsAt);
        return {
          ...booking,
          candidateName: booking.mentor.user?.name || 'Expert',
          candidateAvatar: booking.mentor.user?.avatar,
          company: booking.mentor.companyName,
          role: booking.mentor.roleTitle,
          date: startsAt.toLocaleDateString(),
          time: startsAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: booking.timeZone }),
          duration: `${Math.round((endsAt - startsAt) / 60000)} minutes`,
          price: booking.price,
          status: booking.status === 'COMPLETED'
            ? 'Completed'
            : booking.status === 'CANCELLED'
              ? 'Cancelled'
              : startsAt > new Date() ? 'Upcoming' : 'Awaiting Completion'
        };
      }));
    } catch (error) {
      setBookings([]);
      showToast(error.message || 'Unable to load your bookings.', 'error');
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => { void refreshBookings(); }, [refreshBookings]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'Upcoming');
  }, [bookings]);

  const completedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'Completed');
  }, [bookings]);

  // ==========================================
  // TAB 3: SIMULATED VIDEO ROOM STATE & WEBCAM
  // ==========================================
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Stop camera stream safely
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

  // Request native webcam access
  const startCamera = useCallback(async () => {
    setIsCameraStarting(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support mediaDevices API.');
      }

      // Prompt browser native camera permission popup
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false // mute local feed to avoid speaker audio loops
      });

      streamRef.current = stream;
      setVideoActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      showToast('Camera active! Live webcam feed connected.', 'success');
    } catch (err) {
      console.error('Camera access error:', err);
      setVideoActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        showToast('Camera permission was blocked. Please allow camera access in your browser address bar.', 'warning');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        showToast('No camera device detected on this system.', 'warning');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        showToast('Camera is currently in use by another application.', 'warning');
      } else {
        showToast(`Unable to activate webcam: ${err.message}`, 'error');
      }
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
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenShareActive(false);
      showToast('Screen sharing stopped.', 'info');
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        showToast('Screen sharing is not supported by your browser.', 'warning');
        return;
      }
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      setScreenShareActive(true);
      showToast('Screen sharing active.', 'success');

      screenStream.getVideoTracks()[0].onended = () => {
        setScreenShareActive(false);
        screenStreamRef.current = null;
      };
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        showToast(`Screen share failed: ${err.message}`, 'warning');
      }
    }
  }, [screenShareActive, showToast]);

  // Clean up streams on tab switch or unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentTab !== 'room') {
      stopCamera();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenShareActive(false);
    }
  }, [currentTab, stopCamera]);

  const [activeRightTab, setActiveRightTab] = useState('editor'); // 'editor' | 'prompt'
  const [code, setCode] = useState(`// IntelliGrid Collaborative Coding Pad
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
  const [outputConsole, setOutputConsole] = useState('');
  const [showDebriefModal, setShowDebriefModal] = useState(false);

  // Debrief ratings
  const [dsaRating, setDsaRating] = useState(4);
  const [codeQualityRating, setCodeQualityRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [debriefNotes, setDebriefNotes] = useState('Strong algorithmic explanation and solid edge case handling on cache size evictions.');

  // Timer tick for video session
  useEffect(() => {
    if (currentTab !== 'room') return;
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTab]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setOutputConsole('Executing in IntelliGrid Sandbox VM...\n\n> Compiled successfully.\n> Test Case 1: get(1) -> returns 1 [PASS]\n> Test Case 2: put(3, 3) -> evicts key 2 [PASS]\n> Test Case 3: get(2) -> returns -1 [PASS]\n\nExecution Time: 42ms | Memory: 14.8MB');
  };

  const handleSaveDebrief = async () => {
    const bookingToReview = completedBookings[0];
    if (!bookingToReview) {
      showToast('A server-confirmed completed booking is required to submit a review.', 'warning');
      return;
    }
    try {
      const rating = Math.round((dsaRating + codeQualityRating + communicationRating) / 3);
      await apiRequest(`/bookings/${encodeURIComponent(bookingToReview.id)}/review`, {
        method: 'POST',
        body: { rating, comment: debriefNotes }
      });
      showToast('Review saved to your completed booking.', 'success');
      setShowDebriefModal(false);
      await refreshBookings();
      handleTabChange('bookings');
    } catch (error) {
      showToast(error.message || 'Unable to submit the session review.', 'error');
    }
  };

  return (
    <div className="mock-interviews-page" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '1.75rem' }}>
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>1-on-1 Practice & Video Mocks</span>
          </div>
          <h1 className="page-title">
            Peer & Mentor Mock Interviews
          </h1>
          <p className="page-subtitle">
            Sample profiles are illustrative only. Real booking becomes available when verified experts publish availability in the configured backend.
          </p>
        </div>

        {/* Primary Section Tabs */}
        <div className="prep-nav-tabs" style={{ marginBottom: '2rem' }}>
          <button
            className={`prep-tab-btn ${currentTab === 'mentors' ? 'active' : ''}`}
            onClick={() => handleTabChange('mentors')}
          >
            <Icon name="users" size={17} />
            <span>Find a Mentor</span>
            <span className="prep-tab-count">{mentors.length}</span>
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            <Icon name="calendar" size={17} />
            <span>My Bookings</span>
            <span className="prep-tab-count">{upcomingBookings.length}</span>
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'room' ? 'active' : ''}`}
            onClick={() => handleTabChange('room')}
            style={{ marginLeft: 'auto' }}
          >
            <Icon name="video" size={17} color={currentTab === 'room' ? 'var(--accent-cyan)' : 'var(--accent-purple)'} />
            <span>Simulated Video Room</span>
            <span className="prep-tab-count" style={{ background: 'rgba(108, 99, 255, 0.25)', color: '#A78BFA' }}>
              DEMO
            </span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: FIND A MENTOR & DIRECTORY
           ======================================================== */}
        {currentTab === 'mentors' && (
          <ScrollReveal direction="up">
            {/* If detailed mentor view is active */}
            {detailedMentor ? (
              <div className="detailed-mentor-view">
                <button
                  className="back-link-btn"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('mentor');
                    setSearchParams(newParams);
                  }}
                >
                  <Icon name="arrow-left" size={15} />
                  <span>Back to all mentors</span>
                </button>

                <div
                  className="glass-panel"
                  style={{
                    padding: '2.5rem',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <img
                      src={detailedMentor.avatar}
                      alt={detailedMentor.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--accent-cyan)',
                        boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)'
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                          {detailedMentor.name}
                        </h2>
                        <span className="badge badge-cyan">
                          {detailedMentor.company}
                        </span>
                        <Badge variant={detailedMentor.isDemo ? 'purple' : 'selected'} size="sm">
                          {detailedMentor.isDemo ? 'Sample profile' : detailedMentor.interviewResult}
                        </Badge>
                      </div>

                      <div style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {detailedMentor.role}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {detailedMentor.isDemo ? (
                          <span>Sample details only; no verified reviews, rates, or availability.</span>
                        ) : (
                          <>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Icon name="star" size={14} color="#FFD700" />
                              <strong style={{ color: '#FFFFFF' }}>{detailedMentor.rating?.toFixed(2) || 'New'}</strong> ({detailedMentor.reviewCount} reviews)
                            </span>
                            <span>•</span>
                            <span>Rate: <strong style={{ color: 'var(--status-emerald)' }}>{detailedMentor.hourlyRate == null ? 'Not set' : `₹${detailedMentor.hourlyRate} / session`}</strong></span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveMentorToBook(detailedMentor)}
                      disabled={detailedMentor.isDemo}
                      title={detailedMentor.isDemo ? 'Sample profiles cannot be booked.' : 'Book an available session'}
                      className="btn btn-primary btn-lg"
                    >
                      <Icon name="calendar" size={18} />
                      <span>{detailedMentor.isDemo ? 'Sample Only' : 'Book Mock Interview'}</span>
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      About & Placement Background
                    </h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {detailedMentor.bio}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                      Topics & Mock Interview Focus Areas
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {detailedMentor.topics.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '0.4rem 0.85rem',
                            background: 'rgba(0, 212, 255, 0.08)',
                            border: '1px solid rgba(0, 212, 255, 0.25)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
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
            ) : (
              /* Mentors Grid View */
              <div>
                {/* Search & Company Filter Controls */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                      <Icon name="search" size={17} />
                    </div>
                    <input
                      type="text"
                      className="search-input"
                      style={{ paddingLeft: '2.75rem', width: '100%' }}
                      placeholder="Search mentor by name, company, or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="filter-tabs" style={{ margin: 0 }}>
                    {companies.map((c) => (
                      <button
                        key={c}
                        className={`tab-btn ${selectedCompany === c ? 'active' : ''}`}
                        onClick={() => setSelectedCompany(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mentors Grid */}
                <div className="grid-cards">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor.id}>
                      <InterviewerCard
                        interviewer={mentor}
                        onBook={() => setActiveMentorToBook(mentor)}
                      />
                    </div>
                  ))}
                </div>

                {filteredMentors.length === 0 && (
                  <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <Icon name="users" size={36} color="var(--text-dim)" />
                    <h3 style={{ color: '#FFFFFF', marginTop: '1rem' }}>No verified experts available</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Only active experts with verified profiles are listed. Sample profiles cannot be booked.</p>
                  </div>
                )}
              </div>
            )}

            {/* Booking Modal */}
            {activeMentorToBook && (
              <BookingModal
                interviewer={activeMentorToBook}
                onClose={() => {
                  setActiveMentorToBook(null);
                  refreshBookings();
                }}
              />
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 2: MY BOOKINGS
           ======================================================== */}
        {currentTab === 'bookings' && (
          <ScrollReveal direction="up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Upcoming Bookings */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon name="calendar" size={18} color="var(--accent-cyan)" />
                  <span>Upcoming Mock Sessions ({upcomingBookings.length})</span>
                </h3>

                {upcomingBookings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {upcomingBookings.map((b) => (
                      <div
                        key={b.id}
                        className="glass-panel"
                        style={{
                          padding: '1.5rem',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1.5rem',
                          border: '1px solid rgba(0, 212, 255, 0.25)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <img
                            src={b.candidateAvatar}
                            alt={b.candidateName}
                            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                                {b.candidateName}
                              </h4>
                              <span className="badge badge-cyan">{b.company}</span>
                              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                                #{b.id}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {b.role} • {b.duration}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Icon name="clock" size={14} />
                              <span>{b.date} at {b.time}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <button
                            onClick={() => handleTabChange('room')}
                            className="btn btn-purple btn-md"
                          >
                            <Icon name="video" size={16} />
                            <span>Join Video Room</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You have no upcoming mock interview sessions scheduled.</p>
                    <button onClick={() => handleTabChange('mentors')} className="btn btn-primary btn-sm">
                      Browse Mentors & Book
                    </button>
                  </div>
                )}
              </div>

              {/* Completed Bookings */}
              {completedBookings.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Completed Sessions & Debriefs ({completedBookings.length})
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {completedBookings.map((b) => (
                      <div
                        key={b.id}
                        className="glass-panel"
                        style={{
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={b.candidateAvatar}
                            alt={b.candidateName}
                            style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                              {b.candidateName} ({b.company})
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                              Completed on {b.date} • Reference {b.id}
                            </div>
                          </div>
                        </div>

                        <Badge variant="selected" size="sm">
                          Completed & Debriefed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 3: SIMULATED VIDEO INTERVIEW ROOM
           ======================================================== */}
        {currentTab === 'room' && (
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
                  background: 'rgba(13, 21, 39, 0.9)',
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
                      Live Mock Session Room (Demo Simulation)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      ENCRYPTED P2P SIMULATION • 1080P 60FPS
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
                    onClick={() => setShowDebriefModal(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--status-crimson)', borderColor: 'rgba(255, 77, 109, 0.4)' }}
                  >
                    <Icon name="phone-off" size={15} color="var(--status-crimson)" />
                    <span>End Session & Debrief</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Video Feeds on Left, Code Editor on Right */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left: Video Feeds Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Peer Mentor Box */}
                  <div className="video-feed-box">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                      alt="Interviewer Feed"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-emerald)' }} />
                      <span>Arjun Mehta (Interviewer - Amazon)</span>
                    </div>
                  </div>

                  {/* Student Box */}
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
                          <span>LIVE WEBCAM</span>
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
                          <span>{isCameraStarting ? 'Requesting Permission...' : 'Turn On Webcam'}</span>
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
                      <span>You ({user.name})</span>
                      {!micActive && (
                        <span style={{ color: 'var(--status-crimson)', display: 'inline-flex', alignItems: 'center' }} title="Microphone Muted">
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
                      title={videoActive ? 'Turn Off Webcam' : 'Turn On Webcam (Browser Permission)'}
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

                {/* Right: Collaborative Coding Workspace */}
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
                  {/* Workspace Tabs Header */}
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

                  {/* Tab Body */}
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

                      {/* Console Output */}
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
                        Problem: Design and Implement LRU (Least Recently Used) Cache
                      </h4>
                      <p style={{ color: 'var(--text-muted)' }}>
                        Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
                      </p>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <li><code>LRUCache(int capacity)</code> Initialize the LRU cache with positive size capacity.</li>
                        <li><code>int get(int key)</code> Return the value of the key if the key exists, otherwise return -1.</li>
                        <li><code>void put(int key, int value)</code> Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.</li>
                      </ul>
                      <div style={{ padding: '0.75rem 1rem', background: 'rgba(0, 212, 255, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 212, 255, 0.2)', fontSize: '0.85rem' }}>
                        <strong>Constraint:</strong> The functions <code>get</code> and <code>put</code> must each run in <code>O(1)</code> average time complexity.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Debrief Rating Modal */}
              {showDebriefModal && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem'
                  }}
                >
                  <div
                    className="glass-panel"
                    style={{
                      maxWidth: '520px',
                      width: '100%',
                      padding: '2rem',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-glass)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      Session Rating & Debrief Scorecard
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Log structured peer performance evaluation to complete this mock interview record.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
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
                          <span style={{ color: 'var(--text-main)' }}>Code Cleanliness & Modular Structure</span>
                          <strong style={{ color: 'var(--accent-cyan)' }}>{codeQualityRating} / 5</strong>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={codeQualityRating}
                          onChange={(e) => setCodeQualityRating(Number(e.target.value))}
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
                        <label className="input-label">Detailed Mentor / Peer Feedback Notes</label>
                        <textarea
                          rows={3}
                          className="textarea-input"
                          value={debriefNotes}
                          onChange={(e) => setDebriefNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => setShowDebriefModal(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDebrief}
                        className="btn btn-primary btn-sm"
                      >
                        <Icon name="check" size={15} />
                        <span>Save Scorecard & Finish</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
