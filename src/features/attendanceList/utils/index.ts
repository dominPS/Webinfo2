// Date formatting utility
export const formatDate = (dateString: any): string => {
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

// Print utility functions
export const generateTableHeader = (headers: string[]) => {
  return `<tr>${headers.map(header => 
    `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">${header}</th>`
  ).join('')}</tr>`;
};

export const generateTableRow = (cells: string[]) => {
  return `<tr>${cells.map(cell => 
    `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`
  ).join('')}</tr>`;
};

// Print styles
export const PRINT_STYLES = `
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
`;
