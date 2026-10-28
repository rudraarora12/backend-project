import React from 'react';

export const Badge = ({ children, variant = 'cyan', size = 'md', className = '' }) => {
  const variantClass = `badge-${variant.toLowerCase()}`;
  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.5rem' } : {};

  return (
    <span className={`badge ${variantClass} ${className}`} style={sizeStyle}>
      {children}
    </span>
  );
};
