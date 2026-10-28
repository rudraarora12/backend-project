import React from 'react';
import { CompanyGrid } from '../components/company/CompanyGrid';
import { COMPANIES_DATA } from '../data/companies';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/companies.css';

export const Companies = () => {
  return (
    <div className="companies-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Campus Placement Intelligence</span>
          </div>
          <h1 className="page-title">
            Company Recruitment Directories
          </h1>
          <p className="page-subtitle">
            Explore 650+ tech companies, verified hiring patterns, difficulty benchmarks, and commonly asked algorithmic & system design problems.
          </p>
        </div>

        {/* Company Grid */}
        <ScrollReveal direction="up">
          <CompanyGrid companies={COMPANIES_DATA} />
        </ScrollReveal>
      </div>
    </div>
  );
};
