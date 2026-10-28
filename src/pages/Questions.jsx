import React, { useState, useMemo } from 'react';
import { QUESTIONS_DATA } from '../data/questions';
import { QuestionCard } from '../components/questions/QuestionCard';
import { Icon } from '../components/common/Icons';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const Questions = () => {
  const [activeTopic, setActiveTopic] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reports'); // 'reports' | 'title'

  const topics = ['All', 'DSA', 'System Design', 'DBMS', 'OS', 'OOP', 'Behavioral'];

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      const matchesTopic = activeTopic === 'All' || q.topic === activeTopic;
      const matchesDiff = activeDifficulty === 'All' || q.difficulty === activeDifficulty;
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(term) ||
        (q.description && q.description.toLowerCase().includes(term)) ||
        (q.companies && q.companies.some((c) => c.toLowerCase().includes(term)));

      return matchesTopic && matchesDiff && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'reports') return b.reports - a.reports;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [activeTopic, activeDifficulty, searchQuery, sortBy]);

  return (
    <div className="questions-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Universal Interview Problem Bank</span>
          </div>
          <h1 className="page-title">
            Campus Placement Question Matrix
          </h1>
          <p className="page-subtitle">
            Community-reported technical interview questions ranked by report frequency, tagged by core domain, company presence, and verified solutions.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {/* Top Row: Search + Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', maxWidth: '460px', position: 'relative' }}>
              <div className="search-icon">
                <Icon name="search" size={17} />
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search question, concept, or company (e.g. Cache, Amazon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>SORT:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.85rem', fontSize: '0.825rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="reports">Highest Frequency</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Topic Tabs + Difficulty */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div className="filter-tabs">
              {topics.map((top) => (
                <button
                  key={top}
                  className={`tab-btn ${activeTopic === top ? 'active' : ''}`}
                  onClick={() => setActiveTopic(top)}
                >
                  {top === 'All' ? 'All Domains' : top}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  className={`tab-btn ${activeDifficulty === diff ? 'active' : ''}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => setActiveDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Showing <strong style={{ color: '#FFFFFF' }}>{filteredQuestions.length}</strong> canonical interview problems
        </div>

        {/* Questions Grid */}
        <ScrollReveal direction="up">
          {filteredQuestions.length > 0 ? (
            <div className="grid-cards">
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Icon name="search" size={48} />
              </div>
              <h4 className="empty-state-title">No questions found matching your filter</h4>
              <p className="empty-state-desc">Try resetting topic or difficulty filters to view more problems.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setActiveTopic('All');
                  setActiveDifficulty('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};
