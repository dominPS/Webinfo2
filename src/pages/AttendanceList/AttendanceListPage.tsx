import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, CircularProgress, Alert } from '@mui/material';
import { useAttendanceList } from '@/hooks/useAttendanceList';
import { useAttendanceGuests } from '@/hooks/useAttendanceGuests';
import { useAttendanceGuestsPresence } from '@/hooks/useAttendanceGuestsPresence';
import { useAttendanceVehicles } from '@/hooks/useAttendanceVehicles';

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

  // Format date function
  const formatDate = (dateString: any): string => {
    if (!dateString) return '';
    try {
      // Handle .NET Date format: /Date(1753953897640)/
      if (typeof dateString === 'string' && dateString.startsWith('/Date(') && dateString.endsWith(')/')) {
        const timestamp = parseInt(dateString.slice(6, -2));
        if (!isNaN(timestamp)) {
          const date = new Date(timestamp);
          return date.toLocaleString('sv-SE').replace('T', ' ');
        }
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString('sv-SE').replace('T', ' ');
    } catch {
      return dateString;
    }
  };

  // API hooks for real data - LAZY LOADING: tylko aktywna zakładka ładuje dane
  const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading, refetch: attendanceRefetch } = useAttendanceList(undefined, activeTab === 'employees');
  const { data: guestsData, error: guestsError, isLoading: guestsLoading, refetch: guestsRefetch } = useAttendanceGuests(activeTab === 'guests');
  const { data: guestsPresenceData, error: guestsPresenceError, isLoading: guestsPresenceLoading, refetch: guestsPresenceRefetch } = useAttendanceGuestsPresence(activeTab === 'presentGuests');
  const { data: vehiclesData, error: vehiclesError, isLoading: vehiclesLoading, refetch: vehiclesRefetch } = useAttendanceVehicles(activeTab === 'vehicles');

  // Refresh function for all data
  const handleRefreshAll = async () => {
    await Promise.all([
      attendanceRefetch(),
      guestsRefetch(),
      guestsPresenceRefetch(),
      vehiclesRefetch()
    ]);
  };

  // Print function for current tab
  const handlePrint = () => {
    let printContent = '';
    let title = '';
    
    const generateTableHeader = (headers: string[]) => {
      return `<tr>${headers.map(header => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">${header}</th>`).join('')}</tr>`;
    };

    const generateTableRow = (cells: string[]) => {
      return `<tr>${cells.map(cell => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join('')}</tr>`;
    };

    switch (activeTab) {
      case 'employees':
        title = t('AttendanceList.Tabs.Employees.Label', 'Pracownicy');
        const employeeHeaders = [
          t('AttendanceList.Table.Headers.Id', 'Nr ewid.'),
          t('AttendanceList.Table.Headers.LastName', 'Nazwisko'),
          t('AttendanceList.Table.Headers.FirstName', 'Imię'),
          t('AttendanceList.Table.Headers.Attendance', 'Obecność'),
          t('AttendanceList.Table.Headers.Date', 'Data'),
          t('AttendanceList.Table.Headers.Device', 'Urządzenie')
        ];
        const employeeRows = sortedEmployees.map(employee => [
          String(employee.Badge || ''),
          String(employee.Surname || ''),
          String(employee.Name || ''),
          String(employee.Presence || ''),
          formatDate(employee.Date) || '-',
          String(employee.DeviceName || '-')
        ]);
        printContent = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${generateTableHeader(employeeHeaders)}
            ${employeeRows.map(row => generateTableRow(row)).join('')}
          </table>
        `;
        break;

      case 'guests':
        title = t('AttendanceList.Tabs.Guests.Label', 'Goście');
        const guestHeaders = [
          t('AttendanceList.GuestTable.Headers.LogicalNumber', 'Nr logiczny'),
          t('AttendanceList.GuestTable.Headers.Type', 'Typ'),
          t('AttendanceList.GuestTable.Headers.FirstName', 'Imię'),
          t('AttendanceList.GuestTable.Headers.LastName', 'Nazwisko'),
          t('AttendanceList.GuestTable.Headers.Company', 'Firma'),
          t('AttendanceList.GuestTable.Headers.Document', 'Dokument'),
          t('AttendanceList.GuestTable.Headers.IssueDate', 'Data wydania'),
          t('AttendanceList.GuestTable.Headers.ReturnDate', 'Data zwrotu'),
          t('AttendanceList.GuestTable.Headers.ToWhom', 'Do kogo')
        ];
        const guestRows = sortedGuests.map(guest => [
          String(guest.CardLog || ''),
          String(guest.CardType || ''),
          String(guest.Name || ''),
          String(guest.Surname || ''),
          String(guest.Company || '-'),
          String(guest.Document || '-'),
          formatDate(guest.ReleaseDate) || formatDate(guest.Date) || formatDate(guest.DataWydania) || '-',
          formatDate(guest.ReturnDate) || '-',
          String(guest.ToWhom || '-')
        ]);
        printContent = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${generateTableHeader(guestHeaders)}
            ${guestRows.map(row => generateTableRow(row)).join('')}
          </table>
        `;
        break;

      case 'presentGuests':
        title = t('AttendanceList.Tabs.PresentGuests.Label', 'Obecni goście');
        const presentGuestHeaders = [
          t('AttendanceList.PresentGuestTable.Headers.FirstName', 'Imię'),
          t('AttendanceList.PresentGuestTable.Headers.LastName', 'Nazwisko'),
          t('AttendanceList.PresentGuestTable.Headers.Company', 'Firma'),
          t('AttendanceList.PresentGuestTable.Headers.LogicalNumber', 'Nr logiczny'),
          t('AttendanceList.PresentGuestTable.Headers.PhysicalNumber', 'Nr fizyczny'),
          t('AttendanceList.PresentGuestTable.Headers.Type', 'Typ'),
          t('AttendanceList.PresentGuestTable.Headers.Attendance', 'Obecność'),
          t('AttendanceList.PresentGuestTable.Headers.Entrance', 'Wejście'),
          t('AttendanceList.PresentGuestTable.Headers.Exit', 'Wyjście'),
          t('AttendanceList.PresentGuestTable.Headers.Stay', 'Pobyt'),
          t('AttendanceList.PresentGuestTable.Headers.ToWhom', 'Do kogo')
        ];
        const presentGuestRows = sortedPresentGuests.map(guest => [
          String(guest.FirstName || ''),
          String(guest.LastName || ''),
          String(guest.Company || '-'),
          String(guest.NumerLogiczny || '-'),
          String(guest.NumerFizyczny || '-'),
          String(guest.TypKarty || '-'),
          String(guest.Obecnosc || ''),
          formatDate(guest.EntryDate) || '-',
          formatDate(guest.ExitDate) || '-',
          String(guest.Duration || '-'),
          String(guest.DoKogo || guest.ContactPerson || '-')
        ]);
        printContent = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${generateTableHeader(presentGuestHeaders)}
            ${presentGuestRows.map(row => generateTableRow(row)).join('')}
          </table>
        `;
        break;

      case 'vehicles':
        title = t('AttendanceList.Tabs.Vehicles.Label', 'Pojazdy');
        const vehicleHeaders = [
          t('AttendanceList.VehicleTable.Headers.Number', 'Numer'),
          t('AttendanceList.VehicleTable.Headers.Type', 'Typ'),
          t('AttendanceList.VehicleTable.Headers.Note', 'Notatka'),
          t('AttendanceList.VehicleTable.Headers.EntryDate', 'Data wjazdu'),
          t('AttendanceList.VehicleTable.Headers.Driver', 'Kierowca')
        ];
        const vehicleRows = sortedVehicles.map(vehicle => [
          String(vehicle.VehicleNumber || ''),
          String(vehicle.VehicleType || '-'),
          String(vehicle.VehicleNote || '-'),
          formatDate(vehicle.LastDate) || '-',
          String(vehicle.Driver || '-')
        ]);
        printContent = `
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${generateTableHeader(vehicleHeaders)}
            ${vehicleRows.map(row => generateTableRow(row)).join('')}
          </table>
        `;
        break;

      default:
        return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const currentDate = new Date().toLocaleString('pl-PL');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${t('AttendanceList.Title', 'Lista obecności')} - ${title}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            h1 {
              text-align: center;
              margin-bottom: 10px;
              font-size: 18px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
              font-size: 14px;
              color: #666;
            }
            .print-info {
              text-align: right;
              margin-bottom: 20px;
              font-size: 10px;
              color: #888;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 6px;
              text-align: left;
              font-size: 10px;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              body { margin: 0; }
              .print-info { font-size: 8px; }
              table { font-size: 8px; }
              th, td { padding: 4px; }
            }
          </style>
        </head>
        <body>
          <h1>${t('AttendanceList.Title', 'Lista obecności')}</h1>
          <h2>${title}</h2>
          <div class="print-info">
            ${t('AttendanceList.Print.GeneratedOn', 'Wygenerowano:')} ${currentDate}
          </div>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  // Sorting states
  const [employeeSort, setEmployeeSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [guestSort, setGuestSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [presentGuestSort, setPresentGuestSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });
  const [vehicleSort, setVehicleSort] = useState<{ key: string; order: SortOrder }>({ key: '', order: 'asc' });

  // Extract real data from API responses
  const employees = attendanceData?.Elements || [];
  const guests = guestsData?.Elements || [];
  const presentGuests = guestsPresenceData?.Elements || [];
  const vehicles = vehiclesData?.Elements || [];

  // Loading and error states for all tabs
  const isAnyLoading = attendanceLoading || guestsLoading || guestsPresenceLoading || vehiclesLoading;
  const hasAnyError = attendanceError || guestsError || guestsPresenceError || vehiclesError;

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
  const sortedEmployees = [...employees].sort((a: any, b: any) => {
    if (!employeeSort.key) return 0;
    return smartSort(a, b, employeeSort.key, employeeSort.order);
  });

  const sortedGuests = [...guests].sort((a: any, b: any) => {
    if (!guestSort.key) return 0;
    return smartSort(a, b, guestSort.key, guestSort.order);
  });

  const sortedPresentGuests = [...presentGuests].sort((a: any, b: any) => {
    if (!presentGuestSort.key) return 0;
    return smartSort(a, b, presentGuestSort.key, presentGuestSort.order);
  });

  const sortedVehicles = [...vehicles].sort((a: any, b: any) => {
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
                        active={employeeSort.key === 'Badge'}
                        direction={employeeSort.key === 'Badge' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Badge')}
                      >
                        {t('AttendanceList.Table.Headers.Id', 'Nr ewid.')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Surname'}
                        direction={employeeSort.key === 'Surname' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Surname')}
                      >
                        {t('AttendanceList.Table.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Name'}
                        direction={employeeSort.key === 'Name' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Name')}
                      >
                        {t('AttendanceList.Table.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Presence'}
                        direction={employeeSort.key === 'Presence' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Presence')}
                      >
                        {t('AttendanceList.Table.Headers.Attendance', 'Obecność')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Date'}
                        direction={employeeSort.key === 'Date' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Date')}
                      >
                        {t('AttendanceList.Table.Headers.Date', 'Data')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'CardNumber'}
                        direction={employeeSort.key === 'CardNumber' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('CardNumber')}
                      >
                        {t('AttendanceList.Table.Headers.CardNumber', 'Nr karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Status'}
                        direction={employeeSort.key === 'Status' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Status')}
                      >
                        {t('AttendanceList.Table.Headers.CardType', 'Typ karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Status'}
                        direction={employeeSort.key === 'Status' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Status')}
                      >
                        {t('AttendanceList.Table.Headers.CardStatus', 'Status karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'Status'}
                        direction={employeeSort.key === 'Status' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('Status')}
                      >
                        {t('AttendanceList.Table.Headers.CardState', 'Stan karty')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={employeeSort.key === 'DeviceName'}
                        direction={employeeSort.key === 'DeviceName' ? employeeSort.order : 'asc'}
                        onClick={() => handleEmployeeSort('DeviceName')}
                      >
                        {t('AttendanceList.Table.Headers.Device', 'Urządzenie')}
                      </TableSortLabel>
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
                      <TableCell>{employee.Presence}</TableCell>
                      <TableCell>{formatDate(employee.Date) || '-'}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{employee.Status || '-'}</TableCell>
                      <TableCell>{employee.Status || '-'}</TableCell>
                      <TableCell>{employee.Status || '-'}</TableCell>
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
                        active={guestSort.key === 'CardLog'}
                        direction={guestSort.key === 'CardLog' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('CardLog')}
                      >
                        {t('AttendanceList.GuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'CardType'}
                        direction={guestSort.key === 'CardType' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('CardType')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'Name'}
                        direction={guestSort.key === 'Name' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('Name')}
                      >
                        {t('AttendanceList.GuestTable.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'Surname'}
                        direction={guestSort.key === 'Surname' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('Surname')}
                      >
                        {t('AttendanceList.GuestTable.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'Company'}
                        direction={guestSort.key === 'Company' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('Company')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Company', 'Firma')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'Document'}
                        direction={guestSort.key === 'Document' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('Document')}
                      >
                        {t('AttendanceList.GuestTable.Headers.Document', 'Dokument')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'Date'}
                        direction={guestSort.key === 'Date' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('Date')}
                      >
                        {t('AttendanceList.GuestTable.Headers.IssueDate', 'Data wydania')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'ReturnDate'}
                        direction={guestSort.key === 'ReturnDate' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('ReturnDate')}
                      >
                        {t('AttendanceList.GuestTable.Headers.ReturnDate', 'Data zwrotu')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={guestSort.key === 'ToWhom'}
                        direction={guestSort.key === 'ToWhom' ? guestSort.order : 'asc'}
                        onClick={() => handleGuestSort('ToWhom')}
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
                      <TableCell>{guest.CardType}</TableCell>
                      <TableCell>{guest.Name}</TableCell>
                      <TableCell>{guest.Surname}</TableCell>
                      <TableCell>{guest.Company || '-'}</TableCell>
                      <TableCell>{guest.Document || '-'}</TableCell>
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
                        active={presentGuestSort.key === 'FirstName'}
                        direction={presentGuestSort.key === 'FirstName' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('FirstName')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.FirstName', 'Imię')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'LastName'}
                        direction={presentGuestSort.key === 'LastName' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('LastName')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.LastName', 'Nazwisko')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'Company'}
                        direction={presentGuestSort.key === 'Company' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('Company')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Company', 'Firma')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'NumerLogiczny'}
                        direction={presentGuestSort.key === 'NumerLogiczny' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('NumerLogiczny')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.LogicalNumber', 'Nr logiczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'NumerFizyczny'}
                        direction={presentGuestSort.key === 'NumerFizyczny' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('NumerFizyczny')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.PhysicalNumber', 'Nr fizyczny')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'TypKarty'}
                        direction={presentGuestSort.key === 'TypKarty' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('TypKarty')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'Obecnosc'}
                        direction={presentGuestSort.key === 'Obecnosc' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('Obecnosc')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Attendance', 'Obecność')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'EntryDate'}
                        direction={presentGuestSort.key === 'EntryDate' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('EntryDate')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Entrance', 'Wejście')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'ExitDate'}
                        direction={presentGuestSort.key === 'ExitDate' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('ExitDate')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Exit', 'Wyjście')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'Duration'}
                        direction={presentGuestSort.key === 'Duration' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('Duration')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.Stay', 'Pobyt')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={presentGuestSort.key === 'DoKogo'}
                        direction={presentGuestSort.key === 'DoKogo' ? presentGuestSort.order : 'asc'}
                        onClick={() => handlePresentGuestSort('DoKogo')}
                      >
                        {t('AttendanceList.PresentGuestTable.Headers.ToWhom', 'Do kogo')}
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPresentGuests.map((guest, index) => (
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
                      <TableCell>{guest.TypKarty || '-'}</TableCell>
                      <TableCell>{guest.Obecnosc}</TableCell>
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
                        active={vehicleSort.key === 'VehicleNumber'}
                        direction={vehicleSort.key === 'VehicleNumber' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('VehicleNumber')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Number', 'Numer')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'VehicleType'}
                        direction={vehicleSort.key === 'VehicleType' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('VehicleType')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Type', 'Typ')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'VehicleNote'}
                        direction={vehicleSort.key === 'VehicleNote' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('VehicleNote')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.Note', 'Notatka')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'LastDate'}
                        direction={vehicleSort.key === 'LastDate' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('LastDate')}
                      >
                        {t('AttendanceList.VehicleTable.Headers.EntryDate', 'Data wjazdu')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={vehicleSort.key === 'Driver'}
                        direction={vehicleSort.key === 'Driver' ? vehicleSort.order : 'asc'}
                        onClick={() => handleVehicleSort('Driver')}
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
      
      {/* Loading state */}
      {isAnyLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            {t('AttendanceList.Loading', 'Ładowanie danych...')}
          </Typography>
        </Box>
      )}
      
      {/* Error state */}
      {hasAnyError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('AttendanceList.Error', 'Błąd podczas ładowania danych:')} 
          {attendanceError?.message || guestsError?.message || guestsPresenceError?.message || vehiclesError?.message}
        </Alert>
      )}
      
      {/* Tab navigation */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant={activeTab === 'employees' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('employees')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Employees.Label', 'Pracownicy')} ({employees.length})
        </Button>
        <Button 
          variant={activeTab === 'guests' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('guests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Guests.Label', 'Goście')} ({guests.length})
        </Button>
        <Button 
          variant={activeTab === 'presentGuests' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('presentGuests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.PresentGuests.Label', 'Obecni goście')} ({presentGuests.length})
        </Button>
        <Button 
          variant={activeTab === 'vehicles' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('vehicles')}
        >
          {t('AttendanceList.Tabs.Vehicles.Label', 'Pojazdy')} ({vehicles.length})
        </Button>
        <Button 
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={handleRefreshAll}
          disabled={isAnyLoading}
        >
          {t('AttendanceList.Refresh', 'ODŚWIEŻ')}
        </Button>
        <Button 
          variant="outlined"
          sx={{ ml: 1 }}
          onClick={handlePrint}
          disabled={isAnyLoading}
        >
          {t('AttendanceList.Print.Button', 'DRUKUJ')}
        </Button>
      </Box>

      <Box>
        {!isAnyLoading && !hasAnyError && renderTabContent()}
      </Box>
    </div>
  );
};

export default AttendanceListPage;