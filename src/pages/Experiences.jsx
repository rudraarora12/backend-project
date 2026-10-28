import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllExperiences } from '../services/experienceService';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { Icon } from '../components/common/Icons';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/experiences.css';

export const Experiences = () => {
  const experiences = getAllExperiences();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('All'); // 'All' | 'Selected' | 'Rejected'
  const [channelFilter, setChannelFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'upvotes' | 'difficulty'

  const filtered = useMemo(() => {
    return experiences
      .filter((exp) => {
        const matchesOutcome = outcomeFilter === 'All' || exp.result === outcomeFilter;
        const matchesChannel = channelFilter === 'All' || exp.channel === channelFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          exp.company.toLowerCase().includes(q) ||
          exp.role.toLowerCase().includes(q) ||
          (exp.topics && exp.topics.some((t) => t.toLowerCase().includes(q)));

        return matchesOutcome && matchesChannel && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'upvotes') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
        if (sortBy === 'difficulty') return b.difficulty - a.difficulty;
        return 0;
      });
  }, [experiences, outcomeFilter, channelFilter, searchQuery, sortBy]);

  return (
    <div className="experiences-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Crowdsourced Placement Intelligence</span>
          </div>
          <h1 className="page-title">
            Campus Placement Interview Logs
          </h1>
          <p className="page-subtitle">
            Authentic, round-by-round interview breakdowns from engineering students who cleared or faced loops at top tier tech firms.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel filter-bar-card">
          {/* Search */}
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <div className="search-icon">
              <Icon name="search" size={17} />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search company, role, or topic (e.g. Google, DP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Outcome Filter */}
          <div className="filter-tabs">
            {['All', 'Selected', 'Rejected'].map((outcome) => (
              <button
                key={outcome}
                className={`tab-btn ${outcomeFilter === outcome ? 'active' : ''}`}
                onClick={() => setOutcomeFilter(outcome)}
              >
                {outcome === 'All' ? 'All Outcomes' : outcome}
              </button>
            ))}
          </div>

          {/* Channel Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>DRIVE:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.85rem', fontSize: '0.825rem' }}
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="All">All Channels</option>
              <option value="On-Campus Drive">On-Campus Drive</option>
              <option value="Off-Campus / Referral">Off-Campus / Referral</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>SORT:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.85rem', fontSize: '0.825rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Helpful</option>
              <option value="difficulty">Hardest First</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: '#FFFFFF' }}>{filtered.length}</strong> interview records
          </div>

          <Link to="/submit" className="btn btn-primary btn-sm">
            <Icon name="plus" size={15} />
            <span>Submit Your Story</span>
          </Link>
        </div>

        {/* Experiences Grid */}
        <ScrollReveal direction="up">
          {filtered.length > 0 ? (
            <div className="grid-cards">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Icon name="search" size={48} />
              </div>
              <h4 className="empty-state-title">No interview experiences matched your filter</h4>
              <p className="empty-state-desc">
                Try widening your search terms or clearing the outcome filters.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setOutcomeFilter('All');
                  setChannelFilter('All');
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
