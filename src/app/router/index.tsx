import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
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
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProfileSelectionPage />,
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
