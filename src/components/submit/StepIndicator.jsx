import React from 'react';

export const StepIndicator = ({ currentStep = 1, steps = ['Company & Role', 'Rounds Breakdown', 'Preparation Advice'] }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: '600px', width: '100%', position: 'relative' }}>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <React.Fragment key={index}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isDone
                      ? 'var(--status-emerald)'
                      : isActive
                      ? 'linear-gradient(135deg, #00D4FF 0%, #6C63FF 100%)'
                      : 'rgba(13, 21, 39, 0.9)',
                    border: `2px solid ${isDone ? 'var(--status-emerald)' : isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    color: isDone || isActive ? '#050811' : 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isActive ? '0 0 20px rgba(0, 212, 255, 0.5)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isDone ? '✓' : stepNumber}
                </div>
                <span
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : isDone ? 'var(--text-main)' : 'var(--text-dim)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  style={{
                    height: '2px',
                    flex: 1,
                    background: isDone ? 'var(--status-emerald)' : 'var(--border-subtle)',
                    marginTop: '-1.5rem',
                    zIndex: 1,
                    transition: 'background 0.3s'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
