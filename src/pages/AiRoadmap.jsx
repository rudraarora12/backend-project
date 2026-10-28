import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { generateCustomRoadmap } from '../data/preparation';
import { COMPANIES_DATA } from '../data/companies';
import { PrepDay } from '../components/preparation/PrepDay';
import { PrepProgress } from '../components/preparation/PrepProgress';
import { PomodoroTimer } from '../components/preparation/PomodoroTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/preparation.css';

export const AiRoadmap = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'amazon';
  const { showToast } = useApp();

  // Setup form states
  const [targetCompanySlug, setTargetCompanySlug] = useState(initialCompany);
  const [targetRole, setTargetRole] = useState('SDE-1 (Full Time)');
  const [selectedLevel, setSelectedLevel] = useState('intermediate'); // 'beginner' | 'intermediate' | 'advanced'
  const [selectedDays, setSelectedDays] = useState(7); // 7 | 14 | 30
  const [dailyHours, setDailyHours] = useState(3); // 2 | 3 | 5
  const [selectedFocusAreas, setSelectedFocusAreas] = useState(['DSA', 'System Design', 'Behavioral']);

  // Configuration panel collapsed/expanded toggle
  const [configExpanded, setConfigExpanded] = useState(false);

  // Storage key for user sprint progress
  const storageKey = `ii_ai_roadmap_v2_${targetCompanySlug}_${selectedDays}_${selectedLevel}_${dailyHours}h`;
  const [sprintState, setSprintState] = useLocalStorage(storageKey, {
    completedDays: [1],
    completedProblems: ['p-101']
  });

  // Dynamically generate daily plan
  const dailyPlans = useMemo(() => {
    return generateCustomRoadmap({
      days: selectedDays,
      level: selectedLevel,
      targetCompany: targetCompanySlug,
      role: targetRole,
      dailyHours,
      focusAreas: selectedFocusAreas
    });
  }, [selectedDays, selectedLevel, targetCompanySlug, targetRole, dailyHours, selectedFocusAreas]);

  const toggleDayCompletion = (dayNumber) => {
    setSprintState((prev) => {
      const isDone = prev.completedDays.includes(dayNumber);
      const updatedDays = isDone
        ? prev.completedDays.filter((d) => d !== dayNumber)
        : [...prev.completedDays, dayNumber];

      showToast(
        isDone ? `Marked Day ${dayNumber} incomplete` : `Awesome! Day ${dayNumber} completed!`,
        isDone ? 'info' : 'success'
      );

      return {
        ...prev,
        completedDays: updatedDays
      };
    });
  };

  const toggleProblemCompletion = (problemId) => {
    setSprintState((prev) => {
      const isDone = (prev.completedProblems || []).includes(problemId);
      const updatedProbs = isDone
        ? prev.completedProblems.filter((p) => p !== problemId)
        : [...(prev.completedProblems || []), problemId];

      return {
        ...prev,
        completedProblems: updatedProbs
      };
    });
  };

  const selectedCompany = useMemo(() => {
    if (targetCompanySlug === 'general') {
      return {
        name: 'General Campus Placement',
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
        avgDifficulty: 3.8
      };
    }
    return COMPANIES_DATA.find((c) => c.slug === targetCompanySlug) || COMPANIES_DATA[0];
  }, [targetCompanySlug]);

  const readinessScore = Math.min(
    100,
    Math.round(((sprintState.completedDays?.length || 0) / selectedDays) * 90 + 10)
  );

  const focusAreaOptions = ['DSA', 'System Design', 'DBMS', 'OS', 'OOP', 'Behavioral'];

  const toggleFocusArea = (area) => {
    if (selectedFocusAreas.includes(area)) {
      if (selectedFocusAreas.length > 1) {
        setSelectedFocusAreas(selectedFocusAreas.filter((a) => a !== area));
      }
    } else {
      setSelectedFocusAreas([...selectedFocusAreas, area]);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your checklist progress for this roadmap configuration?')) {
      setSprintState({ completedDays: [], completedProblems: [] });
      showToast('Progress reset for current sprint.', 'info');
    }
  };

  return (
    <div className="ai-roadmap-page" style={{ paddingBottom: '5rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '1.75rem' }}>
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Personalized Placement Intelligence</span>
          </div>
          <h1 className="page-title">
            Adaptive AI Interview Roadmap
          </h1>
          <p className="page-subtitle">
            Generate an actionable day-by-day technical study schedule tailored to your target company, role, available daily study hours, and current skill baseline.
          </p>
        </div>

        {/* Honest System Architecture Disclaimer */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(108, 99, 255, 0.08)',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ color: '#A78BFA' }}>
              <Icon name="sparkles" size={18} />
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <strong>Algorithmic Schedule Engine (Demo Mode):</strong> Deterministic curriculum generator with integrated LeetCode problem mappings and Pomodoro focus blocks.
            </div>
          </div>
          <Badge variant="purple" size="sm">
            RULE-BASED OPTIMIZER
          </Badge>
        </div>

        {/* Roadmap Setup & Customization Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2.5rem',
            border: '1px solid var(--border-glass)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img
                src={selectedCompany.logo}
                alt={selectedCompany.name}
                style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(0,0,0,0.4)', padding: '4px' }}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Target: {selectedCompany.name} • {targetRole}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedDays}-Day Sprint • ~{dailyHours} Hours/Day • {selectedLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setConfigExpanded(!configExpanded)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon name="sliders" size={15} />
              <span>{configExpanded ? 'Collapse Settings' : 'Customize Goals & Schedule'}</span>
            </button>
          </div>

          {/* Collapsible Detailed Configuration Form */}
          {configExpanded && (
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {/* Target Company */}
                <div>
                  <label className="input-label">Target Company</label>
                  <select
                    className="select-input"
                    style={{ width: '100%' }}
                    value={targetCompanySlug}
                    onChange={(e) => {
                      setTargetCompanySlug(e.target.value);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('company', e.target.value);
                      setSearchParams(newParams);
                    }}
                  >
                    <option value="general">🎯 General Campus Placement</option>
                    {COMPANIES_DATA.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Role */}
                <div>
                  <label className="input-label">Target Role</label>
                  <select
                    className="select-input"
                    style={{ width: '100%' }}
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  >
                    <option value="SDE-1 (Full Time)">SDE-1 (Full Time)</option>
                    <option value="SDE Intern (Summer/Fall)">SDE Intern (Summer/Fall)</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend / Full Stack Engineer">Frontend / Full Stack Engineer</option>
                    <option value="AI / ML Systems Intern">AI / ML Systems Intern</option>
                  </select>
                </div>

                {/* Daily Time Budget */}
                <div>
                  <label className="input-label">Daily Available Time</label>
                  <select
                    className="select-input"
                    style={{ width: '100%' }}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                  >
                    <option value={2}>1 - 2 Hours / Day (Focused)</option>
                    <option value={3}>2 - 4 Hours / Day (Balanced)</option>
                    <option value={5}>4 - 6+ Hours / Day (Intensive)</option>
                  </select>
                </div>
              </div>

              {/* Sprint Duration & Level */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="input-label">Sprint Duration</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[7, 14, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        className={`tab-btn ${selectedDays === days ? 'active' : ''}`}
                        style={{ flex: 1, textAlign: 'center' }}
                        onClick={() => setSelectedDays(days)}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Current Skill Baseline</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        className={`tab-btn ${selectedLevel === lvl ? 'active' : ''}`}
                        style={{ flex: 1, textAlign: 'center', textTransform: 'capitalize' }}
                        onClick={() => setSelectedLevel(lvl)}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Focus Areas Multi-Select */}
              <div>
                <label className="input-label">Target Focus Areas (Select multiple)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {focusAreaOptions.map((area) => {
                    const isSelected = selectedFocusAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleFocusArea(area)}
                        className={`tab-btn ${isSelected ? 'active' : ''}`}
                        style={{
                          borderRadius: 'var(--radius-full)',
                          padding: '0.35rem 0.85rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        {isSelected && <Icon name="check" size={13} />}
                        <span>{area}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <Icon name="refresh-cw" size={14} />
                  <span>Reset Progress</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfigExpanded(false);
                    showToast('Roadmap generated and calibrated!', 'success');
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Icon name="check" size={15} />
                  <span>Apply & Close</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sprint Dashboard Grid: Daily Accordion on Left, Gauges & Pomodoro on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Daily Roadmap Missions */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Daily Sprint Missions ({dailyPlans.length} Days)
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {sprintState.completedDays.length} / {selectedDays} Days Completed
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {dailyPlans.map((dayPlan) => (
                <PrepDay
                  key={dayPlan.day}
                  dayPlan={dayPlan}
                  isCompleted={sprintState.completedDays.includes(dayPlan.day)}
                  completedProblems={sprintState.completedProblems || []}
                  onToggleDay={() => toggleDayCompletion(dayPlan.day)}
                  onToggleProblem={toggleProblemCompletion}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Readiness Score Gauge & Pomodoro Focus Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Readiness Gauge */}
            <ScrollReveal direction="left" delay={0.1}>
              <PrepProgress
                readinessScore={readinessScore}
                completedDaysCount={sprintState.completedDays.length}
                totalDays={selectedDays}
                completedProblemsCount={(sprintState.completedProblems || []).length}
              />
            </ScrollReveal>

            {/* Pomodoro Focus Timer Component */}
            <ScrollReveal direction="left" delay={0.2}>
              <PomodoroTimer />
            </ScrollReveal>

            {/* Quick Link to Mock Interviews Checkpoint */}
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <Icon name="video" size={18} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Ready to test your readiness?
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Simulate a real 45-minute technical mock interview with a verified engineer from {selectedCompany.name}.
              </p>
              <Link to="/mock-interviews" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Book 1-on-1 Mock Interview</span>
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
