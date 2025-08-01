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

interface PresentGuestTableProps {
  guests: any[];
}

export const PresentGuestTable: React.FC<PresentGuestTableProps> = ({ guests }) => {
  const { t, translateStatus, translateGuestType } = useAttendanceTranslations();
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
  } = useTableState(25);

  const sortedGuests = sortData(guests);
  const displayedGuests = paginateData(sortedGuests);

  return (
    <>
      <TableContainer component={Paper}>
        <Table id="present-guests-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'FirstName'}
                  direction={sortKey === 'FirstName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('FirstName')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.FirstName', 'Imię')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'LastName'}
                  direction={sortKey === 'LastName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('LastName')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.LastName', 'Nazwisko')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Company'}
                  direction={sortKey === 'Company' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Company')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Company', 'Firma')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'NumerLogiczny'}
                  direction={sortKey === 'NumerLogiczny' ? sortOrder : 'asc'}
                  onClick={() => handleSort('NumerLogiczny')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'NumerFizyczny'}
                  direction={sortKey === 'NumerFizyczny' ? sortOrder : 'asc'}
                  onClick={() => handleSort('NumerFizyczny')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.PhysicalNumber', 'Nr fizyczny')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'TypKarty'}
                  direction={sortKey === 'TypKarty' ? sortOrder : 'asc'}
                  onClick={() => handleSort('TypKarty')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Type', 'Typ')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Obecnosc'}
                  direction={sortKey === 'Obecnosc' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Obecnosc')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Attendance', 'Obecność')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'EntryDate'}
                  direction={sortKey === 'EntryDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('EntryDate')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Entrance', 'Wejście')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'ExitDate'}
                  direction={sortKey === 'ExitDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('ExitDate')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Exit', 'Wyjście')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Duration'}
                  direction={sortKey === 'Duration' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Duration')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.Stay', 'Pobyt')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'DoKogo'}
                  direction={sortKey === 'DoKogo' ? sortOrder : 'asc'}
                  onClick={() => handleSort('DoKogo')}
                >
                  {t('AttendanceList.PresentGuestTable.Headers.ToWhom', 'Do kogo')}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedGuests.map((guest, index) => (
              <TableRow 
                key={guest.IdGuest || index}
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
                <TableCell>{guest.FirstName}</TableCell>
                <TableCell>{guest.LastName}</TableCell>
                <TableCell>{guest.Company || '-'}</TableCell>
                <TableCell>{guest.NumerLogiczny || '-'}</TableCell>
                <TableCell>{guest.NumerFizyczny || '-'}</TableCell>
                <TableCell>{translateGuestType(guest.TypKarty || '-')}</TableCell>
                <TableCell>{translateStatus(guest.Obecnosc)}</TableCell>
                <TableCell>{formatDate(guest.EntryDate) || '-'}</TableCell>
                <TableCell>{formatDate(guest.ExitDate) || '-'}</TableCell>
                <TableCell>{guest.Duration || '-'}</TableCell>
                <TableCell>{guest.DoKogo || guest.ContactPerson || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedGuests.length}
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
