import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dashboardApi, bookingsApi } from '../services/api';
import { TrackSwitcher } from '../components/dashboard/TrackSwitcher';
import { PracticeTable } from '../components/dashboard/PracticeTable';
import { Heatmap } from '../components/dashboard/Heatmap';
import { BookmarksList } from '../components/dashboard/BookmarksList';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user, updateUser, showToast, isAuthenticated } = useApp();

  // Dashboard state synced with MongoDB
  const [dashboardData, setDashboardData] = useState({
    activeTrack: 'amazon',
    milestones: {},
    challenges: {},
    heatmap: {},
    stats: { totalSolved: 479, streak: 14 }
  });

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for editing academic profile (College, Degree, Grad Year)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editCollege, setEditCollege] = useState(user.college || '');
  const [editDegree, setEditDegree] = useState(user.degree || '');
  const [editGradYear, setEditGradYear] = useState(user.graduationYear || 2026);
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch real-time dashboard data and bookings from MongoDB
  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [dashRes, bookRes] = await Promise.allSettled([
          dashboardApi.get(),
          bookingsApi.list()
        ]);

        if (!active) return;

        if (dashRes.status === 'fulfilled' && dashRes.value?.dashboard) {
          const doc = dashRes.value.dashboard;
          setDashboardData({
            activeTrack: doc.activeTrack || 'amazon',
            milestones: doc.milestones || {},
            challenges: doc.challenges || {},
            heatmap: doc.heatmap || {},
            stats: doc.stats || { totalSolved: 479, streak: 14 }
          });
        }

        if (bookRes.status === 'fulfilled' && Array.isArray(bookRes.value?.bookings)) {
          setUpcomingBookings(
            bookRes.value.bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'Upcoming')
          );
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadDashboard();
    } else {
      setLoading(false);
    }

    return () => { active = false; };
  }, [isAuthenticated]);

  // Sync profile edits with MongoDB
  const handleSaveAcademicProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updates = {
        college: editCollege.trim() || 'University Candidate',
        degree: editDegree.trim() || 'B.Tech / Computer Science',
        graduationYear: Number(editGradYear) || 2026
      };

      const res = await dashboardApi.updateProfile(updates);
      if (res?.user) {
        updateUser(res.user);
      } else {
        updateUser(updates);
      }

      showToast('Academic info saved to MongoDB successfully!', 'success');
      setShowEditProfile(false);
    } catch (err) {
      showToast(err.message || 'Failed to update academic profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handlers for real-time track & milestone state
  const handleTrackChanged = (track) => {
    setDashboardData((prev) => ({ ...prev, activeTrack: track }));
  };

  const handleMilestoneChanged = (milestoneId, status) => {
    setDashboardData((prev) => ({
      ...prev,
      milestones: { ...prev.milestones, [milestoneId]: status }
    }));
  };

  const handleChallengeUpdated = (challengeId, status) => {
    const today = new Date().toISOString().slice(0, 10);
    setDashboardData((prev) => {
      const isSolved = status === 'Solved';
      const todayCount = (prev.heatmap[today] || 0) + (isSolved ? 1 : 0);
      return {
        ...prev,
        challenges: { ...prev.challenges, [challengeId]: status },
        heatmap: isSolved ? { ...prev.heatmap, [today]: todayCount } : prev.heatmap,
        stats: isSolved
          ? { ...prev.stats, totalSolved: prev.stats.totalSolved + 1 }
          : prev.stats
      };
    });
  };

  return (
    <div className="dashboard-page" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Welcome Header Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem 2.5rem',
            borderRadius: 'var(--radius-xl)',
            margin: '2rem 0',
            background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-cyan)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Welcome, {user.name}
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                  CLASS OF {user.graduationYear || '2026'}
                </span>
                <button
                  onClick={() => {
                    setEditCollege(user.college || '');
                    setEditDegree(user.degree || '');
                    setEditGradYear(user.graduationYear || 2026);
                    setShowEditProfile(true);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.55rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                  title="Update College, Degree, or Graduation Year in MongoDB"
                >
                  <Icon name="sparkles" size={12} />
                  <span>Edit Profile</span>
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {user.degree || 'Computer Science & Engineering'} • {user.college || 'Engineering Institute'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/ai-roadmap" className="btn btn-primary btn-sm">
              <Icon name="zap" size={15} />
              <span>Resume AI Roadmap</span>
            </Link>
            <Link to="/mock-interviews" className="btn btn-secondary btn-sm">
              <Icon name="video" size={15} />
              <span>Book Mock Call</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Sections Gap */}
        <div className="dashboard-sections-gap">
          {/* Upcoming Mock Sessions Alert (If Any) */}
          {upcomingBookings.length > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                background: 'rgba(16, 185, 129, 0.05)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--status-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon name="video" size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      Upcoming Mock: {upcomingBookings[0].mentor?.companyName || 'Verified Expert'}
                    </span>
                    <Badge variant="upcoming" size="sm">
                      CONFIRMED
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Session ID: {upcomingBookings[0].id}
                  </div>
                </div>
              </div>

              <Link
                to="/mock-interviews?tab=room"
                className="btn btn-primary btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                <span>Enter Mock Room</span>
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          )}

          {/* Section 1: Target Track Switcher & Metrics (Real-time MongoDB) */}
          <TrackSwitcher
            currentTrackKey={dashboardData.activeTrack}
            onTrackChanged={handleTrackChanged}
            mongoMilestones={dashboardData.milestones}
            onMilestoneChanged={handleMilestoneChanged}
          />

          {/* Section 2: Coding Consistency Heatmap (Real-time MongoDB) */}
          <Heatmap
            dynamicStats={dashboardData.stats}
            dynamicHeatmap={dashboardData.heatmap}
          />

          {/* Section 3: Essential Interview Practice Problems Table (Real-time MongoDB) */}
          <PracticeTable
            filterTrack={dashboardData.activeTrack}
            mongoChallenges={dashboardData.challenges}
            onChallengeUpdated={handleChallengeUpdated}
          />

          {/* Section 4: Bookmarks Manager (Loaded from MongoDB) */}
          <BookmarksList />
        </div>
      </div>

      {/* Edit Profile / Academic Info Modal */}
      {showEditProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-glass)',
              background: 'rgba(10, 16, 32, 0.98)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Academic Details
              </h3>
              <button
                onClick={() => setShowEditProfile(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAcademicProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  COLLEGE / UNIVERSITY
                </label>
                <input
                  type="text"
                  className="art-input"
                  placeholder="e.g. Delhi Technological University"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  DEGREE & BRANCH
                </label>
                <input
                  type="text"
                  className="art-input"
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  value={editDegree}
                  onChange={(e) => setEditDegree(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  GRADUATION YEAR
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  className="art-input"
                  value={editGradYear}
                  onChange={(e) => setEditGradYear(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary btn-sm"
                >
                  {savingProfile ? 'Saving...' : 'Save to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
