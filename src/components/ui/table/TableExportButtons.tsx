import React, { useState } from 'react';
import Button from '../button/Button';

interface TableExportButtonsProps {
  data: any[];
  columns: Array<{ key: string; label: string }>;
  title: string;
  filename: string;
  className?: string;
}

const TableExportButtons: React.FC<TableExportButtonsProps> = ({
  data,
  columns,
  title,
  filename,
  className = ""
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [maxRows, setMaxRows] = useState<number | null>(null);

  const handlePrint = async () => {
    const { printTable } = await import('../../../utils/tableExport');
    printTable(data, columns, {
      title,
      filename,
      maxRows: maxRows || undefined
    });
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const { downloadTableAsPDF } = await import('../../../utils/tableExport');
      await downloadTableAsPDF(data, columns, {
        title,
        filename,
        maxRows: maxRows || undefined
      });
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleMaxRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxRows(value ? parseInt(value) : null);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Broj redova:
        </label>
        <input
          type="number"
          min="1"
          max={data.length}
          value={maxRows || ''}
          onChange={handleMaxRowsChange}
          placeholder="Svi"
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Štampaj
      </Button>
      
      <Button
        onClick={handleDownloadPDF}
        disabled={isExporting}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {isExporting ? 'Preuzimanje...' : 'Preuzmi PDF'}
      </Button>
    </div>
  );
};

export default TableExportButtons;
