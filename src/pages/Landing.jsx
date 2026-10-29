import React from 'react';
import { Link } from 'react-router-dom';
import { HologramHero } from '../components/landing/HologramHero';
import { StatsSection } from '../components/landing/StatsSection';
import { LiveFeed } from '../components/auth/LiveFeed';
import { CompanyCard } from '../components/company/CompanyCard';
import { COMPANIES_DATA } from '../data/companies';
import { Icon } from '../components/common/Icons';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/landing.css';

export const Landing = () => {
  const trendingCompanies = COMPANIES_DATA.slice(0, 3);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LiveFeed />
          </div>

          <div className="hero-grid">
            <ScrollReveal direction="left">
              <div>
                <div className="section-tag">
                  <span className="section-tag-dot" />
                  <span>Campus Placement Intelligence 2026</span>
                </div>

                <h1 className="hero-title">
                  Demystify Tech Interviews with <span className="text-gradient">Real Placement</span> Data.
                </h1>

                <p className="hero-description">
                  Explore sample technical interview experiences and company topic patterns, build adaptive study sprints, and practice with simulated 1-on-1 mocks.
                </p>

                <div className="hero-actions">
                  <Link to="/company-prep" className="btn btn-primary btn-lg">
                    <span>Company Prep</span>
                    <Icon name="arrow-right" size={18} />
                  </Link>

                  <Link to="/ai-roadmap" className="btn btn-secondary btn-lg">
                    <Icon name="zap" size={18} />
                    <span>AI Roadmap</span>
                  </Link>

                  <Link to="/mock-interviews" className="btn btn-purple btn-lg">
                    <Icon name="video" size={18} />
                    <span>Mock Interviews</span>
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon name="check-circle" size={16} color="var(--status-emerald)" />
                    <span>FAANG & Tier-1 Curated</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon name="check-circle" size={16} color="var(--status-emerald)" />
                    <span>Auto-Linked LeetCode</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon name="check-circle" size={16} color="var(--status-emerald)" />
                    <span>Community Interview Samples</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <HologramHero />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="container">
        <ScrollReveal direction="up">
          <StatsSection />
        </ScrollReveal>
      </section>

      {/* Trending Companies Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">
                <span className="section-tag-dot" />
                <span>Recruitment Trends</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Top Target Companies This Drive
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Deep-dive into round difficulty, question distribution, and verified candidate experiences.
              </p>
            </div>

            <Link to="/company-prep?tab=directory" className="btn btn-secondary btn-sm">
              <span>View All {COMPANIES_DATA.length} Companies</span>
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>

          <div className="grid-cards">
            {trendingCompanies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: 'rgba(7, 12, 24, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <div className="section-tag">
              <span className="section-tag-dot" />
              <span>Full-Stack Preparation Architecture</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Consolidated Four-Pillar Intelligence
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Everything a student needs from Day 0 foundation building to Day 30 on-site final interview rounds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <ScrollReveal delay={0.1}>
              <div className="glass-panel feature-card">
                <div>
                  <div className="feature-icon-wrapper">
                    <Icon name="layers" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                    1. Company Prep
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Explore {COMPANIES_DATA.length} curated company profiles, topic patterns, sample interview reports, and a question bank.
                  </p>
                </div>
                <Link to="/company-prep" style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Analyze Companies</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="glass-panel feature-card">
                <div>
                  <div className="feature-icon-wrapper" style={{ background: 'var(--accent-purple-dim)', color: '#A78BFA' }}>
                    <Icon name="zap" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                    2. AI Roadmap
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    7-day, 14-day, and 30-day dynamic roadmaps tailored to your target company, role, and daily study hours with Pomodoro timer.
                  </p>
                </div>
                <Link to="/ai-roadmap" style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Start Daily Sprint</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="glass-panel feature-card">
                <div>
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-emerald)' }}>
                    <Icon name="video" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                    3. Mock Interviews
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Simulate real interview loops with placed seniors from Amazon, Google, Microsoft, Uber, and receive tactical rating debriefs.
                  </p>
                </div>
                <Link to="/mock-interviews" style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Book Mock Session</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="glass-panel feature-card">
                <div>
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(0, 212, 255, 0.15)', color: 'var(--accent-cyan)' }}>
                    <Icon name="message-circle" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                    4. Expert Chat
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Direct 1-on-1 text advisory with campus alumni and placed mentors for quick doubts on OA strategy, resumes, and culture.
                  </p>
                </div>
                <Link to="/expert-chat" style={{ marginTop: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Start Chatting</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.35)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 212, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(ellipse, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
              }}
            />

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
              Have You Interviewed Recently? Pay It Forward.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto 2rem' }}>
              Your round breakdown helps thousands of university students prepare better and level the placement playing field. Anonymity guaranteed.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/company-prep?tab=submit" className="btn btn-primary btn-lg">
                <Icon name="plus" size={18} />
                <span>Submit Your Placement Experience</span>
              </Link>
              <Link to="/company-prep?tab=questions" className="btn btn-secondary btn-lg">
                <Icon name="book" size={18} />
                <span>Explore Universal Question Bank</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
