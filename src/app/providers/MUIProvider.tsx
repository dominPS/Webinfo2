import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme as useEmotionTheme } from '@emotion/react';
import { useTheme } from './ThemeProvider';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface Props {
  children: React.ReactNode;
}

export const MUIProvider: React.FC<Props> = ({ children }) => {
  const { isDark } = useTheme();
  const emotionTheme = useEmotionTheme();

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: emotionTheme.colors.primary,
        dark: '#0D4A56',
        light: '#4A9FB3',
      },
      secondary: {
        main: emotionTheme.colors.secondary,
      },
      // Dodane własne kolory
      accent_field: {
        main: '#84B8D0',
        dark: '#6a94a6',
        light: '#a0c9dc',
      },
      accent_hover: {
        main: '#47a49a',
        dark: '#3a847c',
        light: '#6bb5ac',
      },
      accent_white: {
        main: '#ffffff',
        dark: '#f5f5f5',
        light: '#ffffff',
      },
      background: {
        default: emotionTheme.colors.background,
        paper: emotionTheme.colors.surface,
      },
      text: {
        primary: emotionTheme.colors.text.primary,
        secondary: emotionTheme.colors.text.secondary,
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      success: {
        main: '#4caf50',
      },
    } as any,
    typography: {
      fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${emotionTheme.colors.border}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${emotionTheme.colors.border}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
