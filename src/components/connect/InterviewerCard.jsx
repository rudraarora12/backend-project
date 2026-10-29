import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { CardTilt } from '../effects/CardTilt';

export const InterviewerCard = ({ mentor, interviewer, onBookClick, onBook }) => {
  const mentorData = mentor || interviewer;
  const handleBook = onBookClick || onBook;

  if (!mentorData) return null;

  return (
    <CardTilt maxTilt={6} scale={1.015}>
      <div
        className="glass-panel glass-panel-hover"
        style={{
          padding: '1.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Mentor Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img
              src={mentorData.avatar}
              alt={mentorData.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent-cyan)',
                boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)'
              }}
            />
            <div>
              <Link
                to={`/mock-interviews?tab=mentors&mentor=${mentorData.id}`}
                style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              >
                {mentorData.name}
              </Link>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {mentorData.company}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {mentorData.role}
              </div>
            </div>
          </div>

          {/* Rating and rate */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(7, 12, 24, 0.7)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
              fontSize: '0.825rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {mentorData.isDemo ? (
                <span style={{ color: 'var(--text-dim)' }}>Sample profile · no verified reviews</span>
              ) : (
                <>
                  <Icon name="star" size={14} color="#FFD700" />
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{mentorData.rating?.toFixed(2) || 'New'}</span>
                  <span style={{ color: 'var(--text-dim)' }}>({mentorData.reviewCount} reviews)</span>
                </>
              )}
            </div>

            <div style={{ fontWeight: 700, color: 'var(--status-emerald)', fontFamily: 'var(--font-mono)' }}>
              {mentorData.hourlyRate == null ? 'Rate not set' : `₹${mentorData.hourlyRate} / 45m`}
            </div>
          </div>

          {/* Bio Preview */}
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {mentorData.bio}
          </p>

          {/* Topics tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {mentorData.topics.slice(0, 3).map((topic, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          <Link
            to={`/expert-chat?expert=${mentorData.id}`}
            className="btn btn-secondary btn-sm"
            title="Direct chat with mentor"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <Icon name="message-circle" size={14} />
          </Link>

          <Link
            to={`/mock-interviews?tab=mentors&mentor=${mentorData.id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
          >
            Profile
          </Link>

          <button
            onClick={() => handleBook && handleBook(mentorData)}
            disabled={mentorData.isDemo}
            title={mentorData.isDemo ? 'Sample profiles cannot be booked.' : 'Book an available session'}
            className="btn btn-primary btn-sm"
            style={{ flex: 1.2, justifyContent: 'center', opacity: mentorData.isDemo ? 0.55 : 1, cursor: mentorData.isDemo ? 'not-allowed' : 'pointer' }}
          >
            <Icon name="calendar" size={14} />
            <span>{mentorData.isDemo ? 'Sample Only' : 'Book Mock'}</span>
          </button>
        </div>
      </div>
    </CardTilt>
  );
};
