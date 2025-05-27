import React, { useState } from 'react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as NoviRedIcon } from '../icons/Novi_red.svg?react';

// Add TableRow type with index signature
type TableRow = {
  nazivRadnogMesta: string;
  imePrezime: string;
  intervalPregleda: string;
  datumPregledaPrethodni: string;
  datumPregledaPeriodični: string[]; // 4 cells
  datumSledeci: string;
  brojIzvestaja: string;
  ocenaZdravstveneSposobnosti: string;
  preduzeteMere: string;
};


// Use TableRow type for initialRows
const initialRows: TableRow[] = [
  {
    nazivRadnogMesta: '',
    imePrezime: '',
    intervalPregleda: '',
    datumPregledaPrethodni: '',
    datumPregledaPeriodični: ['', '', '', ''],
    datumSledeci: '',
    brojIzvestaja: '',
    ocenaZdravstveneSposobnosti: '',
    preduzeteMere: '',
  },
  {
    nazivRadnogMesta: '',
    imePrezime: '',
    intervalPregleda: '',
    datumPregledaPrethodni: '',
    datumPregledaPeriodični: ['', '', '', ''],
    datumSledeci: '',
    brojIzvestaja: '',
    ocenaZdravstveneSposobnosti: '',
    preduzeteMere: '',
  },
];

const EvidencijaRizicnaRadnaMesta: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>(initialRows);

  const handleCellChange = (rowIdx: number, accessor: keyof TableRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [accessor]: value };
      return updated;
    });
  };

  const handlePeriodicniChange = (rowIdx: number, idx: number, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      const periodicni = [...updated[rowIdx].datumPregledaPeriodični];
      periodicni[idx] = value;
      updated[rowIdx] = { ...updated[rowIdx], datumPregledaPeriodični: periodicni };
      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        nazivRadnogMesta: '',
        imePrezime: '',
        intervalPregleda: '',
        datumPregledaPrethodni: '',
        datumPregledaPeriodični: ['', '', '', ''],
        datumSledeci: '',
        brojIzvestaja: '',
        ocenaZdravstveneSposobnosti: '',
        preduzeteMere: '',
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
          Evidencija o radnim mestima sa povećanim rizikom, zaposlenima koji obavljaju poslove na radnim mestima sa povećanim rizikom i lekarskim pregledima zaposlenih koji obavljaju te poslove
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
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Redni broj</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Naziv radnog mesta sa povećanim rizikom koje je utvrđeno aktom o proceni rizika</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Ime i prezime zaposlenog koji radi na radnom mestu sa povećanim rizikom</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Interval vršenja periodičnih lekarskih pregleda izražen u mesecima</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" colSpan={2}>Datum izvršenog prethodnog i periodičnog lekarskog pregleda zaposlenog</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Datum kada treba da se izvrši sledeći lekarski pregled zaposlenog</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Broj lekarskog izveštaja</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Ocena zdravstvene sposobnosti</th>
                <th className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 font-medium text-gray-700 dark:text-gray-400" rowSpan={2}>Preduzete mere</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  <tr>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1 text-center text-gray-800 dark:text-gray-400" rowSpan={5}>{rowIdx + 1}.</td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400 font-medium" value={row.nazivRadnogMesta} onChange={e => handleCellChange(rowIdx, 'nazivRadnogMesta', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.imePrezime} onChange={e => handleCellChange(rowIdx, 'imePrezime', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.intervalPregleda} onChange={e => handleCellChange(rowIdx, 'intervalPregleda', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 text-gray-800 dark:text-gray-400">Prethodni</td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                      <input
                        type="text"
                        className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                        value={row.datumPregledaPrethodni}
                        onChange={e => handleCellChange(rowIdx, 'datumPregledaPrethodni', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.datumSledeci} onChange={e => handleCellChange(rowIdx, 'datumSledeci', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.brojIzvestaja} onChange={e => handleCellChange(rowIdx, 'brojIzvestaja', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.ocenaZdravstveneSposobnosti} onChange={e => handleCellChange(rowIdx, 'ocenaZdravstveneSposobnosti', e.target.value)} />
                    </td>
                    <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1" rowSpan={5}>
                      <input type="text" className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400" value={row.preduzeteMere} onChange={e => handleCellChange(rowIdx, 'preduzeteMere', e.target.value)} />
                    </td>
                  </tr>
                  {row.datumPregledaPeriodični.map((val, i) => (
                    <tr key={i}>
                      {i === 0 && (
                        <td className="border border-gray-100 dark:border-white/[0.05] text-[12px] px-2 py-1 text-gray-800 dark:text-gray-400" rowSpan={4} style={{verticalAlign: 'middle'}}>Periodični</td>
                      )}
                      <td className="border border-gray-100 dark:border-white/[0.05] px-2 py-1">
                        <input
                          type="text"
                          className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-400"
                          value={val}
                          onChange={e => handlePeriodicniChange(rowIdx, i, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
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

export default EvidencijaRizicnaRadnaMesta; 