import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Effects & Layout
import { GlobalBackground } from './components/effects/GlobalBackground';
import { ParticleBackground } from './components/effects/ParticleBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Preloader } from './components/layout/Preloader';
import { ToastContainer } from './components/common/Toast';
import { Modal } from './components/common/Modal';

// Pages
import { Landing } from './pages/Landing';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Experiences } from './pages/Experiences';
import { ExperienceDetail } from './pages/ExperienceDetail';
import { Preparation } from './pages/Preparation';
import { Dashboard } from './pages/Dashboard';
import { Questions } from './pages/Questions';
import { InterviewConnect } from './pages/InterviewConnect';
import { CandidateProfile } from './pages/CandidateProfile';
import { VideoSession } from './pages/VideoSession';
import { Submit } from './pages/Submit';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Styles
import './styles/global.css';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
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

          {/* Sticky Navigation Header */}
          <Navbar />

          {/* Main Route Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:slug" element={<CompanyDetail />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experience/:id" element={<ExperienceDetail />} />
              <Route path="/preparation" element={<Preparation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/interview-connect" element={<InterviewConnect />} />
              <Route path="/candidate/:id" element={<CandidateProfile />} />
              <Route path="/video-session" element={<VideoSession />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
