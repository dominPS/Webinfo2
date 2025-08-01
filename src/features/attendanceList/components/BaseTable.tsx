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
  Typography,
  Box,
  TableSortLabel
} from '@mui/material';
import type { SortOrder } from '../hooks/useTableState';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  render?: (value: any, row: any) => React.ReactNode;
}

interface BaseTableProps {
  columns: Column[];
  data: any[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortKey: string;
  sortOrder: SortOrder;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (key: string) => void;
  emptyMessage?: string;
  rowKey?: string;
}

export const BaseTable: React.FC<BaseTableProps> = ({
  columns,
  data,
  totalCount,
  page,
  rowsPerPage,
  sortKey,
  sortOrder,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  emptyMessage = 'Brak danych do wyświetlenia',
  rowKey = 'id'
}) => {
  if (data.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography variant="body1" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                  sortDirection={sortKey === column.key ? sortOrder : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortKey === column.key}
                      direction={sortKey === column.key ? sortOrder : 'asc'}
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={row[rowKey] || index}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    align={column.align || 'left'}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || '-'
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Wierszy na stronie:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
        }
      />
    </Paper>
  );
};
