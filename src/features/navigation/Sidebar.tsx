import React from 'react';
import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useUIState } from '@/hooks/useUIState';

const SIDEBAR_WIDTH = 320;
const TOP_SPACING = 40;

const SidebarContainer = styled.aside`
  width: ${SIDEBAR_WIDTH}px;
  position: fixed;
  top: ${TOP_SPACING}px;
  bottom: ${TOP_SPACING}px;
  left: 0;
  background: ${props => props.theme.colors.primary};
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const SidebarHeader = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  padding: 0 46px;
  margin-bottom: 32px;
`;

const NavContainer = styled.div`
  flex: 1;
  padding: 0 30px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

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

const LogoutButton = styled.button`
  margin: 24px 30px;
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
  width: calc(100% - 60px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 50%;
  right: -29.5px;
  transform: translateY(-50%);
  width: 59px;
  height: 59px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2000;
  padding: 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-50%) scale(1.05);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  svg {
    width: 59px;
    height: 59px;
  }
`;

const CollapseIcon = styled.span`
  display: block;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  user-select: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CollapsedSidebarContainer = styled(SidebarContainer)`
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  padding: 0;
  align-items: center;
  .logo {
    justify-content: center;
    padding: 0;
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

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      {collapsed ? (
        <CollapsedSidebarContainer>          <SidebarHeader className="logo" style={{ justifyContent: 'center', padding: 0, marginBottom: 0, height: '80px' }}>
            <Logo onlyIcon />
          </SidebarHeader>
          <CollapseButton onClick={() => setCollapsed(false)} title={t('navigation.expandSidebar')}>
            <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="29.5" cy="29.5" r="29.5" fill="#646FFF"/>
              <CollapseIcon>{'>'}</CollapseIcon>
            </svg>
          </CollapseButton>
        </CollapsedSidebarContainer>
      ) : (
        <SidebarContainer>          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <CollapseButton onClick={() => setCollapsed(true)} title={t('navigation.collapseSidebar')}>
            <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="29.5" cy="29.5" r="29.5" fill="#646FFF"/>
              <CollapseIcon>{'<'}</CollapseIcon>
            </svg>
          </CollapseButton>
          <NavContainer>
            {navigationItems.map((item) => (
              <NavItem key={item.path} to={item.path}>
                {t(`navigation.${item.translationKey}`, {
                  defaultValue: item.translationKey
                })}
              </NavItem>
            ))}
          </NavContainer>
          <LogoutButton onClick={handleAuthAction}>
            {isLoggedIn ? t('navigation.logout') : t('navigation.login')}
          </LogoutButton>
        </SidebarContainer>
      )}
    </>
  );
};
