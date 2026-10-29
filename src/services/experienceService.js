import { EXPERIENCES_DATA } from '../data/experiences';
import { experiencesApi } from './api';

export const CANONICAL_QUESTION_LINKS = {
  "lru cache": "https://leetcode.com/problems/lru-cache/",
  "trapping rain water": "https://leetcode.com/problems/trapping-rain-water/",
  "course schedule": "https://leetcode.com/problems/course-schedule/",
  "course schedule ii": "https://leetcode.com/problems/course-schedule-ii/",
  "word ladder": "https://leetcode.com/problems/word-ladder/",
  "subarray sum equals k": "https://leetcode.com/problems/subarray-sum-equals-k/",
  "serialize and deserialize binary tree": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  "lowest common ancestor": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
  "sliding window maximum": "https://leetcode.com/problems/sliding-window-maximum/",
  "3sum": "https://leetcode.com/problems/3sum/",
  "two sum": "https://leetcode.com/problems/two-sum/",
  "number of islands": "https://leetcode.com/problems/number-of-islands/",
  "merge k sorted lists": "https://leetcode.com/problems/merge-k-sorted-lists/",
  "alien dictionary": "https://leetcode.com/problems/alien-dictionary/",
  "k closest points to origin": "https://leetcode.com/problems/k-closest-points-to-origin/",
  "coin change": "https://leetcode.com/problems/coin-change/",
  "climbing stairs": "https://leetcode.com/problems/climbing-stairs/",
  "design hit counter": "https://leetcode.com/problems/design-hit-counter/",
  "design parking system": "https://leetcode.com/problems/design-parking-system/",
  "median of two sorted arrays": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  "longest consecutive sequence": "https://leetcode.com/problems/longest-consecutive-sequence/"
};

/**
 * Normalizes question title and returns direct LeetCode URL or LeetCode search fallback
 */
export function getCanonicalQuestionUrl(rawTitle = '') {
  if (!rawTitle) return 'https://leetcode.com/problemset/all/';

  const normalized = rawTitle
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .trim();

  // Direct lookup
  for (const [key, url] of Object.entries(CANONICAL_QUESTION_LINKS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }

  // Fallback to LeetCode Search
  const query = encodeURIComponent(rawTitle.trim());
  return `https://leetcode.com/problemset/all/?search=${query}`;
}

const STORAGE_KEY_EXPERIENCES = 'ii_experiences';
const STORAGE_KEY_UPVOTES = 'ii_upvotes';

// ============================================================
// ASYNC API VERSIONS (backed by MongoDB via backend API)
// ============================================================

/**
 * Fetch all experiences from the backend.
 * @param {object} params - Optional query params (page, limit, q, etc.)
 * @returns {Promise<Array>}
 */
export async function getAllExperiencesAsync(params = {}) {
  const result = await experiencesApi.list(params);
  return result.experiences || [];
}

/**
 * Fetch a single experience by ID from the backend.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getExperienceByIdAsync(id) {
  const result = await experiencesApi.get(id);
  return result.experience || null;
}

/**
 * Submit a new interview experience to the backend.
 * Maps frontend form data to the backend schema.
 * @param {object} data - Frontend form data
 * @returns {Promise<object>}
 */
export async function createExperienceAsync(data) {
  const payload = {
    company: data.company,
    role: data.role,
    year: Number(data.year),
    channel: data.channel,
    location: data.location,
    result: data.result,
    difficulty: Number(data.difficulty),
    compensation: data.ctc,
    prepAdvice: data.prepAdvice,
    candidateExperience: data.candidateExperience,
    anonymous: Boolean(data.anonymous),
    rounds: (data.rounds || []).map((r) => ({
      type: r.type,
      duration: r.duration,
      difficulty: r.difficulty,
      topics: typeof r.topics === 'string' ? r.topics : (r.topics || []).join(', '),
      questions: typeof r.questions === 'string' ? r.questions : (r.questions || []).join(', '),
    }))
  };
  const result = await experiencesApi.create(payload);
  return result.experience;
}

/**
 * Toggle a helpful vote on an experience (backend).
 * @param {string} experienceId
 * @returns {Promise<{voted: boolean, votes: number}>}
 */
export async function toggleHelpfulVoteAsync(experienceId) {
  const result = await experiencesApi.vote(experienceId);
  return result;
}

// ============================================================
// LEGACY SYNC VERSIONS — kept for backward compatibility
// These read from localStorage / bundled static data.
// @deprecated Use the Async equivalents above for live data.
// ============================================================

/**
 * @deprecated Use getAllExperiencesAsync() for live backend data.
 */
export function getAllExperiences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPERIENCES);
    if (stored) {
      const experiences = JSON.parse(stored);
      if (!Array.isArray(experiences)) throw new TypeError('Stored experiences must be an array.');
      return experiences.map((experience) => ({
        ...experience,
        isDemo: true,
        status: 'demo',
        helpfulVotes: 0,
        verified: false,
        authorName: experience.anonymous ? 'Anonymous Demo Candidate' : 'Demo Candidate'
      }));
    }
    // Seed default experiences
    localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(EXPERIENCES_DATA));
    return EXPERIENCES_DATA;
  } catch (err) {
    console.error('Error loading experiences:', err);
    return EXPERIENCES_DATA;
  }
}

