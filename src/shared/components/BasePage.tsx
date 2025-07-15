import React from 'react';
import { useTranslation } from 'react-i18next';
import './BasePage.css';

interface PageProps {
  translationKey: string;
}

export const BasePage: React.FC<PageProps> = ({ translationKey }) => {
  const { t } = useTranslation();

  return (
    <div className="base-page">
      <h1 className="base-page__title">{t(`navigation.${translationKey}`)}</h1>
      <div className="base-page__content">
        {/* Content will be added later */}
      </div>
    </div>
  );
};
