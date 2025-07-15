import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ProfileSelectionPage.css';

/**
 * Profile Selection Page
 * Allows users to choose their profile before accessing employee evaluation
 */
const ProfileSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProfileSelect = (profile: string) => {
    // Navigate to the appropriate evaluation page based on profile
    switch (profile) {
      case 'worker':
        navigate('/employee-evaluation/worker');
        break;
      case 'leader':
        navigate('/employee-evaluation/leader');
        break;
      case 'hr':
        navigate('/employee-evaluation/hr');
        break;
      default:
        navigate('/employee-evaluation/worker');
    }
  };

  return (
    <div className="profile-selection-page">
      <h2 className="profile-selection-page__label">{t('evaluation.chooseProfile', 'Choose your profile')}</h2>
      <div className="profile-selection-page__button-container">
        <button className="profile-selection-page__button" onClick={() => handleProfileSelect('worker')}>
          {t('evaluation.profiles.worker', 'Worker')}
        </button>
        <button className="profile-selection-page__button" onClick={() => handleProfileSelect('leader')}>
          {t('evaluation.profiles.leader', 'Leader')}
        </button>
        <button className="profile-selection-page__button" onClick={() => handleProfileSelect('hr')}>
          {t('evaluation.profiles.hr', 'HR')}
        </button>
      </div>
    </div>
  );
};

export default ProfileSelectionPage;
