import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA } from '../../data/companies';
import { EXPERIENCES_DATA } from '../../data/experiences';
import { QUESTIONS_DATA } from '../../data/questions';
import { Icon } from '../common/Icons';
import { Badge } from '../common/Badge';

export const BookmarksList = () => {
  const { user, toggleBookmark } = useApp();
  const [activeTab, setActiveTab] = useState('companies');

  const bookmarkedCompanies = COMPANIES_DATA.filter((c) =>
    user.bookmarks?.companies?.includes(c.id)
  );

  const bookmarkedExperiences = EXPERIENCES_DATA.filter((e) =>
    user.bookmarks?.experiences?.includes(e.id)
  );

  const bookmarkedQuestions = QUESTIONS_DATA.filter((q) =>
    user.bookmarks?.questions?.includes(q.id)
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      {/* Header and tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
            Saved Placement Bookmarks
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Quick access to companies, candidate logs, and high-priority questions
          </p>
        </div>

        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies ({bookmarkedCompanies.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            Experiences ({bookmarkedExperiences.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions ({bookmarkedQuestions.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'companies' && (
        <div>
          {bookmarkedCompanies.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {bookmarkedCompanies.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(7, 12, 24, 0.7)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: c.bgGradient || 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px'
                      }}
                    >
                      <img src={c.logo} alt={c.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <Link to={`/company/${c.slug}`} style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                        {c.name}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {c.experienceCount} experiences
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark('companies', c.id)}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', color: 'var(--accent-cyan)' }}
                    title="Remove from bookmarks"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No saved companies yet. Browse companies and click the bookmark icon!</p>
              <Link to="/companies" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>Explore Companies</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'experiences' && (
        <div>
          {bookmarkedExperiences.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bookmarkedExperiences.map((e) => (
                <div
                  key={e.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(7, 12, 24, 0.7)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{e.company}</span>
                      <span style={{ color: 'var(--border-subtle)' }}>•</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{e.role}</span>
                      <Badge variant={e.result === 'Selected' ? 'selected' : 'rejected'} size="sm">
                        {e.result}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {e.rounds?.length || 0} rounds logged • {e.year}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link to={`/experience/${e.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                      Read
                    </Link>
                    <button
                      onClick={() => toggleBookmark('experiences', e.id)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--accent-cyan)' }}
                      title="Remove bookmark"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No saved interview experiences yet.</p>
              <Link to="/experiences" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>Browse Experiences</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'questions' && (
        <div>
          {bookmarkedQuestions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bookmarkedQuestions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(7, 12, 24, 0.7)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                      {q.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <span>{q.topic}</span>
                      <span>•</span>
                      <Badge variant={q.difficulty === 'Hard' ? 'hard' : q.difficulty === 'Medium' ? 'medium' : 'easy'} size="sm">
                        {q.difficulty}
                      </Badge>
                      <span>•</span>
                      <span>{q.reports} reports</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a
                      href={q.leetcodeUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      <span>Solve</span>
                      <Icon name="external-link" size={12} />
                    </a>
                    <button
                      onClick={() => toggleBookmark('questions', q.id)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--accent-cyan)' }}
                      title="Remove bookmark"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No saved questions yet.</p>
              <Link to="/questions" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>Explore Question Bank</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
