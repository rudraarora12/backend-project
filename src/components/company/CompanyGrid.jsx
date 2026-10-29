import React, { useState, useMemo } from 'react';
import { CompanyCard } from './CompanyCard';
import { Icon } from '../common/Icons';

export const CompanyGrid = ({ companies = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('experiences');

  const categories = ['All', 'Product', 'Fintech', 'Service'];

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.topTopics && c.topTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'experiences') return b.experienceCount - a.experienceCount;
        if (sortBy === 'difficulty') return b.avgDifficulty - a.avgDifficulty;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [companies, activeCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* Search and Category Control Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
          <div className="search-icon">
            <Icon name="search" size={18} />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by company or topic (e.g. Amazon, Graphs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'All Companies' : cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>SORT:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.85rem', fontSize: '0.825rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="experiences">Most Experiences</option>
            <option value="difficulty">Highest Difficulty</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid-cards">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="search" size={48} />
          </div>
          <h4 className="empty-state-title">No companies matched "{searchQuery}"</h4>
          <p className="empty-state-desc">
            Try adjusting your search criteria or resetting filters to browse all {companies.length} available company profiles.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
