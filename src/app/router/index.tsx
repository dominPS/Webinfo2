import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { LicensesPage } from '../../features/licenses/LicensesPage';
import { ClientsPage } from '../../features/clients/ClientsPage';
import { InvoicesPage } from '../../features/invoices/InvoicesPage';
import { SettingsPage } from '../../features/settings/SettingsPage';
import AttendanceListPage from "../../pages/AttendanceList/AttendanceListPage";
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  EmployeeEvaluationPage,
  ProfileSelectionPage,
  WorkerEvaluationPage,
  LeaderEvaluationPage,
  HREvaluationPage,
  ETeczkaPage,
  MobileAppsPage,
  AssignmentsPage,
  MapRegistrationsPage,
  ScheduleAttendancePage,
  EmployeeDataPage,
  ReserveVehiclePage,
  CanteenPage,
  VacationPlanPage,
  WeekendWorkPage,
  EmployeeRequestsPage,
  VacationsPage,
  MonthlySummaryPage,
  ExamsAndTrainingPage,
  SettlementPage,
  AbsencePlanPage,
  MonthlyAbsencePlanPage,
  SchedulePage,
  ProjectsActivitiesPage
} from '../../pages';
import { RequireAuth } from './RequireAuth';
import { LoginLayout } from '../../layouts/auth-layout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginLayout />, // layout dla logowania
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'licenses',
        element: <LicensesPage />, 
      },
      {
        path: 'clients',
        element: <ClientsPage />, 
      },
      {
        path: 'invoices',
        element: <InvoicesPage />, 
      },
      {
        path: 'settings',
        element: <SettingsPage />, 
      },
      {
        path: 'mobile-apps',
        element: <MobileAppsPage />, 
      },
      {
        path: 'assignments',
        element: <AssignmentsPage translationKey="assignments" />, 
      },
      {
        path: 'map-registrations',
        element: <MapRegistrationsPage translationKey="map-registrations" />, 
      },
      {
        path: 'attendance-list',
        element: <AttendanceListPage />, 
      },
      {
        path: 'schedule-attendance',
        element: <ScheduleAttendancePage translationKey="schedule-attendance" />, 
      },
      {
        path: 'employee-data',
        element: <EmployeeDataPage />, 
      },
      {
        path: 'reserve-vehicle',
        element: <ReserveVehiclePage translationKey="reserve-vehicle" />, 
      },
      {
        path: 'canteen',
        element: <CanteenPage translationKey="canteen" />, 
      },
      {
        path: 'vacation-plan',
        element: <VacationPlanPage translationKey="vacation-plan" />, 
      },
      {
        path: 'weekend-work',
        element: <WeekendWorkPage translationKey="weekend-work" />, 
      },
      {
        path: 'employee-requests',
        element: <EmployeeRequestsPage translationKey="employee-requests" />, 
      },
      {
        path: 'vacations',
        element: <VacationsPage />, 
      },
      {
        path: 'monthly-summary',
        element: <MonthlySummaryPage translationKey="monthly-summary" />, 
      },
      {
        path: 'exams-and-training',
        element: <ExamsAndTrainingPage translationKey="exams-and-training" />, 
      },
      {
        path: 'settlement',
        element: <SettlementPage translationKey="settlement" />, 
      },
      {
        path: 'absence-plan',
        element: <AbsencePlanPage translationKey="absence-plan" />, 
      },
      {
        path: 'monthly-absence-plan',
        element: <MonthlyAbsencePlanPage translationKey="monthly-absence-plan" />, 
      },
      {
        path: 'schedule',
        element: <SchedulePage translationKey="schedule" />, 
      },
      {
        path: 'projects-activities',
        element: <ProjectsActivitiesPage translationKey="projects-activities" />, 
      },
      {
        path: 'e-teczka',
        element: <ETeczkaPage />, 
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
