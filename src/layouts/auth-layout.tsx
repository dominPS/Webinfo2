import React from 'react';
import { CssBaseline, Box, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import backgroundImage from '@/shared/assets/images/background_login.jpeg';
import { useTranslation } from 'react-i18next';
import PolsystemLogo from '@/shared/assets/images/logo_polsystem.svg';

export const LoginLayout: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').toUpperCase();
  const languages = ['PL', 'EN', 'UA'];
  const { t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang.toLowerCase());
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        px: 2,
      }}
    >
      <CssBaseline />
        {/* Przełącznik języka */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 24,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {languages.map((lang, idx) => (
            <Typography
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              sx={{
                cursor: 'pointer',
                fontWeight: lang === currentLang ? 'bold' : 'normal',
                fontSize: '0.675rem',
                color: theme.colors.primary,
              }}
            >
              {lang}
              {idx < languages.length - 1 && ' / '}
            </Typography>
          ))}
        </Box>

        {/* Główne okno logowania */}
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: 0,
            left: 120,
            width: 360,
            maxWidth: '90vw',
            height: '80vh',
            padding: 4,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            backgroundColor: theme.colors.primary,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Paper>

        {/* Dolny pasek z tekstem i SVG */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.colors.text.primary, fontSize: '0.675rem' }}
          >
            {t('login_copyright')}
          </Typography>

          <img
          src={PolsystemLogo}
          alt="Ikona logowania"
          //style={{ width: 51, height: 43 }}
          />

          <Typography
            variant="caption"
            sx={{ color: theme.colors.text.primary, fontSize: '0.675rem' }}
          >
            {t('login_server')}
          </Typography>
        </Box>
      </Box>
  );
};