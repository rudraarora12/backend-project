import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Exactly THREE primary navigation items (AI is now the floating widget)
  const navLinks = [
    { label: 'Company Prep', path: '/company-prep' },
    { label: 'Mock Interviews', path: '/mock-interviews' },
    { label: 'Expert Chat', path: '/expert-chat' }
  ];

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
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
        backgroundColor: 'rgba(5, 8, 17, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.16)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo & Brand */}
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
              boxShadow: '0 0 16px rgba(0, 212, 255, 0.45)',
              flexShrink: 0
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

        {/* Desktop Navigation Links — EXACTLY FOUR PRIMARY ITEMS */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.925rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.4rem 0',
                transition: 'all 0.2s ease',
                textShadow: isActive ? '0 0 12px rgba(0, 212, 255, 0.6)' : 'none',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent'
              })}
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'EXPERT' && (
            <NavLink
              to="/partner"
              style={({ isActive }) => ({
                fontSize: '0.88rem',
                fontWeight: 700,
                color: isActive ? '#FFFFFF' : '#C4B5FD',
                textDecoration: 'none',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.4) 0%, rgba(0, 212, 255, 0.3) 100%)' : 'rgba(108, 99, 255, 0.15)',
                border: '1px solid rgba(108, 99, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isActive ? '0 0 15px rgba(108, 99, 255, 0.4)' : 'none'
              })}
            >
              <Icon name="shield" size={14} color="#A78BFA" />
              <span>Partner Phase</span>
            </NavLink>
          )}
        </nav>

        {/* Action Controls & Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Secondary CTA: Share Experience */}
          <Link
            to="/company-prep?tab=submit"
            className="btn btn-primary btn-sm desktop-share-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
          >
            <Icon name="plus" size={15} />
            <span>Share Experience</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(13, 21, 39, 0.85)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
                aria-expanded={profileDropdownOpen}
                aria-label="User Account Menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <Icon name={profileDropdownOpen ? 'chevron-up' : 'chevron-down'} size={14} color="var(--text-dim)" />
              </button>

              {/* Account Dropdown */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'rgba(10, 16, 32, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 212, 255, 0.1)',
                    padding: '0.75rem',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {user.role === 'EXPERT' ? 'Verified Industry Partner & Mentor' : (user.college || 'Engineering Candidate')}
                    </div>
                  </div>

                  {user.role === 'EXPERT' && (
                    <Link
                      to="/partner"
                      className="dropdown-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.55rem 0.75rem',
                        color: '#C4B5FD',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        background: 'rgba(108, 99, 255, 0.15)',
                        border: '1px solid rgba(108, 99, 255, 0.3)',
                        marginBottom: '0.35rem'
                      }}
                    >
                      <Icon name="shield" size={16} color="var(--accent-purple)" />
                      <strong style={{ color: '#FFFFFF' }}>Partner Phase Desk</strong>
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Icon name="grid" size={16} color="var(--accent-cyan)" />
                    <span>My Target Dashboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Icon name="bookmark" size={16} color="var(--accent-cyan)" />
                    <span>Profile & Bookmarks</span>
                  </Link>

                  <Link
                    to="/admin"
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Icon name="shield" size={16} color="var(--accent-purple)" />
                    <span>Moderation Desk</span>
                  </Link>

                  {user.role !== 'EXPERT' && (
                    <Link
                      to="/login?role=partner"
                      className="dropdown-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.55rem 0.75rem',
                        color: '#C4B5FD',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        transition: 'background 0.2s'
                      }}
                    >
                      <Icon name="users" size={16} color="var(--accent-purple)" />
                      <span>Switch to Partner Mode</span>
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.55rem 0.75rem',
                        color: 'var(--status-crimson)',
                        fontSize: '0.85rem',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon name="logout" size={16} color="var(--status-crimson)" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              color: 'var(--text-main)',
              border: 'none',
              padding: '6px',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'grid'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(5, 8, 17, 0.98)',
            backdropFilter: 'blur(25px)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)',
            zIndex: 999
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                fontSize: '1.05rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                textDecoration: 'none'
              })}
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/company-prep?tab=submit"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary btn-sm"
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <Icon name="plus" size={16} />
            <span>Share Experience</span>
          </Link>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              Target Dashboard
            </Link>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              Profile
            </Link>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              Admin
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .dropdown-item:hover {
          background: rgba(0, 212, 255, 0.1) !important;
          color: var(--accent-cyan) !important;
        }
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .desktop-share-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
