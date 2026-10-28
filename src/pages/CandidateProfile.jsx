import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMentorById } from '../services/connectService';
import { BookingModal } from '../components/connect/BookingModal';
import { Icon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';

export const CandidateProfile = () => {
  const { id } = useParams();
  const mentor = getMentorById(id);
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!mentor) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '1rem' }}>Mentor Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We could not find the mentor profile you were looking for.</p>
        <Link to="/interview-connect" className="btn btn-primary btn-sm">Browse All Mentors</Link>
      </div>
    );
  }

  return (
    <div className="candidate-profile-page" style={{ paddingBottom: '4rem' }}>
      <div className="container container-narrow">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-dim)', margin: '1.5rem 0' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/interview-connect" style={{ color: 'var(--text-muted)' }}>Interview Connect</Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-cyan)' }}>{mentor.name}</span>
        </div>

        {/* Profile Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
            <img
              src={mentor.avatar}
              alt={mentor.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-cyan)',
                boxShadow: '0 0 25px rgba(0, 212, 255, 0.4)'
              }}
            />

            <div style={{ flex: '1 1 260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {mentor.name}
                </h1>
                <Badge variant="selected" size="md">
                  VERIFIED PLACED
                </Badge>
              </div>

              <div style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {mentor.company} • {mentor.role}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FBBF24' }}>
                  <Icon name="star" size={16} color="#FBBF24" />
                  <strong style={{ color: '#FFFFFF' }}>{mentor.rating.toFixed(2)}</strong>
                  <span style={{ color: 'var(--text-dim)' }}>({mentor.reviewCount} mock reviews)</span>
                </div>
                <span>•</span>
                <span className="font-mono text-emerald" style={{ fontWeight: 700 }}>
                  ₹{mentor.hourlyRate} / session
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="btn btn-primary btn-lg"
            >
              <Icon name="calendar" size={18} />
              <span>Book 1-on-1 Mock</span>
            </button>
          </div>

          {/* Biography */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              About {mentor.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {mentor.bio}
            </p>
          </div>

          {/* Technical Evaluation Topics */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.85rem' }}>
              Evaluation Specializations
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(mentor.topics || []).map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.825rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 212, 255, 0.08)',
                    border: '1px solid rgba(0, 212, 255, 0.25)',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Available Slots Preview */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.85rem' }}>
              Next Available Slots
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(mentor.availableSlots || []).map((slot, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(7, 12, 24, 0.7)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <Icon name="clock" size={14} color="var(--accent-cyan)" />
                  <span>{slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showBookingModal && (
          <BookingModal
            mentor={mentor}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </div>
  );
};
