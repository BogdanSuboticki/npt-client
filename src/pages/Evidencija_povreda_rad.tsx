import React, { useState, useRef } from 'react';
import { ReactComponent as PrintIcon } from '../icons/Print.svg?react';
import { ReactComponent as NoviRedIcon } from '../icons/Novi_red.svg?react';
import { ReactComponent as DownloadIcon } from '../icons/download.svg?react';
import { ReactComponent as SaveIcon } from '../icons/Save-icon.svg?react';
import html2pdf from 'html2pdf.js';
import { Modal } from '../components/ui/modal';
import { useModal } from '../hooks/useModal';
import Label from '../components/form/Label';
import Input from '../components/form/input/InputField';
import Popover from '../components/ui/popover/Popover';

// Define TableRow type for injury records
type TableRow = {
  nazivRadnogMesta: string;
  imePrezime: string;
  vremeNastanka: string;
  vrstaPovrede: string;
  ocenaTezine: string;
};


// Initial rows with empty values
const initialRows: TableRow[] = Array(10).fill({
  nazivRadnogMesta: '',
  imePrezime: '',
  vremeNastanka: '',
  vrstaPovrede: '',
  ocenaTezine: '',
});

const EvidencijaPovredaRad: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableRef = useRef<HTMLDivElement>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingItemsPerPage, setPendingItemsPerPage] = useState(10);
  const { isOpen, openModal, closeModal } = useModal();
  const [nazivObrasca, setNazivObrasca] = useState('');

  const handleCellChange = (rowIdx: number, accessor: keyof TableRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [accessor]: value };
      return updated;
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (newItemsPerPage < itemsPerPage) {
      // Check if any rows that would be removed have data
      const hasDataInRemovedRows = rows.slice(newItemsPerPage).some(row => 
        Object.values(row).some(value => value.trim() !== '')
      );

      if (hasDataInRemovedRows) {
        setPendingItemsPerPage(newItemsPerPage);
        setShowWarningModal(true);
        return;
      }
    }

    // If no data would be lost or user confirmed, proceed with the change
    setItemsPerPage(newItemsPerPage);
    setRows(prev => {
      if (prev.length < newItemsPerPage) {
        const newRows = Array(newItemsPerPage - prev.length).fill({
          nazivRadnogMesta: '',
          imePrezime: '',
          vremeNastanka: '',
          vrstaPovrede: '',
          ocenaTezine: '',
        });
        return [...prev, ...newRows];
      } else if (prev.length > newItemsPerPage) {
        return prev.slice(0, newItemsPerPage);
      }
      return prev;
    });
  };

  const confirmRowReduction = () => {
    setItemsPerPage(pendingItemsPerPage);
    setRows(prev => prev.slice(0, pendingItemsPerPage));
    setShowWarningModal(false);
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
    setItemsPerPage(prev => prev + 1);
  };

  const handlePrint = () => {
    const element = tableRef.current;
    if (!element) return;

    // Create header elements for print
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'Obrazac 2.';
    title.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 10px 0;
      color: #000000;
    `;
    
    const subtitle = document.createElement('h2');
    subtitle.textContent = 'Evidencija o povredama na radu';
    subtitle.style.cssText = `
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      color: #000000;
      line-height: 1.4;
    `;
    
    headerDiv.appendChild(title);
    headerDiv.appendChild(subtitle);
    
    // Insert header at the beginning of the table container
    element.insertBefore(headerDiv, element.firstChild);

    // Store original input elements and their values
    const inputs = element.querySelectorAll('input');
    const originalInputs: HTMLInputElement[] = [];
    const inputValues: string[] = [];
    const inputRefs: { [key: string]: HTMLInputElement | null } = {};

    // Replace inputs with text divs and store originals
    inputs.forEach((input, index) => {
      const inputKey = input.getAttribute('data-input-key') || `input-${index}`;
      originalInputs[index] = input.cloneNode(true) as HTMLInputElement;
      inputValues[index] = input.value;
      inputRefs[inputKey] = input;
      
      const textDiv = document.createElement('div');
      textDiv.textContent = input.value;
      textDiv.style.cssText = `
        width: 100%;
        min-height: 24px;
        padding: 2px 4px;
        font-size: 13px;
        line-height: 1.4;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: #1f2937;
        background: transparent;
        border: none;
        outline: none;
        font-family: inherit;
        display: block;
      `;
      input.parentNode?.replaceChild(textDiv, input);
    });

    // Add print-specific CSS
    const printStyle = document.createElement('style');
    printStyle.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #print-table, #print-table * {
          visibility: visible;
        }
        #print-table {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        #print-table thead {
          display: table-header-group;
        }
        #print-table tbody {
          display: table-row-group;
        }
        @page {
          size: A4 landscape;
          margin: 0.3in;
        }
      }
    `;
    element.id = 'print-table';
    element.appendChild(printStyle);

    // Print
    window.print();

    // Restore original input elements with proper functionality
    setTimeout(() => {
      // Remove the header elements that were added for print
      const headerDiv = element.querySelector('div:first-child');
      if (headerDiv && headerDiv.querySelector('h1')) {
        element.removeChild(headerDiv);
      }
      
      const textDivs = element.querySelectorAll('div');
      textDivs.forEach((div, index) => {
        if (originalInputs[index]) {
          const restoredInput = originalInputs[index];
          restoredInput.value = inputValues[index];
          
          // Restore the input with its original attributes and event handlers
          const parent = div.parentNode;
          if (parent) {
            parent.replaceChild(restoredInput, div);
            
            // Re-attach click handler to the parent cell
            const cell = parent as HTMLElement;
            if (cell.classList.contains('cursor-text')) {
              cell.onclick = () => {
                restoredInput.focus();
              };
            }
          }
        }
      });
      element.removeAttribute('id');
      if (printStyle.parentNode) {
        printStyle.parentNode.removeChild(printStyle);
      }
    }, 1000);
  };

  const handleDownload = () => {
    const element = tableRef.current;
    if (!element) return;

    // Create header elements for download
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'Obrazac 2.';
    title.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 10px 0;
      color: #000000;
    `;
    
    const subtitle = document.createElement('h2');
    subtitle.textContent = 'Evidencija o povredama na radu';
    subtitle.style.cssText = `
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      color: #000000;
      line-height: 1.4;
    `;
    
    headerDiv.appendChild(title);
    headerDiv.appendChild(subtitle);
    
    // Insert header at the beginning of the table container
    element.insertBefore(headerDiv, element.firstChild);

    // Store original input elements and their values
    const inputs = element.querySelectorAll('input');
    const originalInputs: HTMLInputElement[] = [];
    const inputValues: string[] = [];
    const inputRefs: { [key: string]: HTMLInputElement | null } = {};

    // Replace inputs with text divs and store originals
    inputs.forEach((input, index) => {
      const inputKey = input.getAttribute('data-input-key') || `input-${index}`;
      originalInputs[index] = input.cloneNode(true) as HTMLInputElement;
      inputValues[index] = input.value;
      inputRefs[inputKey] = input;
      
      const textDiv = document.createElement('div');
      textDiv.textContent = input.value;
      textDiv.style.cssText = `
        width: 100%;
        min-height: 24px;
        padding: 2px 4px;
        font-size: 13px;
        line-height: 1.4;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: #1f2937;
        background: transparent;
        border: none;
        outline: none;
        font-family: inherit;
        display: block;
      `;
      input.parentNode?.replaceChild(textDiv, input);
    });

    const opt = {
      margin: 1,
      filename: 'evidencija_povreda_rad.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'landscape'
      }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Remove the header elements that were added for download
      const headerDiv = element.querySelector('div:first-child');
      if (headerDiv && headerDiv.querySelector('h1')) {
        element.removeChild(headerDiv);
      }
      
      // Restore original input elements with proper functionality
      const textDivs = element.querySelectorAll('div');
      textDivs.forEach((div, index) => {
        if (originalInputs[index]) {
          const restoredInput = originalInputs[index];
          restoredInput.value = inputValues[index];
          
          // Restore the input with its original attributes and event handlers
          const parent = div.parentNode;
          if (parent) {
            parent.replaceChild(restoredInput, div);
            
            // Re-attach click handler to the parent cell
            const cell = parent as HTMLElement;
            if (cell.classList.contains('cursor-text')) {
              cell.onclick = () => {
                restoredInput.focus();
              };
            }
          }
        }
      });
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
          Obrazac 2.
        </h1>
        <h2 className='text-lg text-gray-400 dark:text-white mt-2'>
          Evidencija o povredama na radu
        </h2>
      </div>
      <div className='rounded-lg bg-white dark:bg-gray-800 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400">Prikaži</span>
            <div className="relative z-20  w-[80px] ">
              <select
                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-[#F9FAFB] hover:bg-gray-100 border border-gray-300 rounded-lg appearance-none dark:bg-[#101828] h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map((value) => (
                  <option
                    key={value}
                    value={value}
                    className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                  >
                    {value}
                  </option>
                ))}
              </select>
              <div className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400 pointer-events-none">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400">redova</span>
          </div>
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
            <thead>
              <tr>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Redni broj</th>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Naziv radnog mesta na kom je zaposleni radio kada se dogodila povreda</th>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Ime i prezime povređenog</th>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Vreme nastanka povrede na radu (datum, dan u sedmici, čas)</th>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Vrsta povrede (pojedinačna ili kolektivna)</th>
                <th className="border border-gray-200 dark:border-white/[0.1] text-[13px] px-4 py-3 font-medium text-gray-700 dark:text-gray-400">Ocena težine povrede (laka, teška, smrtna povreda na radu)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1 text-center text-[13px] text-gray-800 dark:text-gray-400">{rowIdx + 1}.</td>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 whitespace-pre-wrap break-words min-h-[24px]"
                      value={row.nazivRadnogMesta}
                      onChange={e => handleCellChange(rowIdx, 'nazivRadnogMesta', e.target.value)}
                      data-input-key={`nazivRadnogMesta-${rowIdx}`}
                    />
                  </td>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 whitespace-pre-wrap break-words min-h-[24px]"
                      value={row.imePrezime}
                      onChange={e => handleCellChange(rowIdx, 'imePrezime', e.target.value)}
                      data-input-key={`imePrezime-${rowIdx}`}
                    />
                  </td>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 whitespace-pre-wrap break-words min-h-[24px]"
                      value={row.vremeNastanka}
                      onChange={e => handleCellChange(rowIdx, 'vremeNastanka', e.target.value)}
                      data-input-key={`vremeNastanka-${rowIdx}`}
                    />
                  </td>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 whitespace-pre-wrap break-words min-h-[24px]"
                      value={row.vrstaPovrede}
                      onChange={e => handleCellChange(rowIdx, 'vrstaPovrede', e.target.value)}
                      data-input-key={`vrstaPovrede-${rowIdx}`}
                    />
                  </td>
                  <td className="border border-gray-200 dark:border-white/[0.1] px-2 py-1">
                    <input
                      type="text"
                      className="w-full outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-400 whitespace-pre-wrap break-words min-h-[24px]"
                      value={row.ocenaTezine}
                      onChange={e => handleCellChange(rowIdx, 'ocenaTezine', e.target.value)}
                      data-input-key={`ocenaTezine-${rowIdx}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='px-6 py-4 flex gap-2'>
          <button
            className="px-4 py-2 flex-1 bg-[#F9FAFB] dark:bg-[#101828] text-gray-700 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
            onClick={addRow}
          >
            <NoviRedIcon className="w-5 h-5" />
            Novi Red
          </button>
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

      {/* Warning Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-7">
            <svg
              className="fill-warning-50 dark:fill-warning-500/15"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <svg
                className="fill-warning-600 dark:fill-orange-400"
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M32.1445 19.0002C32.1445 26.2604 26.2589 32.146 18.9987 32.146C11.7385 32.146 5.85287 26.2604 5.85287 19.0002C5.85287 11.7399 11.7385 5.85433 18.9987 5.85433C26.2589 5.85433 32.1445 11.7399 32.1445 19.0002ZM18.9987 35.146C27.9158 35.146 35.1445 27.9173 35.1445 19.0002C35.1445 10.0831 27.9158 2.85433 18.9987 2.85433C10.0816 2.85433 2.85287 10.0831 2.85287 19.0002C2.85287 27.9173 10.0816 35.146 18.9987 35.146ZM21.0001 26.0855C21.0001 24.9809 20.1047 24.0855 19.0001 24.0855L18.9985 24.0855C17.894 24.0855 16.9985 24.9809 16.9985 26.0855C16.9985 27.19 17.894 28.0855 18.9985 28.0855L19.0001 28.0855C20.1047 28.0855 21.0001 27.19 21.0001 26.0855ZM18.9986 10.1829C19.827 10.1829 20.4986 10.8545 20.4986 11.6829L20.4986 20.6707C20.4986 21.4992 19.827 22.1707 18.9986 22.1707C18.1701 22.1707 17.4986 21.4992 17.4986 20.6707L17.4986 11.6829C17.4986 10.8545 18.1701 10.1829 18.9986 10.1829Z"
                  fill=""
                />
              </svg>
            </span>
          </div>

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Upozorenje!
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Smanivanjem broja redova biće uklonjen tekst u poljima koja više neće biti vidljiva. Da li ste sigurni da želite da nastavite?
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              type="button"
              onClick={() => setShowWarningModal(false)}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-theme-xs hover:bg-gray-50 dark:bg-[#101828] dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 sm:w-auto"
            >
              Otkaži
            </button>
            <button
              type="button"
              onClick={confirmRowReduction}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
            >
              Nastavi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EvidencijaPovredaRad; 