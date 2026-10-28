import React from 'react';
import { Icon } from '../common/Icons';

export const StatsSection = () => {
  const stats = [
    {
      label: 'Verified Interview Records',
      value: '2,840+',
      trend: '+12% this month',
      icon: 'shield',
      accent: 'var(--accent-cyan)'
    },
    {
      label: 'Tech Companies Indexed',
      value: '650+',
      trend: 'FAANG, Tier 1, Fintech',
      icon: 'building',
      accent: 'var(--accent-purple)'
    },
    {
      label: 'Campus Offer Rate',
      value: '84.6%',
      trend: 'Among active sprint students',
      icon: 'flame',
      accent: 'var(--status-emerald)'
    },
    {
      label: 'Highest Reported CTC',
      value: '₹58 LPA',
      trend: 'SDE / Quantitative MTS',
      icon: 'dollar',
      accent: 'var(--status-amber)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        margin: '3rem 0'
      }}
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.accent
            }}
          >
            <Icon name={stat.icon} size={22} />
          </div>

          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '0.4rem'
            }}
          >
            {stat.value}
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: '0.25rem'
            }}
          >
            {stat.label}
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
};
