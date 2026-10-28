import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExperience } from '../services/experienceService';
import { COMPANIES_DATA } from '../data/companies';
import { StepIndicator } from '../components/submit/StepIndicator';
import { RoundBuilder } from '../components/submit/RoundBuilder';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icons';
import '../styles/submit.css';

export const Submit = () => {
  const navigate = useNavigate();
  const { user, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company: 'Amazon',
    role: 'SDE-1 (Full Time)',
    channel: 'On-Campus Drive',
    result: 'Selected',
    year: 2026,
    ctc: '₹45 LPA',
    location: 'Bangalore, India',
    anonymous: false,
    authorName: user.name || 'Anonymous Candidate',
    difficulty: 3.8,
    prepAdvice: '',
    candidateExperience: '',
    rounds: [
      {
        type: 'Online Assessment (OA)',
        duration: '90 min',
        difficulty: 'Medium',
        topics: 'Arrays, Two Pointers, Heaps',
        questions: 'LRU Cache, Subarray Sum Equals K'
      },
      {
        type: 'Technical Round 1',
        duration: '60 min',
        difficulty: 'Medium',
        topics: 'Binary Trees, Leadership Principles',
        questions: 'Lowest Common Ancestor of a Binary Tree, LP: Customer Obsession'
      }
    ]
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = createExperience({
        ...formData,
        userId: user.id
      });

      setIsSubmitting(false);
      showToast('Interview experience published and added to placement database!', 'success');
      navigate(`/experience/${created.id}`);
    }, 700);
  };

  return (
    <div className="submit-page" style={{ paddingBottom: '4rem' }}>
      <div className="container submit-container">
        {/* Header */}
        <div className="page-header" style={{ paddingBottom: '1.5rem' }}>
          <div className="section-tag">
            <span className="section-tag-dot" />
            <span>Placement Intelligence Contribution</span>
          </div>
          <h1 className="page-title">
            Share Your Interview Experience
          </h1>
          <p className="page-subtitle">
            Empower fellow engineering students with real round questions, time allocations, and preparation strategies.
          </p>
        </div>

        {/* Multi-step progress tracker */}
        <StepIndicator currentStep={step} />

        {/* Wizard Form Card */}
        <div className="glass-panel submit-wizard-card">
          <form onSubmit={step === 3 ? handleSubmit : handleNext}>
            {/* STEP 1: Company & Role Details */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem' }}>
                  Step 1: Company & Role Foundation
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {/* Company */}
                  <div className="form-group">
                    <label className="form-label">Target Company</label>
                    <select
                      className="form-select"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      required
                    >
                      {COMPANIES_DATA.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role */}
                  <div className="form-group">
                    <label className="form-label">Role / Position</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. SDE-1, SWE Intern, MTS"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      required
                    />
                  </div>

                  {/* Recruitment Channel */}
                  <div className="form-group">
                    <label className="form-label">Recruitment Channel</label>
                    <select
                      className="form-select"
                      value={formData.channel}
                      onChange={(e) => handleChange('channel', e.target.value)}
                    >
                      <option value="On-Campus Drive">On-Campus Drive</option>
                      <option value="Off-Campus / Referral">Off-Campus / Referral</option>
                      <option value="Internship PPO">Internship PPO</option>
                    </select>
                  </div>

                  {/* Final Verdict Outcome */}
                  <div className="form-group">
                    <label className="form-label">Final Outcome</label>
                    <select
                      className="form-select"
                      value={formData.result}
                      onChange={(e) => handleChange('result', e.target.value)}
                    >
                      <option value="Selected">Selected / Offer Extended</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Interview Year */}
                  <div className="form-group">
                    <label className="form-label">Interview Year</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.year}
                      onChange={(e) => handleChange('year', e.target.value)}
                      min={2023}
                      max={2027}
                      required
                    />
                  </div>

                  {/* Offered CTC / Stipend */}
                  <div className="form-group">
                    <label className="form-label">Offered CTC or Stipend (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹45 LPA, ₹1.25L / mo"
                      value={formData.ctc}
                      onChange={(e) => handleChange('ctc', e.target.value)}
                    />
                  </div>
                </div>

                {/* Anonymous Checkbox */}
                <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(7, 12, 24, 0.6)', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={(e) => handleChange('anonymous', e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>Post Anonymously</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Your name and avatar will be hidden and displayed as "Anonymous Candidate".
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Rounds Breakdown with Dynamic RoundBuilder */}
            {step === 2 && (
              <div>
                <RoundBuilder
                  rounds={formData.rounds}
                  onChange={(updatedRounds) => handleChange('rounds', updatedRounds)}
                />
              </div>
            )}

            {/* STEP 3: Preparation Advice & Reflections */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                  Step 3: Strategic Advice & Overall Reflections
                </h3>

                {/* Overall Difficulty Slider */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <div className="form-label">
                    <span>Overall Interview Difficulty</span>
                    <span className="font-mono text-cyan" style={{ fontSize: '1rem' }}>
                      {formData.difficulty} / 5.0
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>1.0 (Walk in the park)</span>
                    <span>3.0 (Moderate)</span>
                    <span>5.0 (Extreme Bar Raiser)</span>
                  </div>
                </div>

                {/* Prep Advice */}
                <div className="form-group">
                  <label className="form-label">Preparation Advice & Recommended Resources</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="What specific study materials, problem patterns, or behavioral frameworks helped you most?"
                    value={formData.prepAdvice}
                    onChange={(e) => handleChange('prepAdvice', e.target.value)}
                    required
                  />
                </div>

                {/* Candidate Reflections */}
                <div className="form-group">
                  <label className="form-label">Candidate Reflections & Interviewer Demeanor (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="How was the communication? Were they friendly or strict? Did they give hints when stuck?"
                    value={formData.candidateExperience}
                    onChange={(e) => handleChange('candidateExperience', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="wizard-footer-actions">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Icon name="arrow-right" size={14} style={{ transform: 'rotate(180deg)' }} />
                  <span>Previous</span>
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {step < 3 ? (
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Next: {step === 1 ? 'Rounds Breakdown' : 'Preparation Advice'}</span>
                    <Icon name="arrow-right" size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting}
                    style={{ minWidth: '160px' }}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Experience'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
