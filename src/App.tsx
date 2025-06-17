import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/shared/routes';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import '@/i18n';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
