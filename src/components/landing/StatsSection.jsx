import React from 'react';
import { Icon } from '../common/Icons';
import { COMPANIES_DATA } from '../../data/companies';
import { EXPERIENCES_DATA } from '../../data/experiences';
import { QUESTIONS_DATA } from '../../data/questions';
import { INTERVIEWERS_DATA } from '../../data/interviewers';

export const StatsSection = () => {
  const stats = [
    {
      label: 'Company Profiles',
      value: COMPANIES_DATA.length,
      trend: 'Curated interview patterns',
      icon: 'shield',
      accent: 'var(--accent-cyan)'
    },
    {
      label: 'Sample Interview Reports',
      value: EXPERIENCES_DATA.length,
      trend: 'Example placement stories',
      icon: 'building',
      accent: 'var(--accent-purple)'
    },
    {
      label: 'Practice Questions',
      value: QUESTIONS_DATA.length,
      trend: 'Across technical topics',
      icon: 'book',
      accent: 'var(--status-emerald)'
    },
    {
      label: 'Mentor Profiles',
      value: INTERVIEWERS_DATA.length,
      trend: 'Demo mentor directory',
      icon: 'user',
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
