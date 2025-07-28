import React, { useState, useRef } from 'react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as DownloadIcon } from '../icons/download.svg?react';
import { ReactComponent as NoviRedIcon } from '../icons/Novi_red.svg?react';
import { ReactComponent as SaveIcon } from '../icons/Save-icon.svg?react';
import html2pdf from 'html2pdf.js';
import { Modal } from '../components/ui/modal';
import { useModal } from '../hooks/useModal';
import Label from '../components/form/Label';
import Input from '../components/form/input/InputField';
import Popover from '../components/ui/popover/Popover';
import ItemsPerPageDropdown from '../components/ui/dropdown/ItemsPerPageDropdown';
import { 
  prepareElementForExport, 
  restoreElementAfterExport, 
  createPrintStyles, 
  createPdfOptions 
} from '../utils/printDownloadUtils';

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
  const { isOpen, openModal, closeModal } = useModal();
  const [nazivObrasca, setNazivObrasca] = useState('');

  const handleCellChange = (accessor: keyof TableRow, value: string) => {
    setRow(prev => ({ ...prev, [accessor]: value }));
  };

  const handlePrint = () => {
    const element = tableRef.current;
    if (!element) return;

    const config = {
      title: 'Obrazac 6.',
      subtitle: 'Evidencija o obučenim radnicima za bezbedan rad'
    };

    const { originalInputs, inputValues } = prepareElementForExport(element, config);

    // Add print-specific CSS
    const printStyle = createPrintStyles();
    element.id = 'print-table';
    element.appendChild(printStyle);

    // Print
    window.print();

    // Restore original input elements with proper functionality
    setTimeout(() => {
      restoreElementAfterExport(element, originalInputs, inputValues);
      element.removeAttribute('id');
      if (printStyle.parentNode) {
        printStyle.parentNode.removeChild(printStyle);
      }
    }, 1000);
  };

  const handleDownload = () => {
    const element = tableRef.current;
    if (!element) return;

    const config = {
      title: 'Obrazac 6.',
      subtitle: 'Evidencija o obučenim radnicima za bezbedan rad',
      filename: 'evidencija_obuceni_bezbedan.pdf'
    };

    const { originalInputs, inputValues } = prepareElementForExport(element, config);

    const opt = createPdfOptions(config.filename);

    html2pdf().set(opt).from(element).save().then(() => {
      restoreElementAfterExport(element, originalInputs, inputValues);
    });
  };

  const handleSave = () => {
    if (!nazivObrasca.trim()) {
      return;
    }
    // Handle save logic here
    console.log("Saving form with name:", nazivObrasca);
    closeModal();
  };

  const handleNazivChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNazivObrasca(e.target.value);
  };

  return (
    <div className="py-8">
      <div className="flex-row md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Obrazac 6.
        </h1>
        <h2 className='text-lg text-gray-400 dark:text-white mt-2'>
          Evidencija o zaposlenima obučenim za bezbedan i zdrav rad i pravilno korišćenje lične zaštitne opreme
        </h2>
      </div>
      <div className='rounded-lg bg-white dark:bg-gray-800 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
            >
              <DownloadIcon className="w-5 h-5" />
              Preuzmi
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#F9FAFB] dark:border-gray-700 dark:bg-[#101828] dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
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
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.imePrezime} onChange={e => handleCellChange('imePrezime', e.target.value)} data-input-key="imePrezime" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Naziv radnog mesta</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.nazivRadnogMesta} onChange={e => handleCellChange('nazivRadnogMesta', e.target.value)} data-input-key="nazivRadnogMesta" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Opis poslova na tom radnom mestu</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.opisPoslova} onChange={e => handleCellChange('opisPoslova', e.target.value)} data-input-key="opisPoslova" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Slučaj, odnosno razlog izvršene obuke zaposlenog za bezbedan i zdrav rad</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.slucajRazlogObuke} onChange={e => handleCellChange('slucajRazlogObuke', e.target.value)} data-input-key="slucajRazlogObuke" />
                </td>
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
                        <td className="border-r border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.datumObukeTeorijske} onChange={e => handleCellChange('datumObukeTeorijske', e.target.value)} data-input-key="datumObukeTeorijske" />
                        </td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.datumObukePrakticne} onChange={e => handleCellChange('datumObukePrakticne', e.target.value)} data-input-key="datumObukePrakticne" />
                        </td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.datumProvereTeorijske} onChange={e => handleCellChange('datumProvereTeorijske', e.target.value)} data-input-key="datumProvereTeorijske" />
                        </td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.datumProverePrakticne} onChange={e => handleCellChange('datumProverePrakticne', e.target.value)} data-input-key="datumProverePrakticne" />
                        </td>
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
                        <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.nazivLZO} onChange={e => handleCellChange('nazivLZO', e.target.value)} data-input-key="nazivLZO" />
                        </td>
                        <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                          <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.datumObukeLZO} onChange={e => handleCellChange('datumObukeLZO', e.target.value)} data-input-key="datumObukeLZO" />
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" data-input-key="nazivLZO" /></td>
                        <td className="border-r border-gray-200 dark:border-white/[0.1] px-4 py-3"><input type="text" className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400" data-input-key="datumObukeLZO" /></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Part 4 */}
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Opasnosti, odnosno štetnosti sa kojima je zaposleni upoznat prilikom obuke za bezbedan i zdrav rad</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.opasnostiStetnosti} onChange={e => handleCellChange('opasnostiStetnosti', e.target.value)} data-input-key="opasnostiStetnosti" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Konkretne mere za bezbedan i zdrav rad na tom radnom mestu</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.konkretneMere} onChange={e => handleCellChange('konkretneMere', e.target.value)} data-input-key="konkretneMere" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Nazivi radnih mesta koja rukovodilac prati i kontroliše</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.naziviRadnihMesta} onChange={e => handleCellChange('naziviRadnihMesta', e.target.value)} data-input-key="naziviRadnihMesta" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-gray-700 dark:text-gray-400 px-4 py-3">Obaveštenja, uputstva ili instrukcije sa kojima je zaposleni upoznat radi obavljanja procesa rada na bezbedan način</td>
                <td className="border border-gray-200 dark:border-white/[0.1] p-0">
                  <input type="text" className="w-full h-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 px-4 py-3" value={row.obavestenjaUputstva} onChange={e => handleCellChange('obavestenjaUputstva', e.target.value)} data-input-key="obavestenjaUputstva" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        <div className='px-6 py-4 flex gap-2'>
          <button
            className="px-4 py-2 flex-1 bg-brand-500 shadow-theme-xs hover:bg-brand-600 text-white dark:text-gray-400 rounded dark:hover:bg-gray-700 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
            onClick={openModal}
          >
            <SaveIcon className="w-5 h-5" />
            Sačuvaj
          </button>
        </div>
      </div>
      
      {/* Save Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="" onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            Sačuvaj obrazac
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5">
            <div className="col-span-1">
              <Label>
                Naziv obrasca
              </Label>
              <Input 
                type="text" 
                placeholder="Unesite naziv obrasca" 
                value={nazivObrasca}
                onChange={handleNazivChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-theme-xs hover:bg-gray-50 dark:bg-[#101828] dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Otkaži
            </button>
            <Popover
              position="top"
              trigger={
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex justify-center px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Sačuvaj
                </button>
              }
            >
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-error-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Molimo unesite naziv obrasca
                  </p>
                </div>
              </div>
            </Popover>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EvidencijaObuceniBezbedan; 