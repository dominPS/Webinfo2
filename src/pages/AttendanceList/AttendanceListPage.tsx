import React from 'react';
import { useTranslation } from 'react-i18next';

interface AttendanceListPageProps {
  translationKey?: string;
}

const AttendanceListPage: React.FC<AttendanceListPageProps> = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('AttendanceList.Title', 'Lista obecności')}</h1>
      <p>{t('AttendanceList.Description', 'To jest strona listy obecności.')}</p>
    </div>
  );
};

export default AttendanceListPage;