import { ThemeProvider } from './app/providers/ThemeProvider';
import { MUIProvider } from './app/providers/MUIProvider';
import { QueryProvider } from './app/providers/QueryProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ErrorBoundary } from './shared/components/common';
import { useAuthStore } from './lib/stores';
import { useEffect } from 'react';
import './app/i18n';

export const App = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <MUIProvider>
            <RouterProvider router={router} />
          </MUIProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};
