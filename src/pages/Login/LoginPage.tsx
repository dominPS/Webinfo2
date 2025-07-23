import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { TextField } from '@/components/ui/text-field/text-field';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import loginImage from '@/shared/assets/images/time_hub.svg';
import loginIcon from '@/shared/assets/images/view-card.svg';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError(t('login_aut_error'));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        px: 2,
        py: 4,
      }}
    >
      <Box>
        <img src={loginImage} alt="Ilustracja logowania" style={{ width: '150px', height: 'auto' }} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <TextField
          fullWidth
          placeholder={t('login_edit_user') || 'Nazwa użytkownika'}
          icon={<PersonOutlineOutlinedIcon fontSize="small" htmlColor={theme.palette.accent_field.main} />}
          margin="none"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          placeholder={t('login-password') || 'Hasło'}
          icon={<LockOpenOutlinedIcon fontSize="small" htmlColor={theme.palette.accent_field.main} />}
          margin="none"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 0.5,
              px: 3,
              py: 0.6,
              fontSize: '0.575rem',
              borderRadius: '10px',
              textDecoration: 'underline',
              textUnderlineOffset: '1px',
              textTransform: 'none',
              backgroundColor: theme.palette.accent_hover.main,
              '&:hover': {
                backgroundColor: theme.palette.accent_hover.dark,
              },
            }}
          >
            {t('login-aut')}
          </Button>
        </Box>

        <Box
          sx={{
            color: 'red',
            fontSize: '0.7rem',
            mt: 1,
            textAlign: 'center',
            minHeight: '1.2rem',
            fontStyle: 'italic',
          }}
        >
          {error || '\u00A0'}
        </Box>

      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <img src={loginIcon} alt="Ikona logowania" style={{ width: 51, height: 43 }} />
        <Box
          component="span"
          sx={{
            lineHeight: '20px',
            letterSpacing: '0.29px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 500,
            color: theme.palette.accent_white.main,
          }}
        >
          {t('login_info')}
        </Box>
      </Box>
    </Box>
  );
};
export default LoginPage;