
/**
 * Theme utility functions for managing theme preferences
 */

import { Theme } from './types';

/**
 * Get the system preferred theme 
 */
export const getSystemTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Save theme preference to localStorage
 */
export const saveThemePreference = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
};

/**
 * Get saved theme from localStorage or system preference
 */
export const getSavedTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || getSystemTheme();
};

/**
 * Apply theme class to document
 */
export const applyThemeToDOM = (theme: Theme): void => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
