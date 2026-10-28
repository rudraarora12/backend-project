import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExperienceById } from '../services/experienceService';
import { COMPANIES_DATA } from '../data/companies';
import { ExperienceRound } from '../components/experience/ExperienceRound';
import { HelpfulVoteBtn } from '../components/experience/HelpfulVoteBtn';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icons';
import '../styles/experience.css';

export const ExperienceDetail = () => {
  const { id } = useParams();
  const { toggleBookmark, isBookmarked } = useApp();

  const exp = getExperienceById(id);

  if (!exp) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '1rem' }}>Experience Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The interview experience record you requested does not exist or was removed.</p>
        <Link to="/experiences" className="btn btn-primary btn-sm">Browse All Experiences</Link>
      </div>
    );
  }

  const bookmarked = isBookmarked('experiences', exp.id);
  const isSelected = exp.result === 'Selected';
  const companyInfo = COMPANIES_DATA.find((c) => c.slug === exp.companySlug);

  return (
    <div className="experience-detail-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-dim)', margin: '1.5rem 0' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/experiences" style={{ color: 'var(--text-muted)' }}>Experiences</Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-cyan)' }}>{exp.company} - {exp.role}</span>
        </div>

        {/* Hero Card */}
        <div
          className="glass-panel experience-hero"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
            border: '1px solid var(--border-glass)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
                <Link
                  to={`/company/${exp.companySlug}`}
                  style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.target.style.color = '#FFFFFF')}
                >
                  {exp.company}
                </Link>
                {exp.verified && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Icon name="shield" size={13} />
                    <span>VERIFIED RECORD</span>
                  </span>
                )}
                <Badge variant={isSelected ? 'selected' : 'rejected'} size="md">
                  {exp.result}
                </Badge>
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                {exp.role}
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Author: <strong style={{ color: '#FFFFFF' }}>{exp.authorName}</strong></span>
                <span>•</span>
                <span>Cycle: <strong style={{ color: '#FFFFFF' }}>{exp.year}</strong></span>
                <span>•</span>
                <span>Channel: <strong style={{ color: '#FFFFFF' }}>{exp.channel}</strong></span>
                {exp.location && (
                  <>
                    <span>•</span>
                    <span>Location: <strong style={{ color: '#FFFFFF' }}>{exp.location}</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpfulVoteBtn experienceId={exp.id} initialVotes={exp.helpfulVotes || 0} />

              <button
                onClick={() => toggleBookmark('experiences', exp.id)}
                className="btn btn-secondary btn-sm"
                style={{
                  background: bookmarked ? 'var(--accent-cyan-dim)' : 'rgba(13, 21, 39, 0.8)',
                  borderColor: bookmarked ? 'var(--accent-cyan)' : 'var(--border-glass)',
                  color: bookmarked ? 'var(--accent-cyan)' : 'var(--text-main)'
                }}
              >
                <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={15} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* CTC and Metrics Pill */}
          {exp.ctc && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: 'var(--status-amber)'
              }}
            >
              <Icon name="dollar" size={18} />
              <span style={{ fontSize: '0.875rem' }}>Offered Package:</span>
              <strong className="font-mono" style={{ fontSize: '1rem', color: '#FFFFFF' }}>{exp.ctc}</strong>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="experience-grid-layout">
          {/* Left Column: Rounds breakdown */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                Round-by-Round Interview Log
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                All {exp.rounds?.length || 0} stages recorded by the candidate with exact questions and time allocations.
              </p>
            </div>

            {(exp.rounds || []).map((round, idx) => (
              <ExperienceRound key={idx} round={round} index={idx} defaultOpen={true} />
            ))}

            {/* Candidate Reflections */}
            {exp.candidateExperience && (
              <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Candidate Overall Experience & Interviewer Demeanor
                </h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.925rem' }}>
                  {exp.candidateExperience}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Strategic Advice & Company Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Preparation Advice */}
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderLeft: '4px solid var(--accent-cyan)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>
                <Icon name="zap" size={18} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Candidate's Preparation Advice
                </h4>
              </div>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '0.9rem', fontStyle: 'italic' }}>
                "{exp.prepAdvice}"
              </p>
            </div>

            {/* Topics Covered Tag Cloud */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.85rem' }}>
                Topics Evaluated in This Loop
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(exp.topics || []).map((topic, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 212, 255, 0.08)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Quick Profile */}
            {companyInfo && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <img src={companyInfo.logo} alt={companyInfo.name} style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {companyInfo.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {companyInfo.category} Tech
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {companyInfo.overview.substring(0, 140)}...
                </p>

                <Link
                  to={`/company/${companyInfo.slug}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>View Company Topic Weights</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
