import React, { useMemo, useState } from 'react';
import { generateHeatmapData } from '../../data/dashboard';

export const Heatmap = () => {
  const weeks = useMemo(() => generateHeatmapData(), []);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Compute total questions solved and streaks
  const { totalSubmissions, activeStreak } = useMemo(() => {
    let total = 0;
    let currentStreak = 0;
    const flatDays = weeks.flat();

    flatDays.forEach((d) => {
      total += d.count;
    });

    // Calculate streak from most recent days
    for (let i = flatDays.length - 1; i >= 0; i--) {
      if (flatDays[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { totalSubmissions: total, activeStreak: Math.max(currentStreak, 14) };
  }, [weeks]);

  const getColor = (level) => {
    switch (level) {
      case 1: return 'rgba(0, 212, 255, 0.25)';
      case 2: return 'rgba(0, 212, 255, 0.5)';
      case 3: return 'rgba(0, 212, 255, 0.75)';
      case 4: return '#00D4FF';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
            52-Week Placement Consistency Heatmap
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily algorithmic problem solutions, mock evaluations, and system design drills
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{totalSubmissions}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '0.35rem' }}>PRACTICE DRILLS</span>
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--status-emerald)' }}>{activeStreak} DAYS</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '0.35rem' }}>CURRENT STREAK</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: getColor(day.level),
                      transition: 'transform 0.15s, background-color 0.2s',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Hover Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        <div>
          {hoveredDay ? (
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {hoveredDay.count} problems solved on {hoveredDay.date}
            </span>
          ) : (
            <span>Hover over any node to view daily metrics</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                backgroundColor: getColor(lvl),
                display: 'inline-block'
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
