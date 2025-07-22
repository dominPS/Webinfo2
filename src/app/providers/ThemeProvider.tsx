import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import React from 'react';
import { lightTheme, darkTheme } from './index';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  // Read initial theme from localStorage
  const [isDark, setIsDark] = useState(() => {
    const stored = window.localStorage.getItem('themeMode');
    return stored === 'dark';
  });
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      window.localStorage.setItem('themeMode', next ? 'dark' : 'light');
      return next;
    });
  };

  // Sync localStorage if theme changes outside React (optional, for robustness)
  React.useEffect(() => {
    const stored = window.localStorage.getItem('themeMode');
    if ((stored === 'dark') !== isDark) {
      window.localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <EmotionThemeProvider theme={theme}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
