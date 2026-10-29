import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchRole } = useApp();
  const isPartner = isAuthenticated && (user?.role === 'EXPERT');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Primary navigation items for students
  const studentNavLinks = [
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

  const handleSwitchToPartner = async () => {
    await switchRole('EXPERT');
    setProfileDropdownOpen(false);
    navigate('/partner?tab=requests');
  };

  const handleSwitchToStudent = async () => {
    await switchRole('STUDENT');
    setProfileDropdownOpen(false);
    navigate('/dashboard');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '74px',
        backgroundColor: 'rgba(5, 8, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isPartner ? '1px solid rgba(108, 99, 255, 0.4)' : '1px solid rgba(0, 212, 255, 0.16)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo & Brand */}
        <Link to={isPartner ? '/partner?tab=requests' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isPartner
                ? 'linear-gradient(135deg, #A78BFA 0%, #6C63FF 100%)'
                : 'linear-gradient(135deg, #00D4FF 0%, #6C63FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPartner ? '0 0 16px rgba(108, 99, 255, 0.45)' : '0 0 16px rgba(0, 212, 255, 0.45)',
              flexShrink: 0
            }}
          >
            <Icon name={isPartner ? 'shield' : 'sparkles'} size={20} color="#050811" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#FFFFFF' }}>Interview</span>
              <span className={isPartner ? 'text-purple' : 'text-cyan'}>
                {isPartner ? 'Partner' : 'Intelligence'}
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: isPartner ? '#A78BFA' : 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {isPartner ? 'PARTNER PHASE ACTIVE' : 'INTELLIGRID 2.0'}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
        >
          {isPartner ? (
            /* PARTNER ONLY: EXACTLY THE TWO REQUESTED PAGES */
            <>
              <NavLink
                to="/partner?tab=requests"
                style={({ isActive }) => {
                  const isCurrent = location.pathname.includes('partner') && (!location.search.includes('video'));
                  return {
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'all 0.2s ease',
                    textShadow: isCurrent ? '0 0 12px rgba(0, 212, 255, 0.6)' : 'none',
                    borderBottom: isCurrent ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  };
                }}
              >
                <Icon name="calendar" size={17} />
                <span>Student Session Requests</span>
              </NavLink>

              <NavLink
                to="/partner?tab=video"
                style={({ isActive }) => {
                  const isCurrent = location.pathname.includes('partner') && location.search.includes('video');
                  return {
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: isCurrent ? 'var(--accent-purple)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'all 0.2s ease',
                    textShadow: isCurrent ? '0 0 12px rgba(108, 99, 255, 0.6)' : 'none',
                    borderBottom: isCurrent ? '2px solid var(--accent-purple)' : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  };
                }}
              >
                <Icon name="video" size={17} />
                <span>Video Call Session</span>
              </NavLink>
            </>
          ) : (
            /* STUDENT NAVIGATION (ONLY WHEN LOGGED IN AS STUDENT) */
            studentNavLinks.map((link) => (
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
            ))
          )}
        </nav>

        {/* Action Controls & Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* If Student, show 1-click switch to Partner Mode */}
          {!isPartner && isAuthenticated && (
            <button
              type="button"
              onClick={handleSwitchToPartner}
              className="btn btn-purple btn-sm desktop-share-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', boxShadow: '0 0 15px rgba(108, 99, 255, 0.3)' }}
              title="Switch this account to Partner Mode"
            >
              <Icon name="shield" size={15} />
              <span>Switch to Partner Mode</span>
            </button>
          )}

          {/* If Partner, show 1-click button to go to Video Call or Switch */}
          {isPartner && (
            <button
              type="button"
              onClick={handleSwitchToStudent}
              className="btn btn-secondary btn-sm desktop-share-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
              title="Return to Student Mode"
            >
              <Icon name="grid" size={14} />
              <span>Switch to Student Mode</span>
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: isPartner ? 'rgba(20, 15, 45, 0.95)' : 'rgba(13, 21, 39, 0.85)',
                  border: isPartner ? '1px solid rgba(108, 99, 255, 0.5)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s',
                  boxShadow: isPartner ? '0 0 15px rgba(108, 99, 255, 0.25)' : 'none'
                }}
                aria-expanded={profileDropdownOpen}
                aria-label="User Account Menu"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isPartner ? '1.5px solid var(--accent-purple)' : '1.5px solid var(--accent-cyan)'
                  }}
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
                    width: '250px',
                    backgroundColor: 'rgba(10, 16, 32, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: isPartner ? '1px solid rgba(108, 99, 255, 0.4)' : '1px solid var(--border-glass)',
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
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{user.name}</span>
                      {isPartner && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(108, 99, 255, 0.3)', color: '#C4B5FD', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                          PARTNER
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {isPartner ? 'Verified Industry Partner & Mentor' : (user.college || 'Engineering Candidate')}
                    </div>
                  </div>

                  {isPartner ? (
                    /* PARTNER DROPDOWN: ONLY THE TWO PAGES */
                    <>
                      <Link
                        to="/partner?tab=requests"
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
                        <Icon name="calendar" size={16} color="var(--accent-cyan)" />
                        <span>Student Session Requests</span>
                      </Link>

                      <Link
                        to="/partner?tab=video"
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
                        <Icon name="video" size={16} color="var(--accent-purple)" />
                        <span>Video Call Session</span>
                      </Link>

                      <button
                        onClick={handleSwitchToStudent}
                        className="dropdown-item"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.75rem',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Icon name="grid" size={16} />
                        <span>Switch to Student Mode</span>
                      </button>
                    </>
                  ) : (
                    /* STUDENT DROPDOWN */
                    <>
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

                      <button
                        onClick={handleSwitchToPartner}
                        className="dropdown-item"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 0.75rem',
                          color: '#C4B5FD',
                          fontSize: '0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Icon name="shield" size={16} color="var(--accent-purple)" />
                        <span>Switch to Partner Mode</span>
                      </button>
                    </>
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
          {isPartner ? (
            /* MOBILE MENU FOR PARTNER: EXACTLY TWO PAGES */
            <>
              <NavLink
                to="/partner?tab=requests"
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: !location.search.includes('video') ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                })}
              >
                <Icon name="calendar" size={18} />
                <span>Student Session Requests</span>
              </NavLink>

              <NavLink
                to="/partner?tab=video"
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: location.search.includes('video') ? 'var(--accent-purple)' : 'var(--text-muted)',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                })}
              >
                <Icon name="video" size={18} />
                <span>Video Call Session</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--status-crimson)', justifyContent: 'center', marginTop: '1rem' }}
              >
                <Icon name="logout" size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            /* MOBILE MENU FOR STUDENTS */
            <>
              {studentNavLinks.map((link) => (
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

              <button
                onClick={handleSwitchToPartner}
                className="btn btn-purple btn-sm"
                style={{ justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <Icon name="shield" size={16} />
                <span>Switch to Partner Mode</span>
              </button>

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
              </div>
            </>
          )}
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
