import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/shared/routes';
import '@/i18n';

export const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
