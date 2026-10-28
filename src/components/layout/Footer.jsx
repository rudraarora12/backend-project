import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icons';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'rgba(5, 8, 17, 0.95)',
        borderTop: '1px solid rgba(0, 212, 255, 0.12)',
        padding: '4rem 0 2rem',
        marginTop: '5rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #6C63FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon name="sparkles" size={18} color="#050811" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                Interview <span className="text-cyan">Intelligence</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Crowdsourced university campus placement intelligence & technical interview roadmap platform. Real round breakdowns, predictive company pattern analytics, and verified peer mock interviews.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--status-emerald)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-emerald)', boxShadow: '0 0 8px var(--status-emerald)' }} />
              <span className="font-mono">Placement Intelligence Nodes: ONLINE (650+ Companies)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Placement Hub
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/companies" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Company Topic Weightages</Link></li>
              <li><Link to="/experiences" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Interview Round Breakdowns</Link></li>
              <li><Link to="/preparation" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Adaptive Prep Sprints</Link></li>
              <li><Link to="/questions" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Universal Question Bank</Link></li>
            </ul>
          </div>

          {/* Peer Mock & Tools */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Practice & Mock
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/interview-connect" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>1-on-1 Peer Mentors</Link></li>
              <li><Link to="/video-session" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Simulated Mock Video Room</Link></li>
              <li><Link to="/dashboard" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Student Target Tracks</Link></li>
              <li><Link to="/submit" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Submit Placement Report</Link></li>
            </ul>
          </div>

          {/* Moderation & Admin */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Governance
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/admin" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Moderation Desk</Link></li>
              <li><Link to="/profile" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>Student Profile & Bookmarks</Link></li>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Strict Verification Protocol</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {new Date().getFullYear()} Interview Intelligence (IntelliGrid). Built for university aspiring engineers.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)' }}>
            <span>v2.8.4-PROD</span>
            <span className="text-cyan">ZERO-EXTERNAL-UI</span>
            <span className="text-purple">DARK-CYBER-PUNK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
