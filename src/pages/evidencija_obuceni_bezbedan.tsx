import React, { useState, useRef } from 'react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as DownloadIcon } from '../icons/download.svg?react';
import html2pdf from 'html2pdf.js';

// Table row type
interface TableRow {
  imePrezime: string;
  nazivRadnogMesta: string;
  opisPoslova: string;
  slucajRazlogObuke: string;
  datumObukeTeorijske: string;
  datumObukePrakticne: string;
  datumProvereTeorijske: string;
  datumProverePrakticne: string;
  nazivLZO: string;
  datumObukeLZO: string;
  opasnostiStetnosti: string;
  konkretneMere: string;
  naziviRadnihMesta: string;
  obavestenjaUputstva: string;
}

const EvidencijaObuceniBezbedan: React.FC = () => {
  const [row, setRow] = useState<TableRow>({
    imePrezime: '',
    nazivRadnogMesta: '',
    opisPoslova: '',
    slucajRazlogObuke: '',
    datumObukeTeorijske: '',
    datumObukePrakticne: '',
    datumProvereTeorijske: '',
    datumProverePrakticne: '',
    nazivLZO: '',
    datumObukeLZO: '',
    opasnostiStetnosti: '',
    konkretneMere: '',
    naziviRadnihMesta: '',
    obavestenjaUputstva: '',
  });
  const tableRef = useRef<HTMLDivElement>(null);

  const handleCellChange = (accessor: keyof TableRow, value: string) => {
    setRow(prev => ({ ...prev, [accessor]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = tableRef.current;
    if (!element) return;
    const opt = {
      margin: 1,
      filename: 'evidencija_obuceni_bezbedan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="py-8">
      <div className="flex-row md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
         Obrazac 6.
        </h1>
        <h2 className='text-lg text-gray-400 dark:text-white'>
        EVIDENCIJA O ZAPOSLENIMA OBUČENIM ZA BEZBEDAN I ZDRAV RAD I PRAVILNO KORIŠĆENJE LIČNE ZAŠTITNE OPREME
        </h2>
      </div>
      <div className='rounded-lg bg-white dark:bg-[#24303F] shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-white dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 border border-gray-200"
            >
              <DownloadIcon className="w-5 h-5" />
              Preuzmi
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 border border-gray-200"
            >
              <PrintIcon className="w-5 h-5" />
              Štampaj
            </button>
          </div>
        </div>
        <div ref={tableRef} className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-white/[0.1]">
            <tbody>
              {/* Part 1 */}
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Ime i prezime zaposlenog koji je obučen za bezbedan i zdrav rad i pravilno korišćenje lične zaštitne opreme</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.imePrezime} onChange={e => handleCellChange('imePrezime', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Naziv radnog mesta</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.nazivRadnogMesta} onChange={e => handleCellChange('nazivRadnogMesta', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Opis poslova na tom radnom mestu</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.opisPoslova} onChange={e => handleCellChange('opisPoslova', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Slučaj, odnosno razlog izvršene obuke zaposlenog za bezbedan i zdrav rad</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.slucajRazlogObuke} onChange={e => handleCellChange('slucajRazlogObuke', e.target.value)} /></td>
              </tr>
              {/* Part 2 */}
              <tr>
                <td className="text-[13px] font-medium text-center px-0 py-0" colSpan={2}>
                  <table className="w-full border-none">
                    <thead>
                      <tr>
                        <th className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] font-medium text-gray-700 dark:text-gray-400" colSpan={2}>Datum obuke za bezbedan i zdrav rad</th>
                        <th className="px-4 py-3 text-[13px] font-medium text-gray-700 dark:text-gray-400" colSpan={2}>Datum provere obučenosti za bezbedan i zdrav rad</th>
                      </tr>
                      <tr>
                        <th className="border border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] text-gray-700 dark:text-gray-400">teorijske</th>
                        <th className="border border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] text-gray-700 dark:text-gray-400">praktične</th>
                        <th className="border border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] text-gray-700 dark:text-gray-400">teorijske</th>
                        <th className="border border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] text-gray-700 dark:text-gray-400">praktične</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.datumObukeTeorijske} onChange={e => handleCellChange('datumObukeTeorijske', e.target.value)} /></td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.datumObukePrakticne} onChange={e => handleCellChange('datumObukePrakticne', e.target.value)} /></td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.datumProvereTeorijske} onChange={e => handleCellChange('datumProvereTeorijske', e.target.value)} /></td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.datumProverePrakticne} onChange={e => handleCellChange('datumProverePrakticne', e.target.value)} /></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Part 3 */}
              <tr>
                <td className="border-t text-[13px] font-medium text-center px-0 py-0" colSpan={2}>
                  <table className="w-full border-none">
                    <thead>
                      <tr>
                        <th className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] font-medium text-gray-700 dark:text-gray-400">Naziv lične zaštitne opreme (ako je korišćenje LZO utvrđeno aktom o proceni rizika)</th>
                        <th className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3 text-[13px] font-medium text-gray-700 dark:text-gray-400">Datum obuke za pravilno korišćenje lične zaštitne opreme</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.nazivLZO} onChange={e => handleCellChange('nazivLZO', e.target.value)} /></td>
                        <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.datumObukeLZO} onChange={e => handleCellChange('datumObukeLZO', e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" /></td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" /></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Part 4 */}
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Opasnosti, odnosno štetnosti sa kojima je zaposleni upoznat prilikom obuke za bezbedan i zdrav rad</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.opasnostiStetnosti} onChange={e => handleCellChange('opasnostiStetnosti', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Konkretne mere za bezbedan i zdrav rad na tom radnom mestu</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.konkretneMere} onChange={e => handleCellChange('konkretneMere', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Nazivi radnih mesta koja rukovodilac prati i kontroliše</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.naziviRadnihMesta} onChange={e => handleCellChange('naziviRadnihMesta', e.target.value)} /></td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Obaveštenja, uputstva ili instrukcije sa kojima je zaposleni upoznat radi obavljanja procesa rada na bezbedan način</td>
                <td className="border border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" value={row.obavestenjaUputstva} onChange={e => handleCellChange('obavestenjaUputstva', e.target.value)} /></td>
              </tr>

            </tbody>
          </table>
        </div>
        <div className='px-6 py-4'>

        </div>
      </div>
    </div>
  );
};

export default EvidencijaObuceniBezbedan; 