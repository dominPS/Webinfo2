import React from 'react';
import { useTranslation } from 'react-i18next';
import './LeaderIDPFlow.css';

const LeaderIDPComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div className="leader-idp-flow">
      <div className="leader-idp-flow__header">
        <h2 className="leader-idp-flow__title">
          {t('idp.leader.title', 'Zarządzanie Planami IDP')}
        </h2>
      </div>
      <div>Leader IDP Flow Component</div>
    </div>
  );
};

export default LeaderIDPComponent;
