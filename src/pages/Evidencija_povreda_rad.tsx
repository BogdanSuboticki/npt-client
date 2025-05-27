import React, { useState } from 'react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as NoviRedIcon } from '../icons/Novi_red.svg?react';

// Define TableRow type for injury records
type TableRow = {
  nazivRadnogMesta: string;
  imePrezime: string;
  vremeNastanka: string;
  vrstaPovrede: string;
  ocenaTezine: string;
};


// Initial rows with empty values
const initialRows: TableRow[] = [
  {
    nazivRadnogMesta: '',
    imePrezime: '',
    vremeNastanka: '',
    vrstaPovrede: '',
    ocenaTezine: '',
  },
  {
    nazivRadnogMesta: '',
    imePrezime: '',
    vremeNastanka: '',
    vrstaPovrede: '',
    ocenaTezine: '',
  },
];

const EvidencijaPovredaRad: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>(initialRows);

  const handleCellChange = (rowIdx: number, accessor: keyof TableRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [accessor]: value };
      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        nazivRadnogMesta: '',
        imePrezime: '',
        vremeNastanka: '',
        vrstaPovrede: '',
        ocenaTezine: '',
      },
    ]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Evidencija povreda na radu
        </h1>

      </div>
      <div className='rounded-xl bg-white dark:bg-white/[0.03] shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
        <div className="p-4 flex justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <PrintIcon className="w-5 h-5" />
            Štampaj
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-100 dark:border-white/[0.05]">
            <thead>
              <tr>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Redni broj</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Naziv radnog mesta na kom je zaposleni radio kada se dogodila povreda</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Ime i prezime povređenog</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Vreme nastanka povrede na radu (datum, dan u sedmici, čas)</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Vrsta povrede (pojedinačna ili kolektivna)</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400">Ocena težine povrede (laka, teška, smrtna povreda na radu)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1 text-center text-gray-800 dark:text-gray-400">{rowIdx + 1}.</td>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                      value={row.nazivRadnogMesta}
                      onChange={e => handleCellChange(rowIdx, 'nazivRadnogMesta', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                      value={row.imePrezime}
                      onChange={e => handleCellChange(rowIdx, 'imePrezime', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                      value={row.vremeNastanka}
                      onChange={e => handleCellChange(rowIdx, 'vremeNastanka', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                      value={row.vrstaPovrede}
                      onChange={e => handleCellChange(rowIdx, 'vrstaPovrede', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                      value={row.ocenaTezine}
                      onChange={e => handleCellChange(rowIdx, 'ocenaTezine', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-4 px-4 py-2 min-w-full bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          onClick={addRow}
        >
          <NoviRedIcon className="w-5 h-5" />
          Novi Red
        </button>
      </div>
    </div>
  );
};

export default EvidencijaPovredaRad; 