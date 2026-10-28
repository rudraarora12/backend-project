import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { CardTilt } from '../effects/CardTilt';

export const CompanyCard = ({ company }) => {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked('companies', company.id);

  const getDifficultyColor = (diff) => {
    if (diff >= 4.3) return 'hard';
    if (diff >= 3.6) return 'medium';
    return 'easy';
  };

  return (
    <CardTilt maxTilt={6} scale={1.015}>
      <div
        className="glass-panel glass-panel-hover"
        style={{
          padding: '1.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* Top Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: company.bgGradient || 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px'
                }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <Link
                  to={`/company-prep?tab=intelligence&company=${company.slug}`}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                >
                  {company.name}
                </Link>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {company.category}
                </span>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark('companies', company.id);
              }}
              className="btn-icon"
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark Company'}
              style={{
                color: bookmarked ? 'var(--accent-cyan)' : 'var(--text-dim)',
                background: bookmarked ? 'var(--accent-cyan-dim)' : 'transparent',
                borderColor: bookmarked ? 'var(--accent-cyan)' : 'var(--border-subtle)'
              }}
            >
              <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={16} />
            </button>
          </div>

          {/* Difficulty Benchmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty:</span>
            <Badge variant={getDifficultyColor(company.avgDifficulty)} size="sm">
              {company.avgDifficulty.toFixed(1)} / 5.0
            </Badge>
          </div>

          {/* Roles Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {company.roles.slice(0, 3).map((role, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {role}
              </span>
            ))}
          </div>

          {/* Metric Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '0.75rem 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
              fontSize: '0.825rem'
            }}
          >
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                EXPERIENCES
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {company.experienceCount} logged
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                TOP QUESTIONS
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {company.questionsCount} tracked
              </div>
            </div>
          </div>
        </div>

        {/* View Deep Dive Action */}
        <Link
          to={`/company-prep?tab=intelligence&company=${company.slug}`}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>Pattern Analytics</span>
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </CardTilt>
  );
};
