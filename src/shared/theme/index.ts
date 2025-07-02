export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
    };
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#126678',
    secondary: '#F50057',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    border: '#E0E0E0',
  },
  fonts: {
    primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    secondary: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#126678',
    secondary: '#FF4081',
    background: '#121212',
    surface: '#1E1E1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    border: '#333333',
  },
  fonts: {
    primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    secondary: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.2)',
    large: '0 8px 16px rgba(0,0,0,0.2)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};
