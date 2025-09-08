import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { ProtectedRoute } from '../../shared/components/common';
import IDPTestPage from '../../pages/Test/IDPTestPage';
import {
  LoginPage,
  NotFoundPage,
  EmployeeEvaluationPage,
  ProfileSelectionPage,
  WorkerEvaluationPage,
  LeaderEvaluationPage,
  HREvaluationPage
} from '../../pages';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfileSelectionPage />,
      },
      {
        path: 'test-idp',
        element: <IDPTestPage />,
      },
      {
        path: 'employee-evaluation',
        element: <ProfileSelectionPage />,
      },
      {
        path: 'employee-evaluation/worker',
        element: <WorkerEvaluationPage />,
      },
      {
        path: 'employee-evaluation/leader',
        element: <LeaderEvaluationPage />,
      },
      {
        path: 'employee-evaluation/hr',
        element: <HREvaluationPage />,
      },
      {
        path: 'employee-evaluation/form',
        element: <EmployeeEvaluationPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
