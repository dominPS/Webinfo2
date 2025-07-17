import React from 'react';
import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/components/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useUIState } from '../../hooks/useUIState';
import { useSidebar } from '../../contexts/SidebarContext';
import WorkerdetailsIcon from '../../shared/assets/icons/Workerdetails.png';
import MobileAppsIcon from '../../shared/assets/icons/mobileapps.png';
import AssignmentsIcon from '../../shared/assets/icons/assigments.png';
import AttendanceListIcon from '../../shared/assets/icons/attendanceList.png';
import ScheduleAttendanceIcon from '../../shared/assets/icons/scheduleAttendance.png';
import ReserveVehicleIcon from '../../shared/assets/icons/reserveVehicle.png';
import CanteenIcon from '../../shared/assets/icons/canteen.png';
import EmployeeRequestsIcon from '../../shared/assets/icons/employeeRequests.png';
import VacationsIcon from '../../shared/assets/icons/vacations.png';
import VacationPlanIcon from '../../shared/assets/icons/vacationPlan.png';
import WeekendWorkIcon from '../../shared/assets/icons/weekendWork.png';
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
  ETeczkaIcon
} from '../../shared/components/PlaceholderIcons';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 50;
const TOP_SPACING = 30;

const SidebarContainer = styled.aside<{ $isCollapsed: boolean }>`
  width: ${props => props.$isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH}px;
  position: fixed;
  top: ${TOP_SPACING}px;
  bottom: ${TOP_SPACING}px;
  left: 0;
  background: ${props => props.theme.colors.primary};
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 10;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const SidebarHeader = styled.div<{ $isCollapsed: boolean }>`
  height: ${props => props.$isCollapsed ? '60px' : '90px'};
  display: flex;
  align-items: center;
  padding: ${props => props.$isCollapsed ? '0' : '0 36px'};
  margin-bottom: ${props => props.$isCollapsed ? '0' : '24px'};
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  padding: ${props => props.$isCollapsed ? '0 8px' : '0 24px'};
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const NavItem = styled(NavLink)<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isCollapsed ? '0' : '12px'};
  padding: ${props => props.$isCollapsed ? '8px' : '12px 16px'};
  color: white;
  text-decoration: none;
  border-radius: 13px;
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.8;
  transition: all 0.2s ease;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  position: relative;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }

  /* Tooltip for collapsed state */
  ${props => props.$isCollapsed && `
    &:hover::after {
      content: attr(title);
      position: absolute;
      left: 60px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
    }
  `}
`;

const NavItemIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(100%);
  flex-shrink: 0;
`;

const NavItemText = styled.span<{ $isCollapsed: boolean }>`
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  white-space: nowrap;
`;

const LogoutButton = styled.button<{ $isCollapsed: boolean }>`
  margin: 24px ${props => props.$isCollapsed ? '6px' : '30px'};
  padding: 0 16px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 13px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  width: ${props => props.$isCollapsed ? '48px' : 'calc(100% - 60px)'};
  opacity: ${props => props.$isCollapsed ? '0' : '1'};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;



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
  { path: '/e-teczka', translationKey: 'eTeczka', icon: ETeczkaIcon }
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
    <SidebarContainer 
      $isCollapsed={isCollapsed} 
      onClick={handleSidebarClick}
      data-sidebar="true"
    >
      <SidebarHeader $isCollapsed={isCollapsed}>
        {isCollapsed ? <Logo onlyIcon /> : <Logo />}
      </SidebarHeader>
      
      <NavContainer $isCollapsed={isCollapsed}>
        {navigationItems.map((item) => {
          const translatedText = t(`navigation.${item.translationKey}`, {
            defaultValue: item.translationKey
          });
          
          return (
            <NavItem 
              key={item.path} 
              to={item.path} 
              $isCollapsed={isCollapsed}
              title={isCollapsed ? translatedText : undefined}
            >
              {item.icon && (
                typeof item.icon === 'string' ? (
                  <NavItemIcon src={item.icon} alt={`${item.translationKey} icon`} />
                ) : (
                  <item.icon width={20} height={20} fill="white" />
                )
              )}
              <NavItemText $isCollapsed={isCollapsed}>
                {translatedText}
              </NavItemText>
            </NavItem>
          );
        })}
      </NavContainer>
      
      <LogoutButton $isCollapsed={isCollapsed} onClick={handleAuthAction}>
        {isLoggedIn ? t('navigation.logout') : t('navigation.login')}
      </LogoutButton>
    </SidebarContainer>
  );
};
