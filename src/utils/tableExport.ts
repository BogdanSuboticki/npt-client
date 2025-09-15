import html2pdf from 'html2pdf.js';

export interface TableExportOptions {
  title: string;
  filename: string;
  showRowCount?: boolean;
  maxRows?: number;
}

export const generateTableHTML = (
  data: any[],
  columns: Array<{ key: string; label: string }>,
  options: TableExportOptions
): string => {
  const { title = true, maxRows } = options;
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 12px;
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
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${displayData.map((row) => `
            <tr>
              ${columns.map(col => {
                let value = row[col.key];
                
                // Handle different data types
                if (Array.isArray(value)) {
                  value = value.join(', ');
                } else if (value instanceof Date) {
                  value = value.toLocaleDateString('sr-Latn-RS');
                } else if (typeof value === 'boolean') {
                  value = value ? 'Da' : 'Ne';
                } else if (value === null || value === undefined) {
                  value = '';
                }
                
                return `<td>${value}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  return html;
};

export const printTable = (
  data: any[],
  columns: Array<{ key: string; label: string }>,
  options: TableExportOptions
): void => {
  const { title, maxRows } = options;
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  // Create a simple table element
  const tableElement = document.createElement('div');
  tableElement.id = 'print-table';
  tableElement.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    visibility: hidden;
  `;

  // Create the table HTML
  tableElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif;">
      <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0; color: #000000;">${title}</h1>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          ${columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; background-color: #f5f5f5; font-weight: bold;">${col.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${displayData.map((row, index) => `
          <tr style="${index % 2 === 0 ? 'background-color: #f9f9f9;' : 'background-color: white;'}">
            ${columns.map(col => {
              let value = row[col.key];
              
              // Handle different data types
              if (Array.isArray(value)) {
                value = value.join(', ');
              } else if (value instanceof Date) {
                value = value.toLocaleDateString('sr-Latn-RS');
              } else if (typeof value === 'boolean') {
                value = value ? 'Da' : 'Ne';
              } else if (value === null || value === undefined) {
                value = '';
              }
              
              return `<td style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; color: #000000;">${value}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Add print styles
  const printStyle = document.createElement('style');
  printStyle.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      #print-table, #print-table * {
        visibility: visible !important;
      }
      #print-table {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: white !important;
        z-index: 9999 !important;
      }
    }
  `;
  tableElement.appendChild(printStyle);

  // Add to document
  document.body.appendChild(tableElement);

  // Print
  window.print();

  // Clean up
  setTimeout(() => {
    if (tableElement.parentNode) {
      tableElement.parentNode.removeChild(tableElement);
    }
  }, 1000);
};

export const downloadTableAsPDF = async (
  data: any[],
  columns: Array<{ key: string; label: string }>,
  options: TableExportOptions
): Promise<void> => {
  const html = generateTableHTML(data, columns, options);
  
  // Create a temporary element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv);
  
  const opt = {
    margin: 1,
    filename: `${options.filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
  };
  
  try {
    await html2pdf().set(opt).from(tempDiv).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Greška pri generisanju PDF-a. Molimo pokušajte ponovo.');
  } finally {
    // Clean up
    if (tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
  }
};
