import React, { useState } from 'react';
import DataTableTwo from '../components/tables/DataTables/TableTwo/DataTableTwo';
import RadnoMestoForm from './RadnoMestoForm';
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";

// Sample data for the table
const radnaMestaData = [
  {
    id: 1,
    nazivRadnogMesta: "Operater viljuškara",
    nazivLokacije: "Magacin Novi Sad",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Viljuškara", "Zaštitna oprema", "Alat za održavanje"]
  },
  {
    id: 2,
    nazivRadnogMesta: "Administrativni radnik",
    nazivLokacije: "Kancelarija Beograd",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Stolica"]
  },
  {
    id: 3,
    nazivRadnogMesta: "Zavarivač",
    nazivLokacije: "Proizvodna hala Niš",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Zavarivačka maska", "Zaštitna odela", "Zavarivački aparat"]
  },
  {
    id: 4,
    nazivRadnogMesta: "Električar održavanja",
    nazivLokacije: "Pogon Subotica",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Multimetar", "Zaštitne rukavice", "Alat za električne radove"]
  },
  {
    id: 5,
    nazivRadnogMesta: "Magacioner",
    nazivLokacije: "Magacin Kragujevac",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Viljuškara", "Zaštitna kaciga"]
  },
  {
    id: 6,
    nazivRadnogMesta: "Menadžer proizvodnje",
    nazivLokacije: "Proizvodna hala Beograd",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 7,
    nazivRadnogMesta: "Laboratorijski tehničar",
    nazivLokacije: "Laboratorija Novi Sad",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Laboratorijski pribor", "Zaštitna odela", "Mikroskop"]
  },
  {
    id: 8,
    nazivRadnogMesta: "Vozač viljuškara",
    nazivLokacije: "Skladište Čačak",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Viljuškara", "Zaštitna kaciga"]
  },
  {
    id: 9,
    nazivRadnogMesta: "Inženjer bezbednosti",
    nazivLokacije: "Kancelarija Novi Sad",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 10,
    nazivRadnogMesta: "Operater na mašini",
    nazivLokacije: "Pogon Valjevo",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Proizvodna mašina", "Zaštitna odela"]
  },
  {
    id: 11,
    nazivRadnogMesta: "Tehničar održavanja",
    nazivLokacije: "Pogon Pančevo",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Ne",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Alat za održavanje", "Multimetar"]
  },
  {
    id: 12,
    nazivRadnogMesta: "Kontrolor kvaliteta",
    nazivLokacije: "Proizvodna hala Šabac",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Mikroskop", "Računar"]
  },
  {
    id: 13,
    nazivRadnogMesta: "Hemijski tehničar",
    nazivLokacije: "Laboratorija Beograd",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Da",
    oprema: ["Laboratorijski pribor", "Zaštitna odela"]
  },
  {
    id: 14,
    nazivRadnogMesta: "Referent nabavke",
    nazivLokacije: "Kancelarija Kragujevac",
    povecanRizik: "Ne",
    obaveznaObuka: "Da",
    obavezanOftamoloskiPregled: "Da",
    obavezanPregledPoDrugomOsnovu: "Ne",
    oprema: ["Računar", "Mobilni telefon"]
  },
  {
    id: 15,
    nazivRadnogMesta: "Bravar",
    nazivLokacije: "Radionica Zrenjanin",
    povecanRizik: "Da",
    obaveznaObuka: "Da",
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
  { key: "nazivLokacije", label: "Naziv lokacije", sortable: true },
  { key: "povecanRizik", label: "Povećan rizik", sortable: true },
  { key: "obaveznaObuka", label: "Obavezna obuka", sortable: true },
  { key: "obavezanOftamoloskiPregled", label: "Obavezan oftamološki pregled", sortable: true },
  { key: "obavezanPregledPoDrugomOsnovu", label: "Obavezan pregled po drugom osnovu", sortable: true },
  { key: "oprema", label: "Oprema", sortable: false },
];

// Columns for the second table (LZS table)
const lzsColumns = [
  { key: "id", label: "", sortable: true },
  { key: "lzs", label: "LZS", sortable: true },
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
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingLZSId, setEditingLZSId] = useState<number | null>(null);

  const handleSave = (newData: any) => {
    const newItem = {
      id: data.length + 1,
      ...newData,
      povecanRizik: newData.povecanRizik ? "Da" : "Ne",
      obaveznaObuka: newData.obaveznaObuka ? "Da" : "Ne",
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
    // Reset form and edit state
    setNewLZS({ lzs: "", rok: "", standard: "" });
    setIsEditing(false);
    setEditingLZSId(null);
  };

  const handleAddLZS = () => {
    if (newLZS.lzs && newLZS.rok && newLZS.standard && selectedRadnoMesto) {
      const currentLZSData = lzsDataState[selectedRadnoMesto.id as keyof typeof lzsDataState] || [];
      
      if (isEditing && editingLZSId) {
        // Update existing LZS
        const updatedLZSData = currentLZSData.map((item: any) => 
          item.id === editingLZSId 
            ? { ...item, lzs: newLZS.lzs, rok: parseInt(newLZS.rok), standard: newLZS.standard }
            : item
        );
        
        setLzsDataState({
          ...lzsDataState,
          [selectedRadnoMesto.id]: updatedLZSData
        });
        
        // Reset edit state
        setIsEditing(false);
        setEditingLZSId(null);
      } else {
        // Add new LZS
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
      }

      // Reset form
      setNewLZS({ lzs: "", rok: "", standard: "" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewLZS(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditLZS = (lzsItem: any) => {
    setNewLZS({
      lzs: lzsItem.lzs,
      rok: lzsItem.rok.toString(),
      standard: lzsItem.standard
    });
    setIsEditing(true);
    setEditingLZSId(lzsItem.id);
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
      <div className="mb-6 flex items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Radna mesta
        </h1>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          className="ml-5"
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
         <div className="flex flex-col h-full max-h-[70vh]">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              LZS za {selectedRadnoMesto?.nazivRadnogMesta}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)] mb-6">
              <DataTableTwo 
                data={(lzsDataState as any)[selectedRadnoMesto?.id] || []}
                columns={lzsColumns}
                showFilters={false}
                showPagination={false}
                showOpremaButton={false}
                showResultsText={false}
                showItemsPerPage={false}
                onEditClick={handleEditLZS}
                onDeleteClick={handleDeleteLZS}
              />
            </div>

            {/* Add new LZS form */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {isEditing ? "Izmeni LZS" : "Dodaj novi LZS"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LZS
                  </label>
                  <input
                    type="text"
                    value={newLZS.lzs}
                    onChange={(e) => handleInputChange('lzs', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Unesite naziv LZS-a"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rok (meseci)
                  </label>
                  <input
                    type="number"
                    value={newLZS.rok}
                    onChange={(e) => handleInputChange('rok', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Unesite rok u mesecima"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Standard
                  </label>
                  <input
                    type="text"
                    value={newLZS.standard}
                    onChange={(e) => handleInputChange('standard', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    placeholder="Unesite standard"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingLZSId(null);
                  setNewLZS({ lzs: "", rok: "", standard: "" });
                }}
              >
                Otkaži
              </Button>
            )}
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
              {isEditing ? "Sačuvaj izmene" : "Dodaj"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RadnaMesta; 