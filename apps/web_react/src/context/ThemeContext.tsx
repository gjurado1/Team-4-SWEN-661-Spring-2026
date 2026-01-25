import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'default' | 'dark-contrast' | 'sepia';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default');
  const [textSize, setTextSize] = useState<number>(100);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('careconnect-theme') as Theme;
    const savedTextSize = localStorage.getItem('careconnect-textsize');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedTextSize) setTextSize(parseInt(savedTextSize));
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('careconnect-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply text size
    document.documentElement.style.fontSize = `${textSize}%`;
    localStorage.setItem('careconnect-textsize', textSize.toString());
  }, [textSize]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, textSize, setTextSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
