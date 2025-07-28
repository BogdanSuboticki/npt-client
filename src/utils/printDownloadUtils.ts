// Utility functions for print and download functionality across evidencija pages

export interface ExportConfig {
  title: string;
  subtitle: string;
  filename?: string;
}

export interface ExportResult {
  originalInputs: HTMLInputElement[];
  inputValues: string[];
  headerDiv: HTMLDivElement;
  signaturesDiv: HTMLDivElement;
}

/**
 * Prepares an element for export (print/download) by:
 * 1. Adding header with title and subtitle
 * 2. Adding signature lines
 * 3. Replacing inputs with static text
 */
export function prepareElementForExport(
  element: HTMLDivElement, 
  config: ExportConfig
): ExportResult {
  // Create header elements for export
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = `
    text-align: center;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
  `;
  
  const title = document.createElement('h1');
  title.textContent = config.title;
  title.style.cssText = `
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 10px 0;
    color: #000000;
  `;
  
  const subtitle = document.createElement('h2');
  subtitle.textContent = config.subtitle;
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

  // Create signatures block
  const signaturesDiv = document.createElement('div');
  signaturesDiv.className = 'print-signatures';
  signaturesDiv.style.cssText = 'display: flex; justify-content: space-between; margin-top: 60px;';
  signaturesDiv.innerHTML = `
    <div style="text-align: left;">
      <div style="font-size: 13px; margin-bottom: 30px;">Savetnik za BZR</div>
      <div style="border-bottom: 1px solid #000; width: 220px; height: 32px;"></div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 13px; margin-bottom: 30px;">Poslodavac</div>
      <div style="border-bottom: 1px solid #000; width: 220px; height: 32px;"></div>
    </div>
  `;
  element.appendChild(signaturesDiv);

  // Store original input elements and their values
  const inputs = element.querySelectorAll('input');
  const originalInputs: HTMLInputElement[] = [];
  const inputValues: string[] = [];

  // Replace inputs with text divs and store originals
  inputs.forEach((input, index) => {
    originalInputs[index] = input.cloneNode(true) as HTMLInputElement;
    inputValues[index] = input.value;
    
    const textDiv = document.createElement('div');
    textDiv.textContent = input.value;
    textDiv.style.cssText = `
      width: 100%;
      min-height: 24px;
      padding: 2px 4px;
      font-size: 11px;
      line-height: 1.3;
      word-wrap: break-word;
      white-space: pre-wrap;
      color: #000000;
      background: transparent;
      border: none;
      outline: none;
      font-family: Arial, sans-serif;
      display: block;
    `;
    input.parentNode?.replaceChild(textDiv, input);
  });

  return { originalInputs, inputValues, headerDiv, signaturesDiv };
}

/**
 * Restores an element after export by:
 * 1. Removing header elements
 * 2. Removing signature lines
 * 3. Restoring original input elements
 */
export function restoreElementAfterExport(
  element: HTMLDivElement, 
  originalInputs: HTMLInputElement[], 
  inputValues: string[]
): void {
  // Remove the header elements that were added for export
  const headerDiv = element.querySelector('div:first-child');
  if (headerDiv && headerDiv.querySelector('h1')) {
    element.removeChild(headerDiv);
  }
  
  // Remove the signatures block
  const signatures = element.querySelector('.print-signatures');
  if (signatures) {
    element.removeChild(signatures);
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
}

/**
 * Creates print-specific CSS styles
 */
export function createPrintStyles(): HTMLStyleElement {
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
        display: table-row-group !important;
      }
      #print-table tbody {
        display: table-row-group !important;
      }
      #print-table tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      @page {
        size: A4 landscape;
        margin: 0.3in;
      }
    }
  `;
  return printStyle;
}

/**
 * Creates PDF download options
 */
export function createPdfOptions(filename: string = 'document.pdf') {
  return {
    margin: 0.3,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 1.2,
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
} 