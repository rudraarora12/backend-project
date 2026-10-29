import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/apiClient';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const BookingModal = ({ mentor: mentorProp, interviewer, onClose, onSuccess }) => {
  const mentor = mentorProp || interviewer;
  const { isAuthenticated, showToast } = useApp();
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  useEffect(() => {
    let active = true;
    if (!mentor || mentor.isDemo) {
      setSlots([]);
      return () => { active = false; };
    }
    apiRequest(`/experts/${encodeURIComponent(mentor.id)}/availability`)
      .then(({ slots: availableSlots }) => {
        if (!active) return;
        setSlots(availableSlots);
        setSelectedSlotId(availableSlots[0]?.id || '');
      })
      .catch((error) => {
        if (active) showToast(error.message || 'Unable to load availability.', 'error');
      });
    return () => { active = false; };
  }, [mentor, showToast]);

  if (!mentor) return null;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (mentor.isDemo) {
      showToast('Sample profiles cannot be booked.', 'warning');
      return;
    }
    if (!isAuthenticated) {
      showToast('Sign in before booking a session.', 'warning');
      return;
    }
    if (!selectedSlotId) {
      showToast('This expert has no available sessions to book.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const { booking } = await apiRequest('/bookings', {
        method: 'POST',
        body: { slotId: selectedSlotId, notes }
      });
      showToast(`Mock session confirmed with ${mentor.name}! Booking ID: ${booking.id}`, 'success');
      if (onSuccess) onSuccess(booking);
      if (onClose) onClose();
    } catch (error) {
      showToast(error.message || 'Unable to reserve this session.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 212, 255, 0.25)',
          animation: 'scale-up 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={mentor.avatar}
              alt={mentor.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Book Mock Interview
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                with {mentor.name} ({mentor.company})
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ color: 'var(--text-dim)', padding: '4px' }}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleBooking}>
          {/* Slot picker */}
          <div className="form-group">
            <label className="form-label">Available Slots</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {slots.map((slot) => {
                const label = new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: slot.timeZone
                }).format(new Date(slot.startsAt));
                return (
                <label
                  key={slot.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: selectedSlotId === slot.id ? 'var(--accent-cyan-dim)' : 'rgba(7, 12, 24, 0.7)',
                    border: `1px solid ${selectedSlotId === slot.id ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    checked={selectedSlotId === slot.id}
                    onChange={() => setSelectedSlotId(slot.id)}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: selectedSlotId === slot.id ? '#FFFFFF' : 'var(--text-muted)', fontWeight: 500 }}>
                    {label} ({slot.timeZone})
                  </span>
                </label>
                );
              })}
              {slots.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No live availability is currently published for this expert.
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Specific topics or questions to focus on</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Please grill me on Amazon Leadership Principles and Graph Topological Sorting..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Price summary */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(7, 12, 24, 0.8)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Session length is set by the expert</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Booking does not collect payment.</div>
            </div>
            <div className="font-mono text-emerald" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {selectedSlot?.price == null && mentor.hourlyRate == null
                ? 'Rate not set'
                : `${selectedSlot?.currency || mentor.currency || 'INR'} ${selectedSlot?.price ?? mentor.hourlyRate}`}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting || !slots.length || !isAuthenticated || mentor.isDemo}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
              style={{ minWidth: '140px' }}
            >
              {isSubmitting ? 'Confirming...' : 'Confirm & Reserve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
