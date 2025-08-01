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

interface VehicleTableProps {
  vehicles: any[];
}

export const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  const { t } = useAttendanceTranslations();
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

  const sortedVehicles = sortData(vehicles);
  const displayedVehicles = paginateData(sortedVehicles);

  return (
    <>
      <TableContainer component={Paper}>
        <Table id="vehicles-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'VehicleNumber'}
                  direction={sortKey === 'VehicleNumber' ? sortOrder : 'asc'}
                  onClick={() => handleSort('VehicleNumber')}
                >
                  {t('AttendanceList.VehicleTable.Headers.Number', 'Numer')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'VehicleType'}
                  direction={sortKey === 'VehicleType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('VehicleType')}
                >
                  {t('AttendanceList.VehicleTable.Headers.Type', 'Typ')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'VehicleNote'}
                  direction={sortKey === 'VehicleNote' ? sortOrder : 'asc'}
                  onClick={() => handleSort('VehicleNote')}
                >
                  {t('AttendanceList.VehicleTable.Headers.Note', 'Notatka')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'LastDate'}
                  direction={sortKey === 'LastDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('LastDate')}
                >
                  {t('AttendanceList.VehicleTable.Headers.EntryDate', 'Data wjazdu')}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === 'Driver'}
                  direction={sortKey === 'Driver' ? sortOrder : 'asc'}
                  onClick={() => handleSort('Driver')}
                >
                  {t('AttendanceList.VehicleTable.Headers.Driver', 'Kierowca')}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedVehicles.map((vehicle, index) => (
              <TableRow 
                key={vehicle.VehicleNumber || index}
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
                <TableCell>{vehicle.VehicleNumber}</TableCell>
                <TableCell>{vehicle.VehicleType || '-'}</TableCell>
                <TableCell>{vehicle.VehicleNote || '-'}</TableCell>
                <TableCell>{formatDate(vehicle.LastDate) || '-'}</TableCell>
                <TableCell>{vehicle.Driver || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedVehicles.length}
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
