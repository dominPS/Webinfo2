import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { VacationHistory } from '../hooks/useVacationData';

interface VacationHistoryTableProps {
  vacations: VacationHistory[];
}

export const VacationHistoryTable: React.FC<VacationHistoryTableProps> = ({ vacations }) => {
  const { t } = useTranslation();
  
  return (
    <TableContainer component={Paper} id="vacation-history-table">
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.VacationHistory.Headers.VacationCode', 'Kod urlopu')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.VacationHistory.Headers.Description', 'Opis')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.VacationHistory.Headers.DateFrom', 'Data od')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.VacationHistory.Headers.DateTo', 'Data do')}</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>{t('Vacations.Tables.VacationHistory.Headers.VacationDays', 'Dni urlopu')}</TableCell>
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
                <TableCell align="center">{vacation.vacationCode}</TableCell>
                <TableCell align="center">{vacation.description}</TableCell>
                <TableCell align="center">{vacation.dateFrom}</TableCell>
                <TableCell align="center">{vacation.dateTo}</TableCell>
                <TableCell align="center">{vacation.vacationDays}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
