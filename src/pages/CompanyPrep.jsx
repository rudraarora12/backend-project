import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { COMPANIES_DATA } from '../data/companies';
import { getAllExperiences, getExperienceById, getCanonicalQuestionUrl, createExperience } from '../services/experienceService';
import { QUESTIONS_DATA } from '../data/questions';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { CompanyCard } from '../components/company/CompanyCard';
import { InterviewPattern } from '../components/company/InterviewPattern';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { ExperienceRound } from '../components/experience/ExperienceRound';
import { HelpfulVoteBtn } from '../components/experience/HelpfulVoteBtn';
import { QuestionCard } from '../components/questions/QuestionCard';
import { StepIndicator } from '../components/submit/StepIndicator';
import { RoundBuilder } from '../components/submit/RoundBuilder';
import { ScrollReveal } from '../components/common/ScrollReveal';

import '../styles/company-prep.css';
import '../styles/companies.css';
import '../styles/company.css';
import '../styles/experiences.css';
import '../styles/experience.css';
import '../styles/submit.css';

export const CompanyPrep = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, showToast, toggleBookmark, isBookmarked } = useApp();

  // Active tab state from URL params
  const currentTab = searchParams.get('tab') || 'directory';
  const companySlugParam = searchParams.get('company');
  const experienceIdParam = searchParams.get('id');

  // Tab switcher
  const handleTabChange = (newTab) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    // Remove detail params when explicitly switching top-level tabs
    if (newTab !== 'intelligence') newParams.delete('company');
    if (newTab !== 'experiences') newParams.delete('id');
    setSearchParams(newParams);
  };

  // Switch to specific company intelligence
  const handleSelectCompany = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'intelligence');
    newParams.set('company', slug);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to specific experience detail
  const handleSelectExperience = (expId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'experiences');
    newParams.set('id', expId);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // TAB 1: COMPANY DIRECTORY STATE & FILTERS
  // ==========================================
  const [companySearch, setCompanySearch] = useState('');
  const [companyCategory, setCompanyCategory] = useState('All');
  const [companyDifficultyFilter, setCompanyDifficultyFilter] = useState('All');

  const companyCategories = ['All', 'Product', 'Fintech', 'Cloud / AI', 'Service'];

  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter((comp) => {
      const matchesCat = companyCategory === 'All' || comp.category === companyCategory;
      const term = companySearch.toLowerCase();
      const matchesSearch =
        comp.name.toLowerCase().includes(term) ||
        comp.roles.some((r) => r.toLowerCase().includes(term)) ||
        comp.techStack.some((t) => t.toLowerCase().includes(term));
      const matchesDiff =
        companyDifficultyFilter === 'All' ||
        (companyDifficultyFilter === 'Hard' && comp.avgDifficulty >= 4.0) ||
        (companyDifficultyFilter === 'Medium' && comp.avgDifficulty >= 3.0 && comp.avgDifficulty < 4.0) ||
        (companyDifficultyFilter === 'Easy' && comp.avgDifficulty < 3.0);

      return matchesCat && matchesSearch && matchesDiff;
    });
  }, [companySearch, companyCategory, companyDifficultyFilter]);

  // ==========================================
  // TAB 2: COMPANY INTELLIGENCE DETAIL
  // ==========================================
  const activeCompany = useMemo(() => {
    if (companySlugParam) {
      return COMPANIES_DATA.find((c) => c.slug === companySlugParam) || COMPANIES_DATA[0];
    }
    return COMPANIES_DATA[0];
  }, [companySlugParam]);

  const [intelligenceSubTab, setIntelligenceSubTab] = useState('overview'); // 'overview' | 'questions' | 'experiences'
  const isCompanyBookmarked = isBookmarked('companies', activeCompany?.id);

  // ==========================================
  // TAB 3: EXPERIENCES FEED & DETAIL
  // ==========================================
  const allExperiences = getAllExperiences();
  // Filter for approved public experiences (or experiences submitted by current session)
  const approvedExperiences = useMemo(() => {
    return allExperiences.filter((e) => e.status !== 'flagged');
  }, [allExperiences]);

  const [expSearch, setExpSearch] = useState('');
  const [expOutcome, setExpOutcome] = useState('All'); // 'All' | 'Selected' | 'Rejected'
  const [expChannel, setExpChannel] = useState('All');
  const [expSortBy, setExpSortBy] = useState('recent'); // 'recent' | 'upvotes' | 'difficulty'

  const filteredExperiences = useMemo(() => {
    return approvedExperiences
      .filter((exp) => {
        const matchesOutcome = expOutcome === 'All' || exp.result === expOutcome;
        const matchesChannel = expChannel === 'All' || exp.channel === expChannel;
        const q = expSearch.toLowerCase();
        const matchesSearch =
          exp.company.toLowerCase().includes(q) ||
          exp.role.toLowerCase().includes(q) ||
          (exp.topics && exp.topics.some((t) => t.toLowerCase().includes(q)));

        return matchesOutcome && matchesChannel && matchesSearch;
      })
      .sort((a, b) => {
        if (expSortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
        if (expSortBy === 'upvotes') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
        if (expSortBy === 'difficulty') return b.difficulty - a.difficulty;
        return 0;
      });
  }, [approvedExperiences, expOutcome, expChannel, expSearch, expSortBy]);

  const selectedExperience = useMemo(() => {
    if (!experienceIdParam) return null;
    return getExperienceById(experienceIdParam);
  }, [experienceIdParam]);

  // Company experiences specifically
  const companyExperiences = useMemo(() => {
    return approvedExperiences.filter(
      (e) => e.companySlug === activeCompany?.slug || e.company.toLowerCase().includes(activeCompany?.name.toLowerCase())
    );
  }, [approvedExperiences, activeCompany]);

  // ==========================================
  // TAB 4: QUESTION BANK
  // ==========================================
  const [questionTopic, setQuestionTopic] = useState('All');
  const [questionDifficulty, setQuestionDifficulty] = useState('All');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionCompanyFilter, setQuestionCompanyFilter] = useState('All');

  const questionTopics = ['All', 'DSA', 'System Design', 'DBMS', 'OS', 'OOP', 'Behavioral'];

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      const matchesTopic = questionTopic === 'All' || q.topic === questionTopic;
      const matchesDiff = questionDifficulty === 'All' || q.difficulty === questionDifficulty;
      const term = questionSearch.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(term) ||
        (q.description && q.description.toLowerCase().includes(term)) ||
        (q.companies && q.companies.some((c) => c.toLowerCase().includes(term)));
      const matchesComp =
        questionCompanyFilter === 'All' ||
        (q.companies && q.companies.some((c) => c.toLowerCase() === questionCompanyFilter.toLowerCase()));

      return matchesTopic && matchesDiff && matchesSearch && matchesComp;
    }).sort((a, b) => b.reports - a.reports);
  }, [questionTopic, questionDifficulty, questionSearch, questionCompanyFilter]);

  // ==========================================
  // TAB 5: SHARE EXPERIENCE SUBMISSION WIZARD
  // ==========================================
  const [submitStep, setSubmitStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFormData, setSubmitFormData] = useState({
    company: 'Amazon',
    role: 'SDE-1 (Full Time)',
    channel: 'On-Campus Drive',
    result: 'Selected',
    year: 2026,
    ctc: '₹45 LPA',
    location: 'Bangalore, India',
    anonymous: false,
    authorName: user?.name || 'Anonymous Candidate',
    difficulty: 3.8,
    prepAdvice: '',
    candidateExperience: '',
    rounds: [
      {
        type: 'Online Assessment (OA)',
        duration: '90 min',
        difficulty: 'Medium',
        topics: 'Arrays, Two Pointers, Heaps',
        questions: 'LRU Cache, Subarray Sum Equals K'
      },
      {
        type: 'Technical Round 1',
        duration: '60 min',
        difficulty: 'Medium',
        topics: 'Binary Trees, Leadership Principles',
        questions: 'Lowest Common Ancestor of a Binary Tree, LP: Customer Obsession'
      }
    ]
  });

  const handleSubmitChange = (field, value) => {
    setSubmitFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!submitFormData.prepAdvice.trim()) {
      showToast('Please provide brief preparation advice for junior students.', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      const created = createExperience(submitFormData);
      showToast('Interview report submitted! Sent to moderation desk for placement verification.', 'success', 5000);
      setIsSubmitting(false);
      // Reset form and return to experiences tab
      setSubmitStep(1);
      handleTabChange('experiences');
    } catch (err) {
      console.error(err);
      showToast('Failed to submit experience. Please retry.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="company-prep-page">
      <div className="container">
        {/* Consolidated Section Header */}
        <div className="page-header" style={{ marginBottom: '1.75rem' }}>
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Placement Intelligence Central</span>
          </div>
          <h1 className="page-title">
            Company Recruitment & Interview Intelligence
          </h1>
          <p className="page-subtitle">
            Explore 650+ tech companies, predictive hiring topic patterns, verified student interview debriefs, and community-reported question banks.
          </p>
        </div>

        {/* Primary Section Tabs */}
        <div className="prep-nav-tabs">
          <button
            className={`prep-tab-btn ${currentTab === 'directory' ? 'active' : ''}`}
            onClick={() => handleTabChange('directory')}
          >
            <Icon name="grid" size={17} />
            <span>Company Directory</span>
            <span className="prep-tab-count">{COMPANIES_DATA.length}</span>
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'intelligence' ? 'active' : ''}`}
            onClick={() => handleTabChange('intelligence')}
          >
            <Icon name="layers" size={17} />
            <span>Interview Intelligence</span>
            {activeCompany && (
              <span className="prep-tab-count" style={{ textTransform: 'capitalize' }}>
                {activeCompany.name}
              </span>
            )}
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'experiences' ? 'active' : ''}`}
            onClick={() => handleTabChange('experiences')}
          >
            <Icon name="shield" size={17} />
            <span>Interview Experiences</span>
            <span className="prep-tab-count">{approvedExperiences.length}</span>
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'questions' ? 'active' : ''}`}
            onClick={() => handleTabChange('questions')}
          >
            <Icon name="book" size={17} />
            <span>Question Bank</span>
            <span className="prep-tab-count">{QUESTIONS_DATA.length}</span>
          </button>

          <button
            className={`prep-tab-btn ${currentTab === 'submit' ? 'active' : ''}`}
            onClick={() => handleTabChange('submit')}
            style={{ marginLeft: 'auto' }}
          >
            <Icon name="plus" size={17} color={currentTab === 'submit' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
            <span>Share Experience</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: COMPANY DIRECTORY
           ======================================================== */}
        {currentTab === 'directory' && (
          <ScrollReveal direction="up">
            {/* Filter Controls Bar */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Search Box */}
              <div style={{ flex: '1 1 260px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}>
                  <Icon name="search" size={17} />
                </div>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="Search company, tech stack, or role..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                />
              </div>

              {/* Category Filter Pills */}
              <div className="filter-tabs" style={{ margin: 0 }}>
                {companyCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`tab-btn ${companyCategory === cat ? 'active' : ''}`}
                    onClick={() => setCompanyCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Difficulty Dropdown */}
              <select
                value={companyDifficultyFilter}
                onChange={(e) => setCompanyDifficultyFilter(e.target.value)}
                className="select-input"
                style={{ padding: '0.5rem 1rem', minWidth: '150px' }}
              >
                <option value="All">All Difficulties</option>
                <option value="Hard">Hard (4.0 - 5.0)</option>
                <option value="Medium">Medium (3.0 - 3.9)</option>
                <option value="Easy">Easy (&lt; 3.0)</option>
              </select>
            </div>

            {/* Company Cards Grid */}
            <div className="grid-cards">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => handleSelectCompany(comp.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <CompanyCard company={comp} />
                </div>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                <Icon name="search" size={36} color="var(--text-dim)" />
                <h3 style={{ color: '#FFFFFF', marginTop: '1rem' }}>No companies found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria or category filter.</p>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 2: COMPANY INTERVIEW INTELLIGENCE
           ======================================================== */}
        {currentTab === 'intelligence' && activeCompany && (
          <ScrollReveal direction="up">
            {/* Quick Company Switcher Horizontal Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                Target Company Intelligence Nodes
              </div>
              <div className="company-selector-bar">
                {COMPANIES_DATA.map((c) => (
                  <button
                    key={c.id}
                    className={`company-selector-pill ${c.slug === activeCompany.slug ? 'active' : ''}`}
                    onClick={() => handleSelectCompany(c.slug)}
                  >
                    <img src={c.logo} alt={c.name} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Detail Banner */}
            <div
              className="glass-panel company-banner"
              style={{
                background: activeCompany.bgGradient || 'rgba(13, 21, 39, 0.85)',
                border: '1px solid var(--border-glass)',
                marginBottom: '2rem'
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
                    <img src={activeCompany.logo} alt={activeCompany.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        {activeCompany.name}
                      </h1>
                      <Badge variant="cyan" size="md">
                        {activeCompany.category}
                      </Badge>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Avg. Difficulty: <strong style={{ color: '#FFFFFF' }}>{activeCompany.avgDifficulty.toFixed(1)} / 5.0</strong></span>
                      <span>•</span>
                      <span>Logged Experiences: <strong style={{ color: '#FFFFFF' }}>{activeCompany.experienceCount}</strong></span>
                      <span>•</span>
                      <span>Questions Recorded: <strong style={{ color: '#FFFFFF' }}>{activeCompany.questionsCount}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Banner Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => toggleBookmark('companies', activeCompany.id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      background: isCompanyBookmarked ? 'var(--accent-cyan-dim)' : 'rgba(13, 21, 39, 0.8)',
                      borderColor: isCompanyBookmarked ? 'var(--accent-cyan)' : 'var(--border-glass)',
                      color: isCompanyBookmarked ? 'var(--accent-cyan)' : 'var(--text-main)'
                    }}
                  >
                    <Icon name={isCompanyBookmarked ? 'bookmark-filled' : 'bookmark'} size={16} />
                    <span>{isCompanyBookmarked ? 'Saved' : 'Bookmark'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/ai-roadmap?company=${activeCompany.slug}`)}
                    className="btn btn-primary btn-sm"
                  >
                    <Icon name="zap" size={16} />
                    <span>Generate AI Sprint</span>
                  </button>
                </div>
              </div>

              {/* Disclaimer Notice Box */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderLeft: '3px solid var(--accent-cyan)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <Icon name="shield" size={16} color="var(--accent-cyan)" />
                <span>
                  <strong>Predictive Intelligence Notice:</strong> Historical topic patterns and round structures are estimates derived from crowdsourced placement logs across verified students, not guaranteed future interview questions.
                </span>
              </div>
            </div>

            {/* Inner Subtabs */}
            <div className="filter-tabs" style={{ marginBottom: '2rem' }}>
              <button
                className={`tab-btn ${intelligenceSubTab === 'overview' ? 'active' : ''}`}
                onClick={() => setIntelligenceSubTab('overview')}
              >
                Topic Pattern & Weightage
              </button>
              <button
                className={`tab-btn ${intelligenceSubTab === 'questions' ? 'active' : ''}`}
                onClick={() => setIntelligenceSubTab('questions')}
              >
                Frequently Asked ({activeCompany.frequentlyAskedQuestions?.length || 0})
              </button>
              <button
                className={`tab-btn ${intelligenceSubTab === 'experiences' ? 'active' : ''}`}
                onClick={() => setIntelligenceSubTab('experiences')}
              >
                Verified Student Reports ({companyExperiences.length})
              </button>
            </div>

            {/* Overview / Pattern Subtab */}
            {intelligenceSubTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="layers" size={20} color="var(--accent-cyan)" />
                    <span>Recruitment Topic Weightages</span>
                  </h3>
                  <InterviewPattern pattern={activeCompany.pattern} />
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="clock" size={20} color="var(--accent-purple)" />
                    <span>Interview Loop Architecture</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeCompany.rounds?.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '1rem',
                          background: 'rgba(7, 12, 24, 0.6)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                            Round {r.round}: {r.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                            {r.duration}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                          {r.focus}
                        </p>
                      </div>
                    ))}
                  </div>

                  {activeCompany.cultureNotes && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(108, 99, 255, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(108, 99, 255, 0.25)' }}>
                      <div style={{ fontWeight: 700, color: '#A78BFA', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        Preparation Strategy & Culture Note
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                        {activeCompany.cultureNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions Subtab */}
            {intelligenceSubTab === 'questions' && (
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
                  Frequently Asked Problems at {activeCompany.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeCompany.frequentlyAskedQuestions?.map((q, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem 1.25rem',
                        background: 'rgba(7, 12, 24, 0.6)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                          {q.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          <span>Topic: <strong style={{ color: 'var(--text-muted)' }}>{q.topic}</strong></span>
                          <span>•</span>
                          <span>Reports: <strong style={{ color: 'var(--accent-cyan)' }}>{q.frequency} students</strong></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Badge
                          variant={q.difficulty === 'Hard' ? 'hard' : q.difficulty === 'Medium' ? 'medium' : 'easy'}
                          size="sm"
                        >
                          {q.difficulty}
                        </Badge>
                        <a
                          href={getCanonicalQuestionUrl(q.title)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <span>Solve</span>
                          <Icon name="external-link" size={13} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiences Subtab */}
            {intelligenceSubTab === 'experiences' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Interview Experiences for {activeCompany.name}
                  </h3>
                  <button
                    onClick={() => {
                      handleSubmitChange('company', activeCompany.name);
                      handleTabChange('submit');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Icon name="plus" size={15} />
                    <span>Submit Experience for {activeCompany.name}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {companyExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => handleSelectExperience(exp.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <ExperienceCard experience={exp} />
                    </div>
                  ))}

                  {companyExperiences.length === 0 && (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)' }}>No verified student reports yet for {activeCompany.name}.</p>
                      <button
                        onClick={() => {
                          handleSubmitChange('company', activeCompany.name);
                          handleTabChange('submit');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '1rem' }}
                      >
                        Be the first to share!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 3: INTERVIEW EXPERIENCES FEED & NESTED DETAIL
           ======================================================== */}
        {currentTab === 'experiences' && (
          <ScrollReveal direction="up">
            {/* If an experience is selected, display full nested detail view */}
            {selectedExperience ? (
              <div className="experience-detail-view">
                <button
                  className="back-link-btn"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('id');
                    setSearchParams(newParams);
                  }}
                >
                  <Icon name="arrow-left" size={15} />
                  <span>Back to all interview logs</span>
                </button>

                {/* Hero Card */}
                <div
                  className="glass-panel experience-hero"
                  style={{
                    background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
                    border: '1px solid var(--border-glass)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {selectedExperience.company}
                        </span>
                        {selectedExperience.verified && (
                          <span className="badge badge-cyan" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Icon name="shield" size={13} />
                            <span>VERIFIED RECORD</span>
                          </span>
                        )}
                        <Badge variant={selectedExperience.result === 'Selected' ? 'selected' : 'rejected'} size="md">
                          {selectedExperience.result}
                        </Badge>
                      </div>

                      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                        {selectedExperience.role}
                      </h2>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>Author: <strong style={{ color: '#FFFFFF' }}>{selectedExperience.authorName}</strong></span>
                        <span>•</span>
                        <span>Drive: <strong style={{ color: '#FFFFFF' }}>{selectedExperience.channel} ({selectedExperience.year})</strong></span>
                        <span>•</span>
                        <span>Compensation CTC: <strong style={{ color: 'var(--status-emerald)' }}>{selectedExperience.ctc}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpfulVoteBtn experienceId={selectedExperience.id} initialCount={selectedExperience.helpfulVotes} />
                      <button
                        onClick={() => toggleBookmark('experiences', selectedExperience.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Icon name={isBookmarked('experiences', selectedExperience.id) ? 'bookmark-filled' : 'bookmark'} size={16} />
                        <span>{isBookmarked('experiences', selectedExperience.id) ? 'Saved' : 'Bookmark'}</span>
                      </button>
                    </div>
                  </div>

                  {selectedExperience.prepAdvice && (
                    <div style={{ padding: '1.25rem', background: 'rgba(0, 212, 255, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Icon name="zap" size={15} />
                        <span>Candidate Preparation & Strategy Advice</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                        {selectedExperience.prepAdvice}
                      </p>
                    </div>
                  )}
                </div>

                {/* Round by Round Breakdown */}
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                  Round-by-Round Interview Logs ({selectedExperience.rounds?.length || 0} Rounds)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {selectedExperience.rounds?.map((round, idx) => (
                    <ExperienceRound key={idx} round={round} roundNumber={idx + 1} />
                  ))}
                </div>
              </div>
            ) : (
              /* Experiences Feed */
              <div>
                {/* Filter and Search Bar */}
                <div className="glass-panel filter-bar-card" style={{ marginBottom: '2rem' }}>
                  <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    <div className="search-icon">
                      <Icon name="search" size={17} />
                    </div>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search company, role, or topic (e.g. Google, DP)..."
                      value={expSearch}
                      onChange={(e) => setExpSearch(e.target.value)}
                    />
                  </div>

                  {/* Outcome Filter */}
                  <div className="filter-tabs">
                    {['All', 'Selected', 'Rejected'].map((outcome) => (
                      <button
                        key={outcome}
                        className={`tab-btn ${expOutcome === outcome ? 'active' : ''}`}
                        onClick={() => setExpOutcome(outcome)}
                      >
                        {outcome === 'All' ? 'All Outcomes' : outcome}
                      </button>
                    ))}
                  </div>

                  {/* Channel Filter */}
                  <select
                    className="select-input"
                    value={expChannel}
                    onChange={(e) => setExpChannel(e.target.value)}
                  >
                    <option value="All">All Channels</option>
                    <option value="On-Campus Drive">On-Campus Drive</option>
                    <option value="Off-Campus Drive">Off-Campus Drive</option>
                    <option value="Employee Referral">Employee Referral</option>
                  </select>

                  {/* Sort */}
                  <select
                    className="select-input"
                    value={expSortBy}
                    onChange={(e) => setExpSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="upvotes">Highest Upvotes</option>
                    <option value="difficulty">Hardest Interview</option>
                  </select>
                </div>

                {/* Experiences List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => handleSelectExperience(exp.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <ExperienceCard experience={exp} />
                    </div>
                  ))}

                  {filteredExperiences.length === 0 && (
                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                      <Icon name="search" size={36} color="var(--text-dim)" />
                      <h3 style={{ color: '#FFFFFF', marginTop: '1rem' }}>No experiences matched</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Try broadening your search or resetting the outcome filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 4: QUESTION BANK
           ======================================================== */}
        {currentTab === 'questions' && (
          <ScrollReveal direction="up">
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: '1 1 280px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <Icon name="search" size={17} />
                  </div>
                  <input
                    type="text"
                    className="search-input"
                    style={{ paddingLeft: '2.75rem', width: '100%' }}
                    placeholder="Search interview question, topic or company..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <select
                    className="select-input"
                    value={questionDifficulty}
                    onChange={(e) => setQuestionDifficulty(e.target.value)}
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <select
                    className="select-input"
                    value={questionCompanyFilter}
                    onChange={(e) => setQuestionCompanyFilter(e.target.value)}
                  >
                    <option value="All">All Companies</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Uber">Uber</option>
                    <option value="Goldman Sachs">Goldman Sachs</option>
                    <option value="Atlassian">Atlassian</option>
                  </select>
                </div>
              </div>

              {/* Topics Pills */}
              <div className="filter-tabs" style={{ margin: 0 }}>
                {questionTopics.map((topic) => (
                  <button
                    key={topic}
                    className={`tab-btn ${questionTopic === topic ? 'active' : ''}`}
                    onClick={() => setQuestionTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                <Icon name="search" size={36} color="var(--text-dim)" />
                <h3 style={{ color: '#FFFFFF', marginTop: '1rem' }}>No questions matched</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try resetting the topic or difficulty filters.</p>
              </div>
            )}
          </ScrollReveal>
        )}

        {/* ========================================================
            TAB 5: SHARE EXPERIENCE SUBMISSION WIZARD
           ======================================================== */}
        {currentTab === 'submit' && (
          <ScrollReveal direction="up">
            <div className="container-narrow">
              <div
                className="glass-panel"
                style={{
                  padding: '2.5rem',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 12, 24, 0.98) 100%)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <StepIndicator currentStep={submitStep} totalSteps={3} />

                <form onSubmit={submitStep === 3 ? handleSubmitForm : (e) => { e.preventDefault(); setSubmitStep(submitStep + 1); }}>
                  {/* Step 1: Basic Placement Info */}
                  {submitStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>
                        Step 1: Placement & Company Basics
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          <label className="input-label">Company Name *</label>
                          <input
                            type="text"
                            required
                            className="text-input"
                            value={submitFormData.company}
                            onChange={(e) => handleSubmitChange('company', e.target.value)}
                            placeholder="e.g. Amazon, Google, Uber"
                          />
                        </div>

                        <div>
                          <label className="input-label">Job Role / Title *</label>
                          <input
                            type="text"
                            required
                            className="text-input"
                            value={submitFormData.role}
                            onChange={(e) => handleSubmitChange('role', e.target.value)}
                            placeholder="e.g. SDE-1, SDE Intern"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          <label className="input-label">Recruitment Channel</label>
                          <select
                            className="select-input"
                            style={{ width: '100%' }}
                            value={submitFormData.channel}
                            onChange={(e) => handleSubmitChange('channel', e.target.value)}
                          >
                            <option value="On-Campus Drive">On-Campus Drive</option>
                            <option value="Off-Campus Drive">Off-Campus Drive</option>
                            <option value="Employee Referral">Employee Referral</option>
                          </select>
                        </div>

                        <div>
                          <label className="input-label">Final Outcome</label>
                          <select
                            className="select-input"
                            style={{ width: '100%' }}
                            value={submitFormData.result}
                            onChange={(e) => handleSubmitChange('result', e.target.value)}
                          >
                            <option value="Selected">Selected (Offer Received)</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          <label className="input-label">Offered CTC / Package</label>
                          <input
                            type="text"
                            className="text-input"
                            value={submitFormData.ctc}
                            onChange={(e) => handleSubmitChange('ctc', e.target.value)}
                            placeholder="e.g. ₹45 LPA or $140,000"
                          />
                        </div>

                        <div>
                          <label className="input-label">Drive Year</label>
                          <input
                            type="number"
                            className="text-input"
                            value={submitFormData.year}
                            onChange={(e) => handleSubmitChange('year', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <input
                          type="checkbox"
                          id="anon-check"
                          checked={submitFormData.anonymous}
                          onChange={(e) => handleSubmitChange('anonymous', e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                        />
                        <label htmlFor="anon-check" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                          Submit anonymously (hide your name from public listing)
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary btn-md">
                          <span>Continue to Rounds</span>
                          <Icon name="arrow-right" size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Dynamic Round Builder */}
                  {submitStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>
                          Step 2: Round-by-Round Breakdown
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Detail each technical / OA / HR round
                        </span>
                      </div>

                      <RoundBuilder
                        rounds={submitFormData.rounds}
                        onChange={(updatedRounds) => handleSubmitChange('rounds', updatedRounds)}
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-md"
                          onClick={() => setSubmitStep(1)}
                        >
                          <Icon name="arrow-left" size={16} />
                          <span>Back</span>
                        </button>

                        <button type="submit" className="btn btn-primary btn-md">
                          <span>Continue to Advice</span>
                          <Icon name="arrow-right" size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Preparation Advice & Verification */}
                  {submitStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>
                        Step 3: Preparation Advice & Verification
                      </h3>

                      <div>
                        <label className="input-label">Overall Interview Difficulty (1.0 = Very Easy, 5.0 = Brutal)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                          <input
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={submitFormData.difficulty}
                            onChange={(e) => handleSubmitChange('difficulty', parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: 'var(--accent-cyan)' }}
                          />
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', minWidth: '45px' }}>
                            {submitFormData.difficulty} / 5
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="input-label">Preparation Advice for Juniors *</label>
                        <textarea
                          rows={4}
                          required
                          className="textarea-input"
                          placeholder="What resources did you use? Any specific tips for OA time management, system design questions, or behavioral rounds?"
                          value={submitFormData.prepAdvice}
                          onChange={(e) => handleSubmitChange('prepAdvice', e.target.value)}
                        />
                      </div>

                      <div
                        style={{
                          padding: '1rem',
                          background: 'rgba(0, 212, 255, 0.05)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <strong style={{ color: 'var(--accent-cyan)' }}>Placement Integrity Standard:</strong> Your submission will be routed to the moderation desk to filter out spam and ensure genuine placement intel for students.
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-md"
                          onClick={() => setSubmitStep(2)}
                        >
                          <Icon name="arrow-left" size={16} />
                          <span>Back</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary btn-md"
                        >
                          {isSubmitting ? (
                            <span>Submitting to Desk...</span>
                          ) : (
                            <>
                              <Icon name="check-circle" size={16} />
                              <span>Submit Placement Report</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
