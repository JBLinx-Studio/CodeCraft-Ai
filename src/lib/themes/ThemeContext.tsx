
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Theme, ThemeContextType } from './types';
import { getSavedTheme, applyThemeToDOM, saveThemePreference } from './theme-utils';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    // Apply the saved theme when the app loads
    const initialTheme = getSavedTheme();
    updateTheme(initialTheme);
  }, []);
  
  // Update theme function that also updates localStorage and document classes
  const updateTheme = (newTheme: Theme): void => {
    setTheme(newTheme);
    saveThemePreference(newTheme);
    applyThemeToDOM(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
