import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/features/dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Add more routes here as we create the components
      {
        path: '*',
        element: <div>Page not found</div>,
      },
    ],
  },
]);
