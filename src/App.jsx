import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Effects & Layout
import { GlobalBackground } from './components/effects/GlobalBackground';
import { ParticleBackground } from './components/effects/ParticleBackground';
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

        <div className="app-layout">
          {/* Background Ambient Lighting and Particle Constellation Canvas */}
          <GlobalBackground />
          <ParticleBackground />

          {/* Sticky Navigation Header with Exactly FOUR Primary Links */}
          <Navbar />

          {/* Main Route Content */}
          <main className="main-content">
            <Routes>
              {/* Public Landing View */}
              <Route path="/" element={<Landing />} />

              {/* EXACTLY FOUR PRIMARY NAVIGATION DESTINATIONS */}
              {/* 1. Company Prep (Directory, Topic Intelligence, Experiences Feed/Detail, Question Bank, Submission) */}
              <Route path="/company-prep" element={<CompanyPrep />} />

              {/* 2. AI Roadmap (Setup Form, Adaptive Sprints, Daily Missions, Pomodoro Timer) */}
              <Route path="/ai-roadmap" element={<AiRoadmap />} />

              {/* 3. Mock Interviews (Mentor Directory, Booking Flow, My Bookings, Simulated Video Room) */}
              <Route path="/mock-interviews" element={<MockInterviews />} />

              {/* 4. Expert Chat (1-on-1 Direct Text Advisory, Domain Mentors, Client-side History) */}
              <Route path="/expert-chat" element={<ExpertChat />} />

              {/* Contextual & Account Utility Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
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
              <Route path="/submit" element={<Navigate to="/company-prep?tab=submit" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>

          {/* Platform Footer */}
          <Footer />

          {/* Global Backdrop Modal & Toast Container */}
          <Modal />
          <ToastContainer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
