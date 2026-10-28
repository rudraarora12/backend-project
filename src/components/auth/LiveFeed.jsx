import React, { useState, useEffect } from 'react';
import { Icon } from '../common/Icons';

export const LiveFeed = () => {
  const defaultFeed = [
    { id: 1, text: 'Rohan V. placed at Amazon (SDE-1, ₹45 LPA)', time: '2m ago', tag: 'Offer' },
    { id: 2, text: 'Ananya S. cleared Google SWE Intern OA', time: '8m ago', tag: 'OA Cleared' },
    { id: 3, text: 'Devansh R. shared D.E. Shaw MTS Round 2 Log', time: '14m ago', tag: 'Experience' },
    { id: 4, text: 'Priya N. booked 1-on-1 Mock with Arjun (Amazon)', time: '22m ago', tag: 'Mock Connect' },
    { id: 5, text: 'New Question added: Uber Geohash Ride Matcher', time: '35m ago', tag: 'Question' }
  ];

  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % defaultFeed.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [defaultFeed.length]);

  const currentItem = defaultFeed[feedIndex];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.45rem 1rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(13, 21, 39, 0.8)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.825rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)', animation: 'pulse-dot 2s infinite ease-in-out' }} />
        <span className="font-mono text-cyan" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
          {currentItem.tag}:
        </span>
      </div>

      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
        {currentItem.text}
      </span>

      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
        {currentItem.time}
      </span>
    </div>
  );
};
