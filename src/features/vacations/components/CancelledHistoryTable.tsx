import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CancelledVacation } from '../hooks/useVacationData';

interface CancelledHistoryTableProps {
  vacations: CancelledVacation[];
}

export const CancelledHistoryTable: React.FC<CancelledHistoryTableProps> = ({ vacations }) => {
  const { t } = useTranslation();
  
  return (
    <TableContainer component={Paper} id="cancelled-history-table">
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.CancelledHistory.Headers.VacationCode', 'Kod urlopu')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.CancelledHistory.Headers.Description', 'Opis')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.CancelledHistory.Headers.DateFrom', 'Data od')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.CancelledHistory.Headers.DateTo', 'Data do')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                {t('Vacations.Tables.NoData', 'Brak danych')}
              </TableCell>
            </TableRow>
          ) : (
            vacations.map((vacation) => (
              <TableRow key={vacation.id}>
                <TableCell align="center">{vacation.vacationCode}</TableCell>
                <TableCell align="center">{vacation.description}</TableCell>
                <TableCell align="center">{vacation.dateFrom}</TableCell>
                <TableCell align="center">{vacation.dateTo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
