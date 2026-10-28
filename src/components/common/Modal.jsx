import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icons';

export const Modal = () => {
  const { modal, closeModal } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 17, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fade-in 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.25)',
          border: '1px solid var(--accent-cyan)',
          overflow: 'hidden',
          animation: 'scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 21, 39, 0.9)'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
            {modal.title}
          </h3>
          <button
            onClick={() => {
              if (modal.onCancel) modal.onCancel();
              closeModal();
            }}
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}
        >
          {modal.content}
        </div>

        {/* Action Footer */}
        {(modal.onConfirm || modal.onCancel) && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(7, 12, 24, 0.8)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            {modal.onCancel && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  modal.onCancel();
                  closeModal();
                }}
              >
                {modal.cancelText}
              </button>
            )}
            {modal.onConfirm && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  modal.onConfirm();
                  closeModal();
                }}
              >
                {modal.confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
