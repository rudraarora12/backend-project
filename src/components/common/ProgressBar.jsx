import React from 'react';

export const ProgressBar = ({
  progress = 0,
  label = '',
  height = '8px',
  color = 'linear-gradient(90deg, #00D4FF 0%, #6C63FF 100%)',
  showPercentage = true,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`progress-container ${className}`} style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.35rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)'
          }}
        >
          {label && <span style={{ fontWeight: 500 }}>{label}</span>}
          {showPercentage && (
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)'
          }}
        />
      </div>
    </div>
  );
};
