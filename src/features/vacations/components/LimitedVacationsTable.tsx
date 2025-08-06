import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { LimitedVacation } from '../hooks/useVacationData';

interface LimitedVacationsTableProps {
  vacations: LimitedVacation[];
}

export const LimitedVacationsTable: React.FC<LimitedVacationsTableProps> = ({ vacations }) => {
  const { t } = useTranslation();
  
  return (
    <TableContainer component={Paper} id="limited-vacations-table">
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.LimitedVacations.Headers.Code', 'Kod urlopu')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.LimitedVacations.Headers.ParentCode', 'Kod nadrzędny')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.LimitedVacations.Headers.Limit', 'Limit')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.LimitedVacations.Headers.Available', 'Do wykorzystania')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.LimitedVacations.Headers.AdditionalInfo', 'Dod. info.')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {t('Vacations.Tables.NoData', 'Brak danych')}
              </TableCell>
            </TableRow>
          ) : (
            vacations.map((vacation) => (
              <TableRow key={vacation.id}>
                <TableCell align="center">{vacation.code}</TableCell>
                <TableCell align="center">{vacation.parentCode}</TableCell>
                <TableCell align="center">{vacation.limit}</TableCell>
                <TableCell align="center">{vacation.available}</TableCell>
                <TableCell align="center">{vacation.additionalInfo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
