import React from 'react';
import { useTranslation } from 'react-i18next';
import './LicensesPage.css';

export const LicensesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="licenses-page">
      <h1 className="licenses-page__title">{t('topMenu.licenses')}</h1>
      {/* Add your licenses content here */}
    </div>
  );
};
