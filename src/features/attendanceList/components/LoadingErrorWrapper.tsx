import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAttendanceTranslations } from '../hooks/useAttendanceTranslations';

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  children: React.ReactNode;
}

export const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  hasError,
  errorMessage,
  children
}) => {
  const { t } = useAttendanceTranslations();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          {t('AttendanceList.Loading', 'Ładowanie danych...')}
        </Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {t('AttendanceList.Error', 'Błąd podczas ładowania danych:')} {errorMessage}
      </Alert>
    );
  }

  return <>{children}</>;
};
