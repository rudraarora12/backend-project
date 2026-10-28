import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

export const PrepProgress = ({ totalDays = 7, completedCount = 0, readinessScore = 0 }) => {
  const percentage = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
            Sprint Readiness Gauge
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Dynamic pacing based on completed daily missions
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono text-cyan" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            SPRINT PROGRESS
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <ProgressBar progress={percentage} showPercentage={false} height="10px" />

      {/* Stats Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
            {completedCount} / {totalDays}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Days Cleared
          </div>
        </div>

        <div>
          <div className="font-mono text-emerald" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {readinessScore}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Readiness Index
          </div>
        </div>

        <div>
          <div className="font-mono text-purple" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {totalDays - completedCount} Left
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Missions Remaining
          </div>
        </div>
      </div>
    </div>
  );
};
