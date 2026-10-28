import React from 'react';
import { Icon } from '../common/Icons';

export const RoundBuilder = ({ rounds = [], onChange }) => {
  const handleAddRound = () => {
    const newRound = {
      type: `Round ${rounds.length + 1} (Technical)`,
      duration: '60 min',
      difficulty: 'Medium',
      topics: '',
      questions: ''
    };
    onChange([...rounds, newRound]);
  };

  const handleRemoveRound = (index) => {
    if (rounds.length <= 1) return;
    const updated = rounds.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateField = (index, field, value) => {
    const updated = rounds.map((r, i) => {
      if (i === index) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>Interview Rounds Breakdown</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Add technical rounds, online assessments, or managerial conversations
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRound}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Icon name="plus" size={15} />
          <span>Add Round</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {rounds.map((round, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              background: 'rgba(7, 12, 24, 0.65)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    color: '#050811',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                  Round {idx + 1}
                </span>
              </div>

              {rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRound(idx)}
                  className="btn-icon"
                  style={{ width: '28px', height: '28px', color: 'var(--status-rose)' }}
                  title="Remove this round"
                >
                  <Icon name="trash" size={15} />
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Round Type */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Round Type / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Online Assessment, Tech Round 1"
                  value={round.type}
                  onChange={(e) => handleUpdateField(idx, 'type', e.target.value)}
                  required
                />
              </div>

              {/* Duration */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 60 min, 45 min"
                  value={round.duration}
                  onChange={(e) => handleUpdateField(idx, 'duration', e.target.value)}
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Difficulty</label>
                <select
                  className="form-select"
                  value={round.difficulty}
                  onChange={(e) => handleUpdateField(idx, 'difficulty', e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Topics */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                <span>Topics Assessed (comma separated)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Binary Search, Dynamic Programming, System Design"
                value={round.topics}
                onChange={(e) => handleUpdateField(idx, 'topics', e.target.value)}
              />
            </div>

            {/* Questions Asked */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                <span>Questions Asked (comma or newline separated - auto linked to LeetCode)</span>
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. LRU Cache, Trapping Rain Water, LP: Disagree and commit"
                value={round.questions}
                onChange={(e) => handleUpdateField(idx, 'questions', e.target.value)}
              />
              <span className="form-hint">
                IntelliGrid automatically canonicalizes question titles to LeetCode / GeeksforGeeks URLs.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
