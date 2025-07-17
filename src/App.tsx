import { ThemeProvider } from './shared/theme/ThemeProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './shared/routes';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { SidebarProvider } from './contexts/SidebarContext';
import './i18n';

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
