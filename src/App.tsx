
import { ThemeProvider } from './app/providers/ThemeProvider';
import { MUIProvider } from './app/providers/MUIProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import './app/i18n';

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <MUIProvider>
            <SidebarProvider>
              <RouterProvider router={router} />
            </SidebarProvider>
          </MUIProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
