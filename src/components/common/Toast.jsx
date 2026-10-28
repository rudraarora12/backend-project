import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icons';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let accentColor = '#00D4FF';
        let iconName = 'sparkles';

        if (toast.type === 'success') {
          accentColor = '#10B981';
          iconName = 'check-circle';
        } else if (toast.type === 'error') {
          accentColor = '#F43F5E';
          iconName = 'close';
        } else if (toast.type === 'warning') {
          accentColor = '#F59E0B';
          iconName = 'flame';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(13, 21, 39, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${accentColor}`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px ${accentColor}40`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              animation: 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: accentColor, display: 'flex' }}>
                <Icon name={iconName} size={20} />
              </span>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500 }}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--text-dim)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
