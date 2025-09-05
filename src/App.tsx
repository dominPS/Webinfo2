import { ThemeProvider } from './app/providers/ThemeProvider';
import { MUIProvider } from './app/providers/MUIProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './app/i18n';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MUIProvider>
          <RouterProvider router={router} />
        </MUIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
