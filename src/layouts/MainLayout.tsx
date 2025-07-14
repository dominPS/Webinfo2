import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '@/features/navigation/Sidebar';
import { LanguageSelector } from '@/shared/components/LanguageSelector';
import { ReportsLogo } from '@/shared/components/ReportsLogo';
import { TopMenu } from '@/shared/components/TopMenu';
import { Footer } from '@/shared/components/Footer';
import { useSidebar } from '@/contexts/SidebarContext';
import './MainLayout.css';

export const MainLayout = () => {
  const { t } = useTranslation();
  const { isCollapsed } = useSidebar();

  return (
    <div className={`main-layout ${isCollapsed ? 'main-layout--sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-layout__content">
        <div className="main-layout__top-bar">
          <div className="main-layout__top-bar-left">
            <TopMenu />
            <ReportsLogo />
          </div>
          <div className="main-layout__top-bar-right">
            <LanguageSelector />
            <button 
              className="main-layout__notification-button" 
              title={t('header.notifications')}
            >
              🔔
            </button>
            <button className="main-layout__profile-button">
              👤 Test
            </button>
          </div>
        </div>
        <div className="main-layout__main-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};
