import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../common/Icons';

export const PomodoroTimer = () => {
  const [mode, setMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Play synthetic audio chime using Web Audio API
  const playCyberChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio might be restricted until user gesture
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playCyberChime();
            if (mode === 'focus') {
              setMode('break');
              return 5 * 60;
            } else {
              setMode('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.15)',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>
            <Icon name="clock" size={18} />
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Focus Pomodoro
          </span>
        </div>

        {/* Mode selector pills */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
          <button
            onClick={() => switchMode('focus')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: mode === 'focus' ? 'var(--accent-cyan)' : 'transparent',
              color: mode === 'focus' ? '#050811' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            25m Sprint
          </button>
          <button
            onClick={() => switchMode('break')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: mode === 'break' ? 'var(--status-emerald)' : 'transparent',
              color: mode === 'break' ? '#050811' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            5m Rest
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: mode === 'focus' ? '#FFFFFF' : 'var(--status-emerald)',
          textShadow: mode === 'focus' ? '0 0 20px rgba(0, 212, 255, 0.4)' : '0 0 20px rgba(16, 185, 129, 0.4)',
          lineHeight: 1,
          margin: '0.5rem 0 1rem'
        }}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: mode === 'focus' ? 'var(--accent-cyan)' : 'var(--status-emerald)',
            transition: 'width 1s linear'
          }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          style={{ minWidth: '110px' }}
        >
          <Icon name={isRunning ? 'pause' : 'play'} size={15} />
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={handleReset}
          className="btn btn-ghost btn-sm btn-icon"
          title="Reset timer"
        >
          <Icon name="reset" size={16} />
        </button>
      </div>
    </div>
  );
};
