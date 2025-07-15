import React from 'react';
import { useTranslation } from 'react-i18next';
import './InvoicesPage.css';

export const InvoicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="invoices-page">
      <h1 className="invoices-page__title">{t('topMenu.invoices')}</h1>
      {/* Add your invoices content here */}
    </div>
  );
};
