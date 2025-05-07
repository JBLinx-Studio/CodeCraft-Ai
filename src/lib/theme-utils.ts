/**
 * Theme utility functions for consistent theme management across the application
 */

export type Theme = "light" | "dark";

/**
 * Get the current theme based on local storage and system preference
 */
export const getInitialTheme = (): Theme => {
  // Check if running in browser environment
  if (typeof window === "undefined") return "light";
  
  // Check local storage first
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  
  // If theme is saved in localStorage, use that
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  
  // Otherwise, check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

/**
 * Apply theme to document
 */
export const applyTheme = (theme: Theme): void => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

/**
 * Save theme to local storage
 */
export const saveTheme = (theme: Theme): void => {
  localStorage.setItem("theme", theme);
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = (currentTheme: Theme): Theme => {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
  saveTheme(newTheme);
  return newTheme;
};
