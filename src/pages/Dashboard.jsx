import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TrackSwitcher } from '../components/dashboard/TrackSwitcher';
import { PracticeTable } from '../components/dashboard/PracticeTable';
import { Heatmap } from '../components/dashboard/Heatmap';
import { BookmarksList } from '../components/dashboard/BookmarksList';
import { getBookings } from '../services/connectService';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user } = useApp();
  const bookings = getBookings();
  const upcomingBookings = bookings.filter((b) => b.status === 'Upcoming');

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
              src={user.avatar}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Welcome, {user.name}
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                  CLASS OF {user.graduationYear}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {user.degree} • {user.college}
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
                      Upcoming Mock: {upcomingBookings[0].candidateName} ({upcomingBookings[0].company})
                    </span>
                    <Badge variant="upcoming" size="sm">
                      {upcomingBookings[0].status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Slot: {upcomingBookings[0].date} at {upcomingBookings[0].time} • Ref: {upcomingBookings[0].id}
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

          {/* Section 1: Target Track Switcher & Metrics */}
          <TrackSwitcher />

          {/* Section 2: Coding Consistency Heatmap */}
          <Heatmap />

          {/* Section 3: Essential Interview Practice Problems Table */}
          <PracticeTable />

          {/* Section 4: Bookmarks Manager */}
          <BookmarksList />
        </div>
      </div>
    </div>
  );
};
