import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_USER } from '../data/users';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // User Session
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ii_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem('ii_auth');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

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

  // Sync user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ii_user', JSON.stringify(user));
    } catch (err) {
      console.warn('Failed to sync user state:', err);
    }
  }, [user]);

  // Sync auth state
  useEffect(() => {
    try {
      localStorage.setItem('ii_auth', JSON.stringify(isAuthenticated));
    } catch (err) {
      console.warn('Failed to sync auth state:', err);
    }
  }, [isAuthenticated]);

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
    const mergedUser = { ...user, ...userData };
    setUser(mergedUser);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${mergedUser.name}!`, 'success');
  }, [user, showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    showToast('Logged out of interview workspace.', 'info');
  }, [showToast]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  // Bookmark Toggle
  const toggleBookmark = useCallback((type, id) => {
    setUser((prev) => {
      const currentList = prev.bookmarks?.[type] || [];
      const isAlready = currentList.includes(id);
      const updatedList = isAlready
        ? currentList.filter((item) => item !== id)
        : [...currentList, id];

      const newBookmarks = {
        ...prev.bookmarks,
        [type]: updatedList
      };

      showToast(
        isAlready ? `Removed from ${type} bookmarks` : `Saved to ${type} bookmarks`,
        'success'
      );

      return {
        ...prev,
        bookmarks: newBookmarks
      };
    });
  }, [showToast]);

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
    isBookmarked
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
