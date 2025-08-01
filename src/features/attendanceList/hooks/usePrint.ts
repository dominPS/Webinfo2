import { useCallback } from 'react';

export interface PrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  showDate?: boolean;
  showTime?: boolean;
}

export const usePrint = () => {
  const printTable = useCallback((
    tableId: string, 
    options: PrintOptions = {}
  ) => {
    const {
      title = 'Lista obecności',
      orientation = 'landscape',
      showDate = true,
      showTime = true
    } = options;

    const tableElement = document.getElementById(tableId);
    if (!tableElement) {
      console.error(`Element o ID "${tableId}" nie został znaleziony`);
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Nie można otworzyć okna drukowania');
      return;
    }

    // Extract clean table data - headers and body content only
    const extractTableData = (table: HTMLElement) => {
      const headers: string[] = [];
      const rows: string[][] = [];

      // Extract headers from thead
      const headerCells = table.querySelectorAll('thead th, thead td');
      headerCells.forEach(cell => {
        // Get only text content, ignore buttons and sort icons
        const textContent = cell.textContent?.trim() || '';
        headers.push(textContent);
      });

      // Extract data rows from tbody
      const bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach(row => {
        const rowData: string[] = [];
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
          // Get only text content, ignore any UI elements
          const textContent = cell.textContent?.trim() || '';
          rowData.push(textContent);
        });
        if (rowData.length > 0) {
          rows.push(rowData);
        }
      });

      return { headers, rows };
    };

    const { headers, rows } = extractTableData(tableElement);

    // Create clean HTML table
    const createCleanTable = (headers: string[], rows: string[][]) => {
      let tableHtml = '<table>';
      
      // Add headers
      if (headers.length > 0) {
        tableHtml += '<thead><tr>';
        headers.forEach(header => {
          tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead>';
      }
      
      // Add data rows
      if (rows.length > 0) {
        tableHtml += '<tbody>';
        rows.forEach(row => {
          tableHtml += '<tr>';
          row.forEach(cell => {
            tableHtml += `<td>${cell}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody>';
      }
      
      tableHtml += '</table>';
      return tableHtml;
    };

    const cleanTableHtml = createCleanTable(headers, rows);

    // Current date and time
    const currentDate = new Date().toLocaleDateString('pl-PL');
    const currentTime = new Date().toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit'
    });

    // Create print HTML
    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page {
              size: ${orientation};
              margin: 20mm;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 0;
              padding: 0;
              color: #000;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #000;
            }
            
            .print-header h1 {
              margin: 0 0 10px 0;
              font-size: 18px;
              font-weight: bold;
            }
            
            .print-date {
              font-size: 12px;
              color: #666;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 11px;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-align: center;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .print-footer {
              margin-top: 30px;
              font-size: 10px;
              text-align: center;
              color: #666;
            }
            
            @media print {
              body { print-color-adjust: exact; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>${title}</h1>
            ${showDate ? `<div class="print-date">Data wydruku: ${currentDate}</div>` : ''}
            ${showTime ? `<div class="print-date">Godzina wydruku: ${currentTime}</div>` : ''}
          </div>
          
          ${cleanTableHtml}
          
          <div class="print-footer">
            Wygenerowano automatycznie przez system
          </div>
        </body>
      </html>
    `;

    // Write content and print
    printWindow.document.write(printHtml);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  }, []);

  const printCurrentView = useCallback((
    title: string = 'Lista obecności',
    orientation: 'portrait' | 'landscape' = 'landscape',
    showTime: boolean = true
  ) => {
    // Find the main table in the current view
    const tables = document.querySelectorAll('table');
    if (tables.length === 0) {
      console.error('Nie znaleziono tabeli do wydruku');
      return;
    }

    // Get the first visible table
    const visibleTable = Array.from(tables).find(table => {
      const style = window.getComputedStyle(table);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (!visibleTable) {
      console.error('Nie znaleziono widocznej tabeli do wydruku');
      return;
    }

    // Create temporary ID for printing
    const tempId = 'temp-print-table';
    visibleTable.id = tempId;
    
    printTable(tempId, { title, orientation, showTime });
    
    // Remove temporary ID
    visibleTable.removeAttribute('id');
  }, [printTable]);

  return {
    printTable,
    printCurrentView
  };
};
