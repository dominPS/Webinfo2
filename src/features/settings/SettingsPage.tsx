import React from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t('topMenu.settings')}</h1>
      {/* Add your settings content here */}
    </div>
  );
};
