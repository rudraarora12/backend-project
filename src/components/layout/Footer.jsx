import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icons';
import { COMPANIES_DATA } from '../../data/companies';

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
              Interview preparation with company topic patterns, adaptive study roadmaps, and simulated peer mock interviews.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--status-emerald)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-emerald)', boxShadow: '0 0 8px var(--status-emerald)' }} />
              <span className="font-mono">Placement Intelligence Nodes: ONLINE ({COMPANIES_DATA.length} Company Profiles)</span>
            </div>
          </div>

          {/* Core Four Pillars */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Core Intelligence
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>
                <Link to="/company-prep" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  1. Company Prep & Intelligence
                </Link>
              </li>
              <li>
                <Link to="/ai-roadmap" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  2. Adaptive AI Roadmap
                </Link>
              </li>
              <li>
                <Link to="/mock-interviews" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  3. Peer & Mentor Mock Interviews
                </Link>
              </li>
              <li>
                <Link to="/expert-chat" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  4. 1-on-1 Expert Advisory Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice & Tools */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Practice & Submission
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>
                <Link to="/company-prep?tab=questions" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Universal Question Bank
                </Link>
              </li>
              <li>
                <Link to="/company-prep?tab=experiences" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Student Interview Logs
                </Link>
              </li>
              <li>
                <Link to="/company-prep?tab=submit" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Submit Placement Experience
                </Link>
              </li>
              <li>
                <Link to="/mock-interviews?tab=room" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Simulated Video Room (Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Moderation */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Student Portal
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>
                <Link to="/dashboard" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  My Target Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Profile & Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#00D4FF')} onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Placement Moderation Desk
                </Link>
              </li>
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
            © {new Date().getFullYear()} Interview Intelligence (IntelliGrid 2.0). Built for university aspiring engineers.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)' }}>
            <span>v2.8.5-CONSOLIDATED</span>
            <span className="text-cyan">FOUR-CORE-PILLARS</span>
            <span className="text-purple">DARK-CYBER-PUNK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
