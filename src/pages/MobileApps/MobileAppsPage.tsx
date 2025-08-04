import React, { useState } from 'react';
import { Box, Button, Typography, Modal, Paper } from '@mui/material';
import { 
  QrCode as QrCodeIcon, 
  Android as AndroidIcon, 
  Apple as AppleIcon,
  PhonelinkSetup as PhonelinkSetupIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * Mobile Apps Page
 * Displays QR codes for various mobile app downloads and activations
 */
const MobileAppsPage: React.FC = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const handleQRCodeClick = (title: string) => {
    setModalTitle(title);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalTitle('');
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1"
        sx={{ 
          textAlign: 'center',
          mt: 5,
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {t('mobileApps.title', 'Aplikacje mobilne')}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          mt: 5
        }}
      >
        <Button 
          variant="outlined"
          startIcon={<QrCodeIcon />}
          onClick={() => handleQRCodeClick(t('mobileApps.downloadApp', 'Link do pobrania aplikacji MobileInfo'))}
          sx={{ width: 600, justifyContent: 'flex-start' }}
        >
          {t('mobileApps.showQRDownload', 'Pokaż kod QR (Link do pobrania aplikacji MobileInfo)')}
        </Button>
        
        <Button 
          variant="outlined"
          startIcon={<AndroidIcon />}
          onClick={() => handleQRCodeClick(t('mobileApps.activatePersonalizedAndroid', 'Aktywacja personalizowanej aplikacji (Android)'))}
          sx={{ width: 600, justifyContent: 'flex-start' }}
        >
          {t('mobileApps.showQRPersonalizedAndroid', 'Pokaż kod QR (Aktywacja personalizowanej aplikacji) (Android)')}
        </Button>
        
        <Button 
          variant="outlined"
          startIcon={<AppleIcon />}
          onClick={() => handleQRCodeClick(t('mobileApps.activatePersonalizedIOS', 'Aktywacja personalizowanej aplikacji (IOS)'))}
          sx={{ width: 600, justifyContent: 'flex-start' }}
        >
          {t('mobileApps.showQRPersonalizedIOS', 'Pokaż kod QR (Aktywacja personalizowanej aplikacji) (IOS)')}
        </Button>
        
        <Button 
          variant="outlined"
          startIcon={<PhonelinkSetupIcon />}
          onClick={() => handleQRCodeClick(t('mobileApps.activateNonPersonalized', 'Aktywacja niespersonalizowanej aplikacji'))}
          sx={{ width: 600, justifyContent: 'flex-start' }}
        >
          {t('mobileApps.showQRNonPersonalized', 'Pokaż kod QR (Aktywacja niespersonalizowanej aplikacji)')}
        </Button>
      </Box>

      {/* QR Code Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            width: '90%'
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }}>
            {modalTitle}
          </Typography>
          
          {/* Mock QR Code */}
          <Box
            sx={{
              width: 200,
              height: 200,
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3
            }}
          >
            <QrCodeIcon sx={{ fontSize: 80, color: '#999' }} />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('mobileApps.mockQRCode', 'Mock QR Code - będzie zastąpiony prawdziwym kodem')}
          </Typography>
          
          <Button variant="contained" onClick={handleCloseModal}>
            {t('common.close', 'Zamknij')}
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default MobileAppsPage;
