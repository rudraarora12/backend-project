import React, { useState } from 'react';
import { toggleHelpfulVote, hasUserVoted } from '../../services/experienceService';
import { Icon } from '../common/Icons';

export const HelpfulVoteBtn = ({ experienceId, initialVotes = 0 }) => {
  const [voted, setVoted] = useState(() => hasUserVoted(experienceId));
  const [votes, setVotes] = useState(initialVotes);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleHelpfulVote(experienceId);
    setVoted(result.voted);
    setVotes(result.votes);
  };

  return (
    <button
      onClick={handleClick}
      className="btn"
      style={{
        padding: '0.35rem 0.75rem',
        fontSize: '0.8rem',
        borderRadius: 'var(--radius-sm)',
        background: voted ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${voted ? 'var(--status-emerald)' : 'var(--border-subtle)'}`,
        color: voted ? 'var(--status-emerald)' : 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        transition: 'all 0.2s ease'
      }}
      title="Found this interview experience helpful"
    >
      <Icon name="thumbs-up" size={14} color={voted ? 'var(--status-emerald)' : 'currentColor'} />
      <span className="font-mono" style={{ fontWeight: 600 }}>{votes}</span>
      <span style={{ fontSize: '0.72rem' }}>Helpful</span>
    </button>
  );
};
