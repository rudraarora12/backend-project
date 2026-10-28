import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateSchedule } from '../data/preparation';
import { COMPANIES_DATA } from '../data/companies';
import { PrepDay } from '../components/preparation/PrepDay';
import { PrepProgress } from '../components/preparation/PrepProgress';
import { PomodoroTimer } from '../components/preparation/PomodoroTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import '../styles/preparation.css';

export const Preparation = () => {
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'amazon';

  const { showToast } = useApp();

  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedLevel, setSelectedLevel] = useState('intermediate'); // 'beginner' | 'intermediate' | 'advanced'
  const [targetCompanySlug, setTargetCompanySlug] = useState(initialCompany);

  // Storage key for user sprint progress
  const storageKey = `ii_prep_v2_${targetCompanySlug}_${selectedDays}_${selectedLevel}`;
  const [sprintState, setSprintState] = useLocalStorage(storageKey, {
    completedDays: [1],
    completedProblems: ['p-101']
  });

  // Dynamically generate daily plan
  const dailyPlans = useMemo(() => {
    return generateSchedule(selectedDays, selectedLevel);
  }, [selectedDays, selectedLevel]);

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

  const selectedCompany = COMPANIES_DATA.find((c) => c.slug === targetCompanySlug) || COMPANIES_DATA[0];

  const readinessScore = Math.min(
    100,
    Math.round(((sprintState.completedDays?.length || 0) / selectedDays) * 90 + 10)
  );

  return (
    <div className="preparation-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Dynamic Study Roadmap Generator</span>
          </div>
          <h1 className="page-title">
            Adaptive Day-by-Day Prep Sprint
          </h1>
          <p className="page-subtitle">
            Tailor your interview preparation to target companies with sequential algorithmic missions, direct LeetCode tasks, and Pomodoro focus blocks.
          </p>
        </div>

        {/* Configuration Controls Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          {/* Company Target Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TARGET:</span>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '170px' }}
              value={targetCompanySlug}
              onChange={(e) => setTargetCompanySlug(e.target.value)}
            >
              {COMPANIES_DATA.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Sprint Buttons (7 / 14 / 30) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TIMEFRAME:</span>
            <div className="filter-tabs">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  className={`tab-btn ${selectedDays === days ? 'active' : ''}`}
                  onClick={() => setSelectedDays(days)}
                >
                  {days} Days Sprint
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LEVEL:</span>
            <div className="filter-tabs">
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  className={`tab-btn ${selectedLevel === lvl ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(lvl)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Grid: Daily Missions vs Sidebar (Gauges + Pomodoro) */}
        <div className="prep-layout-grid">
          {/* Main Daily Plans Accordion List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {selectedCompany.name} {selectedDays}-Day Sprint Plan
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Level: <strong style={{ color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>{selectedLevel}</strong> • Check off problems as you solve them on LeetCode.
                </p>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSprintState({ completedDays: [], completedProblems: [] });
                  showToast('Sprint progress reset.', 'info');
                }}
              >
                Reset Progress
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dailyPlans.map((dayPlan) => (
                <PrepDay
                  key={dayPlan.day}
                  dayPlan={dayPlan}
                  isCompleted={sprintState.completedDays?.includes(dayPlan.day)}
                  onToggleDay={toggleDayCompletion}
                  completedProblems={sprintState.completedProblems || []}
                  onToggleProblem={toggleProblemCompletion}
                />
              ))}
            </div>
          </div>

          {/* Sticky Right Sidebar */}
          <div className="prep-sidebar-sticky">
            {/* Completion Gauge */}
            <PrepProgress
              totalDays={selectedDays}
              completedCount={sprintState.completedDays?.length || 0}
              readinessScore={readinessScore}
            />

            {/* Focus Pomodoro Timer */}
            <PomodoroTimer />

            {/* Target Company Pro Tip */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem',
                border: '1px solid rgba(0, 212, 255, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', color: 'var(--accent-cyan)' }}>
                <Icon name="sparkles" size={17} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {selectedCompany.name} Pro Tip
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Top topics for {selectedCompany.name} are <strong>{selectedCompany.topTopics?.join(', ')}</strong>. Ensure you review their specific question patterns before final mock day!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
