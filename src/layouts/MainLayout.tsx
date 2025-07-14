import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '@/features/navigation/Sidebar';
import { LanguageSelector } from '@/shared/components/LanguageSelector';
import { ReportsLogo } from '@/shared/components/ReportsLogo';
import { TopMenu } from '@/shared/components/TopMenu';
import { Footer } from '@/shared/components/Footer';
import { useSidebar } from '@/contexts/SidebarContext';

const SIDEBAR_WIDTH = 280;
const COLLAPSED_SIDEBAR_WIDTH = 50;
const TOP_SPACING = 30;

const MainContainer = styled.div<{ $sidebarCollapsed: boolean }>`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-top: ${TOP_SPACING}px;
  padding-bottom: ${TOP_SPACING}px;
  padding-left: ${props => props.$sidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH}px;
  transition: padding-left 0.3s ease;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${TOP_SPACING * 2}px);
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 30px;
  min-height: 0; /* Allow flex child to shrink below content size */
  
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const TopBar = styled.div`
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.large};
  height: 120px;
  padding: 0 40px;
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.medium};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NotificationButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const MainLayout = () => {
  const { t } = useTranslation();
  const { isCollapsed } = useSidebar();

  return (
    <MainContainer $sidebarCollapsed={isCollapsed}>
      <Sidebar />
      <ContentContainer>
        <TopBar>
          <TopBarLeft>
            <TopMenu />
            <ReportsLogo />
          </TopBarLeft>
          <TopBarRight>
            <LanguageSelector />
            <NotificationButton title={t('header.notifications')}>
              🔔
            </NotificationButton>
            <ProfileButton>
              👤 Test
            </ProfileButton>
          </TopBarRight>        </TopBar>
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </ContentContainer>
    </MainContainer>
  );
};
