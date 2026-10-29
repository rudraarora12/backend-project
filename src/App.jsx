import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Effects & Layout
import { GlobalBackground } from './components/effects/GlobalBackground';
import { ParticleBackground } from './components/effects/ParticleBackground';
import { AiChatWidget } from './components/effects/AiChatWidget';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Preloader } from './components/layout/Preloader';
import { ToastContainer } from './components/common/Toast';
import { Modal } from './components/common/Modal';

// Four Consolidated Primary Pages
import { CompanyPrep } from './pages/CompanyPrep';
import { AiRoadmap } from './pages/AiRoadmap';
import { MockInterviews } from './pages/MockInterviews';
import { ExpertChat } from './pages/ExpertChat';

// Landing Page & Contextual Utility Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PartnerPortal } from './pages/PartnerPortal';

// Styles
import './styles/global.css';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, search]);

  return null;
}

// Legacy Route Redirect Helpers
function LegacyCompanyRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/company-prep?tab=intelligence&company=${slug}`} replace />;
}

function LegacyExperienceRedirect() {
  const { id } = useParams();
  return <Navigate to={`/company-prep?tab=experiences&id=${id}`} replace />;
}

function LegacyCandidateRedirect() {
  const { id } = useParams();
  return <Navigate to={`/mock-interviews?tab=mentors&mentor=${id}`} replace />;
}

function AppContent() {
  const { user, isAuthenticated } = useApp();
  const isPartner = isAuthenticated && user?.role === 'EXPERT';

  return (
    <div className="app-layout">
      {/* Background Ambient Lighting and Particle Constellation Canvas */}
      <GlobalBackground />
      <ParticleBackground />

      {/* Navigation Header - dynamically displays ONLY the 2 partner pages when logged in as Partner */}
      <Navbar />

      {/* Main Route Content */}
      <main className="main-content">
        <Routes>
          {/* Public Landing View - if Partner, directs to their portal */}
          <Route path="/" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <Landing />} />

          {/* Student Primary Pages - Partner redirected to Partner Portal */}
          <Route path="/company-prep" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <CompanyPrep />} />
          <Route path="/ai-roadmap" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <AiRoadmap />} />
          <Route path="/mock-interviews" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <MockInterviews />} />
          <Route path="/expert-chat" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <ExpertChat />} />

          {/* Contextual & Account Utility Routes */}
          <Route path="/dashboard" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <Dashboard />} />
          <Route path="/profile" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <Profile />} />
          <Route path="/admin" element={<Admin />} />

          {/* THE TWO PARTNER PHASE PAGES */}
          <Route path="/partner" element={<PartnerPortal />} />
          <Route path="/partner-portal" element={<Navigate to="/partner?tab=sessions" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* LEGACY ROUTE REDIRECTS PRESERVING PARAMETERS */}
          <Route path="/companies" element={<Navigate to="/company-prep?tab=directory" replace />} />
          <Route path="/company/:slug" element={<LegacyCompanyRedirect />} />
          <Route path="/experiences" element={<Navigate to="/company-prep?tab=experiences" replace />} />
          <Route path="/experience/:id" element={<LegacyExperienceRedirect />} />
          <Route path="/preparation" element={<Navigate to="/ai-roadmap" replace />} />
          <Route path="/questions" element={<Navigate to="/company-prep?tab=questions" replace />} />
          <Route path="/interview-connect" element={<Navigate to="/mock-interviews" replace />} />
          <Route path="/candidate/:id" element={<LegacyCandidateRedirect />} />
          <Route path="/video-session" element={<Navigate to="/mock-interviews?tab=room" replace />} />
          <Route path="/submit" element={isPartner ? <Navigate to="/partner?tab=publish" replace /> : <Navigate to="/company-prep?tab=submit" replace />} />

          {/* Fallback route */}
          <Route path="*" element={isPartner ? <Navigate to="/partner?tab=sessions" replace /> : <Landing />} />
        </Routes>
      </main>

      {/* Platform Footer */}
      <Footer />

      {/* Global Backdrop Modal & Toast Container */}
      <Modal />
      <ToastContainer />

      {/* Floating AI Chat Widget — Hidden for Partners to keep workspace purely focused on their 2 pages */}
      {!isPartner && <AiChatWidget />}
    </div>
  );
}

export function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('ii_preloader_seen');
  });

  const handleFinishPreloader = () => {
    sessionStorage.setItem('ii_preloader_seen', 'true');
    setLoading(false);
  };

  return (
    <AppProvider>
      {loading && <Preloader onFinish={handleFinishPreloader} />}
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
