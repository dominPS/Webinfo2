import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/Logo';

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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
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
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <NavContainer>
        <NavItem to="/">{t('navigation.dashboard')}</NavItem>
        <NavItem to="/projects">{t('navigation.projects')}</NavItem>
        <NavItem to="/tasks">{t('navigation.tasks')}</NavItem>
        <NavItem to="/calendar">{t('navigation.calendar')}</NavItem>
        <NavItem to="/reports">{t('navigation.reports')}</NavItem>
        <NavItem to="/settings">{t('navigation.settings')}</NavItem>
      </NavContainer>
      <LogoutButton>
        🚪 {t('navigation.logout')}
      </LogoutButton>
    </SidebarContainer>
  );
};
