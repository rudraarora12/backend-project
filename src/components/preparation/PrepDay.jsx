import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icons';

export const PrepDay = ({ dayPlan, isCompleted, onToggleDay, completedProblems = [], onToggleProblem }) => {
  const [isOpen, setIsOpen] = useState(dayPlan.day === 1);

  const getDifficultyVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'cyan';
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-glass)'}`,
        overflow: 'hidden',
        marginBottom: '1rem',
        background: isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(13, 21, 39, 0.75)',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Day Checkbox button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDay(dayPlan.day);
            }}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: `2px solid ${isCompleted ? 'var(--status-emerald)' : 'var(--border-glass)'}`,
              background: isCompleted ? 'var(--status-emerald)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050811',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            title={isCompleted ? 'Mark Day Incomplete' : 'Mark Day Complete'}
          >
            {isCompleted && <Icon name="check" size={16} color="#050811" />}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: isCompleted ? 'var(--status-emerald)' : '#FFFFFF' }}>
                {dayPlan.title}
              </span>
              {isCompleted && (
                <span className="badge badge-completed" style={{ fontSize: '0.68rem' }}>
                  DONE
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {dayPlan.focus}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {dayPlan.estimatedTime}
          </span>
          <div style={{ color: 'var(--text-dim)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
            <Icon name="chevron-down" size={18} />
          </div>
        </div>
      </div>

      {/* Accordion problems body */}
      {isOpen && (
        <div style={{ padding: '1.25rem', background: 'rgba(7, 12, 24, 0.45)' }}>
          {/* Pro Tip Callout */}
          {dayPlan.proTip && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 212, 255, 0.08)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                fontSize: '0.825rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}
            >
              <span style={{ color: 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }}>
                <Icon name="zap" size={16} />
              </span>
              <div>
                <strong style={{ color: 'var(--accent-cyan)' }}>Strategic Pro-Tip: </strong>
                {dayPlan.proTip}
              </div>
            </div>
          )}

          {/* Problem Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {dayPlan.problems.map((prob) => {
              const isProbDone = completedProblems.includes(prob.id);
              return (
                <div
                  key={prob.id}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13, 21, 39, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => onToggleProblem && onToggleProblem(prob.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `1.5px solid ${isProbDone ? 'var(--status-emerald)' : 'var(--border-subtle)'}`,
                        background: isProbDone ? 'var(--status-emerald)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#050811'
                      }}
                      title={isProbDone ? 'Mark Unsolved' : 'Mark Solved'}
                    >
                      {isProbDone && <Icon name="check" size={13} color="#050811" />}
                    </button>

                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: isProbDone ? 'var(--text-dim)' : 'var(--text-main)',
                        textDecoration: isProbDone ? 'line-through' : 'none'
                      }}
                    >
                      {prob.title}
                    </span>

                    <Badge variant={getDifficultyVariant(prob.difficulty)} size="sm">
                      {prob.difficulty}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      ~{prob.timeMinutes}m
                    </span>

                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <span>Solve</span>
                      <Icon name="external-link" size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
