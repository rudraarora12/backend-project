import React, { useState } from 'react';
import { getCanonicalQuestionUrl } from '../../services/experienceService';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icons';

export const ExperienceRound = ({ round, index, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getDifficultyVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'cyan';
    }
  };

  // Split questions if delimited by comma or newline
  const questionItems = round.questions
    ? round.questions.split(/[,;\n]+/).map((q) => q.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}
    >
      {/* Round Header / Accordion trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(13, 21, 39, 0.7)',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(0, 212, 255, 0.15)',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {index + 1}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.975rem' }}>
              {round.type}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Icon name="clock" size={13} />
                {round.duration || '45-60 min'}
              </span>
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
              <Badge variant={getDifficultyVariant(round.difficulty)} size="sm">
                {round.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <div style={{ color: 'var(--text-dim)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          <Icon name="chevron-down" size={18} />
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div style={{ padding: '1.25rem', background: 'rgba(7, 12, 24, 0.5)' }}>
          {/* Key Topics */}
          {round.topics && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                TOPICS EVALUATED
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {round.topics.split(/[,;]+/).map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Questions Asked with Auto Canonical Links */}
          {questionItems.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                REPORTED QUESTIONS & PROBES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {questionItems.map((q, idx) => {
                  const url = getCanonicalQuestionUrl(q);
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(13, 21, 39, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{q}</span>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--accent-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span>LeetCode Link</span>
                        <Icon name="external-link" size={12} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
