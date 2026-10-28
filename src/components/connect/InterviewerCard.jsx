import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { CardTilt } from '../effects/CardTilt';

export const InterviewerCard = ({ mentor, onBookClick }) => {
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
              src={mentor.avatar}
              alt={mentor.name}
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
                to={`/candidate/${mentor.id}`}
                style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
                onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
              >
                {mentor.name}
              </Link>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {mentor.company}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {mentor.role}
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
              background: 'rgba(7, 12, 24, 0.6)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
              fontSize: '0.825rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FBBF24' }}>
              <Icon name="star" size={14} color="#FBBF24" />
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{mentor.rating.toFixed(2)}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({mentor.reviewCount} mocks)</span>
            </div>

            <div className="font-mono" style={{ color: 'var(--status-emerald)', fontWeight: 700 }}>
              ₹{mentor.hourlyRate} / session
            </div>
          </div>

          {/* Bio Snippet */}
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            {mentor.bio}
          </p>

          {/* Topics evaluation pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {(mentor.topics || []).slice(0, 3).map((topic, i) => (
              <span
                key={i}
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
        <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          <Link
            to={`/candidate/${mentor.id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Profile
          </Link>

          <button
            onClick={() => onBookClick(mentor)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1.2 }}
          >
            <Icon name="calendar" size={14} />
            <span>Book Mock</span>
          </button>
        </div>
      </div>
    </CardTilt>
  );
};
