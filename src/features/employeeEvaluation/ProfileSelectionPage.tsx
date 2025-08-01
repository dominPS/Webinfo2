import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
    <Box>
      <Typography 
        variant="h4" 
        component="h2"
        sx={{ 
          textAlign: 'center',
          mt: 5,  // 40px
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {t('evaluation.chooseProfile', 'Choose your profile')}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          mt: 5  // 40px
        }}
      >
        <Button 
          variant="outlined"
          onClick={() => handleProfileSelect('worker')}
        >
          {t('evaluation.profiles.worker', 'Worker')}
        </Button>
        
        <Button 
          variant="outlined"
          onClick={() => handleProfileSelect('leader')}
        >
          {t('evaluation.profiles.leader', 'Leader')}
        </Button>
        
        <Button 
          variant="outlined"
          onClick={() => handleProfileSelect('hr')}
        >
          {t('evaluation.profiles.hr', 'HR')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileSelectionPage;
