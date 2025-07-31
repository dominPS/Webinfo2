import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel } from '@mui/material';

interface AttendanceListPageProps {
  translationKey?: string;
}

type SortOrder = 'asc' | 'desc';

const AttendanceListPage: React.FC<AttendanceListPageProps> = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('employees');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [guestPage, setGuestPage] = useState(0);
  const [guestRowsPerPage, setGuestRowsPerPage] = useState(10);
  const [presentGuestPage, setPresentGuestPage] = useState(0);
  const [presentGuestRowsPerPage, setPresentGuestRowsPerPage] = useState(10);
  const [vehiclePage, setVehiclePage] = useState(0);
  const [vehicleRowsPerPage, setVehicleRowsPerPage] = useState(10);

  // Sorting states
  const [employeeSort, setEmployeeSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [guestSort, setGuestSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [presentGuestSort, setPresentGuestSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [vehicleSort, setVehicleSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });

  // Mock data - będzie zastąpione danymi z backendu
  const mockEmployees = Array.from({ length: 50 }, (_, index) => ({
    id: `EMP${index + 1}`,
    lastName: `Nazwisko${index + 1}`,
    firstName: `Imię${index + 1}`,
    attendance: index % 2 === 0 ? 'Obecny' : 'Nieobecny',
    date: '2025-07-31',
    cardNumber: `CARD${1000 + index}`,
    cardType: 'Standard',
    cardStatus: 'Aktywna',
    cardState: 'Dobry',
    device: `Urządzenie${(index % 3) + 1}`
  }));

  const mockGuests = Array.from({ length: 30 }, (_, index) => ({
    logicalNumber: `LOG${index + 1}`,
    physicalNumber: `PHY${1000 + index}`,
    type: index % 3 === 0 ? 'Goś stały' : index % 3 === 1 ? 'Goś tymczasowy' : 'Dostawca',
    firstName: `Imię${index + 1}`,
    lastName: `Nazwisko${index + 1}`,
    company: `Firma${(index % 5) + 1}`,
    document: `DOC${2000 + index}`,
    purpose: index % 4 === 0 ? 'Spotkanie' : index % 4 === 1 ? 'Dostawa' : index % 4 === 2 ? 'Serwis' : 'Wizyta',
    issueDate: '2025-07-31',
    returnDate: '2025-07-31',
    toWhom: `Pracownik${(index % 10) + 1}`
  }));

  const mockPresentGuests = Array.from({ length: 20 }, (_, index) => ({
    firstName: `Imię${index + 1}`,
    lastName: `Nazwisko${index + 1}`,
    company: `Firma${(index % 5) + 1}`,
    logicalNumber: `LOG${index + 1}`,
    physicalNumber: `PHY${1000 + index}`,
    type: index % 3 === 0 ? 'Goś stały' : index % 3 === 1 ? 'Goś tymczasowy' : 'Dostawca',
    attendance: index % 4 === 0 ? 'Obecny' : 'Na terenie',
    entrance: `${8 + (index % 4)}:${String((index % 6) * 10).padStart(2, '0')}`,
    exit: index % 3 === 0 ? `${16 + (index % 3)}:${String((index % 6) * 10).padStart(2, '0')}` : '-',
    stay: `${index + 1}h ${(index % 6) * 10}min`,
    toWhom: `Pracownik${(index % 10) + 1}`
  }));

  const mockVehicles = Array.from({ length: 15 }, (_, index) => ({
    number: `${['WA', 'KR', 'WB', 'PO'][index % 4]} ${String(1000 + index).slice(-3)}${String.fromCharCode(65 + (index % 26))}${String.fromCharCode(65 + ((index + 1) % 26))}`,
    type: index % 4 === 0 ? 'Osobowy' : index % 4 === 1 ? 'Dostawczy' : index % 4 === 2 ? 'Ciężarowy' : 'Motocykl',
    note: index % 3 === 0 ? 'Wizyta służbowa' : index % 3 === 1 ? 'Dostawa materiałów' : 'Spotkanie z klientem',
    entryDate: '2025-07-31',
    driver: `${['Jan', 'Anna', 'Piotr', 'Maria', 'Tomasz'][index % 5]} ${['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk'][index % 5]}`
  }));

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeGuestPage = (event: unknown, newPage: number) => {
    setGuestPage(newPage);
  };

  const handleChangeGuestRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestRowsPerPage(parseInt(event.target.value, 10));
    setGuestPage(0);
  };

  const handleChangePresentGuestPage = (event: unknown, newPage: number) => {
    setPresentGuestPage(newPage);
  };

  const handleChangePresentGuestRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresentGuestRowsPerPage(parseInt(event.target.value, 10));
    setPresentGuestPage(0);
  };

  const handleChangeVehiclePage = (event: unknown, newPage: number) => {
    setVehiclePage(newPage);
  };

  const handleChangeVehicleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleRowsPerPage(parseInt(event.target.value, 10));
    setVehiclePage(0);
  };

  // Sorting functions
  const handleEmployeeSort = (key: string) => {
    const isAsc = employeeSort.key === key && employeeSort.order === 'asc';
    setEmployeeSort({ key, order: isAsc ? 'desc' : 'asc' });
    setPage(0);
  };

  const handleGuestSort = (key: string) => {
    const isAsc = guestSort.key === key && guestSort.order === 'asc';
    setGuestSort({ key, order: isAsc ? 'desc' : 'asc' });
    setGuestPage(0);
  };

  const handlePresentGuestSort = (key: string) => {
    const isAsc = presentGuestSort.key === key && presentGuestSort.order === 'asc';
    setPresentGuestSort({ key, order: isAsc ? 'desc' : 'asc' });
    setPresentGuestPage(0);
  };

  const handleVehicleSort = (key: string) => {
    const isAsc = vehicleSort.key === key && vehicleSort.order === 'asc';
    setVehicleSort({ key, order: isAsc ? 'desc' : 'asc' });
    setVehiclePage(0);
  };

  // Helper function for smart sorting
  const smartSort = (a: any, b: any, key: string, order: SortOrder) => {
    const aVal = a[key];
    const bVal = b[key];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? -1 : 1;
    if (bVal == null) return order === 'asc' ? 1 : -1;

    // Handle different data types
    // Time format (HH:MM)
    if (typeof aVal === 'string' && /^\d{1,2}:\d{2}$/.test(aVal) && typeof bVal === 'string' && /^\d{1,2}:\d{2}$/.test(bVal)) {
      const [aHours, aMinutes] = aVal.split(':').map(Number);
      const [bHours, bMinutes] = bVal.split(':').map(Number);
      const aTime = aHours * 60 + aMinutes;
      const bTime = bHours * 60 + bMinutes;
      return order === 'asc' ? aTime - bTime : bTime - aTime;
    }

    // Duration format (Xh Ymin)
    if (typeof aVal === 'string' && /^\d+h \d+min$/.test(aVal) && typeof bVal === 'string' && /^\d+h \d+min$/.test(bVal)) {
      const aMatch = aVal.match(/(\d+)h (\d+)min/);
      const bMatch = bVal.match(/(\d+)h (\d+)min/);
      if (aMatch && bMatch) {
        const aDuration = parseInt(aMatch[1]) * 60 + parseInt(aMatch[2]);
        const bDuration = parseInt(bMatch[1]) * 60 + parseInt(bMatch[2]);
        return order === 'asc' ? aDuration - bDuration : bDuration - aDuration;
      }
    }

    // Numeric strings (like IDs, card numbers)
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
      const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return order === 'asc' ? aNum - bNum : bNum - aNum;
      }
    }

    // Numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // Default string comparison
    const aStr = aVal.toString().toLowerCase();
    const bStr = bVal.toString().toLowerCase();
    if (order === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  };

  // Sorting data
  const sortedEmployees = [...mockEmployees].sort((a: any, b: any) => {
    if (!employeeSort.key) return 0;
    return smartSort(a, b, employeeSort.key, employeeSort.order);
  });

  const sortedGuests = [...mockGuests].sort((a: any, b: any) => {
    if (!guestSort.key) return 0;
    return smartSort(a, b, guestSort.key, guestSort.order);
  });

  const sortedPresentGuests = [...mockPresentGuests].sort((a: any, b: any) => {
    if (!presentGuestSort.key) return 0;
    return smartSort(a, b, presentGuestSort.key, presentGuestSort.order);
  });

  const sortedVehicles = [...mockVehicles].sort((a: any, b: any) => {
    if (!vehicleSort.key) return 0;
    return smartSort(a, b, vehicleSort.key, vehicleSort.order);
  });

  const displayedEmployees = sortedEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const displayedGuests = sortedGuests.slice(guestPage * guestRowsPerPage, guestPage * guestRowsPerPage + guestRowsPerPage);
  const displayedPresentGuests = sortedPresentGuests.slice(presentGuestPage * presentGuestRowsPerPage, presentGuestPage * presentGuestRowsPerPage + presentGuestRowsPerPage);
  const displayedVehicles = sortedVehicles.slice(vehiclePage * vehicleRowsPerPage, vehiclePage * vehicleRowsPerPage + vehicleRowsPerPage);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'id'}
                        direction={employeeSort.key === 'id' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('id')}
                      >
                        {t('AttendanceList.Table.Headers.Id', 'Nr ewid.')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'lastName'}
                        direction={employeeSort.key === 'lastName' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('lastName')}
                      >
                        {t('AttendanceList.Table.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'firstName'}
                        direction={employeeSort.key === 'firstName' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('firstName')}
                      >
                        {t('AttendanceList.Table.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'attendance'}
                        direction={employeeSort.key === 'attendance' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('attendance')}
                      >
                        {t('AttendanceList.Table.Headers.Attendance', 'Obecność')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'date'}
                        direction={employeeSort.key === 'date' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('date')}
                      >
                        {t('AttendanceList.Table.Headers.Date', 'Data')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'cardNumber'}
                        direction={employeeSort.key === 'cardNumber' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('cardNumber')}
                      >
                        {t('AttendanceList.Table.Headers.CardNumber', 'Nr karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'cardType'}
                        direction={employeeSort.key === 'cardType' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('cardType')}
                      >
                        {t('AttendanceList.Table.Headers.CardType', 'Typ karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'cardStatus'}
                        direction={employeeSort.key === 'cardStatus' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('cardStatus')}
                      >
                        {t('AttendanceList.Table.Headers.CardStatus', 'Status karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'cardState'}
                        direction={employeeSort.key === 'cardState' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('cardState')}
                      >
                        {t('AttendanceList.Table.Headers.CardState', 'Stan karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'device'}
                        direction={employeeSort.key === 'device' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('device')}
                      >
                        {t('AttendanceList.Table.Headers.Device', 'Urządzenie')}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedEmployees.map((employee) => (
                    <TableRow 
                      key={employee.id}
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
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.lastName}</TableCell>
                      <TableCell>{employee.firstName}</TableCell>
                      <TableCell>{employee.attendance}</TableCell>
                      <TableCell>{employee.date}</TableCell>
                      <TableCell>{employee.cardNumber}</TableCell>
                      <TableCell>{employee.cardType}</TableCell>
                      <TableCell>{employee.cardStatus}</TableCell>
                      <TableCell>{employee.cardState}</TableCell>
                      <TableCell>{employee.device}</TableCell>
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
          </Box>
        );
      case 'guests':
        return (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'logicalNumber'}
                        direction={guestSort.key === 'logicalNumber' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('logicalNumber')}
                      >
                        {t('AttendanceList.GuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'physicalNumber'}
                        direction={guestSort.key === 'physicalNumber' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('physicalNumber')}
                      >
                        {t('AttendanceList.GuestTable.Headers.PhysicalNumber', 'Nr fizyczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'type'}
                        direction={guestSort.key === 'type' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('type')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'firstName'}
                        direction={guestSort.key === 'firstName' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('firstName')}
                      >
                        {t('AttendanceList.GuestTable.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'lastName'}
                        direction={guestSort.key === 'lastName' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('lastName')}
                      >
                        {t('AttendanceList.GuestTable.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'company'}
                        direction={guestSort.key === 'company' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('company')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Company', 'Firma')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'document'}
                        direction={guestSort.key === 'document' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('document')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Document', 'Dokument')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'purpose'}
                        direction={guestSort.key === 'purpose' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('purpose')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Purpose', 'Cel')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'issueDate'}
                        direction={guestSort.key === 'issueDate' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('issueDate')}
                      >
                        {t('AttendanceList.GuestTable.Headers.IssueDate', 'Data wydania')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'returnDate'}
                        direction={guestSort.key === 'returnDate' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('returnDate')}
                      >
                        {t('AttendanceList.GuestTable.Headers.ReturnDate', 'Data zwrotu')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'toWhom'}
                        direction={guestSort.key === 'toWhom' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('toWhom')}
                      >
                        {t('AttendanceList.GuestTable.Headers.ToWhom', 'Do kogo')}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedGuests.map((guest, index) => (
                    <TableRow 
                      key={guest.logicalNumber}
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
                      <TableCell>{guest.logicalNumber}</TableCell>
                      <TableCell>{guest.physicalNumber}</TableCell>
                      <TableCell>{guest.type}</TableCell>
                      <TableCell>{guest.firstName}</TableCell>
                      <TableCell>{guest.lastName}</TableCell>
                      <TableCell>{guest.company}</TableCell>
                      <TableCell>{guest.document}</TableCell>
                      <TableCell>{guest.purpose}</TableCell>
                      <TableCell>{guest.issueDate}</TableCell>
                      <TableCell>{guest.returnDate}</TableCell>
                      <TableCell>{guest.toWhom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedGuests.length}
              rowsPerPage={guestRowsPerPage}
              page={guestPage}
              onPageChange={handleChangeGuestPage}
              onRowsPerPageChange={handleChangeGuestRowsPerPage}
              labelRowsPerPage={t('AttendanceList.Pagination.RowsPerPage', 'Wierszy na stronie:')}
              labelDisplayedRows={({ from, to, count }) => 
                t('AttendanceList.Pagination.DisplayedRows', `${from}-${to} z ${count}`, { from, to, count })
              }
            />
          </Box>
        );
      case 'presentGuests':
        return (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'firstName'}
                        direction={presentGuestSort.key === 'firstName' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('firstName')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'lastName'}
                        direction={presentGuestSort.key === 'lastName' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('lastName')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'company'}
                        direction={presentGuestSort.key === 'company' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('company')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Company', 'Firma')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'logicalNumber'}
                        direction={presentGuestSort.key === 'logicalNumber' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('logicalNumber')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'physicalNumber'}
                        direction={presentGuestSort.key === 'physicalNumber' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('physicalNumber')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.PhysicalNumber', 'Nr fizyczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'type'}
                        direction={presentGuestSort.key === 'type' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('type')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'attendance'}
                        direction={presentGuestSort.key === 'attendance' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('attendance')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Attendance', 'Obecność')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'entrance'}
                        direction={presentGuestSort.key === 'entrance' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('entrance')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Entrance', 'Wejście')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'exit'}
                        direction={presentGuestSort.key === 'exit' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('exit')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Exit', 'Wyjście')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'stay'}
                        direction={presentGuestSort.key === 'stay' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('stay')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Stay', 'Pobyt')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'toWhom'}
                        direction={presentGuestSort.key === 'toWhom' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('toWhom')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.ToWhom', 'Do kogo')}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPresentGuests.map((guest, index) => (
                    <TableRow 
                      key={`${guest.logicalNumber}-${index}`}
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
                      <TableCell>{guest.firstName}</TableCell>
                      <TableCell>{guest.lastName}</TableCell>
                      <TableCell>{guest.company}</TableCell>
                      <TableCell>{guest.logicalNumber}</TableCell>
                      <TableCell>{guest.physicalNumber}</TableCell>
                      <TableCell>{guest.type}</TableCell>
                      <TableCell>{guest.attendance}</TableCell>
                      <TableCell>{guest.entrance}</TableCell>
                      <TableCell>{guest.exit}</TableCell>
                      <TableCell>{guest.stay}</TableCell>
                      <TableCell>{guest.toWhom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedPresentGuests.length}
              rowsPerPage={presentGuestRowsPerPage}
              page={presentGuestPage}
              onPageChange={handleChangePresentGuestPage}
              onRowsPerPageChange={handleChangePresentGuestRowsPerPage}
              labelRowsPerPage={t('AttendanceList.Pagination.RowsPerPage', 'Wierszy na stronie:')}
              labelDisplayedRows={({ from, to, count }) => 
                t('AttendanceList.Pagination.DisplayedRows', `${from}-${to} z ${count}`, { from, to, count })
              }
            />
          </Box>
        );
      case 'vehicles':
        return (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'number'}
                        direction={vehicleSort.key === 'number' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('number')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Number', 'Numer')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'type'}
                        direction={vehicleSort.key === 'type' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('type')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'note'}
                        direction={vehicleSort.key === 'note' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('note')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Note', 'Notatka')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'entryDate'}
                        direction={vehicleSort.key === 'entryDate' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('entryDate')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.EntryDate', 'Data wjazdu')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'driver'}
                        direction={vehicleSort.key === 'driver' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('driver')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Driver', 'Kierowca')}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedVehicles.map((vehicle, index) => (
                    <TableRow 
                      key={`${vehicle.number}-${index}`}
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
                      <TableCell>{vehicle.number}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.note}</TableCell>
                      <TableCell>{vehicle.entryDate}</TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={sortedVehicles.length}
              rowsPerPage={vehicleRowsPerPage}
              page={vehiclePage}
              onPageChange={handleChangeVehiclePage}
              onRowsPerPageChange={handleChangeVehicleRowsPerPage}
              labelRowsPerPage={t('AttendanceList.Pagination.RowsPerPage', 'Wierszy na stronie:')}
              labelDisplayedRows={({ from, to, count }) => 
                t('AttendanceList.Pagination.DisplayedRows', `${from}-${to} z ${count}`, { from, to, count })
              }
            />
          </Box>
        );
      default:
        return <Typography>{t('AttendanceList.Tabs.Employees.Content', 'Zawartość podstrony Pracownicy')}</Typography>;
    }
  };

  return (
    <div>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          textAlign: 'center', 
          fontFamily: 'Roboto, sans-serif',
          marginTop: '40px',
          marginBottom: '40px',
          fontWeight: 500
        }}
      >
        {t('AttendanceList.Title', 'Lista obecności')}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant={activeTab === 'employees' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('employees')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Employees.Label', 'Pracownicy')} ( )
        </Button>
        <Button 
          variant={activeTab === 'guests' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('guests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Guests.Label', 'Goście')} ( )
        </Button>
        <Button 
          variant={activeTab === 'presentGuests' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('presentGuests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.PresentGuests.Label', 'Obecni goście')} ( )
        </Button>
        <Button 
          variant={activeTab === 'vehicles' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('vehicles')}
        >
          {t('AttendanceList.Tabs.Vehicles.Label', 'Pojazdy')} ( )
        </Button>
        <Button 
          variant="outlined"
          sx={{ ml: 2 }}
        >
          {t('AttendanceList.Print', 'DRUKUJ')}
        </Button>
      </Box>

      <Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default AttendanceListPage;