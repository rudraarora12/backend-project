import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icons';
import { CardTilt } from '../effects/CardTilt';

export const QuestionCard = ({ question }) => {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked('questions', question.id);

  const getDifficultyVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'cyan';
    }
  };

  return (
    <CardTilt maxTilt={5} scale={1.01}>
      <div
        className="glass-panel glass-panel-hover"
        style={{
          padding: '1.4rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Top Row: Topic + Difficulty + Bookmark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {question.topic}
              </span>
              <Badge variant={getDifficultyVariant(question.difficulty)} size="sm">
                {question.difficulty}
              </Badge>
            </div>

            <button
              onClick={() => toggleBookmark('questions', question.id)}
              className="btn-icon"
              style={{
                width: '30px',
                height: '30px',
                background: bookmarked ? 'var(--accent-cyan-dim)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${bookmarked ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                color: bookmarked ? 'var(--accent-cyan)' : 'var(--text-dim)'
              }}
              title={bookmarked ? 'Remove Bookmark' : 'Save Question'}
            >
              <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={14} />
            </button>
          </div>

          {/* Question Title */}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {question.title}
          </h4>

          {/* Description */}
          {question.description && (
            <p
              style={{
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}
            >
              {question.description}
            </p>
          )}

          {/* Companies asked in */}
          {question.companies && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
              {question.companies.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 212, 255, 0.06)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & external links */}
        <div
          style={{
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--status-amber)' }}>★</span>
            <span>{question.reports} campus reports</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {question.leetcodeUrl && (
              <a
                href={question.leetcodeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
              >
                <span>LeetCode</span>
                <Icon name="external-link" size={11} />
              </a>
            )}
            {question.gfgUrl && (
              <a
                href={question.gfgUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
              >
                <span>GFG</span>
                <Icon name="external-link" size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </CardTilt>
  );
};