/**
 * @deprecated Use getExperienceByIdAsync() for live backend data.
 */
export function getExperienceById(id) {
  const list = getAllExperiences();
  return list.find((item) => String(item.id) === String(id)) || null;
}

/**
 * @deprecated Use createExperienceAsync() for live backend data.
 */
export function createExperience(submissionData) {
  const experiences = getAllExperiences();

  // Process rounds and extract normalized question links & topics
  const extractedQuestions = [];
  const extractedTopics = [];

  (submissionData.rounds || []).forEach((r) => {
    if (r.questions) {
      r.questions.split(/[,;\n]+/).forEach((q) => {
        const trimmed = q.trim();
        if (trimmed && !extractedQuestions.includes(trimmed)) {
          extractedQuestions.push(trimmed);
        }
      });
    }
    if (r.topics) {
      r.topics.split(/[,;\n]+/).forEach((t) => {
        const trimmed = t.trim();
        if (trimmed && !extractedTopics.includes(trimmed)) {
          extractedTopics.push(trimmed);
        }
      });
    }
  });

  const newExperience = {
    id: `exp_${Date.now()}`,
    company: submissionData.company || 'Unknown Tech',
    companySlug: (submissionData.company || 'unknown')
      .toLowerCase()
      .replace(/[\s&/]+/g, '-'),
    companyName: submissionData.company || 'Unknown Tech',
    role: submissionData.role || 'Software Engineer',
    year: Number(submissionData.year) || new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    userId: submissionData.userId || 'user-guest',
    authorName: submissionData.anonymous ? 'Anonymous Candidate' : submissionData.authorName || 'Student Peer',
    anonymous: Boolean(submissionData.anonymous),
    result: submissionData.result || 'Selected',
    difficulty: Number(submissionData.difficulty) || 3.5,
    rounds: submissionData.rounds || [],
    topics: extractedTopics.length ? extractedTopics : ['Problem Solving', 'Data Structures'],
    questions: extractedQuestions.length ? extractedQuestions : ['System Coding Question'],
    prepAdvice: submissionData.prepAdvice || 'Practice consistently on LeetCode Medium/Hard and stay calm during behavioral rounds.',
    candidateExperience: submissionData.candidateExperience || 'Overall smooth experience with supportive interviewers.',
    status: 'demo',
    isDemo: true,
    helpfulVotes: 0,
    channel: submissionData.channel || 'On-Campus Drive',
    location: submissionData.location || 'Bangalore / Virtual',
    ctc: submissionData.ctc || 'Competitive Package',
    verified: false
  };

  const updated = [newExperience, ...experiences];
  localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(updated));
  return newExperience;
}

/**
 * @deprecated Use toggleHelpfulVoteAsync() for live backend data.
 */
export function toggleHelpfulVote(experienceId) {
  try {
    const upvotesMap = JSON.parse(localStorage.getItem(STORAGE_KEY_UPVOTES) || '{}');
    const hasVoted = Boolean(upvotesMap[experienceId]);

    const experiences = getAllExperiences();
    const updated = experiences.map((exp) => {
      if (String(exp.id) === String(experienceId)) {
        return {
          ...exp,
          helpfulVotes: hasVoted ? Math.max(0, exp.helpfulVotes - 1) : exp.helpfulVotes + 1
        };
      }
      return exp;
    });

    if (hasVoted) {
      delete upvotesMap[experienceId];
    } else {
      upvotesMap[experienceId] = true;
    }

    localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_UPVOTES, JSON.stringify(upvotesMap));

    return {
      voted: !hasVoted,
      votes: updated.find((exp) => String(exp.id) === String(experienceId))?.helpfulVotes || 0
    };
  } catch (err) {
    console.error('Error toggling vote:', err);
    return { voted: false, votes: 0 };
  }
}

export function hasUserVoted(experienceId) {
  try {
    const upvotesMap = JSON.parse(localStorage.getItem(STORAGE_KEY_UPVOTES) || '{}');
    return Boolean(upvotesMap[experienceId]);
  } catch {
    return false;
  }
}
