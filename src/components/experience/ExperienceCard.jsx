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
                  to={`/company-prep?tab=intelligence&company=${experience.companySlug}`}
                  style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark('experiences', experience.id);
              }}
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

          {/* Drive Meta Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.775rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            <span>{experience.channel}</span>
            <span>•</span>
            <span>Batch {experience.year}</span>
            <span>•</span>
            <span style={{ color: 'var(--status-emerald)', fontWeight: 600 }}>{experience.ctc}</span>
          </div>

          {/* Topics Tag List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {experience.topics?.map((topic, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(0, 212, 255, 0.06)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 212, 255, 0.15)'
                }}
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Preparation Advice Excerpt */}
          {experience.prepAdvice && (
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: '0 0 1rem 0',
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
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
            to={`/company-prep?tab=experiences&id=${experience.id}`}
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
