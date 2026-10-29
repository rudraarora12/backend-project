import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/apiClient';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const HelpfulVoteBtn = ({ experienceId, initialVotes = 0, isDemo = false }) => {
  const { isAuthenticated, showToast } = useApp();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(initialVotes);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isDemo) {
      setVoted(false);
      return;
    }
    let active = true;
    apiRequest(`/experiences/${encodeURIComponent(experienceId)}/vote`)
      .then(({ voted: hasVoted }) => { if (active) setVoted(hasVoted); })
      .catch((error) => { if (active) showToast(error.message, 'error'); });
    return () => { active = false; };
  }, [experienceId, isAuthenticated, isDemo, showToast]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDemo) return;
    if (pending) return;
    setPending(true);
    try {
      const result = await apiRequest(`/experiences/${encodeURIComponent(experienceId)}/vote`, { method: 'POST' });
      setVoted(result.voted);
      setVotes(result.votes);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending || isDemo}
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
      title={isDemo ? 'Sample experiences cannot be voted on.' : 'Found this interview experience helpful'}
    >
      <Icon name="thumbs-up" size={14} color={voted ? 'var(--status-emerald)' : 'currentColor'} />
      <span className="font-mono" style={{ fontWeight: 600 }}>{votes}</span>
      <span style={{ fontSize: '0.72rem' }}>Helpful</span>
    </button>
  );
};
