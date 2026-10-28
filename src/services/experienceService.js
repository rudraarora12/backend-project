import { EXPERIENCES_DATA } from '../data/experiences';

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

/**
 * Initialize or get all stored experiences
 */
export function getAllExperiences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPERIENCES);
    if (stored) {
      return JSON.parse(stored);
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
 * Get single experience by ID
 */
export function getExperienceById(id) {
  const list = getAllExperiences();
  return list.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Add a new interview experience (submission wizard)
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
    status: 'approved', // Auto-approves for demo flow
    helpfulVotes: 1,
    channel: submissionData.channel || 'On-Campus Drive',
    location: submissionData.location || 'Bangalore / Virtual',
    ctc: submissionData.ctc || 'Competitive Package',
    verified: true
  };

  const updated = [newExperience, ...experiences];
  localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(updated));
  return newExperience;
}

/**
 * Vote for an experience (upvote / unvote toggle)
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
