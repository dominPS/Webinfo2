import { useState } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface TableState {
  page: number;
  rowsPerPage: number;
  sortKey: string;
  sortOrder: SortOrder;
}

export const useTableState = (initialRowsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key: string) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortKey(key);
    setSortOrder(isAsc ? 'desc' : 'asc');
    setPage(0);
  };

  // Smart sorting function
  const smartSort = (a: any, b: any, key: string, order: SortOrder) => {
    const aVal = a[key];
    const bVal = b[key];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? -1 : 1;
    if (bVal == null) return order === 'asc' ? 1 : -1;

    // Time format (HH:MM)
    if (typeof aVal === 'string' && /^\d{1,2}:\d{2}$/.test(aVal) && 
        typeof bVal === 'string' && /^\d{1,2}:\d{2}$/.test(bVal)) {
      const [aHours, aMinutes] = aVal.split(':').map(Number);
      const [bHours, bMinutes] = bVal.split(':').map(Number);
      const aTime = aHours * 60 + aMinutes;
      const bTime = bHours * 60 + bMinutes;
      return order === 'asc' ? aTime - bTime : bTime - aTime;
    }

    // Duration format (Xh Ymin)
    if (typeof aVal === 'string' && /^\d+h \d+min$/.test(aVal) && 
        typeof bVal === 'string' && /^\d+h \d+min$/.test(bVal)) {
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
    return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  };

  const sortData = <T>(data: T[]) => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => smartSort(a, b, sortKey, sortOrder));
  };

  const paginateData = <T>(data: T[]) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return {
    // State
    page,
    rowsPerPage,
    sortKey,
    sortOrder,
    
    // Actions
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
    
    // Utilities
    sortData,
    paginateData
  };
};
