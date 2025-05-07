
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Theme, ThemeContextType } from './types';
import { getSavedTheme, applyThemeToDOM, saveThemePreference } from './theme-utils';

// Create the theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

/**
 * Theme provider component that manages theme state
 * and provides it to the application
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Apply the saved theme when the app loads
    const initialTheme = getSavedTheme();
    updateTheme(initialTheme);
    setIsInitialized(true);
  }, []);
  
  // Update theme function that also updates localStorage and document classes
  const updateTheme = (newTheme: Theme): void => {
    setTheme(newTheme);
    saveThemePreference(newTheme);
    applyThemeToDOM(newTheme);
  };
  
  if (!isInitialized) {
    // If theme is not initialized yet, apply a minimal loading state
    return <>{children}</>;
  }
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme context
 * @returns {ThemeContextType} The theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Default export for convenience
export default ThemeContext;
