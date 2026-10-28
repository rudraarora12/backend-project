import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Companies', path: '/companies' },
    { label: 'Experiences', path: '/experiences' },
    { label: 'Prep Sprint', path: '/preparation' },
    { label: 'Question Bank', path: '/questions' },
    { label: 'Mock Connect', path: '/interview-connect' },
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '74px',
        backgroundColor: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.18)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #6C63FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)'
            }}
          >
            <Icon name="sparkles" size={20} color="#050811" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#FFFFFF' }}>Interview</span>
              <span className="text-cyan">Intelligence</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              IntelliGrid 2.0
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.3rem 0',
                transition: 'color 0.2s ease',
                textShadow: isActive ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none'
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/submit"
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Icon name="plus" size={16} />
            <span>Share Experience</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textDecoration: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(13, 21, 39, 0.8)',
                  border: '1px solid var(--border-glass)',
                  transition: 'all 0.2s'
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn-icon"
                title="Sign Out"
                style={{
                  color: 'var(--text-dim)',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  width: '34px',
                  height: '34px'
                }}
              >
                <Icon name="logout" size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              color: 'var(--text-main)',
              padding: '6px'
            }}
          >
            <Icon name={mobileMenuOpen ? 'close' : 'grid'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(5, 8, 17, 0.98)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.5rem 0'
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.9rem', color: 'var(--text-dim)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}
          >
            Moderator Console
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
