import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '@/features/navigation/Sidebar';
import { LanguageSelector } from '@/shared/components/LanguageSelector';
import { ReportsLogo } from '@/shared/components/ReportsLogo';
import { TopMenu } from '@/shared/components/TopMenu';
import { Footer } from '@/shared/components/Footer';

const SIDEBAR_WIDTH = 320;
const TOP_SPACING = 40;

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding-top: ${TOP_SPACING}px;
  padding-bottom: ${TOP_SPACING}px;
`;

const ContentContainer = styled.div`
  flex: 1;
  margin-left: ${SIDEBAR_WIDTH}px;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - ${TOP_SPACING * 2}px);
  overflow-y: auto;
  
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

const MainContent = styled.div`
  flex: 1;
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

  return (
    <MainContainer>
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
