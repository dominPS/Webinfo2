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

interface GuestTableProps {
  guests: any[];
}

export const GuestTable: React.FC<GuestTableProps> = ({ guests }) => {
  const { t, translateGuestType, translateDocument } = useAttendanceTranslations();
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
        <Table id="guests-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'CardLog'}
                  direction={sortKey === 'CardLog' ? sortOrder : 'asc'}
                  onClick={() => handleSort('CardLog')}
                >
                  {t('AttendanceList.GuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'CardType'}
                  direction={sortKey === 'CardType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('CardType')}
                >
                  {t('AttendanceList.GuestTable.Headers.Type', 'Typ')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Name'}
                  direction={sortKey === 'Name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Name')}
                >
                  {t('AttendanceList.GuestTable.Headers.FirstName', 'Imię')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Surname'}
                  direction={sortKey === 'Surname' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Surname')}
                >
                  {t('AttendanceList.GuestTable.Headers.LastName', 'Nazwisko')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Company'}
                  direction={sortKey === 'Company' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Company')}
                >
                  {t('AttendanceList.GuestTable.Headers.Company', 'Firma')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Document'}
                  direction={sortKey === 'Document' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Document')}
                >
                  {t('AttendanceList.GuestTable.Headers.Document', 'Dokument')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Date'}
                  direction={sortKey === 'Date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Date')}
                >
                  {t('AttendanceList.GuestTable.Headers.IssueDate', 'Data wydania')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'ReturnDate'}
                  direction={sortKey === 'ReturnDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('ReturnDate')}
                >
                  {t('AttendanceList.GuestTable.Headers.ReturnDate', 'Data zwrotu')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'ToWhom'}
                  direction={sortKey === 'ToWhom' ? sortOrder : 'asc'}
                  onClick={() => handleSort('ToWhom')}
                >
                  {t('AttendanceList.GuestTable.Headers.ToWhom', 'Do kogo')}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedGuests.map((guest, index) => (
              <TableRow 
                key={guest.CardLog || index}
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
                <TableCell>{guest.CardLog}</TableCell>
                <TableCell>{translateGuestType(guest.CardType)}</TableCell>
                <TableCell>{guest.Name}</TableCell>
                <TableCell>{guest.Surname}</TableCell>
                <TableCell>{guest.Company || '-'}</TableCell>
                <TableCell>{translateDocument(guest.Document || '-')}</TableCell>
                <TableCell>{formatDate(guest.ReleaseDate) || formatDate(guest.Date) || formatDate(guest.DataWydania) || '-'}</TableCell>
                <TableCell>{formatDate(guest.ReturnDate) || '-'}</TableCell>
                <TableCell>{guest.ToWhom || '-'}</TableCell>
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
