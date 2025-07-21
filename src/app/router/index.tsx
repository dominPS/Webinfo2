import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { LicensesPage } from '../../features/licenses/LicensesPage';
import { ClientsPage } from '../../features/clients/ClientsPage';
import { InvoicesPage } from '../../features/invoices/InvoicesPage';
import { SettingsPage } from '../../features/settings/SettingsPage';
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
  AttendanceListPage,
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
  ProjectsActivitiesPage,
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
        element: <MobileAppsPage translationKey="mobileApps" />,
      },
      {
        path: 'assignments',
        element: <AssignmentsPage translationKey="assignments" />,
      },
      {
        path: 'map-registrations',
        element: <MapRegistrationsPage translationKey="mapRegistrations" />,
      },
      {
        path: 'attendance-list',
        element: <AttendanceListPage translationKey="attendanceList" />,
      },
      {
        path: 'schedule-attendance',
        element: <ScheduleAttendancePage translationKey="scheduleAttendance" />,
      },
      {
        path: 'employee-data',
        element: <EmployeeDataPage translationKey="employeeData" />,
      },
      {
        path: 'reserve-vehicle',
        element: <ReserveVehiclePage translationKey="reserveVehicle" />,
      },
      {
        path: 'canteen',
        element: <CanteenPage translationKey="canteen" />,
      },
      {
        path: 'vacation-plan',
        element: <VacationPlanPage translationKey="vacationPlan" />,
      },
      {
        path: 'weekend-work',
        element: <WeekendWorkPage translationKey="weekendWork" />,
      },
      {
        path: 'employee-requests',
        element: <EmployeeRequestsPage translationKey="employeeRequests" />,
      },
      {
        path: 'vacations',
        element: <VacationsPage translationKey="vacations" />,
      },
      {
        path: 'monthly-summary',
        element: <MonthlySummaryPage translationKey="monthlySummary" />,
      },
      {
        path: 'exams-and-training',
        element: <ExamsAndTrainingPage translationKey="examsAndTraining" />,
      },
      {
        path: 'settlement',
        element: <SettlementPage translationKey="settlement" />,
      },
      {
        path: 'absence-plan',
        element: <AbsencePlanPage translationKey="absencePlan" />,
      },
      {
        path: 'monthly-absence-plan',
        element: <MonthlyAbsencePlanPage translationKey="monthlyAbsencePlan" />,
      },
      {
        path: 'schedule',
        element: <SchedulePage translationKey="schedule" />,
      },
      {
        path: 'projects-activities',
        element: <ProjectsActivitiesPage translationKey="projectsActivities" />,
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
