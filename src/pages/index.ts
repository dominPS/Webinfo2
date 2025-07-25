import DashboardPage from './Dashboard';
import LoginPage from './Login';
import NotFoundPage from './NotFound';
import EmployeeEvaluationPage from './EmployeeEvaluation';
import ProfileSelectionPage from './ProfileSelection';
import WorkerEvaluationPage from './WorkerEvaluation';
import LeaderEvaluationPage from './LeaderEvaluation';
import HREvaluationPage from './HREvaluation';
import ETeczkaPage from './ETeczka';
import { BasePage } from '../shared/components/BasePage';

// Named exports for each page
export { 
  DashboardPage, 
  LoginPage, 
  NotFoundPage, 
  EmployeeEvaluationPage, 
  ProfileSelectionPage,
  WorkerEvaluationPage,
  LeaderEvaluationPage,
  HREvaluationPage,
  ETeczkaPage
};

// Placeholder pages 
export const MobileAppsPage = BasePage;
export const AssignmentsPage = BasePage;
export const MapRegistrationsPage = BasePage;
export const AttendanceListPage = BasePage;
export const ScheduleAttendancePage = BasePage;
export { default as EmployeeDataPage } from './EmployeeDataPage';
export const ReserveVehiclePage = BasePage;
export const CanteenPage = BasePage;
export const VacationPlanPage = BasePage;
export const WeekendWorkPage = BasePage;
export const EmployeeRequestsPage = BasePage;
export const VacationsPage = BasePage;
export const MonthlySummaryPage = BasePage;
export const ExamsAndTrainingPage = BasePage;
export const SettlementPage = BasePage;
export const AbsencePlanPage = BasePage;
export const MonthlyAbsencePlanPage = BasePage;
export const SchedulePage = BasePage;
export const ProjectsActivitiesPage = BasePage;
