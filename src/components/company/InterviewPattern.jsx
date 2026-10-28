import React from 'react';

export const InterviewPattern = ({ pattern = [] }) => {
  if (!pattern || !pattern.length) return null;

  const colors = [
    { fill: 'linear-gradient(90deg, #00D4FF 0%, #0099FF 100%)', text: 'var(--accent-cyan)' },
    { fill: 'linear-gradient(90deg, #6C63FF 0%, #A78BFA 100%)', text: '#A78BFA' },
    { fill: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', text: 'var(--status-emerald)' },
    { fill: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)', text: 'var(--status-amber)' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
            Recruitment Topic Weightages
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Historical distribution of questions asked across campus rounds
          </p>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
          VERIFIED DATA
        </span>
      </div>

      {/* Visual Stacked Multi-Color Bar */}
      <div
        style={{
          height: '14px',
          width: '100%',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          marginBottom: '1.5rem'
        }}
      >
        {pattern.map((item, index) => {
          const colorObj = colors[index % colors.length];
          return (
            <div
              key={index}
              style={{
                width: `${item.percentage}%`,
                height: '100%',
                background: colorObj.fill,
                transition: 'width 0.8s ease'
              }}
              title={`${item.label}: ${item.percentage}%`}
            />
          );
        })}
      </div>

      {/* Detailed Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {pattern.map((item, index) => {
          const colorObj = colors[index % colors.length];
          return (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  {item.label}
                </span>
                <span className="font-mono" style={{ color: colorObj.text, fontWeight: 700 }}>
                  {item.percentage}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: colorObj.fill,
                    borderRadius: 'var(--radius-full)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
