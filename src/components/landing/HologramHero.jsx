import React from 'react';
import { Icon } from '../common/Icons';

export const HologramHero = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        perspective: '1000px'
      }}
    >
      {/* Outer Hologram Card Frame */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(0, 212, 255, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 212, 255, 0.25)',
          background: 'linear-gradient(145deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Hologram Scan Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)',
            boxShadow: '0 0 15px #00D4FF',
            animation: 'float 4s infinite ease-in-out'
          }}
        />

        {/* Card Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
            <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', letterSpacing: '0.06em' }}>
              RECRUITMENT PATTERN SCANNER
            </span>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
            LIVE FEED
          </span>
        </div>

        {/* Target Company Radar Preview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Amazon</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SDE-1 Hiring Pattern</span>
            </div>
            <span className="badge badge-selected" style={{ fontSize: '0.72rem' }}>
              94% ACCURACY
            </span>
          </div>

          {/* Hologram Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Trees, BFS & Graphs</span>
                <span className="font-mono text-cyan">45% Focus</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #00D4FF, #0099FF)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Leadership Principles (STAR)</span>
                <span className="font-mono text-purple">25% Focus</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #6C63FF, #A78BFA)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Low Level Design & Concurrency</span>
                <span className="font-mono text-emerald">15% Focus</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Question Snip */}
        <div
          style={{
            background: 'rgba(7, 12, 24, 0.75)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 212, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Icon name="code" size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>LRU Cache Implementation</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reported 88 times in 2026 loops</div>
            </div>
          </div>
          <span className="badge badge-medium" style={{ fontSize: '0.68rem' }}>
            MEDIUM
          </span>
        </div>

        {/* Bottom Metrics Pill */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>CAMPUS DRIVE STATUS:</span>
          <span style={{ color: 'var(--status-emerald)', fontWeight: 600 }}>PULLING BATCH 2026 OFFERS</span>
        </div>
      </div>
    </div>
  );
};
