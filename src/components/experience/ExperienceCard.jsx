import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { HelpfulVoteBtn } from './HelpfulVoteBtn';
import { CardTilt } from '../effects/CardTilt';

export const ExperienceCard = ({ experience }) => {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked('experiences', experience.id);

  const isSelected = experience.result === 'Selected';

  return (
    <CardTilt maxTilt={5} scale={1.01}>
      <div
        className="glass-panel glass-panel-hover"
        style={{
          padding: '1.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: `4px solid ${isSelected ? 'var(--status-emerald)' : 'var(--status-rose)'}`
        }}
      >
        <div>
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <Link
                  to={`/company/${experience.companySlug}`}
                  style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
                >
                  {experience.company}
                </Link>
                {experience.verified && (
                  <span title="Verified Placement Record" style={{ color: 'var(--accent-cyan)', display: 'flex' }}>
                    <Icon name="shield" size={15} />
                  </span>
                )}
                <Badge variant={isSelected ? 'selected' : 'rejected'} size="sm">
                  {experience.result}
                </Badge>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {experience.role}
              </div>
            </div>

            <button
              onClick={() => toggleBookmark('experiences', experience.id)}
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                background: bookmarked ? 'var(--accent-cyan-dim)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${bookmarked ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                color: bookmarked ? 'var(--accent-cyan)' : 'var(--text-dim)'
              }}
              title={bookmarked ? 'Remove Bookmark' : 'Save Experience'}
            >
              <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={15} />
            </button>
          </div>

          {/* Metadata chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0.65rem 0 1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Icon name="calendar" size={13} />
              {experience.year}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Icon name="layers" size={13} />
              {experience.channel || 'On-Campus'}
            </span>
            {experience.ctc && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--status-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {experience.ctc}
                </span>
              </>
            )}
          </div>

          {/* Snippet / Rounds Overview */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
              ROUNDS RECORDED ({experience.rounds?.length || 0})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(experience.rounds || []).map((r, i) => (
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
                  R{i + 1}: {r.type.split('(')[0].trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Advice Snippet */}
          {experience.prepAdvice && (
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontStyle: 'italic',
                marginBottom: '1.25rem'
              }}
            >
              "{experience.prepAdvice}"
            </p>
          )}
        </div>

        {/* Footer controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            gap: '0.5rem'
          }}
        >
          <HelpfulVoteBtn experienceId={experience.id} initialVotes={experience.helpfulVotes || 0} />

          <Link
            to={`/experience/${experience.id}`}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Full Story</span>
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </CardTilt>
  );
};
