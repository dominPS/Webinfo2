import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../shared/components/navigation/LanguageSelector';
import { ReportsLogo } from '../shared/components/logos/ReportsLogo';
import { Footer } from '../shared/components/layout/Footer';

const TOP_SPACING = 0;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F5F5F5; /* Jasne tło dla całej aplikacji */
  padding-top: ${TOP_SPACING}px;
  padding-bottom: ${TOP_SPACING}px;
`;

const LayoutWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.spacing.lg};
  padding-left: 20px; 
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${TOP_SPACING * 2}px);
  margin-top: 20px;
  background: #F5F5F5; /* Dopasowanie do tła kontenera głównego */
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 30px;
  min-height: 0; /* Allow flex child to shrink below content size */
  background: #FFFFFF; /* Biały kolor dla treści głównej */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  
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
  background: #126678; /* Kolor primary */
  border-radius: 12px;
  height: 70px;
  padding: 0 40px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;  
  margin-top: 10px;
  color: white; /* Biały tekst dla lepszego kontrastu */
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

// Add a FooterWrapper to position footer correctly
const FooterWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <MainContainer>
      <LayoutWrapper>
        <ContentContainer>
          <TopBar>
            <TopBarLeft>
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
            </TopBarRight>
          </TopBar>
          <MainContent>
            <Outlet />
          </MainContent>
        </ContentContainer>
      </LayoutWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </MainContainer>
  );
};
