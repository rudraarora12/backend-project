import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icons';

export const Admin = () => {
  const { showToast } = useApp();
  const [queue, setQueue] = useState([]);
  const [metrics, setMetrics] = useState({ experiences: {}, experts: {} });
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'flagged'
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      apiRequest(`/admin/experiences?status=${activeTab.toUpperCase()}&limit=100`),
      apiRequest('/admin/metrics')
    ]).then(([result, counts]) => {
      if (!active) return;
      setQueue(result.experiences.map((experience) => ({
        ...experience,
        company: experience.companyName,
        ctc: experience.compensation,
        authorName: experience.anonymous ? 'Anonymous Candidate' : experience.author?.name || 'Student Peer',
        status: experience.status.toLowerCase(),
        rounds: experience.rounds.map((round) => ({
          ...round,
          questions: round.questions.join(', ')
        }))
      })));
      setMetrics(counts);
    }).catch((error) => {
      if (!active) return;
      setQueue([]);
      showToast(error.message || 'Unable to load the moderation queue.', 'error');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [activeTab, reloadKey, showToast]);

  const moderateExperience = async (item, status) => {
    if (pendingAction) return;
    setPendingAction(item.id);
    try {
      await apiRequest(`/admin/experiences/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        body: { status }
      });
      showToast(
        status === 'APPROVED' ? `Approved the report for ${item.company}.` : 'Report flagged for review.',
        'success'
      );
      setReloadKey((key) => key + 1);
    } catch (error) {
      showToast(error.message || 'Unable to update this report.', 'error');
    } finally {
      setPendingAction('');
    }
  };

  const filtered = queue;
  const pendingCount = metrics.experiences.PENDING || 0;
  const approvedCount = metrics.experiences.APPROVED || 0;
  const flaggedCount = metrics.experiences.FLAGGED || 0;

  return (
    <div className="admin-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Community Moderation Console</span>
          </div>
          <h1 className="page-title">
            Placement Integrity & Review Desk
          </h1>
          <p className="page-subtitle">
            Review server-submitted interview reports before they are visible as approved records.
          </p>
        </div>

        {/* Moderation Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
            <div className="font-mono text-amber" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Moderation</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
            <div className="font-mono text-emerald" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved & Indexed</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
            <div className="font-mono text-rose" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {flaggedCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flagged / Incomplete</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({approvedCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'flagged' ? 'active' : ''}`}
            onClick={() => setActiveTab('flagged')}
          >
            Flagged ({flaggedCount})
          </button>
        </div>

        {/* Submissions Queue Cards */}
        {loading ? (
          <div className="empty-state">
            <h4 className="empty-state-title">Loading moderation records...</h4>
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${item.status === 'approved' ? 'rgba(16, 185, 129, 0.4)' : item.status === 'flagged' ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-glass)'}`
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {item.company}
                      </span>
                      <span style={{ color: 'var(--border-subtle)' }}>•</span>
                      <span style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        {item.role}
                      </span>
                      <Badge variant={item.status === 'approved' ? 'approved' : item.status === 'flagged' ? 'flagged' : 'pending'} size="sm">
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', gap: '1rem' }}>
                      <span>Submitted by: <strong>{item.authorName}</strong></span>
                      <span>Channel: <strong>{item.channel}</strong></span>
                      {item.ctc && <span>Package: <strong style={{ color: 'var(--status-amber)' }}>{item.ctc}</strong></span>}
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => moderateExperience(item, 'FLAGGED')}
                        disabled={pendingAction === item.id}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--status-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      >
                        <Icon name="close" size={14} />
                        <span>Flag Record</span>
                      </button>

                      <button
                        onClick={() => moderateExperience(item, 'APPROVED')}
                        disabled={pendingAction === item.id}
                        className="btn btn-primary btn-sm"
                      >
                        <Icon name="check" size={14} />
                        <span>Verify & Approve</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Rounds Summary */}
                <div style={{ margin: '1rem 0', background: 'rgba(7, 12, 24, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ROUNDS REPORTED ({item.rounds?.length || 0})
                  </div>
                  {item.rounds?.map((r, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--accent-cyan)' }}>{r.type} ({r.duration}, {r.difficulty}): </strong>
                      <span style={{ color: 'var(--text-main)' }}>{r.questions || 'No specific questions noted'}</span>
                    </div>
                  ))}
                </div>

                {/* Advice snippet */}
                {item.prepAdvice && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                    "{item.prepAdvice}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="shield" size={48} className="empty-state-icon" />
            <h4 className="empty-state-title">{activeTab === 'pending' ? 'No pending reports' : `No ${activeTab} reports`}</h4>
            <p className="empty-state-desc">This view contains records from the configured backend moderation queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};
