import React, { useState } from 'react';
import { createBooking } from '../../services/connectService';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';

export const BookingModal = ({ mentor, onClose, onSuccess }) => {
  const { showToast } = useApp();
  const [selectedSlot, setSelectedSlot] = useState(mentor.availableSlots?.[0] || 'Tomorrow, 6:00 PM IST');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const parts = selectedSlot.split(',');
      const dateStr = parts[0]?.trim() || 'Tomorrow';
      const timeStr = parts[1]?.trim() || '6:00 PM IST';

      const booking = createBooking({
        mentor,
        date: dateStr,
        time: timeStr,
        notes
      });

      setIsSubmitting(false);
      showToast(`Mock session confirmed with ${mentor.name}! Booking ID: ${booking.id}`, 'success');
      if (onSuccess) onSuccess(booking);
      if (onClose) onClose();
    }, 600);
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
              {(mentor.availableSlots || []).map((slot) => (
                <label
                  key={slot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: selectedSlot === slot ? 'var(--accent-cyan-dim)' : 'rgba(7, 12, 24, 0.7)',
                    border: `1px solid ${selectedSlot === slot ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot}
                    checked={selectedSlot === slot}
                    onChange={() => setSelectedSlot(slot)}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: selectedSlot === slot ? '#FFFFFF' : 'var(--text-muted)', fontWeight: 500 }}>
                    {slot}
                  </span>
                </label>
              ))}
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
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>45-Minute 1-on-1 Simulated Mock</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Includes detailed technical rating debrief</div>
            </div>
            <div className="font-mono text-emerald" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              ₹{mentor.hourlyRate}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
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
