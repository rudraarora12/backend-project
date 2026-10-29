import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import { COMPANIES_DATA } from '../data/companies';
import { apiRequest } from '../services/apiClient';
import '../styles/auth.css';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Crisp Google Multi-Color SVG Logo
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

// Crisp Apple SVG Logo
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.5 2.65-1.24z" />
  </svg>
);

export const Login = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, showToast } = useApp();

  // Route awareness: /login defaults to 'login', /register defaults to 'register'
  const isLoginRoute = location.pathname.includes('login');
  const [mode, setMode] = useState(isLoginRoute ? 'login' : initialMode);

  // Two distinct login phases: Student vs Partner / Contributor
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') === 'partner' ? 'partner' : 'student';
  const [accountRole, setAccountRole] = useState(initialRole); // 'student' | 'partner'
  const [partnerCompany, setPartnerCompany] = useState('Amazon');
  const [partnerRoleTitle, setPartnerRoleTitle] = useState('Senior Software Engineer & Bar Raiser');

  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sign In specific state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Handle Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!acceptTerms) {
      showToast('Please accept the Terms & Conditions to continue.', 'warning');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'New Candidate';
    setSubmitting(true);
    try {
      const { user } = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          name: fullName,
          email: email.trim(),
          password,
          role: accountRole === 'partner' ? 'EXPERT' : 'STUDENT',
          ...(accountRole === 'partner' ? {
            companyName: partnerCompany.trim() || 'Amazon',
            roleTitle: partnerRoleTitle.trim() || 'Senior Software Engineer'
          } : {})
        }
      });
      login(user);
      if (user.role === 'EXPERT') {
        navigate('/partner');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Unable to create your account.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { user } = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email: loginEmail.trim(),
          password: loginPassword,
          role: accountRole === 'partner' ? 'EXPERT' : 'STUDENT',
          rememberMe
        }
      });
      login(user);
      if (user.role === 'EXPERT') {
        navigate('/partner');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Unable to sign in.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // One-Click Social SSO handlers (Firebase Google Auth)
  const handleGoogleAuth = async () => {
    try {
      setSubmitting(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const payload = {
        name: fbUser.displayName || 'Google Candidate',
        email: fbUser.email,
        avatar: fbUser.photoURL || null,
        role: accountRole === 'partner' ? 'EXPERT' : 'STUDENT'
      };

      try {
        const { user } = await apiRequest('/auth/firebase-login', {
          method: 'POST',
          body: payload
        });
        login(user);
      } catch {
        login({
          id: fbUser.uid,
          name: payload.name,
          email: payload.email,
          avatar: payload.avatar,
          role: accountRole === 'partner' ? 'EXPERT' : 'STUDENT'
        });
      }

      showToast(`Welcome, ${fbUser.displayName || 'Candidate'}!`, 'success');
      if (user.role === 'EXPERT') {
        navigate('/partner');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Google sign-in was canceled.', 'info');
      } else if (error.code === 'auth/operation-not-allowed') {
        showToast('Enable Google in Firebase Console: Authentication > Sign-in method > Google.', 'error', 7000);
      } else {
        showToast(error.message || 'Google sign-in failed.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAppleAuth = () => {
    showToast('Apple sign-in requires Apple Developer configuration.', 'info');
  };

  const handleDemoStudentLogin = async () => {
    try {
      setSubmitting(true);
      const payload = {
        name: 'Demo Placement Candidate',
        email: 'candidate.demo@intelligrid.dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };
      try {
        const { user } = await apiRequest('/auth/firebase-login', {
          method: 'POST',
          body: payload
        });
        login(user);
      } catch {
        login({
          id: 'demo-student-id',
          name: payload.name,
          email: payload.email,
          avatar: payload.avatar,
          role: accountRole === 'partner' ? 'EXPERT' : 'STUDENT'
        });
      }
      showToast('Logged in as Demo Student!', 'success');
      if (user.role === 'EXPERT') {
        navigate('/partner');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoPartnerLogin = async () => {
    try {
      setSubmitting(true);
      const { user } = await apiRequest('/auth/demo-partner', { method: 'POST' });
      login(user);
      showToast('Logged in as Verified Partner (Arjun Mehta - Amazon)!', 'success');
      navigate('/partner');
    } catch (error) {
      showToast(error.message || 'Unable to log in as partner.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="art-auth-card">
        {/* Left Column: Liquid Blue/Cyan Marble Artwork */}
        <div className="art-auth-banner">
          <div className="art-banner-content">
            <div className="art-banner-badge" style={{ marginBottom: '1.25rem' }}>
              <span className="section-tag-dot" />
              <span>INTELLIGRID 2026</span>
            </div>

            <h1 className="art-banner-title">
              {mode === 'register' ? (
                <>
                  Create your<br />Account
                </>
              ) : (
                <>
                  Welcome<br />Back
                </>
              )}
            </h1>

            <p className="art-banner-subtitle">
              {mode === 'register'
                ? 'Share your interview rounds and crack top offers!'
                : `Access ${COMPANIES_DATA.length} curated company profiles and practice roadmaps!`}
            </p>
          </div>
        </div>

        {/* Right Column: Clean Form Layout */}
        <div className="art-auth-form-side">
          {/* Dual Phase Selector: Student vs Partner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.4)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => setAccountRole('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: accountRole === 'student' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                background: accountRole === 'student' ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
                color: accountRole === 'student' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: accountRole === 'student' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none'
              }}
            >
              <span>🎓 Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountRole('partner')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: accountRole === 'partner' ? '1px solid var(--accent-purple)' : '1px solid transparent',
                background: accountRole === 'partner' ? 'rgba(108, 99, 255, 0.2)' : 'transparent',
                color: accountRole === 'partner' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: accountRole === 'partner' ? '0 0 15px rgba(108, 99, 255, 0.25)' : 'none'
              }}
            >
              <span>🤝 Partner Login</span>
            </button>
          </div>
          <div className="art-form-header">
            <h2 className="art-form-title">
              {accountRole === 'partner'
                ? (mode === 'register' ? 'Join as Partner' : 'Partner Sign In')
                : (mode === 'register' ? 'Student Sign Up' : 'Student Sign In')}
            </h2>
            <p className="art-form-subtitle">
              {mode === 'register'
                ? (accountRole === 'partner' ? 'Enter your details to create your verified Partner profile' : 'Enter your details to create your placement student account')
                : (accountRole === 'partner' ? 'Access candidate mock evaluations, debrief publishing, and honorarium.' : 'Enter your credentials to access your interview workspace')}
            </p>
          </div>

          {/* SIGN UP FORM */}
          {mode === 'register' ? (
            <form onSubmit={handleSignUpSubmit} className="art-form">
              <div>
                <input
                  type="text"
                  className="art-input"
                  placeholder="First name" autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  className="art-input"
                  placeholder="Last name" autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  className="art-input"
                  placeholder={accountRole === 'partner' ? 'Work / Partner email' : 'Email address'} autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {accountRole === 'partner' && mode === 'register' && (
                <>
                  <div>
                    <input
                      type="text"
                      className="art-input"
                      placeholder="Current Company (e.g. Amazon, Google, Microsoft)"
                      value={partnerCompany}
                      onChange={(e) => setPartnerCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="art-input"
                      placeholder="Role Title (e.g. Senior Software Engineer)"
                      value={partnerRoleTitle}
                      onChange={(e) => setPartnerRoleTitle(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="art-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="art-input"
                  placeholder="Password" autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={10}
                  required
                />
                <button
                  type="button"
                  className="art-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={17} />
                </button>
              </div>

              <div className="art-checkbox-row">
                <label className="art-checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>Accept Terms & Conditions</span>
                </label>
              </div>

              <button type="submit" className="art-btn-primary" disabled={submitting}>
                <span>Join us</span>
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </button>

              <div className="art-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="art-social-btn art-btn-google"
              >
                <GoogleIcon />
                <span>Sign up with Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                className="art-social-btn art-btn-apple"
              >
                <AppleIcon />
                <span>Sign up with Apple</span>
              </button>

              <button
                type="button"
                onClick={accountRole === 'partner' ? handleDemoPartnerLogin : handleDemoStudentLogin}
                className="art-social-btn art-btn-demo"
              >
                <Icon name="sparkles" size={14} color="#00D4FF" />
                <span>{accountRole === 'partner' ? 'One-Click Fast Demo Partner Login (Arjun Mehta - Amazon)' : 'One-Click Fast Demo Student Login'}</span>
              </button>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleSignInSubmit} className="art-form">
              <div>
                <input
                  type="email"
                  className="art-input"
                  placeholder={accountRole === 'partner' ? 'Work / Partner email' : 'Email address'} autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              {accountRole === 'partner' && mode === 'register' && (
                <>
                  <div>
                    <input
                      type="text"
                      className="art-input"
                      placeholder="Current Company (e.g. Amazon, Google, Microsoft)"
                      value={partnerCompany}
                      onChange={(e) => setPartnerCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="art-input"
                      placeholder="Role Title (e.g. Senior Software Engineer)"
                      value={partnerRoleTitle}
                      onChange={(e) => setPartnerRoleTitle(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="art-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="art-input"
                  placeholder="Password" autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="art-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={17} />
                </button>
              </div>

              <div className="art-checkbox-row">
                <label className="art-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password recovery is not available until email delivery is configured.', 'warning');
                  }}
                  className="art-forgot-link"
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="art-btn-primary" disabled={submitting}>
                <span>Sign In</span>
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </button>

              <div className="art-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="art-social-btn art-btn-google"
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                className="art-social-btn art-btn-apple"
              >
                <AppleIcon />
                <span>Sign in with Apple</span>
              </button>

              <button
                type="button"
                onClick={accountRole === 'partner' ? handleDemoPartnerLogin : handleDemoStudentLogin}
                className="art-social-btn art-btn-demo"
              >
                <Icon name="sparkles" size={14} color="#00D4FF" />
                <span>{accountRole === 'partner' ? 'One-Click Fast Demo Partner Login (Arjun Mehta - Amazon)' : 'One-Click Fast Demo Student Login'}</span>
              </button>
            </form>
          )}

          {/* Bottom Switch Prompt */}
          <div className="art-auth-switch">
            {mode === 'register' ? (
              <span>
                Already have an account?
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="art-switch-btn"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="art-switch-btn"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
