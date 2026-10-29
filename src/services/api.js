import { apiRequest } from './apiClient';

// ============================================================
// Auth
// ============================================================
export const authApi = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: data }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  me: () => apiRequest('/auth/me'),
  updateProfile: (data) => apiRequest('/users/me', { method: 'PATCH', body: data }),
  updatePassword: (data) => apiRequest('/users/me/password', { method: 'PATCH', body: data }),
};

// ============================================================
// Experiences (Interview Reports)
// ============================================================
export const experiencesApi = {
  list: (params = {}) => apiRequest(`/experiences?${new URLSearchParams(params)}`),
  get: (id) => apiRequest(`/experiences/${id}`),
  create: (data) => apiRequest('/experiences', { method: 'POST', body: data }),
  vote: (id) => apiRequest(`/experiences/${encodeURIComponent(id)}/vote`, { method: 'POST' }),
  getVote: (id) => apiRequest(`/experiences/${encodeURIComponent(id)}/vote`),
};

// ============================================================
// Bookmarks
// ============================================================
export const bookmarksApi = {
  list: () => apiRequest('/bookmarks'),
  add: (type, id) => apiRequest('/bookmarks', { method: 'POST', body: { type, id } }),
  remove: (type, id) => apiRequest(`/bookmarks/${type}/${id}`, { method: 'DELETE' }),
};

// ============================================================
// Roadmaps
// ============================================================
export const roadmapsApi = {
  generate: (data) => apiRequest('/roadmaps/generate', { method: 'POST', body: data }),
  list: (params = {}) => apiRequest(`/roadmaps?${new URLSearchParams(params)}`),
  get: (id) => apiRequest(`/roadmaps/${id}`),
  updateTask: (roadmapId, taskId, data) =>
    apiRequest(`/roadmaps/${roadmapId}/tasks/${taskId}`, { method: 'PATCH', body: data }),
};

// ============================================================
// Experts (Mock Interviews)
// ============================================================
export const expertsApi = {
  list: (params = {}) => apiRequest(`/experts?${new URLSearchParams(params)}`),
  get: (id) => apiRequest(`/experts/${id}`),
  apply: (data) => apiRequest('/experts/apply', { method: 'POST', body: data }),
  getSlots: (expertId) => apiRequest(`/experts/${expertId}/slots`),
  createSlot: (data) => apiRequest('/slots', { method: 'POST', body: data }),
};

// ============================================================
// Bookings
// ============================================================
export const bookingsApi = {
  create: (data) => apiRequest('/bookings', { method: 'POST', body: data }),
  list: () => apiRequest('/bookings'),
  complete: (id) => apiRequest(`/bookings/${id}/complete`, { method: 'POST' }),
  review: (id, data) => apiRequest(`/bookings/${id}/review`, { method: 'POST', body: data }),
};

// ============================================================
// Admin
// ============================================================
export const adminApi = {
  metrics: () => apiRequest('/admin/metrics'),
  experiences: (params = {}) =>
    apiRequest(`/admin/experiences?${new URLSearchParams(params)}`),
  moderateExperience: (id, status) =>
    apiRequest(`/admin/experiences/${id}`, { method: 'PATCH', body: { status } }),
  experts: () => apiRequest('/admin/experts'),
  moderateExpert: (id, status) =>
    apiRequest(`/admin/experts/${id}`, { method: 'PATCH', body: { status } }),
};

// ============================================================
// Dashboard (Real-time MongoDB)
// ============================================================
export const dashboardApi = {
  get: () => apiRequest('/dashboard'),
  setTrack: (track) => apiRequest('/dashboard/track', { method: 'POST', body: { track } }),
  setMilestone: (milestoneId, status) =>
    apiRequest('/dashboard/milestone', { method: 'POST', body: { milestoneId, status } }),
  setChallenge: (challengeId, status) =>
    apiRequest('/dashboard/challenge', { method: 'POST', body: { challengeId, status } }),
  updateProfile: (data) => apiRequest('/dashboard/profile', { method: 'PATCH', body: data }),
};
