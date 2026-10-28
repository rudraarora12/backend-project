import React from 'react';

export const GlobalBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* Ambient Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, rgba(5, 8, 17, 0) 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-5%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, rgba(5, 8, 17, 0) 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(5, 8, 17, 0) 70%)',
          filter: 'blur(70px)'
        }}
      />

      {/* Cyber Grid Lines Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.6
        }}
      />
    </div>
  );
};
