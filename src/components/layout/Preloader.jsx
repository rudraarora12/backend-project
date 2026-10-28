import React, { useState, useEffect } from 'react';

export const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('INITIALIZING INTELLIGRID PROTOCOLS...');

  useEffect(() => {
    const steps = [
      { p: 35, text: 'PARSING 650+ PLACEMENT INTELLIGENCE MATRICES...' },
      { p: 68, text: 'CALIBRATING TOPIC WEIGHTAGES & RECURRENCE PATTERNS...' },
      { p: 92, text: 'SYNCING CAMPUS VERIFIED HISTORICAL LOOPS...' },
      { p: 100, text: 'WORKSPACE READY. LAUNCHING...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);
      }
    }, 240);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#050811',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #00D4FF 0%, #6C63FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 35px rgba(0, 212, 255, 0.5)',
          animation: 'pulse-dot 1.8s infinite ease-in-out'
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#050811' }}>II</span>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div
          style={{
            height: '4px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00D4FF 0%, #6C63FF 100%)',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.8)',
              transition: 'width 0.25s ease-out'
            }}
          />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--accent-cyan)',
            letterSpacing: '0.08em',
            minHeight: '1.2rem'
          }}
        >
          {statusText} [{progress}%]
        </div>
      </div>
    </div>
  );
};
