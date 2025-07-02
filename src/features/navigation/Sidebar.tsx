import React from 'react';
import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useUIState } from '@/hooks/useUIState';
import { useSidebar } from '@/contexts/SidebarContext';

const SIDEBAR_WIDTH = 320;
const COLLAPSED_SIDEBAR_WIDTH = 60;
const TOP_SPACING = 40;

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
  height: ${props => props.$isCollapsed ? '80px' : '120px'};
  display: flex;
  align-items: center;
  padding: ${props => props.$isCollapsed ? '0' : '0 46px'};
  margin-bottom: ${props => props.$isCollapsed ? '0' : '32px'};
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  padding: ${props => props.$isCollapsed ? '0' : '0 30px'};
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
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

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  border-radius: 13px;
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.8;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }
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
}

const navigationItems: NavItem[] = [
  { path: '/mobile-apps', translationKey: 'mobileApps' },
  { path: '/assignments', translationKey: 'assignments' },
  { path: '/map-registrations', translationKey: 'mapRegistrations' },
  { path: '/attendance-list', translationKey: 'attendanceList' },
  { path: '/schedule-attendance', translationKey: 'scheduleAttendance' },
  { path: '/employee-data', translationKey: 'employeeData' },
  { path: '/employee-evaluation', translationKey: 'employeeEvaluation' },
  { path: '/reserve-vehicle', translationKey: 'reserveVehicle' },
  { path: '/canteen', translationKey: 'canteen' },
  { path: '/vacation-plan', translationKey: 'vacationPlan' },
  { path: '/weekend-work', translationKey: 'weekendWork' },
  { path: '/employee-requests', translationKey: 'employeeRequests' },
  { path: '/vacations', translationKey: 'vacations' },
  { path: '/monthly-summary', translationKey: 'monthlySummary' },
  { path: '/exams-and-training', translationKey: 'examsAndTraining' },
  { path: '/settlement', translationKey: 'settlement' },
  { path: '/absence-plan', translationKey: 'absencePlan' },
  { path: '/monthly-absence-plan', translationKey: 'monthlyAbsencePlan' },
  { path: '/schedule', translationKey: 'schedule' },
  { path: '/projects-activities', translationKey: 'projectsActivities' },
  { path: '/employee-review', translationKey: 'employeeReview' }
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
        {navigationItems.map((item) => (
          <NavItem key={item.path} to={item.path}>
            {t(`navigation.${item.translationKey}`, {
              defaultValue: item.translationKey
            })}
          </NavItem>
        ))}
      </NavContainer>
      
      <LogoutButton $isCollapsed={isCollapsed} onClick={handleAuthAction}>
        {isLoggedIn ? t('navigation.logout') : t('navigation.login')}
      </LogoutButton>
    </SidebarContainer>
  );
};
