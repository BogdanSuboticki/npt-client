import React, { useState, useRef, useEffect } from 'react';
import DataTableTwo from '../components/tables/DataTables/TableTwo/DataTableTwo';
import RadnoMestoForm from './RadnoMestoForm';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import ExportPopoverButton from "../components/ui/table/ExportPopoverButton";

// Sample data for the table
const radnaMestaData = [
  {
    id: 1,
    nazivRadnogMesta: "Operater viljuškara",
    nazivLokacije: "Magacin Novi Sad",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Viljuškara", "Zaštitna oprema", "Alat za održavanje"]
  },
  {
    id: 2,
    nazivRadnogMesta: "Administrativni radnik",
    nazivLokacije: "Kancelarija Beograd",
    povecanRizik: "Ne",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Stolica"]
  },
  {
    id: 3,
    nazivRadnogMesta: "Zavarivač",
    nazivLokacije: "Proizvodna hala Niš",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Zavarivačka maska", "Zaštitna odela", "Zavarivački aparat"]
  },
  {
    id: 4,
    nazivRadnogMesta: "Električar održavanja",
    nazivLokacije: "Pogon Subotica",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Multimetar", "Zaštitne rukavice", "Alat za električne radove"]
  },
  {
    id: 5,
    nazivRadnogMesta: "Magacioner",
    nazivLokacije: "Magacin Kragujevac",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Viljuškara", "Zaštitna kaciga"]
  },
  {
    id: 6,
    nazivRadnogMesta: "Menadžer proizvodnje",
    nazivLokacije: "Proizvodna hala Beograd",
    povecanRizik: "Ne",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 7,
    nazivRadnogMesta: "Laboratorijski tehničar",
    nazivLokacije: "Laboratorija Novi Sad",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Laboratorijski pribor", "Zaštitna odela", "Mikroskop"]
  },
  {
    id: 8,
    nazivRadnogMesta: "Vozač viljuškara",
    nazivLokacije: "Skladište Čačak",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Viljuškara", "Zaštitna kaciga"]
  },
  {
    id: 9,
    nazivRadnogMesta: "Inženjer bezbednosti",
    nazivLokacije: "Kancelarija Novi Sad",
    povecanRizik: "Ne",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 10,
    nazivRadnogMesta: "Operater na mašini",
    nazivLokacije: "Pogon Valjevo",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Proizvodna mašina", "Zaštitna odela"]
  },
  {
    id: 11,
    nazivRadnogMesta: "Tehničar održavanja",
    nazivLokacije: "Pogon Pančevo",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Alat za održavanje", "Multimetar"]
  },
  {
    id: 12,
    nazivRadnogMesta: "Kontrolor kvaliteta",
    nazivLokacije: "Proizvodna hala Šabac",
    povecanRizik: "Ne",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Mikroskop", "Računar"]
  },
  {
    id: 13,
    nazivRadnogMesta: "Hemijski tehničar",
    nazivLokacije: "Laboratorija Beograd",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Laboratorijski pribor", "Zaštitna odela"]
  },
  {
    id: 14,
    nazivRadnogMesta: "Referent nabavke",
    nazivLokacije: "Kancelarija Kragujevac",
    povecanRizik: "Ne",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 15,
    nazivRadnogMesta: "Bravar",
    nazivLokacije: "Radionica Zrenjanin",
    povecanRizik: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Alat za bravarske radove", "Zaštitna odela"]
  }
];

