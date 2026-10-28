import React, { useState } from 'react';
import { DEFAULT_PRACTICE_CHALLENGES } from '../../data/dashboard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icons';

export const PracticeTable = ({ filterTrack = null }) => {
  const [challenges, setChallenges] = useLocalStorage('ii_practice_table', DEFAULT_PRACTICE_CHALLENGES);
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const toggleStatus = (id) => {
    setChallenges((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Todo' ? 'In Progress' : item.status === 'In Progress' ? 'Solved' : 'Todo';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filtered = challenges.filter((c) => {
    const matchesTrack = !filterTrack || c.track === filterTrack;
    const matchesDiff = filterDifficulty === 'All' || c.difficulty === filterDifficulty;
    return matchesTrack && matchesDiff;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Solved':
        return <Badge variant="selected" size="sm">SOLVED</Badge>;
      case 'In Progress':
        return <Badge variant="pending" size="sm">IN PROGRESS</Badge>;
      default:
        return <Badge variant="muted" size="sm">TODO</Badge>;
    }
  };

  const getDifficultyVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'cyan';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
            Core Problem Practice Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            High-frequency company tagged questions with one-click status transitions
          </p>
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              className={`tab-btn ${filterDifficulty === diff ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => setFilterDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
              <th style={{ padding: '0.75rem 1rem' }}>CHALLENGE TITLE</th>
              <th style={{ padding: '0.75rem 1rem' }}>CATEGORY</th>
              <th style={{ padding: '0.75rem 1rem' }}>DIFFICULTY</th>
              <th style={{ padding: '0.75rem 1rem' }}>FREQUENCY</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Status Toggle */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button
                    onClick={() => toggleStatus(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    title="Click to toggle status (Todo -> In Progress -> Solved)"
                  >
                    {getStatusBadge(item.status)}
                  </button>
                </td>

                {/* Title */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: item.status === 'Solved' ? 'var(--text-muted)' : '#FFFFFF' }}>
                  {item.title}
                </td>

                {/* Category */}
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  {item.category}
                </td>

                {/* Difficulty */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <Badge variant={getDifficultyVariant(item.difficulty)} size="sm">
                    {item.difficulty}
                  </Badge>
                </td>

                {/* Frequency */}
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                  {item.frequency}
                </td>

                {/* Direct Solve Link */}
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <span>LeetCode</span>
                    <Icon name="external-link" size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
