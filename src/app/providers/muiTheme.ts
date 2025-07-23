import { useState, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material';

// Rozszerzenie palety o własne kolory
// (jeśli już jest w projekcie, można pominąć)
declare module '@mui/material/styles' {
  interface Palette {
    accent_hover: Palette['primary'];
    accent_field: Palette['primary'];
    accent_white: Palette['primary'];
  }

  interface PaletteOptions {
    accent_hover?: PaletteOptions['primary'];
    accent_field?: PaletteOptions['primary'];
    accent_white?: PaletteOptions['primary'];
  }
}

export const useThemeMode = (): {
  theme: Theme;
  darkMode: boolean;
  toggleTheme: () => void;
} => {
  const getInitialMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState<boolean>(getInitialMode);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { 
        main: '#138277',
        dark: '#0f6b61',
        light: '#4a9d95'
      },
      secondary: { 
        main: '#EF7167',
        dark: '#d5443a',
        light: '#f49388'
      },
      accent_hover: { 
        main: '#47a49a',
        dark: '#3a847c',
        light: '#6bb5ac'
      },       
      accent_field: { 
        main: '#84B8D0',
        dark: '#6a94a6',
        light: '#a0c9dc'
      },  
      accent_white: { 
        main: '#ffffff',
        dark: '#f5f5f5',
        light: '#ffffff'
      },  
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b3b3b3' : '#666666',
      },
    },
    typography: {
      fontFamily: "'Segoe UI', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
      h4: {
        fontFamily: "'Segoe UI Light', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
        fontWeight: 300,
      },
      h6: {
        fontFamily: "'Segoe UI', 'Open Sans', Verdana, Arial, Helvetica, sans-serif",
        fontWeight: 600,
      },
    },
    shadows: [
      'none',
      '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.2)',
      '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px rgba(0, 0, 0, 0.2)',
      darkMode 
        ? '0px 1px 8px rgba(255, 255, 255, 0.12), 0px 3px 4px rgba(255, 255, 255, 0.14), 0px 3px 3px rgba(255, 255, 255, 0.2)'
        : '0px 1px 8px rgba(0, 0, 0, 0.12), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px rgba(0, 0, 0, 0.2)',
      '0px 2px 4px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.2)',
      '0px 3px 5px rgba(0, 0, 0, 0.12), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.2)',
      darkMode 
        ? '0px 3px 5px rgba(255, 255, 255, 0.12), 0px 6px 10px rgba(255, 255, 255, 0.14), 0px 1px 18px rgba(255, 255, 255, 0.2)'
        : '0px 3px 5px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.2)',
      ...Array(18).fill('0px 3px 5px rgba(0, 0, 0, 0.12)')
    ] as any,
  }), [darkMode]);

  return { theme, darkMode, toggleTheme };
};
