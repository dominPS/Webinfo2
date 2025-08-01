import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination, 
  TableSortLabel 
} from '@mui/material';
import { useAttendanceTranslations } from '../hooks/useAttendanceTranslations';
import { useTableState } from '../hooks/useTableState';
import { formatDate } from '../utils';

interface Employee {
  IdWorker?: number;
  Badge?: number;
  Name?: string;
  Surname?: string;
  Presence?: string;
  Date?: string | null;
  Time?: string | null;
  Group?: string;
  Department?: string;
  Position?: string | null;
  DeviceName?: string | null;
  DeviceId?: number | null;
  ZoneName?: string | null;
  ZoneId?: number | null;
  LastActivity?: string | null;
  WorkTime?: string | null;
  OverTime?: string | null;
  BreakTime?: string | null;
  Status?: string | null;
  Photo?: string | null;
  Email?: string | null;
  Phone?: string | null;
}

interface EmployeeTableProps {
  employees: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const { translateStatus, t } = useAttendanceTranslations();
  const { 
    page, 
    rowsPerPage, 
    sortKey, 
    sortOrder, 
    handleChangePage, 
    handleChangeRowsPerPage, 
    handleSort, 
    sortData, 
    paginateData 
  } = useTableState();

  const sortedEmployees = sortData(employees);
  const displayedEmployees = paginateData(sortedEmployees);

  return (
    <>
      <TableContainer component={Paper}>
        <Table id="employees-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Badge'}
                  direction={sortKey === 'Badge' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Badge')}
                >
                  {t('AttendanceList.Table.Headers.Id', 'Nr ewid.')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Surname'}
                  direction={sortKey === 'Surname' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Surname')}
                >
                  {t('AttendanceList.Table.Headers.LastName', 'Nazwisko')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Name'}
                  direction={sortKey === 'Name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Name')}
                >
                  {t('AttendanceList.Table.Headers.FirstName', 'Imię')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Presence'}
                  direction={sortKey === 'Presence' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Presence')}
                >
                  {t('AttendanceList.Table.Headers.Attendance', 'Obecność')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Date'}
                  direction={sortKey === 'Date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Date')}
                >
                  {t('AttendanceList.Table.Headers.Date', 'Data')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                {t('AttendanceList.Table.Headers.Device', 'Urządzenie')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEmployees.map((employee) => (
              <TableRow 
                key={employee.IdWorker}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    cursor: 'pointer',
                    '& .MuiTableCell-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <TableCell>{employee.Badge}</TableCell>
                <TableCell>{employee.Surname}</TableCell>
                <TableCell>{employee.Name}</TableCell>
                <TableCell>{translateStatus(employee.Presence || '')}</TableCell>
                <TableCell>{formatDate(employee.Date) || '-'}</TableCell>
                <TableCell>{employee.DeviceName || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('AttendanceList.Pagination.RowsPerPage', 'Wierszy na stronie:')}
        labelDisplayedRows={({ from, to, count }) => 
          t('AttendanceList.Pagination.DisplayedRows', `${from}-${to} z ${count}`, { from, to, count })
        }
      />
    </>
  );
};
