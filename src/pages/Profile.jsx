import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookmarksList } from '../components/dashboard/BookmarksList';
import { getAllExperiences } from '../services/experienceService';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { Icon } from '../components/common/Icons';

export const Profile = () => {
  const { user, updateUser, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    college: user.college,
    degree: user.degree,
    branch: user.branch,
    graduationYear: user.graduationYear
  });

  const allExperiences = getAllExperiences();
  const myExperiences = allExperiences.filter((e) => e.userId === user.id);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditing(false);
    showToast('Profile information successfully updated!', 'success');
  };

  return (
    <div className="profile-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* Profile Hero Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            margin: '2rem 0',
            background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.9) 0%, rgba(7, 12, 24, 0.95) 100%)',
            border: '1px solid var(--border-glass)'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-cyan)',
                  boxShadow: '0 0 25px rgba(0, 212, 255, 0.35)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {user.name}
                  </h1>
                  <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                    VERIFIED STUDENT
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {user.degree} • {user.branch}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                  {user.college} (Batch of {user.graduationYear})
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon name="code" size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div className="font-mono text-cyan" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {user.experiencesShared + myExperiences.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Experiences Published
              </div>
            </div>

            <div>
              <div className="font-mono text-emerald" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {user.helpfulVotes}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Helpful Community Votes
              </div>
            </div>

            <div>
              <div className="font-mono text-purple" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {user.bookmarks?.questions?.length || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Bookmarked Questions
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form (Conditional) */}
        {isEditing && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
              Edit Student Credentials
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University / College</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.degree}
                    onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileForm.graduationYear}
                    onChange={(e) => setProfileForm({ ...profileForm, graduationYear: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bookmarks Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <BookmarksList />
        </div>

        {/* My Contributed Experiences */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
              My Published Interview Reports ({myExperiences.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Placement breakdowns you have contributed to the university community.
            </p>
          </div>

          {myExperiences.length > 0 ? (
            <div className="grid-cards">
              {myExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="layers" size={44} className="empty-state-icon" />
              <h4 className="empty-state-title">No experiences published under this account yet</h4>
              <p className="empty-state-desc">
                Contribute your recent interview story to boost your placement karma!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
