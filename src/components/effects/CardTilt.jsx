import React, { useRef, useState } from 'react';

export const CardTilt = ({ children, maxTilt = 8, scale = 1.02, className = '', style = {}, ...props }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [transition, setTransition] = useState('transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransition('transform 0.1s ease-out');
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
  };

  const handleMouseLeave = () => {
    setTransition('transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)');
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-tilt ${className}`}
      style={{
        transform,
        transition,
        transformStyle: 'preserve-3d',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
