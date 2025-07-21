import { ThemeProvider } from './app/providers/ThemeProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { SidebarProvider } from './contexts/SidebarContext';
import './app/i18n';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
