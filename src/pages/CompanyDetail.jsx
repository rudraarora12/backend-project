import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COMPANIES_DATA } from '../data/companies';
import { getAllExperiences } from '../services/experienceService';
import { InterviewPattern } from '../components/company/InterviewPattern';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icons';
import { getCanonicalQuestionUrl } from '../services/experienceService';
import '../styles/company.css';

export const CompanyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useApp();

  const company = COMPANIES_DATA.find((c) => c.slug === slug) || COMPANIES_DATA[0];
  const bookmarked = isBookmarked('companies', company.id);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'questions' | 'experiences'

  const allExperiences = getAllExperiences();
  const companyExperiences = allExperiences.filter(
    (e) => e.companySlug === company.slug || e.company.toLowerCase().includes(company.slug.replace('-', ' '))
  );

  return (
    <div className="company-detail-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-dim)', margin: '1.5rem 0' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/companies" style={{ color: 'var(--text-muted)' }}>Companies</Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-cyan)' }}>{company.name}</span>
        </div>

        {/* Company Hero Banner */}
        <div
          className="glass-panel company-banner"
          style={{
            background: company.bgGradient || 'rgba(13, 21, 39, 0.85)',
            border: '1px solid var(--border-glass)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div
                className="company-logo-lg"
                style={{
                  background: 'rgba(7, 12, 24, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <img src={company.logo} alt={company.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {company.name}
                  </h1>
                  <Badge variant="cyan" size="md">
                    {company.category}
                  </Badge>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>
                    Avg. Difficulty: <strong style={{ color: '#FFFFFF' }}>{company.avgDifficulty.toFixed(1)} / 5.0</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Logged Experiences: <strong style={{ color: '#FFFFFF' }}>{company.experienceCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Questions Recorded: <strong style={{ color: '#FFFFFF' }}>{company.questionsCount}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => toggleBookmark('companies', company.id)}
                className="btn btn-secondary btn-sm"
                style={{
                  background: bookmarked ? 'var(--accent-cyan-dim)' : 'rgba(13, 21, 39, 0.8)',
                  borderColor: bookmarked ? 'var(--accent-cyan)' : 'var(--border-glass)',
                  color: bookmarked ? 'var(--accent-cyan)' : 'var(--text-main)'
                }}
              >
                <Icon name={bookmarked ? 'bookmark-filled' : 'bookmark'} size={16} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <Link
                to={`/preparation?company=${company.slug}`}
                className="btn btn-primary btn-sm"
              >
                <Icon name="zap" size={16} />
                <span>Generate Prep Sprint</span>
              </Link>
            </div>
          </div>

          {/* Popular Roles Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>POPULAR ROLES:</span>
            {(company.popularRoles || []).map((role, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)'
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="filter-tabs" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Hiring Process & Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Frequent Questions ({company.freqQuestions?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            Candidate Experiences ({companyExperiences.length})
          </button>
        </div>

        {/* Tab 1: Overview & Weightage */}
        {activeTab === 'overview' && (
          <div className="company-detail-grid">
            {/* Left: Overview description & hiring tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
                  Interview Architecture & What to Expect
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {company.overview}
                </p>

                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="zap" size={16} />
                    <span>Key Hiring Evaluation Pillars</span>
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', listStyle: 'disc' }}>
                    <li>Optimal algorithmic complexity (Big-O analysis expected before writing code)</li>
                    <li>Clean, modular variable naming without IDE autocompletion dependencies</li>
                    <li>Thorough consideration of extreme edge cases (null inputs, integer overflows, cycles)</li>
                    <li>Strong communication and collaborative thinking throughout the coding session</li>
                  </ul>
                </div>
              </div>

              {/* Verified Experiences Teaser */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Recent Candidate Experiences
                  </h3>
                  <button
                    onClick={() => setActiveTab('experiences')}
                    className="btn btn-ghost btn-sm"
                  >
                    View All
                  </button>
                </div>

                {companyExperiences.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {companyExperiences.slice(0, 2).map((exp) => (
                      <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    No experiences logged yet for {company.name}. Be the first to share!
                  </p>
                )}
              </div>
            </div>

            {/* Right: Pattern Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <InterviewPattern pattern={company.pattern} />

              {/* Mock Connect Promo */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(13, 21, 39, 0.9) 100%)',
                  border: '1px solid rgba(108, 99, 255, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#A78BFA' }}>
                    <Icon name="video" size={20} />
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    1-on-1 Mock with {company.name} Seniors
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Get simulated interview rounds with candidates who successfully cracked {company.name}'s hiring bar.
                </p>
                <Link to="/interview-connect" className="btn btn-purple btn-sm" style={{ width: '100%' }}>
                  Browse {company.name} Mentors
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Frequently Asked Questions */}
        {activeTab === 'questions' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              High-Frequency Questions at {company.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Crowdsourced questions repeatedly reported by students during {company.name} campus drives and referral screens.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(company.freqQuestions || []).map((q, idx) => {
                const leetcodeLink = getCanonicalQuestionUrl(q.title);
                return (
                  <div
                    key={q.id || idx}
                    style={{
                      padding: '1.1rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(7, 12, 24, 0.7)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'rgba(0, 212, 255, 0.12)',
                          color: 'var(--accent-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                          {q.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                          Reported by {q.reports} candidates in recent cycles
                        </div>
                      </div>
                    </div>

                    <a
                      href={leetcodeLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <span>Solve on LeetCode</span>
                      <Icon name="external-link" size={14} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Candidate Experiences Feed */}
        {activeTab === 'experiences' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                  All Shared Experiences for {company.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Detailed round breakdowns, interview questions, and prep tips.
                </p>
              </div>

              <Link to="/submit" className="btn btn-primary btn-sm">
                <Icon name="plus" size={15} />
                <span>Submit Experience</span>
              </Link>
            </div>

            {companyExperiences.length > 0 ? (
              <div className="grid-cards">
                {companyExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="layers" size={48} className="empty-state-icon" />
                <h4 className="empty-state-title">No experiences recorded yet</h4>
                <p className="empty-state-desc">
                  Have you interviewed at {company.name}? Share your experience to help university students.
                </p>
                <Link to="/submit" className="btn btn-primary btn-sm">
                  Add Interview Log
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
