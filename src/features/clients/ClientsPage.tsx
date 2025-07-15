import React from 'react';
import { useTranslation } from 'react-i18next';
import './ClientsPage.css';

export const ClientsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="clients-page">
      <h1 className="clients-page__title">{t('topMenu.clients')}</h1>
      {/* Add your clients content here */}
    </div>
  );
};