// Sample data for the second table (LZS data)
const lzsData = {
  1: [ // Operater viljuškara
    { id: 1, lzs: "Viljuškara", rok: 12, standard: "ISO-2023-001" },
    { id: 2, lzs: "Zaštitna oprema", rok: 6, standard: "ISO-2023-002" },
    { id: 3, lzs: "Alat za održavanje", rok: 24, standard: "ISO-2023-003" },
  ],
  2: [ // Administrativni radnik
    { id: 4, lzs: "Računar", rok: 36, standard: "ISO-2023-004" },
    { id: 5, lzs: "Stolica", rok: 60, standard: "ISO-2023-005" },
  ],
  3: [ // Zavarivač
    { id: 6, lzs: "Zavarivačka maska", rok: 12, standard: "ISO-2023-006" },
    { id: 7, lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-007" },
    { id: 8, lzs: "Zavarivački aparat", rok: 48, standard: "ISO-2023-008" },
  ],
  4: [ // Električar održavanja
    { id: 9, lzs: "Multimetar", rok: 24, standard: "ISO-2023-009" },
    { id: 10, lzs: "Zaštitne rukavice", rok: 6, standard: "ISO-2023-010" },
    { id: 11, lzs: "Alat za električne radove", rok: 36, standard: "ISO-2023-011" },
  ],
  5: [ // Magacioner
    { id: 12, lzs: "Viljuškara", rok: 12, standard: "ISO-2023-012" },
    { id: 13, lzs: "Zaštitna kaciga", rok: 6, standard: "ISO-2023-013" },
  ],
  6: [ // Menadžer proizvodnje
    { id: 14, lzs: "Računar", rok: 36, standard: "ISO-2023-014" },
    { id: 15, lzs: "Mobilni telefon", rok: 24, standard: "ISO-2023-015" },
  ],
  7: [ // Laboratorijski tehničar
    { id: 16, lzs: "Laboratorijski pribor", rok: 12, standard: "ISO-2023-016" },
    { id: 17, lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-017" },
    { id: 18, lzs: "Mikroskop", rok: 60, standard: "ISO-2023-018" },
  ],
  8: [ // Vozač viljuškara
    { id: 19, lzs: "Viljuškara", rok: 12, standard: "ISO-2023-019" },
    { id: 20, lzs: "Zaštitna kaciga", rok: 6, standard: "ISO-2023-020" },
  ],
  9: [ // Inženjer bezbednosti
    { id: 21, lzs: "Računar", rok: 36, standard: "ISO-2023-021" },
    { id: 22, lzs: "Mobilni telefon", rok: 24, standard: "ISO-2023-022" },
  ],
  10: [ // Operater na mašini
    { id: 23, lzs: "Proizvodna mašina", rok: 48, standard: "ISO-2023-023" },
    { id: 24, lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-024" },
  ],
  11: [ // Tehničar održavanja
    { id: 25, lzs: "Alat za održavanje", rok: 24, standard: "ISO-2023-025" },
    { id: 26, lzs: "Multimetar", rok: 24, standard: "ISO-2023-026" },
  ],
  12: [ // Kontrolor kvaliteta
    { id: 27, lzs: "Mikroskop", rok: 60, standard: "ISO-2023-027" },
    { id: 28, lzs: "Računar", rok: 36, standard: "ISO-2023-028" },
  ],
  13: [ // Hemijski tehničar
    { id: 29, lzs: "Laboratorijski pribor", rok: 12, standard: "ISO-2023-029" },
    { id: 30, lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-030" },
  ],
  14: [ // Referent nabavke
    { id: 31, lzs: "Računar", rok: 36, standard: "ISO-2023-031" },
    { id: 32, lzs: "Mobilni telefon", rok: 24, standard: "ISO-2023-032" },
  ],
  15: [ // Bravar
    { id: 33, lzs: "Alat za bravarske radove", rok: 24, standard: "ISO-2023-033" },
    { id: 34, lzs: "Zaštitna odela", rok: 6, standard: "ISO-2023-034" },
  ],
};

const columns = [
  { key: "id", label: "", sortable: true },
  { key: "nazivRadnogMesta", label: "Naziv radnog mesta", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "obavezanOftamoloskiPregled", label: "Obavezan oftamološki pregled", sortable: true },
  { key: "obavezanPregledPoDrugomOsnovu", label: "Obavezan pregled po drugom osnovu", sortable: true },
  { key: "oprema", label: "Oprema", sortable: false },
];

// Columns for the second table (LZS table)
const lzsColumns = [
  { key: "id", label: "", sortable: true },
  { key: "lzs", label: "Naziv LZS", sortable: true },
  { key: "rok", label: "Rok (meseci)", sortable: true },
  { key: "standard", label: "Standard", sortable: true },
];

const RadnaMesta: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(radnaMestaData);
  const [selectedRadnoMesto, setSelectedRadnoMesto] = useState<any>(null);
  const [showLZSModal, setShowLZSModal] = useState(false);
  const [lzsDataState, setLzsDataState] = useState(lzsData);
  
  // Form state for new LZS entry
  const [newLZS, setNewLZS] = useState({
    lzs: "",
    rok: "",
    standard: ""
  });
  
  // Add state for dropdowns
  const [isLzsOpen, setIsLzsOpen] = useState(false);
  const lzsRef = useRef<HTMLDivElement>(null);

  // Options for LZS based on selected workplace equipment
  const lzsOptions = (selectedRadnoMesto?.oprema as string[]) || [];

  // Infer defaults for rok and standard by selected LZS name
  const inferDefaults = (name: string): { rok: string; standard: string } => {
    const lower = name.toLowerCase();
    if (lower.includes('kacig')) return { rok: '6', standard: 'ISO-2023-020' };
    if (lower.includes('rukavic')) return { rok: '6', standard: 'ISO-2023-010' };
    if (lower.includes('viljuškar') || lower.includes('viljusk')) return { rok: '12', standard: 'ISO-2023-019' };
    if (lower.includes('alat')) return { rok: '24', standard: 'ISO-2023-033' };
    if (lower.includes('multimetar')) return { rok: '24', standard: 'ISO-2023-009' };
    if (lower.includes('laborator') && lower.includes('pribor')) return { rok: '12', standard: 'ISO-2023-016' };
    if (lower.includes('odel') || lower.includes('odij')) return { rok: '6', standard: 'ISO-2023-017' };
    if (lower.includes('mikroskop')) return { rok: '60', standard: 'ISO-2023-018' };
    if (lower.includes('računar') || lower.includes('racunar')) return { rok: '36', standard: 'ISO-2023-014' };
    if (lower.includes('mobilni')) return { rok: '24', standard: 'ISO-2023-015' };
    return { rok: '12', standard: 'ISO-2023-000' };
  };

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close dropdowns
      if (lzsRef.current && !lzsRef.current.contains(target)) {
        setIsLzsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = (newData: any) => {
    const newItem = {
      id: data.length + 1,
      ...newData,
      povecanRizik: newData.povecanRizik ? "Da" : "Ne",
      obavezanOftamoloskiPregled: newData.obavezanOftamoloskiPregled ? "Da" : "Ne",
      obavezanPregledPoDrugomOsnovu: newData.obavezanPregledPoDrugomOsnovu ? "Da" : "Ne",
      oprema: newData.oprema || []
    };
    setData([...data, newItem]);
  };

  const handleOpremaClick = (radnoMesto: any) => {
    setSelectedRadnoMesto(radnoMesto);
    setShowLZSModal(true);
  };

  const closeLZSModal = () => {
    setShowLZSModal(false);
    setSelectedRadnoMesto(null);
    // Reset form state
    setNewLZS({ lzs: "", rok: "", standard: "" });
  };

  const handleAddLZS = () => {
    if (newLZS.lzs && newLZS.rok && newLZS.standard && selectedRadnoMesto) {
      const currentLZSData = lzsDataState[selectedRadnoMesto.id as keyof typeof lzsDataState] || [];

      const newId = Math.max(...currentLZSData.map((item: any) => item.id), 0) + 1;
      const newLZSEntry = {
        id: newId,
        lzs: newLZS.lzs,
        rok: parseInt(newLZS.rok),
        standard: newLZS.standard
      };

      setLzsDataState({
        ...lzsDataState,
        [selectedRadnoMesto.id]: [...currentLZSData, newLZSEntry]
      });

      // Reset form
      setNewLZS({ lzs: "", rok: "", standard: "" });
    }
  };

  

  const handleDeleteLZS = (lzsItem: any) => {
    if (selectedRadnoMesto) {
      const currentLZSData = lzsDataState[selectedRadnoMesto.id as keyof typeof lzsDataState] || [];
      const updatedLZSData = currentLZSData.filter((item: any) => item.id !== lzsItem.id);
      
      setLzsDataState({
        ...lzsDataState,
        [selectedRadnoMesto.id]: updatedLZSData
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Radna mesta
          </h1>
          <div className="hidden sm:flex items-center gap-4">
            <ExportPopoverButton
              data={data}
              columns={columns}
              title="Radna mesta"
              filename="radna-mesta"
            />
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novi Unos
            </Button>
          </div>
        </div>
        
        {/* Mobile buttons div with same width as table */}
        <div className="sm:hidden mt-4">
          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <ExportPopoverButton
                data={data}
                columns={columns}
                title="Radna mesta"
                filename="radna-mesta"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="w-full"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novi Unos
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
        <DataTableTwo 
          data={data}
          columns={columns}
          onOpremaClick={handleOpremaClick}
        />
      </div>

      <RadnoMestoForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />

             {/* LZS Modal */}
               <Modal
          isOpen={showLZSModal}
          onClose={closeLZSModal}
          className="max-w-4xl w-full mx-4 p-4 lg:p-6"
        >
          <div className="flex flex-col">
           <div className="mb-6">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
               Lična zaštititna sredstva za {selectedRadnoMesto?.nazivRadnogMesta}
             </h2>
           </div>
           
           <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-6">
              <DataTableTwo 
                data={(lzsDataState as any)[selectedRadnoMesto?.id] || []}
                columns={lzsColumns}
                showFilters={false}
                showPagination={false}
                showOpremaButton={false}
                showEditButton={false}
                showResultsText={false}
                showItemsPerPage={false}
                onDeleteClick={handleDeleteLZS}
              />
            </div>

            {/* Add new LZS form */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Dodaj LZS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Oprema (LZS)</Label>
                  <div className="relative w-full" ref={lzsRef}>
                    <button
                      type="button"
                      onClick={() => setIsLzsOpen(!isLzsOpen)}
                      className="flex items-center justify-between w-full h-11 px-4 text-sm text-gray-800 bg-[#F9FAFB] border border-gray-300 rounded-lg dark:bg-[#101828] dark:border-gray-700 dark:text-white/90 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                      <span>{newLZS.lzs || "Izaberi opremu"}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isLzsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isLzsOpen && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="pr-1">
                          {lzsOptions.map((option: string, index: number) => (
                            <div
                              key={option}
                              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none ${
                                newLZS.lzs === option ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } ${index === lzsOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                              onClick={() => {
                                const defaults = inferDefaults(option);
                                setNewLZS({ lzs: option, rok: defaults.rok, standard: defaults.standard });
                                setIsLzsOpen(false);
                              }}
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interval pregleda (meseci)
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={newLZS.rok || ""}
                      placeholder="Automatski"
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <Label>Standard</Label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={newLZS.standard || ""}
                      placeholder="Automatski"
                      readOnly
                      className="w-full h-11 px-4 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              onClick={handleAddLZS}
              disabled={!newLZS.lzs || !newLZS.rok || !newLZS.standard}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Dodaj
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RadnaMesta; 