import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_USER } from '../data/users';
import { ApiError, apiRequest } from '../services/apiClient';
import { bookmarksApi } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // User Session
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load bookmarks from backend and merge into user state
  const loadBookmarksFromApi = useCallback(async () => {
    try {
      const { bookmarks } = await bookmarksApi.list();
      const mapped = { companies: [], experiences: [], questions: [] };
      const reverseMap = { COMPANY: 'companies', EXPERIENCE: 'experiences', QUESTION: 'questions' };
      (bookmarks || []).forEach(({ type, referenceId }) => {
        const key = reverseMap[type];
        if (key) mapped[key].push(referenceId);
      });
      setUser((prev) => ({ ...prev, bookmarks: mapped }));
    } catch {
      // Ignore — bookmarks will remain as initialized
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest('/auth/me').then((data) => {
      if (!active) return;
      const sessionUser = data?.user;
      if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
        loadBookmarksFromApi();
      }
    }).catch((error) => {
      if (!active) return;
      console.warn('Unable to restore the server session:', error);
    });
    return () => { active = false; };
  }, [loadBookmarksFromApi]);

  // Active target track for dashboard
  const [activeTrack, setActiveTrack] = useState(() => {
    try {
      return localStorage.getItem('ii_active_track') || 'amazon';
    } catch {
      return 'amazon';
    }
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Global Modal
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    content: null,
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  // Sync active track
  useEffect(() => {
    try {
      localStorage.setItem('ii_active_track', activeTrack);
    } catch (err) {
      console.warn('Failed to sync active track:', err);
    }
  }, [activeTrack]);

  // Toast Dispatcher
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modal Controls
  const openModal = useCallback((config) => {
    setModal({
      isOpen: true,
      title: config.title || '',
      content: config.content || null,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel'
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Auth Handlers
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${userData.name}!`, 'success');
    // Load bookmarks from backend after login
    loadBookmarksFromApi();
  }, [showToast, loadBookmarksFromApi]);

  const logout = useCallback(async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(DEFAULT_USER);
      showToast('Logged out of interview workspace.', 'info');
    } catch (error) {
      showToast(error.message || 'Unable to log out. Please try again.', 'error');
    }
  }, [showToast]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  // Bookmark Toggle — persists to backend when authenticated
  const toggleBookmark = useCallback(async (type, id) => {
    const typeMap = { companies: 'COMPANY', experiences: 'EXPERIENCE', questions: 'QUESTION' };
    const apiType = typeMap[type] || type.toUpperCase();
    const currentList = user.bookmarks?.[type] || [];
    const isAlready = currentList.includes(id);

    // Optimistic update
    setUser((prev) => ({
      ...prev,
      bookmarks: {
        ...prev.bookmarks,
        [type]: isAlready ? currentList.filter((i) => i !== id) : [...currentList, id]
      }
    }));

    if (isAuthenticated) {
      try {
        if (isAlready) {
          await bookmarksApi.remove(apiType, id);
        } else {
          await bookmarksApi.add(apiType, id);
        }
        showToast(
          isAlready ? `Removed from ${type} bookmarks` : `Saved to ${type} bookmarks`,
          'success'
        );
      } catch (err) {
        // Revert optimistic update on failure
        setUser((prev) => ({
          ...prev,
          bookmarks: { ...prev.bookmarks, [type]: currentList }
        }));
        showToast('Could not save bookmark. Try again.', 'error');
        return;
      }
    } else {
      // Not authenticated — still give local feedback but note it won't persist
      showToast(
        isAlready
          ? `Removed from ${type} bookmarks`
          : `Sign in to save bookmarks permanently`,
        isAlready ? 'success' : 'warning'
      );
    }
  }, [user.bookmarks, isAuthenticated, showToast]);

  const isBookmarked = useCallback((type, id) => {
    return Boolean(user.bookmarks?.[type]?.includes(id));
  }, [user.bookmarks]);

  const value = {
    user,
    isAuthenticated,
    activeTrack,
    setActiveTrack,
    login,
    logout,
    updateUser,
    toasts,
    showToast,
    removeToast,
    modal,
    openModal,
    closeModal,
    toggleBookmark,
    isBookmarked,
    loadBookmarksFromApi
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
