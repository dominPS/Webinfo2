import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ApprovedVacation } from '../hooks/useVacationData';

interface ApprovedPlanTableProps {
  vacations: ApprovedVacation[];
}

export const ApprovedPlanTable: React.FC<ApprovedPlanTableProps> = ({ vacations }) => {
  const { t } = useTranslation();
  
  return (
    <TableContainer component={Paper} id="approved-plan-table">
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.ApprovedPlan.Headers.Absence', 'Absencja')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.ApprovedPlan.Headers.DateFrom', 'Data od')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.ApprovedPlan.Headers.DateTo', 'Data do')}</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>{t('Vacations.Tables.ApprovedPlan.Headers.VacationRequest', 'Wniosek urlopowy')}</TableCell>
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
                <TableCell>{vacation.absence}</TableCell>
                <TableCell>{vacation.dateFrom}</TableCell>
                <TableCell>{vacation.dateTo}</TableCell>
                <TableCell>{vacation.vacationRequest}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
