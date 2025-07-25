import { useRoutes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginLayout } from '@/layouts/auth-layout';

import HomePage from '@/pages/Dashboard/DashboardPage';
import { EmployeeDataPage } from '@/pages/EmployeeDataPage';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login/LoginPage';
import PrivateRoute from '@/routes/PrivateRoute';
import { eventPath } from '@/routes/eventPath';

const AppRoutes = () => {
  const routes = useRoutes([
    // Public routes
    {
      element: <LoginLayout />,
      children: [
        {
          path: eventPath.login.path,
          element: <LoginPage />,
        },
      ],
    },
    // Protected routes
    {
      element: <PrivateRoute />, // Auth guard
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: '/',
              element: <HomePage />,
            },
            {
              path: eventPath.user.path,
              element: <EmployeeDataPage />,
            },
            {
              path: '*',
              element: <NotFoundPage />,
            },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default AppRoutes;