import React from 'react';
import { TRACK_CONFIGS } from '../../data/dashboard';
import { useApp } from '../../context/AppContext';
import { dashboardApi } from '../../services/api';
import { ProgressBar } from '../common/ProgressBar';

export const TrackSwitcher = ({
  currentTrackKey = null,
  onTrackChanged = null,
  mongoMilestones = {},
  onMilestoneChanged = null
}) => {
  const { activeTrack: contextActiveTrack, setActiveTrack } = useApp();
  const selectedTrackKey = currentTrackKey || contextActiveTrack || 'amazon';
  const currentTrack = TRACK_CONFIGS[selectedTrackKey] || TRACK_CONFIGS.amazon;
  const tracks = Object.keys(TRACK_CONFIGS);

  const handleSelectTrack = async (key) => {
    setActiveTrack(key);
    if (onTrackChanged) {
      onTrackChanged(key);
    }
    try {
      await dashboardApi.setTrack(key);
    } catch (err) {
      console.warn('Failed to save track to MongoDB:', err);
    }
  };

  const handleToggleMilestone = async (mId, currentStatus) => {
    const nextStatus =
      currentStatus === 'completed'
        ? 'in_progress'
        : currentStatus === 'in_progress'
        ? 'todo'
        : 'completed';

    if (onMilestoneChanged) {
      onMilestoneChanged(mId, nextStatus);
    }

    try {
      await dashboardApi.setMilestone(mId, nextStatus);
    } catch (err) {
      console.warn('Failed to save milestone to MongoDB:', err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
      {/* Track Selector Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {tracks.map((key) => {
          const t = TRACK_CONFIGS[key];
          const isActive = selectedTrackKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectTrack(key)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? `${t.accentColor}25` : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isActive ? t.accentColor : 'var(--border-subtle)'}`,
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: t.accentColor,
                  boxShadow: isActive ? `0 0 10px ${t.accentColor}` : 'none'
                }}
              />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Track Details Card */}
      <div
        style={{
          background: 'rgba(7, 12, 24, 0.6)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>{currentTrack.name}</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                {currentTrack.targetRole}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              {currentTrack.description}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: currentTrack.accentColor }}>
              {currentTrack.metrics.readinessScore}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Target Readiness
            </div>
          </div>
        </div>

        {/* Multi-skill progress bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', margin: '1.25rem 0' }}>
          <div>
            <ProgressBar label="DSA & Problem Solving" progress={currentTrack.metrics.dsaMastery} height="6px" />
          </div>
          <div>
            <ProgressBar label="Behavioral / LP Mastery" progress={currentTrack.metrics.lpMastery} height="6px" color="linear-gradient(90deg, #6C63FF, #A78BFA)" />
          </div>
          <div>
            <ProgressBar label="System & Architecture" progress={currentTrack.metrics.lldMastery} height="6px" color="linear-gradient(90deg, #10B981, #34D399)" />
          </div>
        </div>

        {/* Syllabus Milestones */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              CAMPUS RECRUITMENT MILESTONES (CLICK TO TOGGLE PROGRESS)
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Auto-saved to MongoDB</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {currentTrack.milestones.map((m) => {
              const status = mongoMilestones[m.id] || m.status;
              const isDone = status === 'completed';
              const isInProg = status === 'in_progress';

              return (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id, status)}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13, 21, 39, 0.8)',
                    border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.4)' : isInProg ? 'rgba(0, 212, 255, 0.4)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to toggle: Completed -> In Progress -> Todo"
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isDone ? 'var(--status-emerald)' : isInProg ? 'var(--accent-cyan)' : 'transparent',
                      border: `1px solid ${isDone ? 'var(--status-emerald)' : isInProg ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      color: '#050811',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {isDone ? '✓' : isInProg ? '•' : ''}
                  </span>
                  <span style={{ fontSize: '0.825rem', color: isDone ? 'var(--text-muted)' : '#FFFFFF', fontWeight: 500 }}>
                    {m.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
