import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box mb={3}>
        <Alert severity="error">
          {errorMessage || t('Vacations.Error', 'Wystąpił błąd podczas ładowania danych')}
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};
