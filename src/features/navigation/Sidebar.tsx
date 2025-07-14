import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useUIState } from '@/hooks/useUIState';
import { useSidebar } from '@/contexts/SidebarContext';
import './Sidebar.css';
import WorkerdetailsIcon from '@/shared/assets/icons/Workerdetails.png';
import MobileAppsIcon from '@/shared/assets/icons/mobileapps.png';
import AssignmentsIcon from '@/shared/assets/icons/assigments.png';
import AttendanceListIcon from '@/shared/assets/icons/attendanceList.png';
import ScheduleAttendanceIcon from '@/shared/assets/icons/scheduleAttendance.png';
import ReserveVehicleIcon from '@/shared/assets/icons/reserveVehicle.png';
import CanteenIcon from '@/shared/assets/icons/canteen.png';
import EmployeeRequestsIcon from '@/shared/assets/icons/employeeRequests.png';
import VacationsIcon from '@/shared/assets/icons/vacations.png';
import VacationPlanIcon from '@/shared/assets/icons/vacationPlan.png';
import WeekendWorkIcon from '@/shared/assets/icons/weekendWork.png';
import {
  MapRegistrationsIcon,
  EmployeeEvaluationIcon,
  MonthlySummaryIcon,
  ExamsTrainingIcon,
  SettlementIcon,
  AbsencePlanIcon,
  MonthlyAbsencePlanIcon,
  ScheduleIcon,
  ProjectsActivitiesIcon,
  EmployeeReviewIcon
} from '@/shared/components/PlaceholderIcons';



interface NavItem {
  path: string;
  translationKey: string;
  icon?: string | React.ComponentType<any>;
}

const navigationItems: NavItem[] = [
  { path: '/mobile-apps', translationKey: 'mobileApps', icon: MobileAppsIcon },
  { path: '/assignments', translationKey: 'assignments', icon: AssignmentsIcon },
  { path: '/map-registrations', translationKey: 'mapRegistrations', icon: MapRegistrationsIcon },
  { path: '/attendance-list', translationKey: 'attendanceList', icon: AttendanceListIcon },
  { path: '/schedule-attendance', translationKey: 'scheduleAttendance', icon: ScheduleAttendanceIcon },
  { path: '/employee-data', translationKey: 'employeeData', icon: WorkerdetailsIcon },
  { path: '/employee-evaluation', translationKey: 'employeeEvaluation', icon: EmployeeEvaluationIcon },
  { path: '/reserve-vehicle', translationKey: 'reserveVehicle', icon: ReserveVehicleIcon },
  { path: '/canteen', translationKey: 'canteen', icon: CanteenIcon },
  { path: '/vacation-plan', translationKey: 'vacationPlan', icon: VacationPlanIcon },
  { path: '/weekend-work', translationKey: 'weekendWork', icon: WeekendWorkIcon },
  { path: '/employee-requests', translationKey: 'employeeRequests', icon: EmployeeRequestsIcon },
  { path: '/vacations', translationKey: 'vacations', icon: VacationsIcon },
  { path: '/monthly-summary', translationKey: 'monthlySummary', icon: MonthlySummaryIcon },
  { path: '/exams-and-training', translationKey: 'examsAndTraining', icon: ExamsTrainingIcon },
  { path: '/settlement', translationKey: 'settlement', icon: SettlementIcon },
  { path: '/absence-plan', translationKey: 'absencePlan', icon: AbsencePlanIcon },
  { path: '/monthly-absence-plan', translationKey: 'monthlyAbsencePlan', icon: MonthlyAbsencePlanIcon },
  { path: '/schedule', translationKey: 'schedule', icon: ScheduleIcon },
  { path: '/projects-activities', translationKey: 'projectsActivities', icon: ProjectsActivitiesIcon },
  { path: '/employee-review', translationKey: 'employeeReview', icon: EmployeeReviewIcon }
];

export const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation('translation', {
    useSuspense: false
  });
  const { isLoggedIn, logout } = useAuth();
  const { setShowLoginForm } = useUIState();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  // Force update hook
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Force rerender when language changes
  React.useEffect(() => {
    const handleLanguageChanged = () => {
      console.log('Language changed to:', i18n.language);
      // Force rerender
      forceUpdate();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
      setShowLoginForm(false);
      console.log('Logged out');
    } else {
      setShowLoginForm(true);
    }
  };

  const handleSidebarClick = (e: React.MouseEvent) => {
    // Jeśli kliknięto w puste miejsce (nie w button, link, lub inne interaktywne elementy)
    const target = e.target as HTMLElement;
    const isClickableElement = target.closest('button, a, input, select, textarea');
    
    if (!isClickableElement) {
      if (isCollapsed) {
        // Kliknięto w zwinięty sidebar - rozwiń go
        setIsCollapsed(false);
      } else {
        // Kliknięto w puste miejsce rozwiniętego sidebara - zwiń go
        setIsCollapsed(true);
      }
    }
  };

  return (
    <aside 
      className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}
      onClick={handleSidebarClick}
      data-sidebar="true"
    >
      <div className={`sidebar__header ${isCollapsed ? 'sidebar__header--collapsed' : ''}`}>
        {isCollapsed ? <Logo onlyIcon /> : <Logo />}
      </div>
      
      <div className={`sidebar__nav ${isCollapsed ? 'sidebar__nav--collapsed' : ''}`}>
        {navigationItems.map((item) => {
          const translatedText = t(`navigation.${item.translationKey}`, {
            defaultValue: item.translationKey
          });
          
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={`sidebar__nav-item ${isCollapsed ? 'sidebar__nav-item--collapsed' : ''}`}
              title={isCollapsed ? translatedText : undefined}
            >
              {item.icon && (
                typeof item.icon === 'string' ? (
                  <img 
                    src={item.icon} 
                    alt={`${item.translationKey} icon`}
                    className="sidebar__nav-icon" 
                  />
                ) : (
                  <item.icon width={20} height={20} fill="white" />
                )
              )}
              <span className={`sidebar__nav-text ${isCollapsed ? 'sidebar__nav-text--collapsed' : ''}`}>
                {translatedText}
              </span>
            </NavLink>
          );
        })}
      </div>
      
      <button 
        className={`sidebar__logout ${isCollapsed ? 'sidebar__logout--collapsed' : ''}`}
        onClick={handleAuthAction}
      >
        {isLoggedIn ? t('navigation.logout') : t('navigation.login')}
      </button>
    </aside>
  );
};
