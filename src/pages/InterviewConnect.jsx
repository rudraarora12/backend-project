import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMentors } from '../services/connectService';
import { InterviewerCard } from '../components/connect/InterviewerCard';
import { BookingModal } from '../components/connect/BookingModal';
import { Icon } from '../components/common/Icons';
import { ScrollReveal } from '../components/common/ScrollReveal';
import '../styles/connect.css';

export const InterviewConnect = () => {
  const mentors = getAllMentors();
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [activeMentorToBook, setActiveMentorToBook] = useState(null);

  const companies = ['All', 'Amazon', 'Google', 'Microsoft', 'Goldman Sachs', 'Uber', 'D. E. Shaw'];

  const filteredMentors = mentors.filter((m) => {
    if (selectedCompany === 'All') return true;
    return m.company.toLowerCase() === selectedCompany.toLowerCase();
  });

  return (
    <div className="interview-connect-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Peer & Mentor Mock Network</span>
          </div>
          <h1 className="page-title">
            1-on-1 Interview Connect
          </h1>
          <p className="page-subtitle">
            Book 45-minute live technical mocks, system design grills, and behavioral deep-dives with placed seniors from top tech enterprises.
          </p>
        </div>

        {/* Action Callout Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.75rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(13, 21, 39, 0.85) 100%)',
            border: '1px solid rgba(108, 99, 255, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ color: '#A78BFA' }}>
              <Icon name="video" size={24} />
            </span>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                Simulated Mock Video Room Available
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Test your camera, microphone, screen sharing, and code editor before your scheduled session.
              </div>
            </div>
          </div>

          <Link to="/video-session" className="btn btn-purple btn-sm">
            <span>Launch Video Room</span>
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>

        {/* Company Filter Tabs */}
        <div className="filter-tabs" style={{ marginBottom: '2rem' }}>
          {companies.map((c) => (
            <button
              key={c}
              className={`tab-btn ${selectedCompany === c ? 'active' : ''}`}
              onClick={() => setSelectedCompany(c)}
            >
              {c === 'All' ? 'All Mentors' : c}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <ScrollReveal direction="up">
          <div className="grid-cards">
            {filteredMentors.map((mentor) => (
              <InterviewerCard
                key={mentor.id}
                mentor={mentor}
                onBookClick={(m) => setActiveMentorToBook(m)}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Booking Modal */}
        {activeMentorToBook && (
          <BookingModal
            mentor={activeMentorToBook}
            onClose={() => setActiveMentorToBook(null)}
          />
        )}
      </div>
    </div>
  );
};
